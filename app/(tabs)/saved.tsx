import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRecipesStore } from '@/stores/recipes-store';
import { useAuthStore } from '@/stores/auth-store';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function SavedScreen() {
  const router = useRouter();
  const { session } = useAuthStore();
  const { 
    savedRecipes, 
    shoppingLists,
    isLoadingSaved,
    loadSavedRecipes, 
    loadShoppingLists,
    unsaveRecipe,
    deleteShoppingList,
    toggleShoppingItem,
  } = useRecipesStore();

  const [activeTab, setActiveTab] = useState<'recipes' | 'shopping'>('recipes');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (session) {
      loadSavedRecipes();
      loadShoppingLists();
    }
  }, [session]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadSavedRecipes(), loadShoppingLists()]);
    setRefreshing(false);
  };

  const handleDeleteRecipe = (recipeId: string, title: string) => {
    Alert.alert(
      'Remove Recipe',
      `Are you sure you want to remove "${title}" from your saved recipes?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => unsaveRecipe(recipeId),
        },
      ]
    );
  };

  const handleDeleteList = (listId: string, name: string) => {
    Alert.alert(
      'Delete Shopping List',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteShoppingList(listId),
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-stone-900">
      <LinearGradient
        colors={['#1c1917', '#292524', '#1c1917']}
        className="absolute inset-0"
      />

      <ScrollView 
        className="flex-1 px-5" 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#ee7711"
          />
        }
      >
        {/* Header */}
        <View className="pt-4 pb-4">
          <Text className="text-3xl font-bold text-white">Saved</Text>
        </View>

        {/* Tab Switcher */}
        <View className="flex-row bg-stone-800 rounded-xl p-1 mb-6">
          <TouchableOpacity
            onPress={() => setActiveTab('recipes')}
            className={`flex-1 py-3 rounded-lg ${
              activeTab === 'recipes' ? 'bg-primary-500' : ''
            }`}
          >
            <Text className={`text-center font-medium ${
              activeTab === 'recipes' ? 'text-white' : 'text-stone-400'
            }`}>
              Recipes ({savedRecipes.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('shopping')}
            className={`flex-1 py-3 rounded-lg ${
              activeTab === 'shopping' ? 'bg-primary-500' : ''
            }`}
          >
            <Text className={`text-center font-medium ${
              activeTab === 'shopping' ? 'text-white' : 'text-stone-400'
            }`}>
              Shopping ({shoppingLists.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recipes Tab */}
        {activeTab === 'recipes' && (
          <>
            {savedRecipes.length === 0 ? (
              <View className="items-center py-12">
                <Text className="text-6xl mb-4">📚</Text>
                <Text className="text-xl font-semibold text-white mb-2">
                  No saved recipes
                </Text>
                <Text className="text-stone-400 text-center">
                  Recipes you save will appear here
                </Text>
              </View>
            ) : (
              savedRecipes.map((recipe) => (
                <TouchableOpacity
                  key={recipe.id}
                  onPress={() => router.push(`/recipe/${recipe.id}`)}
                  className="bg-stone-800 rounded-2xl p-5 mb-4 border border-stone-700"
                >
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1 mr-3">
                      <Text className="text-lg font-bold text-white mb-1">
                        {recipe.title}
                      </Text>
                      <Text className="text-stone-400 text-sm mb-3" numberOfLines={2}>
                        {recipe.description}
                      </Text>
                      <View className="flex-row gap-4">
                        <View className="flex-row items-center gap-1">
                          <IconSymbol name="clock" size={14} color="#78716c" />
                          <Text className="text-stone-400 text-sm">
                            {recipe.prepTime + recipe.cookTime} min
                          </Text>
                        </View>
                        <View className="bg-stone-700 px-2 py-1 rounded">
                          <Text className="text-stone-300 text-xs capitalize">
                            {recipe.recipeType}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleDeleteRecipe(recipe.id, recipe.title)}
                      className="p-2"
                    >
                      <IconSymbol name="trash" size={20} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </>
        )}

        {/* Shopping Lists Tab */}
        {activeTab === 'shopping' && (
          <>
            {shoppingLists.length === 0 ? (
              <View className="items-center py-12">
                <Text className="text-6xl mb-4">🛒</Text>
                <Text className="text-xl font-semibold text-white mb-2">
                  No shopping lists
                </Text>
                <Text className="text-stone-400 text-center">
                  Generate recipes with extra ingredients{'\n'}to create shopping lists
                </Text>
              </View>
            ) : (
              shoppingLists.map((list) => {
                const completedCount = list.items.filter(i => i.isChecked).length;
                const progress = list.items.length > 0 
                  ? (completedCount / list.items.length) * 100 
                  : 0;

                return (
                  <View
                    key={list.id}
                    className="bg-stone-800 rounded-2xl p-5 mb-4 border border-stone-700"
                  >
                    <View className="flex-row justify-between items-start mb-3">
                      <View className="flex-1">
                        <Text className="text-lg font-bold text-white">
                          {list.name}
                        </Text>
                        <Text className="text-stone-400 text-sm mt-1">
                          {completedCount}/{list.items.length} items
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleDeleteList(list.id, list.name)}
                        className="p-2"
                      >
                        <IconSymbol name="trash" size={20} color="#ef4444" />
                      </TouchableOpacity>
                    </View>

                    {/* Progress Bar */}
                    <View className="h-2 bg-stone-700 rounded-full mb-4 overflow-hidden">
                      <View 
                        className="h-full bg-secondary-500 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </View>

                    {/* Items */}
                    {list.items.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        onPress={() => toggleShoppingItem(list.id, item.id)}
                        className="flex-row items-center gap-3 py-2"
                      >
                        <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                          item.isChecked 
                            ? 'bg-secondary-500 border-secondary-500' 
                            : 'border-stone-600'
                        }`}>
                          {item.isChecked && (
                            <IconSymbol name="checkmark" size={14} color="white" />
                          )}
                        </View>
                        <Text className={`flex-1 ${
                          item.isChecked 
                            ? 'text-stone-500 line-through' 
                            : 'text-stone-300'
                        }`}>
                          {item.amount} {item.unit} {item.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                );
              })
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

