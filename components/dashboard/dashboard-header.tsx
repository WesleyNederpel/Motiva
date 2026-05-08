import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { ScreenHeader } from '@/components/common/screen-header';
import { useThemedStyles } from '@/hooks/use-themed-styles';

interface DashboardHeaderProps {
  onAdd: () => void;
}

export function DashboardHeader({ onAdd }: DashboardHeaderProps) {
  const styles = useThemedStyles();
  return (
    <ScreenHeader
      title="Dashboard"
      right={
        <TouchableOpacity style={styles.addCircleButton} onPress={onAdd}>
          <Text style={styles.addCircleButtonText}>+</Text>
        </TouchableOpacity>
      }
    />
  );
}
