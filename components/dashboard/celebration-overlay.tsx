import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Platform, StyleSheet, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

import { useCelebrationTrigger } from '@/features/tasks/celebration';

const celebrateSound = require('@/assets/sounds/celebrate.wav');

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function CelebrationOverlay() {
  const trigger = useCelebrationTrigger();
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const player = useAudioPlayer(celebrateSound);

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: 'mixWithOthers',
      shouldPlayInBackground: false,
    }).catch(() => { });
  }, []);

  useEffect(() => {
    if (trigger === 0) return;

    setVisible(false);
    requestAnimationFrame(() => setVisible(true));

    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
        () => { }
      );
    }

    try {
      player?.seekTo(0);
      player?.play();
    } catch {
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), 3500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [trigger, player]);

  if (!visible) return null;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <ConfettiCannon
        count={140}
        origin={{ x: SCREEN_WIDTH / 2, y: -20 }}
        fadeOut
        autoStart
        explosionSpeed={350}
        fallSpeed={2800}
      />
    </View>
  );
}
