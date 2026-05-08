import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemedStyles } from '@/hooks/use-themed-styles';

interface FormButtonsProps {
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Which row container style key to use. Defaults to 'addTaskButtons'. */
  rowStyleKey?: 'addTaskButtons' | 'addSubtaskButtons' | 'editFormButtons';
}

/**
 * Standard Cancel/Save (or Cancel/Add) row used by the dashboard forms.
 */
export function FormButtons({
  onCancel,
  onConfirm,
  confirmLabel = 'Save',
  cancelLabel = 'Cancel',
  rowStyleKey = 'addTaskButtons',
}: FormButtonsProps) {
  const styles = useThemedStyles();
  return (
    <View style={styles[rowStyleKey]}>
      <TouchableOpacity
        style={[styles.button, styles.cancelButton]}
        onPress={onCancel}
      >
        <ThemedText style={styles.cancelButtonText}>{cancelLabel}</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.saveButton]}
        onPress={onConfirm}
      >
        <ThemedText style={styles.saveButtonText}>{confirmLabel}</ThemedText>
      </TouchableOpacity>
    </View>
  );
}
