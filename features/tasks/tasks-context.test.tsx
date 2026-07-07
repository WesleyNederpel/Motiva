import { render, renderHook, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

import { TasksProvider, useTasksContext } from './tasks-context';

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation((...args) => {
    if (typeof args[0] === 'string' && args[0].includes('not wrapped in act')) return;
    console.warn(...args);
  });
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

jest.mock('@/lib/supabase');

jest.mock('./use-tasks', () => ({
  useTasks: () => ({
    tasks: [],
    loading: false,
    expandedTasks: new Set<string>(),
    fetchTasks: jest.fn().mockResolvedValue(undefined),
    reset: jest.fn(),
    addTask: jest.fn(),
    toggleTask: jest.fn(),
    deleteTask: jest.fn(),
    updateTask: jest.fn(),
    toggleTaskExpansion: jest.fn(),
    addSubtask: jest.fn(),
    toggleSubtask: jest.fn(),
    deleteSubtask: jest.fn(),
    updateSubtask: jest.fn(),
  }),
}));

describe('useTasksContext', () => {
  test('throws when used outside TasksProvider', () => {
    const { result } = renderHook(() => {
      try {
        return useTasksContext();
      } catch (e) {
        return e as Error;
      }
    });
    expect(result.current).toBeInstanceOf(Error);
    expect((result.current as Error).message).toMatch(/TasksProvider/);
  });
});

describe('TasksProvider', () => {
  test('renders children', () => {
    render(
      <TasksProvider>
        <Text>Hello</Text>
      </TasksProvider>
    );
    expect(screen.getByText('Hello')).toBeTruthy();
  });

  test('initialized becomes true after auth resolves with no user', async () => {
    function InitStatus() {
      const { initialized } = useTasksContext();
      return <Text testID="status">{initialized ? 'ready' : 'loading'}</Text>;
    }

    render(
      <TasksProvider>
        <InitStatus />
      </TasksProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('status').props.children).toBe('ready');
    });
  });

  test('provides tasks array from useTasks', async () => {
    function TaskCount() {
      const { tasks } = useTasksContext();
      return <Text testID="count">{tasks.length}</Text>;
    }

    render(
      <TasksProvider>
        <TaskCount />
      </TasksProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('count').props.children).toBe(0);
    });
  });
});
