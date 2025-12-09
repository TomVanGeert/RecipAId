import { create } from 'zustand';
import type { Ingredient, RecipeType, CuisineStyle } from '@/types';

interface IngredientsState {
  // Scanned ingredients
  scannedIngredients: Ingredient[];
  selectedIngredients: string[];
  
  // Recipe preferences
  recipeType: RecipeType;
  cuisineStyle: CuisineStyle;
  allowExtraIngredients: boolean;
  
  // Actions
  setScannedIngredients: (ingredients: Ingredient[]) => void;
  toggleIngredient: (id: string) => void;
  selectAllIngredients: () => void;
  clearIngredients: () => void;
  addManualIngredient: (name: string) => void;
  removeIngredient: (id: string) => void;
  
  // Preferences
  setRecipeType: (type: RecipeType) => void;
  setCuisineStyle: (style: CuisineStyle) => void;
  setAllowExtraIngredients: (allow: boolean) => void;
  
  // Computed
  getSelectedIngredientNames: () => string[];
}

export const useIngredientsStore = create<IngredientsState>((set, get) => ({
  scannedIngredients: [],
  selectedIngredients: [],
  recipeType: 'dinner',
  cuisineStyle: 'any',
  allowExtraIngredients: false,

  setScannedIngredients: (ingredients) => {
    const selected = ingredients.filter(i => i.confidence > 0.7).map(i => i.id);
    set({ 
      scannedIngredients: ingredients,
      selectedIngredients: selected,
    });
  },

  toggleIngredient: (id) => {
    const { selectedIngredients } = get();
    const isSelected = selectedIngredients.includes(id);
    
    set({
      selectedIngredients: isSelected
        ? selectedIngredients.filter(i => i !== id)
        : [...selectedIngredients, id],
    });
  },

  selectAllIngredients: () => {
    const { scannedIngredients } = get();
    set({ selectedIngredients: scannedIngredients.map(i => i.id) });
  },

  clearIngredients: () => {
    set({ scannedIngredients: [], selectedIngredients: [] });
  },

  addManualIngredient: (name) => {
    const id = `manual-${Date.now()}`;
    const newIngredient: Ingredient = {
      id,
      name: name.toLowerCase().trim(),
      confidence: 1,
      category: 'other',
      selected: true,
    };
    
    set(state => ({
      scannedIngredients: [...state.scannedIngredients, newIngredient],
      selectedIngredients: [...state.selectedIngredients, id],
    }));
  },

  removeIngredient: (id) => {
    set(state => ({
      scannedIngredients: state.scannedIngredients.filter(i => i.id !== id),
      selectedIngredients: state.selectedIngredients.filter(i => i !== id),
    }));
  },

  setRecipeType: (type) => set({ recipeType: type }),
  setCuisineStyle: (style) => set({ cuisineStyle: style }),
  setAllowExtraIngredients: (allow) => set({ allowExtraIngredients: allow }),

  getSelectedIngredientNames: () => {
    const { scannedIngredients, selectedIngredients } = get();
    return scannedIngredients
      .filter(i => selectedIngredients.includes(i.id))
      .map(i => i.name);
  },
}));

