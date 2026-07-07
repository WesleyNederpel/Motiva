import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { DangerButton } from './danger-button';

jest.mock('@/hooks/use-themed-styles', () => ({
  useThemeColors: () => ({ error: '#BF1A2F', text: '#23344A' }),
}));

describe('DangerButton', () => {
  test('renders the label text', () => {
    render(<DangerButton label="Delete account" onPress={() => {}} />);
    expect(screen.getByText('Delete account')).toBeTruthy();
  });

  test('calls onPress when pressed', () => {
    const onPress = jest.fn();
    render(<DangerButton label="Delete" onPress={onPress} />);
    fireEvent.press(screen.getByText('Delete'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    render(<DangerButton label="Delete" onPress={onPress} disabled={true} />);
    fireEvent.press(screen.getByText('Delete'));
    expect(onPress).not.toHaveBeenCalled();
  });

  test('renders without error when filled=true', () => {
    const { toJSON } = render(<DangerButton label="Delete" onPress={() => {}} filled={true} />);
    expect(toJSON()).not.toBeNull();
  });
});
