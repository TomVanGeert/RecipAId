import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRecipesStore } from '@/stores/recipes-store';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { Recipe } from '@/types';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { 
    generatedRecipes, 
    savedRecipes,
    saveRecipe,
    unsaveRecipe,
    createShoppingList,
  } = useRecipesStore();

  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    // Find recipe in generated or saved recipes
    const found = [...generatedRecipes, ...savedRecipes].find(r => r.id === id);
    if (found) {
      setRecipe(found);
    }
  }, [id, generatedRecipes, savedRecipes]);

  const handleSave = async () => {
    if (!recipe) return;
    
    if (recipe.isSaved) {
      await unsaveRecipe(recipe.id);
      setRecipe({ ...recipe, isSaved: false });
    } else {
      await saveRecipe(recipe);
      setRecipe({ ...recipe, isSaved: true });
      Alert.alert('Saved!', 'Recipe has been saved to your collection.');
    }
  };

  const handleCreateShoppingList = async () => {
    if (!recipe) return;
    
    const missingIngredients = recipe.ingredients.filter(i => !i.isAvailable);
    if (missingIngredients.length === 0) {
      Alert.alert('No Missing Ingredients', 'You have all the ingredients for this recipe!');
      return;
    }

    await createShoppingList(recipe);
    Alert.alert('Shopping List Created', 'Check your Saved tab to view the shopping list.');
  };

  if (!recipe) {
    return (
      <SafeAreaView className="flex-1 bg-stone-900 items-center justify-center">
        <Text className="text-white">Recipe not found</Text>
      </SafeAreaView>
    );
  }

  const missingIngredients = recipe.ingredients.filter(i => !i.isAvailable);
  const availableIngredients = recipe.ingredients.filter(i => i.isAvailable);

  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          headerTransparent: true,
          headerTitle: '',
          headerTintColor: 'white',
          headerRight: () => (
            <TouchableOpacity onPress={handleSave} className="mr-2">
              <IconSymbol 
                name={recipe.isSaved ? 'bookmark.fill' : 'bookmark'} 
                size={24} 
                color="#ee7711" 
              />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View className="flex-1 bg-stone-900">
        <LinearGradient
          colors={['#ee7711', '#df5d07', '#1c1917']}
          locations={[0, 0.2, 0.4]}
          className="absolute inset-0"
        />

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Header Section */}
          <View className="pt-24 px-5 pb-8">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="bg-white/20 px-3 py-1 rounded-full">
                <Text className="text-white text-sm capitalize">{recipe.recipeType}</Text>
              </View>
              {recipe.cuisineStyle !== 'any' && (
                <View className="bg-white/20 px-3 py-1 rounded-full">
                  <Text className="text-white text-sm capitalize">{recipe.cuisineStyle}</Text>
                </View>
              )}
            </View>
            
            <Text className="text-3xl font-bold text-white mb-3">
              {recipe.title}
            </Text>
            
            <Text className="text-white/80 text-base leading-relaxed">
              {recipe.description}
            </Text>

            {/* Quick Info */}
            <View className="flex-row gap-6 mt-6">
              <View className="flex-row items-center gap-2">
                <IconSymbol name="clock" size={18} color="white" />
                <Text className="text-white">
                  {recipe.prepTime + recipe.cookTime} min
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <IconSymbol name="person.2" size={18} color="white" />
                <Text className="text-white">
                  {recipe.servings} servings
                </Text>
              </View>
            </View>
          </View>

          {/* Content Card */}
          <View className="bg-stone-900 rounded-t-3xl px-5 pt-6 pb-8 min-h-screen">
            {/* Time Breakdown */}
            <View className="flex-row gap-4 mb-8">
              <View className="flex-1 bg-stone-800 rounded-xl p-4 border border-stone-700">
                <Text className="text-stone-400 text-sm mb-1">Prep Time</Text>
                <Text className="text-white text-xl font-bold">{recipe.prepTime} min</Text>
              </View>
              <View className="flex-1 bg-stone-800 rounded-xl p-4 border border-stone-700">
                <Text className="text-stone-400 text-sm mb-1">Cook Time</Text>
                <Text className="text-white text-xl font-bold">{recipe.cookTime} min</Text>
              </View>
            </View>

            {/* Ingredients Section */}
            <View className="mb-8">
              <Text className="text-xl font-bold text-white mb-4">
                Ingredients
              </Text>

              {/* Available Ingredients */}
              {availableIngredients.length > 0 && (
                <View className="mb-4">
                  <Text className="text-secondary-400 text-sm font-medium mb-2">
                    ✓ Available ({availableIngredients.length})
                  </Text>
                  {availableIngredients.map((ing, index) => (
                    <View 
                      key={index}
                      className="flex-row items-center gap-3 py-3 border-b border-stone-800"
                    >
                      <View className="w-2 h-2 bg-secondary-500 rounded-full" />
                      <Text className="text-stone-300 flex-1">
                        {ing.amount} {ing.unit} {ing.name}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Missing Ingredients */}
              {missingIngredients.length > 0 && (
                <View>
                  <Text className="text-amber-400 text-sm font-medium mb-2">
                    🛒 Need to buy ({missingIngredients.length})
                  </Text>
                  {missingIngredients.map((ing, index) => (
                    <View 
                      key={index}
                      className="flex-row items-center gap-3 py-3 border-b border-stone-800"
                    >
                      <View className="w-2 h-2 bg-amber-500 rounded-full" />
                      <Text className="text-stone-300 flex-1">
                        {ing.amount} {ing.unit} {ing.name}
                      </Text>
                    </View>
                  ))}
                  
                  <TouchableOpacity
                    onPress={handleCreateShoppingList}
                    className="bg-amber-500/20 border border-amber-500/30 rounded-xl py-3 mt-4"
                  >
                    <Text className="text-amber-400 text-center font-medium">
                      + Add to Shopping List
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Instructions Section */}
            <View className="mb-8">
              <Text className="text-xl font-bold text-white mb-4">
                Instructions
              </Text>
              
              {recipe.instructions.map((step, index) => (
                <View key={index} className="flex-row gap-4 mb-4">
                  <View className="w-8 h-8 bg-primary-500 rounded-full items-center justify-center">
                    <Text className="text-white font-bold">{index + 1}</Text>
                  </View>
                  <Text className="flex-1 text-stone-300 leading-relaxed pt-1">
                    {step}
                  </Text>
                </View>
              ))}
            </View>

            {/* Tips Section */}
            {recipe.tips && recipe.tips.length > 0 && (
              <View className="bg-stone-800 rounded-xl p-5 border border-stone-700">
                <Text className="text-lg font-bold text-white mb-3">
                  💡 Chef's Tips
                </Text>
                {recipe.tips.map((tip, index) => (
                  <Text 
                    key={index}
                    className="text-stone-400 mb-2 leading-relaxed"
                  >
                    • {tip}
                  </Text>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </>
  );
}

