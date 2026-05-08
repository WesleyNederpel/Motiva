import React from 'react';

import { RadioRow } from '@/components/common/radio-row';
import { SectionCard } from '@/components/common/section-card';
import {
  ThemePreference,
  useThemePreference,
} from '@/features/theme/theme-preference';

interface Option {
  value: ThemePreference;
  label: string;
  iconName: React.ComponentProps<typeof RadioRow>['iconName'];
}

const OPTIONS: Option[] = [
  { value: 'light', label: 'Light', iconName: 'sun.max.fill' },
  { value: 'dark', label: 'Dark', iconName: 'moon.fill' },
  { value: 'system', label: 'Follow system', iconName: 'gear' },
];

export function ThemePicker() {
  const { pref, setPref } = useThemePreference();

  return (
    <SectionCard title="Appearance">
      {OPTIONS.map((opt, idx) => (
        <RadioRow
          key={opt.value}
          iconName={opt.iconName}
          label={opt.label}
          selected={pref === opt.value}
          onPress={() => setPref(opt.value)}
          isLast={idx === OPTIONS.length - 1}
        />
      ))}
    </SectionCard>
  );
}
