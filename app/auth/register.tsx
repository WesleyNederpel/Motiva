import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthStyles, BaseStyles } from '../../constants/styles';
import { supabase } from '../../lib/supabase';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
    <SafeAreaView style={BaseStyles.container}>
      <KeyboardAvoidingView style={AuthStyles.keyboardContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={AuthStyles.content}>
          <Text style={BaseStyles.title}>Motiva</Text>
          <Text style={BaseStyles.subtitle}>Maak een nieuw account</Text>

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

            <TextInput
              style={BaseStyles.input}
              placeholder="Bevestig wachtwoord"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            <TouchableOpacity
              style={[BaseStyles.button, loading && BaseStyles.buttonDisabled]}
              onPress={signUpWithEmail}
              disabled={loading}
            >
              <Text style={BaseStyles.buttonText}>
                {loading ? 'Bezig...' : 'Registreren'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={BaseStyles.linkButton}
              onPress={() => router.replace('/auth/login')}
            >
              <Text style={BaseStyles.linkText}>Al een account? Log hier in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

