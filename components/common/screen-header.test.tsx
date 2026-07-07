import React from 'react';
import { Text } from 'react-native';
import { render, screen } from '@testing-library/react-native';

import { ScreenHeader } from './screen-header';

jest.mock('@/hooks/use-themed-styles', () => ({
  useThemedStyles: () => ({ header: {}, headerTitle: {} }),
  useThemeColors: () => ({ text: '#23344A', surface: '#FFFFFF', border: '#E6E8E6' }),
}));

describe('ScreenHeader', () => {
  test('renders the title text', () => {
    render(<ScreenHeader title="My Tasks" />);
    expect(screen.getByText('My Tasks')).toBeTruthy();
  });

  test('renders the right slot when provided', () => {
    render(
      <ScreenHeader
        title="Tasks"
        right={<Text testID="right-slot">Add</Text>}
      />
    );
    expect(screen.getByTestId('right-slot')).toBeTruthy();
  });

  test('renders the left slot when provided', () => {
    render(
      <ScreenHeader
        title="Tasks"
        left={<Text testID="left-slot">Back</Text>}
      />
    );
    expect(screen.getByTestId('left-slot')).toBeTruthy();
  });

  test('renders without error when no slots are provided', () => {
    const { toJSON } = render(<ScreenHeader title="Plain header" />);
    expect(toJSON()).not.toBeNull();
  });
});
