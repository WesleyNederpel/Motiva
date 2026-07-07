import React from 'react';
import { render, screen } from '@testing-library/react-native';

import { Task } from '@/features/tasks/types';
import { TaskProgress } from './task-progress';

jest.mock('@/hooks/use-themed-styles', () => ({
  useThemedStyles: () => ({}),
}));

jest.mock('@/hooks/use-theme-color', () => ({
  useThemeColor: () => '#000000',
}));

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

const PAST_DATE = '2020-01-01T12:00:00Z';

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: '1',
    title: 'Test',
    completed: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

describe('TaskProgress', () => {
  test('shows 0% for an incomplete task with no subtasks', () => {
    render(<TaskProgress task={makeTask()} />);
    expect(screen.getByText('0%')).toBeTruthy();
  });

  test('shows 100% for a completed task', () => {
    render(<TaskProgress task={makeTask({ completed: true })} />);
    expect(screen.getByText('100%')).toBeTruthy();
  });

  test('shows 50% for task with half subtasks completed', () => {
    const task = makeTask({
      subtasks: [
        { id: 's1', task_id: '1', title: 'A', completed: true, created_at: '', updated_at: '' },
        { id: 's2', task_id: '1', title: 'B', completed: false, created_at: '', updated_at: '' },
      ],
    });
    render(<TaskProgress task={task} />);
    expect(screen.getByText('50%')).toBeTruthy();
  });

  test('renders deadline label when deadline is set', () => {
    render(<TaskProgress task={makeTask({ deadline: '2024-06-15T12:00:00Z' })} />);
    const deadlineTexts = screen.queryAllByText(/^\d{2}\/\d{2}$/);
    expect(deadlineTexts.length).toBeGreaterThan(0);
  });

  test('does not render deadline label when no deadline', () => {
    render(<TaskProgress task={makeTask()} />);
    const deadlineTexts = screen.queryAllByText(/^\d{2}\/\d{2}$/);
    expect(deadlineTexts.length).toBe(0);
  });

  test('shows Overdue pill for past deadline on incomplete task', () => {
    render(<TaskProgress task={makeTask({ deadline: PAST_DATE, completed: false })} />);
    expect(screen.getByText('⚠ Overdue')).toBeTruthy();
  });

  test('does not show Overdue pill when task is completed', () => {
    render(<TaskProgress task={makeTask({ deadline: PAST_DATE, completed: true })} />);
    expect(screen.queryByText('⚠ Overdue')).toBeNull();
  });

  test('does not show Overdue pill for future deadline', () => {
    render(<TaskProgress task={makeTask({ deadline: '2099-12-31T12:00:00Z', completed: false })} />);
    expect(screen.queryByText('⚠ Overdue')).toBeNull();
  });

  test('shows reward pill when reward is set', () => {
    render(<TaskProgress task={makeTask({ reward: 'Ice cream' })} />);
    expect(screen.getByText('🎁 Ice cream')).toBeTruthy();
  });

  test('does not show reward pill when no reward', () => {
    render(<TaskProgress task={makeTask()} />);
    expect(screen.queryByText(/🎁/)).toBeNull();
  });

  test('shows points pill for incomplete task', () => {
    render(<TaskProgress task={makeTask({ completed: false })} />);
    expect(screen.getByText(/pts/)).toBeTruthy();
  });

  test('hides points pill for completed task', () => {
    render(<TaskProgress task={makeTask({ completed: true })} />);
    expect(screen.queryByText(/pts/)).toBeNull();
  });
});
