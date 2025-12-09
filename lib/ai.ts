import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini client
const geminiApiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

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

// Check if AI is configured
export function isAIConfigured(): boolean {
  return !!geminiApiKey;
}

export async function detectIngredients(imageBase64: string): Promise<IngredientDetectionResult> {
  if (!genAI) {
    throw new Error('Gemini API key not configured. Please add EXPO_PUBLIC_GEMINI_API_KEY to your .env file.');
  }

  // Use gemini-1.5-flash or fall back to gemini-pro-vision
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `You are an expert at identifying food ingredients from images. 
Analyze this image and identify all visible food ingredients.
Return ONLY a valid JSON object (no markdown, no code blocks) with this structure:
{
  "ingredients": [
    { "name": "ingredient name (lowercase, singular)", "confidence": 0.9, "category": "produce|protein|dairy|grain|condiment|spice|other" }
  ]
}

Only identify actual food ingredients, not containers, utensils, or non-food items.
Be specific (e.g., "red bell pepper" not just "pepper").`;

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        mimeType: 'image/jpeg',
        data: imageBase64,
      },
    },
  ]);

  const response = await result.response;
  const text = response.text();

  // Clean up the response (remove markdown code blocks if present)
  const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  try {
    return JSON.parse(cleanedText) as IngredientDetectionResult;
  } catch (error) {
    console.error('Failed to parse Gemini response:', cleanedText);
    throw new Error('Failed to parse ingredient detection response');
  }
}

export async function generateRecipes(
  ingredients: string[],
  recipeType: RecipeType,
  cuisineStyle: CuisineStyle,
  allowExtraIngredients: boolean
): Promise<GeneratedRecipe[]> {
  if (!genAI) {
    throw new Error('Gemini API key not configured. Please add EXPO_PUBLIC_GEMINI_API_KEY to your .env file.');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const modeDescription = allowExtraIngredients
    ? 'You may suggest recipes that require additional ingredients beyond what is available. Mark ingredients as isAvailable: false if they need to be purchased.'
    : 'Only suggest recipes that can be made with EXACTLY the available ingredients. All ingredients must be marked as isAvailable: true.';

  const prompt = `You are a creative chef who generates delicious recipes.
Generate 3 recipe suggestions based on these available ingredients: ${ingredients.join(', ')}

Meal type: ${recipeType}
Cuisine style: ${cuisineStyle === 'any' ? 'any cuisine' : cuisineStyle}

${modeDescription}

Return ONLY a valid JSON object (no markdown, no code blocks) with this structure:
{
  "recipes": [
    {
      "title": "Creative recipe name",
      "description": "Brief appetizing description (1-2 sentences)",
      "prepTime": 15,
      "cookTime": 30,
      "servings": 4,
      "ingredients": [
        { "name": "ingredient", "amount": "1", "unit": "cup", "isAvailable": true }
      ],
      "instructions": ["Step 1...", "Step 2..."],
      "tips": ["Optional cooking tip"]
    }
  ]
}

Make recipes practical, delicious, and appropriately matched to the meal type and cuisine style.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  // Clean up the response
  const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  try {
    const parsed = JSON.parse(cleanedText) as { recipes: GeneratedRecipe[] };
    return parsed.recipes;
  } catch (error) {
    console.error('Failed to parse Gemini response:', cleanedText);
    throw new Error('Failed to parse recipe generation response');
  }
}

