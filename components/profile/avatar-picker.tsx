import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useThemeColors } from '@/hooks/use-themed-styles';

export const AVATARS = [
  '🦊', '🐸', '🦁', '🐼',
  '🐨', '🦄', '🐯', '🦋',
  '🐙', '🦖', '🐲', '🦝',
  '🐺', '🦉', '🐧', '🦀',
];

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

interface AvatarPickerProps {
  visible: boolean;
  current: string | null;
  onSelect: (avatar: string) => void;
  onClose: () => void;
}

export function AvatarPicker({ visible, current, onSelect, onClose }: AvatarPickerProps) {
  const colors = useThemeColors();

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

        <Text style={[styles.title, { color: colors.text }]}>Choose your avatar</Text>

        <View style={styles.grid}>
          {AVATARS.map(emoji => {
            const isSelected = current === emoji;
            return (
              <TouchableOpacity
                key={emoji}
                onPress={() => onSelect(emoji)}
                activeOpacity={0.7}
                style={[
                  styles.emojiCell,
                  {
                    backgroundColor: AVATAR_COLORS[emoji] ?? colors.secondary,
                    borderColor: isSelected ? '#FFFFFF' : 'transparent',
                    borderWidth: 3,
                    opacity: isSelected ? 1 : 0.85,
                  },
                ]}
              >
                <Text style={styles.emoji}>{emoji}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

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
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
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
  cancelButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
