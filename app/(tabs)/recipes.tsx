import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useIngredientsStore } from '@/stores/ingredients-store';
import { useRecipesStore } from '@/stores/recipes-store';
import { generateRecipes } from '@/lib/openai';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { RecipeType, CuisineStyle, Recipe } from '@/types';

const RECIPE_TYPES: { value: RecipeType; label: string; emoji: string }[] = [
  { value: 'breakfast', label: 'Breakfast', emoji: '🍳' },
  { value: 'lunch', label: 'Lunch', emoji: '🥗' },
  { value: 'dinner', label: 'Dinner', emoji: '🍝' },
  { value: 'dessert', label: 'Dessert', emoji: '🍰' },
  { value: 'snack', label: 'Snack', emoji: '🍿' },
];

const CUISINE_STYLES: { value: CuisineStyle; label: string; flag: string }[] = [
  { value: 'any', label: 'Any', flag: '🌍' },
  { value: 'mexican', label: 'Mexican', flag: '🇲🇽' },
  { value: 'italian', label: 'Italian', flag: '🇮🇹' },
  { value: 'indian', label: 'Indian', flag: '🇮🇳' },
  { value: 'chinese', label: 'Chinese', flag: '🇨🇳' },
  { value: 'japanese', label: 'Japanese', flag: '🇯🇵' },
  { value: 'french', label: 'French', flag: '🇫🇷' },
  { value: 'american', label: 'American', flag: '🇺🇸' },
  { value: 'thai', label: 'Thai', flag: '🇹🇭' },
  { value: 'mediterranean', label: 'Mediterranean', flag: '🫒' },
];

export default function RecipesScreen() {
  const router = useRouter();
  const {
    scannedIngredients,
    selectedIngredients,
    recipeType,
    cuisineStyle,
    allowExtraIngredients,
    setRecipeType,
    setCuisineStyle,
    setAllowExtraIngredients,
    getSelectedIngredientNames,
  } = useIngredientsStore();

  const {
    generatedRecipes,
    isGenerating,
    setGeneratedRecipes,
    setIsGenerating,
    saveRecipe,
  } = useRecipesStore();

  const ingredientNames = getSelectedIngredientNames();

  const handleGenerate = async () => {
    if (ingredientNames.length === 0) {
      Alert.alert('No Ingredients', 'Please scan and select ingredients first.');
      router.push('/(tabs)');
      return;
    }

    setIsGenerating(true);
    try {
      const recipes = await generateRecipes(
        ingredientNames,
        recipeType,
        cuisineStyle,
        allowExtraIngredients
      );

      const formattedRecipes: Recipe[] = recipes.map((r, index) => ({
        id: `generated-${Date.now()}-${index}`,
        title: r.title,
        description: r.description,
        recipeType,
        cuisineStyle,
        prepTime: r.prepTime,
        cookTime: r.cookTime,
        servings: r.servings,
        ingredients: r.ingredients,
        instructions: r.instructions,
        tips: r.tips,
        isSaved: false,
        createdAt: new Date().toISOString(),
      }));

      setGeneratedRecipes(formattedRecipes);
    } catch (error) {
      console.error('Error generating recipes:', error);
      Alert.alert('Generation Failed', 'Could not generate recipes. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveRecipe = async (recipe: Recipe) => {
    await saveRecipe(recipe);
    Alert.alert('Saved!', 'Recipe has been saved to your collection.');
  };

  return (
    <SafeAreaView className="flex-1 bg-stone-900">
      <LinearGradient
        colors={['#1c1917', '#292524', '#1c1917']}
        className="absolute inset-0"
      />

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="pt-4 pb-4">
          <Text className="text-3xl font-bold text-white">
            Recipe Generator
          </Text>
          <Text className="text-stone-400 mt-2">
            {ingredientNames.length > 0 
              ? `Using ${ingredientNames.length} ingredients`
              : 'Scan ingredients to get started'}
          </Text>
        </View>

        {/* Selected Ingredients Preview */}
        {ingredientNames.length > 0 && (
          <View className="mb-6">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2">
                {ingredientNames.slice(0, 8).map((name, index) => (
                  <View 
                    key={index}
                    className="bg-stone-800 px-3 py-2 rounded-lg"
                  >
                    <Text className="text-stone-300 text-sm">{name}</Text>
                  </View>
                ))}
                {ingredientNames.length > 8 && (
                  <View className="bg-stone-700 px-3 py-2 rounded-lg">
                    <Text className="text-stone-400 text-sm">
                      +{ingredientNames.length - 8} more
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Recipe Type Selector */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-white mb-3">Meal Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-3">
              {RECIPE_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  onPress={() => setRecipeType(type.value)}
                  className={`px-5 py-3 rounded-xl ${
                    recipeType === type.value
                      ? 'bg-primary-500'
                      : 'bg-stone-800 border border-stone-700'
                  }`}
                >
                  <Text className="text-2xl text-center mb-1">{type.emoji}</Text>
                  <Text className={`text-sm font-medium ${
                    recipeType === type.value ? 'text-white' : 'text-stone-300'
                  }`}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Cuisine Style Selector */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-white mb-3">Cuisine Style</Text>
          <View className="flex-row flex-wrap gap-2">
            {CUISINE_STYLES.map((style) => (
              <TouchableOpacity
                key={style.value}
                onPress={() => setCuisineStyle(style.value)}
                className={`px-4 py-2 rounded-xl flex-row items-center gap-2 ${
                  cuisineStyle === style.value
                    ? 'bg-secondary-500/20 border border-secondary-500'
                    : 'bg-stone-800 border border-stone-700'
                }`}
              >
                <Text>{style.flag}</Text>
                <Text className={`text-sm ${
                  cuisineStyle === style.value ? 'text-secondary-400 font-medium' : 'text-stone-300'
                }`}>
                  {style.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Extra Ingredients Toggle */}
        <TouchableOpacity
          onPress={() => setAllowExtraIngredients(!allowExtraIngredients)}
          className={`flex-row items-center justify-between p-4 rounded-xl mb-6 ${
            allowExtraIngredients
              ? 'bg-primary-500/20 border border-primary-500'
              : 'bg-stone-800 border border-stone-700'
          }`}
        >
          <View className="flex-1 mr-4">
            <Text className={`font-medium ${
              allowExtraIngredients ? 'text-primary-400' : 'text-white'
            }`}>
              Allow extra ingredients
            </Text>
            <Text className="text-stone-400 text-sm mt-1">
              Suggest recipes that may need additional items (creates shopping list)
            </Text>
          </View>
          <View className={`w-12 h-7 rounded-full justify-center ${
            allowExtraIngredients ? 'bg-primary-500 items-end' : 'bg-stone-600 items-start'
          }`}>
            <View className="w-5 h-5 bg-white rounded-full mx-1" />
          </View>
        </TouchableOpacity>

        {/* Generate Button */}
        <TouchableOpacity
          onPress={handleGenerate}
          disabled={isGenerating || ingredientNames.length === 0}
          className={`py-4 rounded-2xl mb-6 ${
            ingredientNames.length > 0 && !isGenerating
              ? 'bg-primary-500'
              : 'bg-stone-700'
          }`}
          style={ingredientNames.length > 0 ? { 
            shadowColor: '#ee7711', 
            shadowOpacity: 0.4, 
            shadowRadius: 12 
          } : {}}
        >
          {isGenerating ? (
            <View className="flex-row items-center justify-center gap-3">
              <ActivityIndicator color="white" />
              <Text className="text-white font-bold text-lg">Generating...</Text>
            </View>
          ) : (
            <Text className={`text-center font-bold text-lg ${
              ingredientNames.length > 0 ? 'text-white' : 'text-stone-500'
            }`}>
              ✨ Generate Recipes
            </Text>
          )}
        </TouchableOpacity>

        {/* Generated Recipes */}
        {generatedRecipes.length > 0 && (
          <View className="mb-8">
            <Text className="text-xl font-bold text-white mb-4">
              Recipe Suggestions
            </Text>
            
            {generatedRecipes.map((recipe) => {
              const missingIngredients = recipe.ingredients.filter(i => !i.isAvailable);
              
              return (
                <TouchableOpacity
                  key={recipe.id}
                  onPress={() => router.push(`/recipe/${recipe.id}`)}
                  className="bg-stone-800 rounded-2xl p-5 mb-4 border border-stone-700"
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <Text className="text-lg font-bold text-white flex-1 mr-2">
                      {recipe.title}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleSaveRecipe(recipe)}
                      className="p-2"
                    >
                      <IconSymbol 
                        name={recipe.isSaved ? 'bookmark.fill' : 'bookmark'} 
                        size={22} 
                        color="#ee7711" 
                      />
                    </TouchableOpacity>
                  </View>
                  
                  <Text className="text-stone-400 mb-3" numberOfLines={2}>
                    {recipe.description}
                  </Text>

                  <View className="flex-row gap-4 mb-3">
                    <View className="flex-row items-center gap-1">
                      <IconSymbol name="clock" size={14} color="#78716c" />
                      <Text className="text-stone-400 text-sm">
                        {recipe.prepTime + recipe.cookTime} min
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <IconSymbol name="person.2" size={14} color="#78716c" />
                      <Text className="text-stone-400 text-sm">
                        {recipe.servings} servings
                      </Text>
                    </View>
                  </View>

                  {missingIngredients.length > 0 && (
                    <View className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                      <Text className="text-amber-400 text-sm font-medium">
                        🛒 Needs {missingIngredients.length} extra ingredient{missingIngredients.length > 1 ? 's' : ''}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Empty State */}
        {ingredientNames.length === 0 && (
          <View className="items-center py-12">
            <Text className="text-6xl mb-4">🍽️</Text>
            <Text className="text-stone-400 text-center text-base mb-4">
              No ingredients selected yet
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)')}
              className="bg-stone-800 px-6 py-3 rounded-xl"
            >
              <Text className="text-primary-400 font-medium">
                Scan Ingredients
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

