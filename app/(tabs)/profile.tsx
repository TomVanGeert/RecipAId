import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '@/stores/auth-store';
import { useRecipesStore } from '@/stores/recipes-store';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function ProfileScreen() {
  const { user, signOut, isLoading } = useAuthStore();
  const { savedRecipes, shoppingLists } = useRecipesStore();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: signOut,
        },
      ]
    );
  };

  const stats = [
    { label: 'Saved Recipes', value: savedRecipes.length, icon: 'bookmark.fill' as const },
    { label: 'Shopping Lists', value: shoppingLists.length, icon: 'cart.fill' as const },
  ];

  return (
    <SafeAreaView className="flex-1 bg-stone-900">
      <LinearGradient
        colors={['#1c1917', '#292524', '#1c1917']}
        className="absolute inset-0"
      />

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="pt-4 pb-6">
          <Text className="text-3xl font-bold text-white">Profile</Text>
        </View>

        {/* User Card */}
        <View className="bg-stone-800 rounded-2xl p-6 mb-6 border border-stone-700">
          <View className="items-center">
            <View className="w-20 h-20 bg-primary-500 rounded-full items-center justify-center mb-4">
              <Text className="text-3xl">👨‍🍳</Text>
            </View>
            <Text className="text-xl font-bold text-white mb-1">
              {user?.email?.split('@')[0] || 'Chef'}
            </Text>
            <Text className="text-stone-400">
              {user?.email}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row gap-4 mb-6">
          {stats.map((stat) => (
            <View 
              key={stat.label}
              className="flex-1 bg-stone-800 rounded-2xl p-5 border border-stone-700"
            >
              <IconSymbol name={stat.icon} size={24} color="#ee7711" />
              <Text className="text-3xl font-bold text-white mt-3 mb-1">
                {stat.value}
              </Text>
              <Text className="text-stone-400 text-sm">
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Menu Items */}
        <View className="bg-stone-800 rounded-2xl border border-stone-700 mb-6">
          <TouchableOpacity className="flex-row items-center justify-between p-5 border-b border-stone-700">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 bg-stone-700 rounded-xl items-center justify-center">
                <IconSymbol name="gearshape.fill" size={20} color="#ee7711" />
              </View>
              <Text className="text-white font-medium">Preferences</Text>
            </View>
            <IconSymbol name="chevron.right" size={16} color="#78716c" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between p-5 border-b border-stone-700">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 bg-stone-700 rounded-xl items-center justify-center">
                <IconSymbol name="exclamationmark.triangle.fill" size={20} color="#f59e0b" />
              </View>
              <Text className="text-white font-medium">Dietary Restrictions</Text>
            </View>
            <IconSymbol name="chevron.right" size={16} color="#78716c" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between p-5 border-b border-stone-700">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 bg-stone-700 rounded-xl items-center justify-center">
                <IconSymbol name="bell.fill" size={20} color="#3b82f6" />
              </View>
              <Text className="text-white font-medium">Notifications</Text>
            </View>
            <IconSymbol name="chevron.right" size={16} color="#78716c" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between p-5">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 bg-stone-700 rounded-xl items-center justify-center">
                <IconSymbol name="questionmark.circle.fill" size={20} color="#22c55e" />
              </View>
              <Text className="text-white font-medium">Help & Support</Text>
            </View>
            <IconSymbol name="chevron.right" size={16} color="#78716c" />
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View className="items-center mb-6">
          <Text className="text-stone-500 text-sm">RecipAId v1.0.0</Text>
          <Text className="text-stone-600 text-xs mt-1">
            Powered by OpenAI GPT-4
          </Text>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          onPress={handleSignOut}
          disabled={isLoading}
          className="bg-red-500/10 border border-red-500/30 rounded-2xl py-4 mb-8"
        >
          <Text className="text-red-400 text-center font-semibold">
            Sign Out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

