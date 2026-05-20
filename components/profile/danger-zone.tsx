import React from 'react';

import { DangerButton } from '@/components/common/danger-button';
import { SectionCard } from '@/components/common/section-card';
import { useAccountActions } from '@/features/profile/use-account-actions';

export function DangerZone() {
  const { logout, deleteAccount } = useAccountActions();

  return (
    <>
      <SectionCard>
        <DangerButton label="Log Out" onPress={logout} />
      </SectionCard>

      <SectionCard title="Danger Zone">
        <DangerButton label="Delete Account" onPress={deleteAccount} filled />
      </SectionCard>
    </>
  );
}
