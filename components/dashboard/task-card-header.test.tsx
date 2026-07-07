import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';

import { Task } from '@/features/tasks/types';
import { TaskCardHeader } from './task-card-header';

jest.mock('@/hooks/use-themed-styles', () => ({
  useThemedStyles: () => ({}),
  useThemeColors: () => ({
    text: '#23344A',
    secondary: '#36749E',
    error: '#BF1A2F',
  }),
}));

jest.mock('@/hooks/use-theme-color', () => ({
  useThemeColor: () => '#000000',
}));

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

jest.mock('@/components/ui/icon-symbol', () => ({
  IconSymbol: ({ name }: { name: string }) => {
    const { Text } = require('react-native');
    return <Text testID={`icon-${name}`}>{name}</Text>;
  },
}));

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: '1',
    title: 'My Task',
    completed: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

const noop = jest.fn();

describe('TaskCardHeader', () => {
  beforeEach(() => jest.clearAllMocks());

  test('renders the task title', () => {
    render(
      <TaskCardHeader
        task={makeTask({ title: 'Buy groceries' })}
        expanded={false}
        onToggle={noop}
        onDelete={noop}
        onEdit={noop}
        onToggleExpansion={noop}
      />
    );
    expect(screen.getByText('Buy groceries')).toBeTruthy();
  });

  test('shows checkmark when task is completed', () => {
    render(
      <TaskCardHeader
        task={makeTask({ completed: true })}
        expanded={false}
        onToggle={noop}
        onDelete={noop}
        onEdit={noop}
        onToggleExpansion={noop}
      />
    );
    expect(screen.getByText('✓')).toBeTruthy();
  });

  test('does not show checkmark when task is not completed', () => {
    render(
      <TaskCardHeader
        task={makeTask({ completed: false })}
        expanded={false}
        onToggle={noop}
        onDelete={noop}
        onEdit={noop}
        onToggleExpansion={noop}
      />
    );
    expect(screen.queryByText('✓')).toBeNull();
  });

  test('calls onToggle when title area is pressed', () => {
    const onToggle = jest.fn();
    render(
      <TaskCardHeader
        task={makeTask({ title: 'My Task' })}
        expanded={false}
        onToggle={onToggle}
        onDelete={noop}
        onEdit={noop}
        onToggleExpansion={noop}
      />
    );
    fireEvent.press(screen.getByText('My Task'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  test('calls onEdit when pencil icon is pressed', () => {
    const onEdit = jest.fn();
    render(
      <TaskCardHeader
        task={makeTask()}
        expanded={false}
        onToggle={noop}
        onDelete={noop}
        onEdit={onEdit}
        onToggleExpansion={noop}
      />
    );
    fireEvent.press(screen.getByTestId('icon-pencil'));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  test('calls onDelete when trash icon is pressed', () => {
    const onDelete = jest.fn();
    render(
      <TaskCardHeader
        task={makeTask()}
        expanded={false}
        onToggle={noop}
        onDelete={onDelete}
        onEdit={noop}
        onToggleExpansion={noop}
      />
    );
    fireEvent.press(screen.getByTestId('icon-trash'));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  test('calls onToggleExpansion when chevron icon is pressed', () => {
    const onToggleExpansion = jest.fn();
    render(
      <TaskCardHeader
        task={makeTask()}
        expanded={false}
        onToggle={noop}
        onDelete={noop}
        onEdit={noop}
        onToggleExpansion={onToggleExpansion}
      />
    );
    fireEvent.press(screen.getByTestId('icon-chevron.down'));
    expect(onToggleExpansion).toHaveBeenCalledTimes(1);
  });

  test('shows chevron.up icon when expanded=true', () => {
    render(
      <TaskCardHeader
        task={makeTask()}
        expanded={true}
        onToggle={noop}
        onDelete={noop}
        onEdit={noop}
        onToggleExpansion={noop}
      />
    );
    expect(screen.getByTestId('icon-chevron.up')).toBeTruthy();
  });

  test('renders without errors when all callbacks are provided', () => {
    const { toJSON } = render(
      <TaskCardHeader
        task={makeTask()}
        expanded={true}
        onToggle={noop}
        onDelete={noop}
        onEdit={noop}
        onToggleExpansion={noop}
      />
    );
    expect(toJSON()).not.toBeNull();
  });
});
