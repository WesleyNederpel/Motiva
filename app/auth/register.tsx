import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors, useThemedStyles } from '../../hooks/use-themed-styles';
import { supabase } from '../../lib/supabase';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Theme-aware styles
  const styles = useThemedStyles();
  const colors = useThemeColors();

  async function signUpWithEmail() {
    if (password !== confirmPassword) {
      Alert.alert('Fout', 'Wachtwoorden komen niet overeen');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Fout', 'Wachtwoord moet minimaal 6 tekens lang zijn');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        Alert.alert('Fout', error.message);
      } else {
        Alert.alert(
          'Succes',
          'Account is aangemaakt! Controleer je email voor bevestiging.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/auth/login')
            }
          ]
        );
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
          <Text style={styles.subtitle}>Maak een nieuw account</Text>

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

          <TextInput
            style={styles.input}
            placeholder="Bevestig wachtwoord"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholderTextColor={colors.placeholder}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={signUpWithEmail}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Bezig...' : 'Registreren'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => router.replace('/auth/login')}
          >
            <Text style={styles.linkText}>Al een account? Log hier in</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

