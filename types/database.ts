export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          display_name: string | null;
          avatar_url: string | null;
          preferences: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          preferences?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          preferences?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      ingredients: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          confidence: number;
          category: string | null;
          scanned_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          confidence: number;
          category?: string | null;
          scanned_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          confidence?: number;
          category?: string | null;
          scanned_at?: string;
        };
      };
      recipes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          recipe_type: string;
          cuisine_style: string | null;
          ingredients: Json;
          instructions: Json;
          prep_time: number | null;
          cook_time: number | null;
          servings: number | null;
          is_saved: boolean;
          extra_ingredients_needed: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          recipe_type: string;
          cuisine_style?: string | null;
          ingredients: Json;
          instructions: Json;
          prep_time?: number | null;
          cook_time?: number | null;
          servings?: number | null;
          is_saved?: boolean;
          extra_ingredients_needed?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          recipe_type?: string;
          cuisine_style?: string | null;
          ingredients?: Json;
          instructions?: Json;
          prep_time?: number | null;
          cook_time?: number | null;
          servings?: number | null;
          is_saved?: boolean;
          extra_ingredients_needed?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      shopping_lists: {
        Row: {
          id: string;
          user_id: string;
          recipe_id: string | null;
          name: string;
          items: Json;
          is_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          recipe_id?: string | null;
          name: string;
          items: Json;
          is_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          recipe_id?: string | null;
          name?: string;
          items?: Json;
          is_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

