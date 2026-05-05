import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors, useThemedStyles } from '../../hooks/use-themed-styles';
import { supabase } from '../../lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Theme-aware styles
  const styles = useThemedStyles();
  const colors = useThemeColors();

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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.authContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.authForm}>
          <Text style={styles.title}>Motiva</Text>
          <Text style={styles.subtitle}>Log in om verder te gaan</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor={colors.placeholder}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="Wachtwoord"
            value={password}
            onChangeText={setPassword}
            placeholderTextColor={colors.placeholder}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={signInWithEmail}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Bezig...' : 'Inloggen'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => router.replace('/auth/register')}
          >
            <Text style={styles.linkText}>Nog geen account? Registreer hier</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

