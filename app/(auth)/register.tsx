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
  ScrollView,
} from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '@/stores/auth-store';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signUp, isLoading } = useAuthStore();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    const { error } = await signUp(email, password);
    if (error) {
      Alert.alert('Registration Failed', error.message);
    } else {
      Alert.alert(
        'Success',
        'Please check your email to verify your account',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View className="flex-1 bg-stone-900">
      <LinearGradient
        colors={['#22c55e', '#16a34a', '#1c1917']}
        locations={[0, 0.3, 0.6]}
        className="absolute inset-0"
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          className="px-8"
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo Area */}
          <View className="items-center mb-10">
            <Text className="text-6xl mb-2">🥗</Text>
            <Text className="text-4xl font-bold text-white tracking-tight">
              Join RecipAId
            </Text>
            <Text className="text-stone-300 text-lg mt-2">
              Start your culinary journey
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
                placeholder="Minimum 6 characters"
                placeholderTextColor="#78716c"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="new-password"
              />
            </View>

            <View>
              <Text className="text-stone-300 text-sm font-medium mb-2 ml-1">
                Confirm Password
              </Text>
              <TextInput
                className="bg-stone-800/80 border border-stone-700 rounded-2xl px-5 py-4 text-white text-base"
                placeholder="Re-enter your password"
                placeholderTextColor="#78716c"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoComplete="new-password"
              />
            </View>

            <TouchableOpacity
              onPress={handleRegister}
              disabled={isLoading}
              className="bg-secondary-500 rounded-2xl py-4 mt-6 shadow-lg"
              style={{ shadowColor: '#22c55e', shadowOpacity: 0.4, shadowRadius: 12 }}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-bold text-lg">
                  Create Account
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Login Link */}
          <View className="flex-row justify-center mt-8 mb-8">
            <Text className="text-stone-400">Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text className="text-secondary-400 font-semibold">Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

