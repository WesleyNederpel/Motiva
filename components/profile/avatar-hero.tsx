import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AVATAR_COLORS } from '@/components/profile/avatar-picker';
import { useThemeColors } from '@/hooks/use-themed-styles';

interface AvatarHeroProps {
  avatar: string | null;
  email: string | null;
  onPress: () => void;
}

export function AvatarHero({ avatar, email, onPress }: AvatarHeroProps) {
  const colors = useThemeColors();

  const display = avatar ?? (email ? email[0].toUpperCase() : '?');

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <View
          style={[
            styles.circle,
            {
              backgroundColor: avatar
                ? (AVATAR_COLORS[avatar] ?? colors.secondary)
                : colors.secondary,
              shadowColor: colors.shadow,
            },
          ]}
        >
          <Text style={styles.avatarText}>{display}</Text>
        </View>
      </TouchableOpacity>
      <Text style={[styles.editLabel, { color: colors.muted }]}>
        Tap to change avatar
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  circle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  avatarText: {
    fontSize: 42,
    lineHeight: 52,
  },
  editLabel: {
    fontSize: 12,
    marginTop: 8,
    fontWeight: '500',
  },
});
