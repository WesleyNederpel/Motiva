import React from 'react';
import { render, screen } from '@testing-library/react-native';

import { Task } from '@/features/tasks/types';
import { EarnedRewardCard } from './earned-reward-card';

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: any) => {
    const { View } = require('react-native');
    return <View>{children}</View>;
  },
}));

jest.mock('@/hooks/use-themed-styles', () => ({
  useThemeColors: () => ({ background: '#E6E8E6' }),
}));

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: '1',
    title: 'Task title',
    completed: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

describe('EarnedRewardCard', () => {
  test('renders the task title', () => {
    render(<EarnedRewardCard task={makeTask({ title: 'Finish project' })} />);
    expect(screen.getByText('Finish project')).toBeTruthy();
  });

  test('renders the reward name when set', () => {
    render(<EarnedRewardCard task={makeTask({ reward: 'Ice cream' })} />);
    expect(screen.getByText('Ice cream')).toBeTruthy();
  });

  test('does not render reward name when reward is not set', () => {
    render(<EarnedRewardCard task={makeTask({ reward: undefined })} />);
    expect(screen.queryByText('Ice cream')).toBeNull();
  });

  test('shows the Earned badge', () => {
    render(<EarnedRewardCard task={makeTask()} />);
    expect(screen.getByText('✓ Earned')).toBeTruthy();
  });
});
