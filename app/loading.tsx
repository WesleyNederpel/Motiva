import React from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemedStyles } from '../hooks/use-themed-styles';

export default function LoadingScreen() {
  const styles = useThemedStyles();

  return (
    <SafeAreaView style={styles.centeredContainer}>
      <Text style={styles.title}>Motiva</Text>
      <Text style={styles.subtitle}>Laden...</Text>
    </SafeAreaView>
  );
}

