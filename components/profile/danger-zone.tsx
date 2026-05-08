import React from 'react';
import { View } from 'react-native';

import { DangerButton } from '@/components/common/danger-button';
import { SectionCard } from '@/components/common/section-card';
import { useAccountActions } from '@/features/profile/use-account-actions';

export function DangerZone() {
  const { logout, deleteAccount } = useAccountActions();

  return (
    <>
      <SectionCard>
        <View style={{ padding: 8 }}>
          <DangerButton label="Log Out" onPress={logout} />
        </View>
      </SectionCard>

      <SectionCard title="Danger Zone">
        <View style={{ padding: 8 }}>
          <DangerButton label="Delete Account" onPress={deleteAccount} filled />
        </View>
      </SectionCard>
    </>
  );
}
