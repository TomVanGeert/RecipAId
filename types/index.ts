export * from './database';

export interface Ingredient {
  id: string;
  name: string;
  confidence: number;
  category: string;
  selected: boolean;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  recipeType: RecipeType;
  cuisineStyle: CuisineStyle;
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: RecipeIngredient[];
  instructions: string[];
  tips?: string[];
  isSaved: boolean;
  createdAt: string;
}

export interface RecipeIngredient {
  name: string;
  amount: string;
  unit: string;
  isAvailable: boolean;
}

export interface ShoppingList {
  id: string;
  name: string;
  recipeId?: string;
  items: ShoppingListItem[];
  isCompleted: boolean;
  createdAt: string;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  amount: string;
  unit: string;
  isChecked: boolean;
}

export type RecipeType = 'breakfast' | 'lunch' | 'dinner' | 'dessert' | 'snack';
export type CuisineStyle = 
  | 'mexican' 
  | 'french' 
  | 'american' 
  | 'indian' 
  | 'italian' 
  | 'chinese' 
  | 'japanese' 
  | 'thai' 
  | 'mediterranean' 
  | 'any';

export interface UserPreferences {
  defaultCuisine: CuisineStyle;
  dietaryRestrictions: string[];
  allergies: string[];
  servingSize: number;
}

