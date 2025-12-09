import OpenAI from 'openai';

const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

export const openai = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true, // Required for React Native
});

export type RecipeType = 'breakfast' | 'lunch' | 'dinner' | 'dessert' | 'snack';
export type CuisineStyle = 'mexican' | 'french' | 'american' | 'indian' | 'italian' | 'chinese' | 'japanese' | 'thai' | 'mediterranean' | 'any';

export interface IngredientDetectionResult {
  ingredients: Array<{
    name: string;
    confidence: number;
    category: string;
  }>;
}

export interface GeneratedRecipe {
  title: string;
  description: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: Array<{
    name: string;
    amount: string;
    unit: string;
    isAvailable: boolean;
  }>;
  instructions: string[];
  tips?: string[];
}

export async function detectIngredients(imageBase64: string): Promise<IngredientDetectionResult> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are an expert at identifying food ingredients from images. 
Analyze the image and identify all visible food ingredients.
Return a JSON object with an "ingredients" array containing objects with:
- "name": the ingredient name (lowercase, singular form)
- "confidence": confidence score 0-1
- "category": one of "produce", "protein", "dairy", "grain", "condiment", "spice", "other"

Only identify actual food ingredients, not containers, utensils, or non-food items.
Be specific (e.g., "red bell pepper" not just "pepper").`,
      },
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${imageBase64}`,
            },
          },
          {
            type: 'text',
            text: 'Identify all food ingredients visible in this image.',
          },
        ],
      },
    ],
    response_format: { type: 'json_object' },
    max_tokens: 1000,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  return JSON.parse(content) as IngredientDetectionResult;
}

export async function generateRecipes(
  ingredients: string[],
  recipeType: RecipeType,
  cuisineStyle: CuisineStyle,
  allowExtraIngredients: boolean
): Promise<GeneratedRecipe[]> {
  const modeDescription = allowExtraIngredients
    ? 'You may suggest recipes that require additional ingredients beyond what is available. Mark ingredients as isAvailable: false if they need to be purchased.'
    : 'Only suggest recipes that can be made with EXACTLY the available ingredients. All ingredients must be marked as isAvailable: true.';

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are a creative chef who generates delicious recipes.
Generate 3 recipe suggestions based on the available ingredients.

${modeDescription}

Return a JSON object with a "recipes" array containing recipe objects with:
- "title": creative recipe name
- "description": brief appetizing description (1-2 sentences)
- "prepTime": preparation time in minutes
- "cookTime": cooking time in minutes
- "servings": number of servings
- "ingredients": array of { "name", "amount", "unit", "isAvailable" }
- "instructions": array of step-by-step instructions
- "tips": optional array of cooking tips

Make recipes practical, delicious, and appropriately matched to the meal type and cuisine style.`,
      },
      {
        role: 'user',
        content: `Available ingredients: ${ingredients.join(', ')}
Meal type: ${recipeType}
Cuisine style: ${cuisineStyle === 'any' ? 'any cuisine' : cuisineStyle}
Mode: ${allowExtraIngredients ? 'Can suggest extra ingredients' : 'Only use available ingredients'}

Generate 3 recipe suggestions.`,
      },
    ],
    response_format: { type: 'json_object' },
    max_tokens: 3000,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  const parsed = JSON.parse(content) as { recipes: GeneratedRecipe[] };
  return parsed.recipes;
}

