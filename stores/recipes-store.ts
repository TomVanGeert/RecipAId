import { create } from 'zustand';
import type { Recipe, ShoppingList } from '@/types';
import { supabase } from '@/lib/supabase';

interface RecipesState {
  // Generated recipes from current session
  generatedRecipes: Recipe[];
  isGenerating: boolean;
  
  // Saved recipes
  savedRecipes: Recipe[];
  isLoadingSaved: boolean;
  
  // Shopping lists
  shoppingLists: ShoppingList[];
  
  // Actions
  setGeneratedRecipes: (recipes: Recipe[]) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  clearGeneratedRecipes: () => void;
  
  // Saved recipes actions
  saveRecipe: (recipe: Recipe) => Promise<void>;
  unsaveRecipe: (recipeId: string) => Promise<void>;
  loadSavedRecipes: () => Promise<void>;
  updateRecipe: (recipeId: string, updates: Partial<Recipe>) => Promise<void>;
  deleteRecipe: (recipeId: string) => Promise<void>;
  
  // Shopping list actions
  createShoppingList: (recipe: Recipe) => Promise<void>;
  loadShoppingLists: () => Promise<void>;
  toggleShoppingItem: (listId: string, itemId: string) => Promise<void>;
  deleteShoppingList: (listId: string) => Promise<void>;
}

export const useRecipesStore = create<RecipesState>((set, get) => ({
  generatedRecipes: [],
  isGenerating: false,
  savedRecipes: [],
  isLoadingSaved: false,
  shoppingLists: [],

  setGeneratedRecipes: (recipes) => set({ generatedRecipes: recipes }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  clearGeneratedRecipes: () => set({ generatedRecipes: [] }),

  saveRecipe: async (recipe) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('recipes').insert({
      user_id: user.id,
      title: recipe.title,
      description: recipe.description,
      recipe_type: recipe.recipeType,
      cuisine_style: recipe.cuisineStyle,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      prep_time: recipe.prepTime,
      cook_time: recipe.cookTime,
      servings: recipe.servings,
      is_saved: true,
      extra_ingredients_needed: recipe.ingredients.filter(i => !i.isAvailable),
    });

    if (!error) {
      await get().loadSavedRecipes();
    }
  },

  unsaveRecipe: async (recipeId) => {
    const { error } = await supabase
      .from('recipes')
      .update({ is_saved: false })
      .eq('id', recipeId);

    if (!error) {
      set(state => ({
        savedRecipes: state.savedRecipes.filter(r => r.id !== recipeId),
      }));
    }
  },

  loadSavedRecipes: async () => {
    set({ isLoadingSaved: true });
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      set({ isLoadingSaved: false });
      return;
    }

    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_saved', true)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const recipes: Recipe[] = data.map(r => ({
        id: r.id,
        title: r.title,
        description: r.description || '',
        recipeType: r.recipe_type as Recipe['recipeType'],
        cuisineStyle: (r.cuisine_style || 'any') as Recipe['cuisineStyle'],
        prepTime: r.prep_time || 0,
        cookTime: r.cook_time || 0,
        servings: r.servings || 4,
        ingredients: r.ingredients as Recipe['ingredients'],
        instructions: r.instructions as string[],
        isSaved: r.is_saved,
        createdAt: r.created_at,
      }));
      set({ savedRecipes: recipes });
    }
    
    set({ isLoadingSaved: false });
  },

  updateRecipe: async (recipeId, updates) => {
    const { error } = await supabase
      .from('recipes')
      .update({
        title: updates.title,
        description: updates.description,
        ingredients: updates.ingredients,
        instructions: updates.instructions,
        prep_time: updates.prepTime,
        cook_time: updates.cookTime,
        servings: updates.servings,
        updated_at: new Date().toISOString(),
      })
      .eq('id', recipeId);

    if (!error) {
      await get().loadSavedRecipes();
    }
  },

  deleteRecipe: async (recipeId) => {
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', recipeId);

    if (!error) {
      set(state => ({
        savedRecipes: state.savedRecipes.filter(r => r.id !== recipeId),
      }));
    }
  },

  createShoppingList: async (recipe) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const missingIngredients = recipe.ingredients.filter(i => !i.isAvailable);
    
    const items = missingIngredients.map((ing, index) => ({
      id: `item-${index}`,
      name: ing.name,
      amount: ing.amount,
      unit: ing.unit,
      isChecked: false,
    }));

    const { error } = await supabase.from('shopping_lists').insert({
      user_id: user.id,
      recipe_id: recipe.id,
      name: `Shopping for ${recipe.title}`,
      items,
      is_completed: false,
    });

    if (!error) {
      await get().loadShoppingLists();
    }
  },

  loadShoppingLists: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('shopping_lists')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const lists: ShoppingList[] = data.map(l => ({
        id: l.id,
        name: l.name,
        recipeId: l.recipe_id || undefined,
        items: l.items as ShoppingList['items'],
        isCompleted: l.is_completed,
        createdAt: l.created_at,
      }));
      set({ shoppingLists: lists });
    }
  },

  toggleShoppingItem: async (listId, itemId) => {
    const list = get().shoppingLists.find(l => l.id === listId);
    if (!list) return;

    const updatedItems = list.items.map(item =>
      item.id === itemId ? { ...item, isChecked: !item.isChecked } : item
    );

    const { error } = await supabase
      .from('shopping_lists')
      .update({ 
        items: updatedItems,
        is_completed: updatedItems.every(i => i.isChecked),
      })
      .eq('id', listId);

    if (!error) {
      set(state => ({
        shoppingLists: state.shoppingLists.map(l =>
          l.id === listId ? { ...l, items: updatedItems } : l
        ),
      }));
    }
  },

  deleteShoppingList: async (listId) => {
    const { error } = await supabase
      .from('shopping_lists')
      .delete()
      .eq('id', listId);

    if (!error) {
      set(state => ({
        shoppingLists: state.shoppingLists.filter(l => l.id !== listId),
      }));
    }
  },
}));

