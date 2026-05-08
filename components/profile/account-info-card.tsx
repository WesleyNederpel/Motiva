import React, { useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { LabeledRow } from '@/components/common/labeled-row';
import { SectionCard } from '@/components/common/section-card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAccountActions } from '@/features/profile/use-account-actions';
import { useThemeColors } from '@/hooks/use-themed-styles';
import { EmailEditForm } from './email-edit-form';
import { PasswordChangeForm } from './password-change-form';

interface AccountInfoCardProps {
  email: string;
}

type EditMode = 'none' | 'email' | 'password';

export function AccountInfoCard({ email }: AccountInfoCardProps) {
  const colors = useThemeColors();
  const { updateEmail, changePassword } = useAccountActions();
  const [mode, setMode] = useState<EditMode>('none');

  const close = () => setMode('none');

  return (
    <SectionCard title="Account">
      {mode === 'email' ? (
        <EmailEditForm
          initialEmail={email}
          onCancel={close}
          onSave={(newEmail) => updateEmail(email, newEmail)}
        />
      ) : (
        <LabeledRow
          label="Email"
          value={email}
          trailing={
            <TouchableOpacity onPress={() => setMode('email')} hitSlop={8}>
              <IconSymbol size={20} name="pencil" color={colors.secondary} />
            </TouchableOpacity>
          }
        />
      )}

      {mode === 'password' ? (
        <PasswordChangeForm
          onCancel={close}
          onSave={(input) => changePassword({ email, ...input })}
        />
      ) : (
        <LabeledRow
          label="Password"
          value="••••••••"
          isLast
          trailing={
            <TouchableOpacity onPress={() => setMode('password')} hitSlop={8}>
              <Text style={{ color: colors.secondary, fontWeight: '600' }}>Change</Text>
            </TouchableOpacity>
          }
        />
      )}
    </SectionCard>
  );
}
