import React from 'react';
import { render, screen } from '@testing-library/react-native';

import { Task } from '@/features/tasks/types';
import { NextRewardCard } from './next-reward-card';

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: any) => {
    const { View } = require('react-native');
    return <View>{children}</View>;
  },
}));

jest.mock('@/hooks/use-themed-styles', () => ({
  useThemeColors: () => ({
    background: '#E6E8E6',
    surface: '#FFFFFF',
    shadow: '#000000',
    muted: '#888888',
  }),
}));

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: '1',
    title: 'Build app',
    completed: false,
    reward: 'Coffee',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    subtasks: [],
    ...overrides,
  };
}

describe('NextRewardCard', () => {
  test('shows empty state message when task is null', () => {
    render(<NextRewardCard task={null} />);
    expect(screen.getByText('No upcoming rewards yet.')).toBeTruthy();
  });

  test('shows the reward name when task has a reward', () => {
    render(<NextRewardCard task={makeTask({ reward: 'Coffee' })} />);
    expect(screen.getByText('Coffee')).toBeTruthy();
  });

  test('shows the task title', () => {
    render(<NextRewardCard task={makeTask({ title: 'Read a book' })} />);
    expect(screen.getByText('Read a book')).toBeTruthy();
  });

  test('shows 0% progress when no subtasks are completed', () => {
    render(<NextRewardCard task={makeTask({ subtasks: [] })} />);
    expect(screen.getByText('0%')).toBeTruthy();
  });

  test('shows 50% progress when half of subtasks are completed', () => {
    const task = makeTask({
      subtasks: [
        { id: 's1', task_id: '1', title: 'A', completed: true, created_at: '', updated_at: '' },
        { id: 's2', task_id: '1', title: 'B', completed: false, created_at: '', updated_at: '' },
      ],
    });
    render(<NextRewardCard task={task} />);
    expect(screen.getByText('50%')).toBeTruthy();
  });

  test('shows 100% progress for a completed task', () => {
    render(<NextRewardCard task={makeTask({ completed: true })} />);
    expect(screen.getByText('100%')).toBeTruthy();
  });
});
