import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { RadioRow } from './radio-row';

jest.mock('@/hooks/use-themed-styles', () => ({
  useThemeColors: () => ({ border: '#E6E8E6', text: '#23344A', secondary: '#36749E' }),
}));

jest.mock('@/components/ui/icon-symbol', () => ({
  IconSymbol: ({ name, testID }: { name: string; testID?: string }) => {
    const { Text } = require('react-native');
    return <Text testID={testID ?? `icon-${name}`}>{name}</Text>;
  },
}));

describe('RadioRow', () => {
  test('renders the label text', () => {
    render(
      <RadioRow iconName="sun.min" label="Light" selected={false} onPress={() => {}} />
    );
    expect(screen.getByText('Light')).toBeTruthy();
  });

  test('shows checkmark icon when selected=true', () => {
    render(
      <RadioRow iconName="sun.min" label="Light" selected={true} onPress={() => {}} />
    );
    expect(screen.getByTestId('icon-checkmark')).toBeTruthy();
  });

  test('does not show checkmark icon when selected=false', () => {
    render(
      <RadioRow iconName="sun.min" label="Light" selected={false} onPress={() => {}} />
    );
    expect(screen.queryByTestId('icon-checkmark')).toBeNull();
  });

  test('calls onPress when the row is pressed', () => {
    const onPress = jest.fn();
    render(
      <RadioRow iconName="sun.min" label="Light" selected={false} onPress={onPress} />
    );
    fireEvent.press(screen.getByText('Light'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
