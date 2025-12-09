import { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useIngredientsStore } from '@/stores/ingredients-store';
import { detectIngredients } from '@/lib/openai';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { Ingredient } from '@/types';

export default function ScanScreen() {
  const router = useRouter();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const { 
    scannedIngredients, 
    selectedIngredients,
    setScannedIngredients, 
    toggleIngredient,
    addManualIngredient,
    clearIngredients,
  } = useIngredientsStore();

  const pickImage = async (useCamera: boolean) => {
    try {
      const permissionResult = useCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please grant camera/photo access to scan ingredients.');
        return;
      }

      const result = useCamera
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
          });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
        await analyzeImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const analyzeImage = async (uri: string) => {
    setIsAnalyzing(true);
    try {
      // Convert image to base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const result = await detectIngredients(base64);
      
      const ingredients: Ingredient[] = result.ingredients.map((ing, index) => ({
        id: `ing-${Date.now()}-${index}`,
        name: ing.name,
        confidence: ing.confidence,
        category: ing.category,
        selected: ing.confidence > 0.7,
      }));

      setScannedIngredients(ingredients);
    } catch (error) {
      console.error('Error analyzing image:', error);
      Alert.alert('Analysis Failed', 'Could not identify ingredients. Please try again or add manually.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleContinue = () => {
    if (selectedIngredients.length === 0) {
      Alert.alert('No Ingredients', 'Please select at least one ingredient to continue.');
      return;
    }
    router.push('/(tabs)/recipes');
  };

  const handleClear = () => {
    setImageUri(null);
    clearIngredients();
  };

  return (
    <SafeAreaView className="flex-1 bg-stone-900">
      <LinearGradient
        colors={['#1c1917', '#292524', '#1c1917']}
        className="absolute inset-0"
      />
      
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="pt-4 pb-6">
          <Text className="text-3xl font-bold text-white">
            Scan Ingredients
          </Text>
          <Text className="text-stone-400 mt-2">
            Take a photo of your fridge or ingredients to get started
          </Text>
        </View>

        {/* Camera/Gallery Buttons */}
        {!imageUri && (
          <View className="flex-row gap-4 mb-6">
            <TouchableOpacity 
              onPress={() => pickImage(true)}
              className="flex-1 bg-primary-500 rounded-2xl py-6 items-center"
              style={{ shadowColor: '#ee7711', shadowOpacity: 0.3, shadowRadius: 12 }}
            >
              <IconSymbol name="camera.fill" size={32} color="white" />
              <Text className="text-white font-semibold mt-2">Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => pickImage(false)}
              className="flex-1 bg-stone-800 border border-stone-700 rounded-2xl py-6 items-center"
            >
              <IconSymbol name="photo.fill" size={32} color="#ee7711" />
              <Text className="text-stone-300 font-semibold mt-2">Gallery</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Image Preview */}
        {imageUri && (
          <View className="mb-6">
            <View className="rounded-2xl overflow-hidden bg-stone-800">
              <Image
                source={{ uri: imageUri }}
                style={{ width: '100%', height: 200 }}
                contentFit="cover"
              />
              {isAnalyzing && (
                <View className="absolute inset-0 bg-black/60 items-center justify-center">
                  <ActivityIndicator size="large" color="#ee7711" />
                  <Text className="text-white mt-3 font-medium">
                    Analyzing ingredients...
                  </Text>
                </View>
              )}
            </View>
            <TouchableOpacity 
              onPress={handleClear}
              className="absolute top-3 right-3 bg-stone-900/80 rounded-full p-2"
            >
              <IconSymbol name="xmark" size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}

        {/* Detected Ingredients */}
        {scannedIngredients.length > 0 && (
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-white">
                Detected Ingredients
              </Text>
              <Text className="text-stone-400">
                {selectedIngredients.length} selected
              </Text>
            </View>

            <View className="flex-row flex-wrap gap-2">
              {scannedIngredients.map((ingredient) => {
                const isSelected = selectedIngredients.includes(ingredient.id);
                return (
                  <TouchableOpacity
                    key={ingredient.id}
                    onPress={() => toggleIngredient(ingredient.id)}
                    className={`px-4 py-3 rounded-xl flex-row items-center gap-2 ${
                      isSelected 
                        ? 'bg-primary-500/20 border border-primary-500' 
                        : 'bg-stone-800 border border-stone-700'
                    }`}
                  >
                    <Text className={isSelected ? 'text-primary-400 font-medium' : 'text-stone-300'}>
                      {ingredient.name}
                    </Text>
                    {ingredient.confidence < 0.7 && (
                      <Text className="text-stone-500 text-xs">?</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Add Manual Ingredient */}
        {(imageUri || scannedIngredients.length > 0) && (
          <TouchableOpacity 
            onPress={() => {
              Alert.prompt(
                'Add Ingredient',
                'Enter ingredient name',
                (text) => {
                  if (text?.trim()) {
                    addManualIngredient(text.trim());
                  }
                }
              );
            }}
            className="flex-row items-center justify-center gap-2 py-4 mb-6 border border-dashed border-stone-600 rounded-xl"
          >
            <IconSymbol name="plus" size={20} color="#78716c" />
            <Text className="text-stone-400">Add ingredient manually</Text>
          </TouchableOpacity>
        )}

        {/* Continue Button */}
        {scannedIngredients.length > 0 && (
          <TouchableOpacity
            onPress={handleContinue}
            disabled={selectedIngredients.length === 0}
            className={`py-4 rounded-2xl mb-8 ${
              selectedIngredients.length > 0 
                ? 'bg-primary-500' 
                : 'bg-stone-700'
            }`}
          >
            <Text className={`text-center font-bold text-lg ${
              selectedIngredients.length > 0 ? 'text-white' : 'text-stone-500'
            }`}>
              Continue to Recipes →
            </Text>
          </TouchableOpacity>
        )}

        {/* Empty State */}
        {!imageUri && scannedIngredients.length === 0 && (
          <View className="items-center py-12">
            <Text className="text-6xl mb-4">📸</Text>
            <Text className="text-stone-400 text-center text-base">
              Snap a photo of your fridge, pantry, or{'\n'}individual ingredients to get started
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
