import React from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BaseStyles } from '../constants/styles';

export default function LoadingScreen() {
  return (
    <SafeAreaView style={BaseStyles.centeredContainer}>
      <Text style={BaseStyles.title}>Motiva</Text>
      <Text style={BaseStyles.subtitle}>Laden...</Text>
    </SafeAreaView>
  );
}

