import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthStyles, BaseStyles } from '../../constants/styles';
import { supabase } from '../../lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        Alert.alert('Fout', error.message);
      } else {
        router.replace('/(tabs)');
      }
    } catch (error) {
      Alert.alert('Fout', 'Er is iets misgegaan. Probeer het opnieuw.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={BaseStyles.container}>
      <KeyboardAvoidingView style={AuthStyles.keyboardContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={AuthStyles.content}>
          <Text style={BaseStyles.title}>Motiva</Text>
          <Text style={BaseStyles.subtitle}>Log in om verder te gaan</Text>

          <View style={AuthStyles.form}>
            <TextInput
              style={BaseStyles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <TextInput
              style={BaseStyles.input}
              placeholder="Wachtwoord"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity
              style={[BaseStyles.button, loading && BaseStyles.buttonDisabled]}
              onPress={signInWithEmail}
              disabled={loading}
            >
              <Text style={BaseStyles.buttonText}>
                {loading ? 'Bezig...' : 'Inloggen'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={BaseStyles.linkButton}
              onPress={() => router.replace('/auth/register')}
            >
              <Text style={BaseStyles.linkText}>Nog geen account? Registreer hier</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

