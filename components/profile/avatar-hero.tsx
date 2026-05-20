import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AVATAR_COLORS } from '@/components/profile/avatar-picker';
import { useThemeColors } from '@/hooks/use-themed-styles';

interface AvatarHeroProps {
  avatar: string | null;
  email: string | null;
  points?: number;
  onPress: () => void;
}

export function AvatarHero({ avatar, email, points, onPress }: AvatarHeroProps) {
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
      {points !== undefined && (
        <View style={[styles.pointsBadge, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.pointsText, { color: colors.text }]}>⭐ {points} pts</Text>
        </View>
      )}
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
  pointsBadge: {
    marginTop: 10,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
