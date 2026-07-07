import React from 'react';
import { Text } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { LabeledRow } from './labeled-row';

jest.mock('@/hooks/use-themed-styles', () => ({
  useThemeColors: () => ({ border: '#E6E8E6', text: '#23344A', muted: '#888' }),
}));

describe('LabeledRow', () => {
  test('renders the label text', () => {
    render(<LabeledRow label="Email" />);
    expect(screen.getByText('Email')).toBeTruthy();
  });

  test('renders the value text when provided', () => {
    render(<LabeledRow label="Email" value="user@test.com" />);
    expect(screen.getByText('user@test.com')).toBeTruthy();
  });

  test('does not render value element when value is undefined', () => {
    render(<LabeledRow label="Email" />);
    expect(screen.queryByText('user@test.com')).toBeNull();
  });

  test('renders trailing content when provided', () => {
    render(<LabeledRow label="Theme" trailing={<Text testID="trailing">Light</Text>} />);
    expect(screen.getByTestId('trailing')).toBeTruthy();
  });

  test('calls onPress when the row is pressed (touchable variant)', () => {
    const onPress = jest.fn();
    render(<LabeledRow label="Edit email" onPress={onPress} />);
    fireEvent.press(screen.getByText('Edit email'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('renders without error when isLast=true', () => {
    const { toJSON } = render(<LabeledRow label="Last item" isLast={true} />);
    expect(toJSON()).not.toBeNull();
  });
});
