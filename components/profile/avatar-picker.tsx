import React from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useThemeColors } from '@/hooks/use-themed-styles';

export const AVATAR_COLORS: Record<string, string> = {
  '🦊': '#F97316',
  '🐸': '#22C55E',
  '🦁': '#F59E0B',
  '🐼': '#6B7280',
  '🐨': '#94A3B8',
  '🦄': '#A855F7',
  '🐯': '#EA580C',
  '🦋': '#8B5CF6',
  '🐙': '#EC4899',
  '🦖': '#16A34A',
  '🐲': '#10B981',
  '🦝': '#64748B',
  '🐺': '#6B7280',
  '🦉': '#D97706',
  '🐧': '#3B82F6',
  '🦀': '#EF4444',
};

export interface AvatarTier {
  label: string;
  cost: number;
  avatars: string[];
}

export const AVATAR_TIERS: AvatarTier[] = [
  { label: 'Free', cost: 0, avatars: ['🦊', '🐸', '🦁', '🐼'] },
  { label: 'Common', cost: 25, avatars: ['🐨', '🦄', '🐯', '🦋'] },
  { label: 'Rare', cost: 75, avatars: ['🐙', '🦖', '🐲', '🦝'] },
  { label: 'Legendary', cost: 150, avatars: ['🐺', '🦉', '🐧', '🦀'] },
];

export const AVATAR_COSTS: Record<string, number> = {};
for (const tier of AVATAR_TIERS) {
  for (const emoji of tier.avatars) {
    AVATAR_COSTS[emoji] = tier.cost;
  }
}

export const AVATARS = AVATAR_TIERS.flatMap(t => t.avatars);

interface AvatarPickerProps {
  visible: boolean;
  current: string | null;
  points: number;
  unlockedAvatars: string[];
  onSelect: (avatar: string) => void;
  onBuy: (avatar: string) => void;
  onClose: () => void;
}

export function AvatarPicker({
  visible,
  current,
  points,
  unlockedAvatars,
  onSelect,
  onBuy,
  onClose,
}: AvatarPickerProps) {
  const colors = useThemeColors();

  const isUnlocked = (emoji: string) => {
    const cost = AVATAR_COSTS[emoji] ?? 0;
    return cost === 0 || unlockedAvatars.includes(emoji);
  };

  const handlePress = (emoji: string) => {
    if (isUnlocked(emoji)) {
      onSelect(emoji);
      return;
    }
    const cost = AVATAR_COSTS[emoji];
    if (points < cost) {
      Alert.alert(
        'Not enough points',
        `This avatar costs ${cost} pts. You have ${points} pts.\n\nComplete more tasks to earn points!`
      );
      return;
    }
    Alert.alert(
      'Unlock Avatar',
      `Buy ${emoji} for ${cost} pts?\n\nYou have ${points} pts.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: `Buy (${cost} pts)`, onPress: () => onBuy(emoji) },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
        <View style={[styles.handle, { backgroundColor: colors.border }]} />

        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.text }]}>Choose your avatar</Text>
          <View style={[styles.pointsBadge, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={[styles.pointsBadgeText, { color: colors.text }]}>⭐ {points} pts</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
          {AVATAR_TIERS.map(tier => (
            <View key={tier.label} style={styles.tierSection}>
              <View style={styles.tierHeader}>
                <Text style={[styles.tierLabel, { color: colors.muted }]}>{tier.label.toUpperCase()}</Text>
                {tier.cost > 0 && (
                  <Text style={[styles.tierCost, { color: colors.muted }]}>{tier.cost} pts each</Text>
                )}
              </View>
              <View style={styles.grid}>
                {tier.avatars.map(emoji => {
                  const isSelected = current === emoji;
                  const unlocked = isUnlocked(emoji);
                  return (
                    <TouchableOpacity
                      key={emoji}
                      onPress={() => handlePress(emoji)}
                      activeOpacity={0.7}
                      style={[
                        styles.emojiCell,
                        {
                          backgroundColor: AVATAR_COLORS[emoji] ?? colors.secondary,
                          borderColor: isSelected ? '#FFFFFF' : 'transparent',
                          borderWidth: 3,
                          opacity: unlocked ? (isSelected ? 1 : 0.85) : 0.45,
                        },
                      ]}
                    >
                      <Text style={styles.emoji}>{emoji}</Text>
                      {!unlocked && (
                        <View style={styles.lockOverlay}>
                          <Text style={styles.lockIcon}>🔒</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity
          onPress={onClose}
          style={[styles.cancelButton, { backgroundColor: colors.border }]}
        >
          <Text style={[styles.cancelText, { color: colors.text }]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  pointsBadge: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pointsBadgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  tierSection: {
    marginBottom: 16,
  },
  tierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tierLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  tierCost: {
    fontSize: 11,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  emojiCell: {
    width: 68,
    height: 68,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 36,
  },
  lockOverlay: {
    position: 'absolute',
    bottom: 2,
    right: 4,
  },
  lockIcon: {
    fontSize: 14,
  },
  cancelButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
