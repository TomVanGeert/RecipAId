import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '@/stores/auth-store';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, isLoading } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const { error } = await signIn(email, password);
    if (error) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <View className="flex-1 bg-stone-900">
      <LinearGradient
        colors={['#ee7711', '#df5d07', '#1c1917']}
        locations={[0, 0.3, 0.6]}
        className="absolute inset-0"
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-8"
      >
        {/* Logo Area */}
        <View className="items-center mb-12">
          <Text className="text-6xl mb-2">🍳</Text>
          <Text className="text-4xl font-bold text-white tracking-tight">
            RecipAId
          </Text>
          <Text className="text-stone-300 text-lg mt-2">
            Your AI Kitchen Assistant
          </Text>
        </View>

        {/* Form */}
        <View className="space-y-4">
          <View>
            <Text className="text-stone-300 text-sm font-medium mb-2 ml-1">
              Email
            </Text>
            <TextInput
              className="bg-stone-800/80 border border-stone-700 rounded-2xl px-5 py-4 text-white text-base"
              placeholder="your@email.com"
              placeholderTextColor="#78716c"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View>
            <Text className="text-stone-300 text-sm font-medium mb-2 ml-1">
              Password
            </Text>
            <TextInput
              className="bg-stone-800/80 border border-stone-700 rounded-2xl px-5 py-4 text-white text-base"
              placeholder="••••••••"
              placeholderTextColor="#78716c"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            className="bg-primary-500 rounded-2xl py-4 mt-6 shadow-lg"
            style={{ shadowColor: '#ee7711', shadowOpacity: 0.4, shadowRadius: 12 }}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-bold text-lg">
                Sign In
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Register Link */}
        <View className="flex-row justify-center mt-8">
          <Text className="text-stone-400">Don't have an account? </Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity>
              <Text className="text-primary-400 font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

