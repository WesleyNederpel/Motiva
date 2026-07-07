import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { Task } from '@/features/tasks/types';
import { TaskCard } from './task-card';

jest.mock('@/hooks/use-themed-styles', () => ({
  useThemedStyles: () => ({ taskCard: {} }),
  useThemeColors: () => ({
    text: '#23344A',
    secondary: '#36749E',
    error: '#BF1A2F',
    primary: '#BF1A2F',
    statusDone: '#22c55e',
    statusInProgress: '#f59e0b',
    surface: '#FFFFFF',
    border: '#E6E8E6',
    shadow: '#000000',
  }),
}));

jest.mock('@/components/ui/icon-symbol', () => ({
  IconSymbol: ({ name }: { name: string }) => {
    const { Text } = require('react-native');
    return <Text testID={`icon-${name}`}>{name}</Text>;
  },
}));

jest.mock('./task-edit-form', () => ({
  TaskEditForm: ({ onCancel }: { onCancel: () => void }) => {
    const { Text, TouchableOpacity } = require('react-native');
    return (
      <TouchableOpacity testID="edit-form-cancel" onPress={onCancel}>
        <Text testID="edit-form">EditForm</Text>
      </TouchableOpacity>
    );
  },
}));

jest.mock('./subtask-list', () => ({
  SubtaskList: () => {
    const { Text } = require('react-native');
    return <Text testID="subtask-list">SubtaskList</Text>;
  },
}));

jest.mock('./task-progress', () => ({
  TaskProgress: () => {
    const { Text } = require('react-native');
    return <Text testID="task-progress">Progress</Text>;
  },
}));

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 't1',
    title: 'My Task',
    completed: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    subtasks: [],
    ...overrides,
  };
}

const noop = jest.fn();

describe('TaskCard', () => {
  beforeEach(() => jest.clearAllMocks());

  test('renders the task title', () => {
    render(
      <TaskCard
        task={makeTask({ title: 'Write report' })}
        expanded={false}
        onToggleTask={noop}
        onDeleteTask={noop}
        onUpdateTask={jest.fn()}
        onToggleExpansion={noop}
        onAddSubtask={jest.fn()}
        onToggleSubtask={noop}
        onDeleteSubtask={noop}
        onUpdateSubtask={jest.fn()}
      />
    );
    expect(screen.getByText('Write report')).toBeTruthy();
  });

  test('renders TaskProgress component', () => {
    render(
      <TaskCard
        task={makeTask()}
        expanded={false}
        onToggleTask={noop}
        onDeleteTask={noop}
        onUpdateTask={jest.fn()}
        onToggleExpansion={noop}
        onAddSubtask={jest.fn()}
        onToggleSubtask={noop}
        onDeleteSubtask={noop}
        onUpdateSubtask={jest.fn()}
      />
    );
    expect(screen.getByTestId('task-progress')).toBeTruthy();
  });

  test('hides SubtaskList when expanded=false', () => {
    render(
      <TaskCard
        task={makeTask()}
        expanded={false}
        onToggleTask={noop}
        onDeleteTask={noop}
        onUpdateTask={jest.fn()}
        onToggleExpansion={noop}
        onAddSubtask={jest.fn()}
        onToggleSubtask={noop}
        onDeleteSubtask={noop}
        onUpdateSubtask={jest.fn()}
      />
    );
    expect(screen.queryByTestId('subtask-list')).toBeNull();
  });

  test('shows SubtaskList when expanded=true', () => {
    render(
      <TaskCard
        task={makeTask()}
        expanded={true}
        onToggleTask={noop}
        onDeleteTask={noop}
        onUpdateTask={jest.fn()}
        onToggleExpansion={noop}
        onAddSubtask={jest.fn()}
        onToggleSubtask={noop}
        onDeleteSubtask={noop}
        onUpdateSubtask={jest.fn()}
      />
    );
    expect(screen.getByTestId('subtask-list')).toBeTruthy();
  });

  test('switches to TaskEditForm when the edit icon is pressed', () => {
    render(
      <TaskCard
        task={makeTask()}
        expanded={false}
        onToggleTask={noop}
        onDeleteTask={noop}
        onUpdateTask={jest.fn()}
        onToggleExpansion={noop}
        onAddSubtask={jest.fn()}
        onToggleSubtask={noop}
        onDeleteSubtask={noop}
        onUpdateSubtask={jest.fn()}
      />
    );
    fireEvent.press(screen.getByTestId('icon-pencil'));
    expect(screen.getByTestId('edit-form')).toBeTruthy();
  });

  test('returns to normal view when edit form cancel is pressed', () => {
    render(
      <TaskCard
        task={makeTask({ title: 'My Task' })}
        expanded={false}
        onToggleTask={noop}
        onDeleteTask={noop}
        onUpdateTask={jest.fn()}
        onToggleExpansion={noop}
        onAddSubtask={jest.fn()}
        onToggleSubtask={noop}
        onDeleteSubtask={noop}
        onUpdateSubtask={jest.fn()}
      />
    );
    fireEvent.press(screen.getByTestId('icon-pencil'));
    fireEvent.press(screen.getByTestId('edit-form-cancel'));
    expect(screen.getByText('My Task')).toBeTruthy();
  });
});
