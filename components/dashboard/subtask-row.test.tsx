import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { Subtask } from '@/features/tasks/types';
import { SubtaskRow } from './subtask-row';

jest.mock('@/hooks/use-themed-styles', () => ({
  useThemedStyles: () => ({
    subtaskItemRow: {},
    subtaskContent: {},
    subtaskCheckbox: {},
    subtaskCheckboxDone: {},
    subtaskCheckmarkText: {},
    subtaskTitle: {},
    taskTitleCompleted: {},
    dateLabel: {},
    overdueText: {},
    overduePill: {},
    overduePillText: {},
    iconButton: {},
  }),
  useThemeColors: () => ({ secondary: '#36749E', error: '#BF1A2F' }),
}));

jest.mock('@/components/ui/icon-symbol', () => ({
  IconSymbol: ({ name }: { name: string }) => {
    const { Text } = require('react-native');
    return <Text testID={`icon-${name}`}>{name}</Text>;
  },
}));

jest.mock('./subtask-edit-form', () => ({
  SubtaskEditForm: ({ onCancel }: { onCancel: () => void }) => {
    const { Text, TouchableOpacity } = require('react-native');
    return (
      <TouchableOpacity testID="edit-form-cancel" onPress={onCancel}>
        <Text>Cancel</Text>
      </TouchableOpacity>
    );
  },
}));

function makeSubtask(overrides: Partial<Subtask> = {}): Subtask {
  return {
    id: 's1',
    task_id: 't1',
    title: 'My subtask',
    completed: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

const noop = jest.fn();

describe('SubtaskRow', () => {
  beforeEach(() => jest.clearAllMocks());

  test('renders the subtask title', () => {
    render(
      <SubtaskRow subtask={makeSubtask({ title: 'Write tests' })} onToggle={noop} onDelete={noop} onUpdate={jest.fn()} />
    );
    expect(screen.getByText('Write tests')).toBeTruthy();
  });

  test('shows checkmark text when subtask is completed', () => {
    render(
      <SubtaskRow subtask={makeSubtask({ completed: true })} onToggle={noop} onDelete={noop} onUpdate={jest.fn()} />
    );
    expect(screen.getByText('✓')).toBeTruthy();
  });

  test('does not show checkmark when subtask is not completed', () => {
    render(
      <SubtaskRow subtask={makeSubtask({ completed: false })} onToggle={noop} onDelete={noop} onUpdate={jest.fn()} />
    );
    expect(screen.queryByText('✓')).toBeNull();
  });

  test('shows Overdue pill for past deadline on incomplete subtask', () => {
    render(
      <SubtaskRow
        subtask={makeSubtask({ deadline: '2020-01-01T12:00:00Z', completed: false })}
        onToggle={noop}
        onDelete={noop}
        onUpdate={jest.fn()}
      />
    );
    expect(screen.getByText('Overdue')).toBeTruthy();
  });

  test('does not show Overdue pill for completed subtask with past deadline', () => {
    render(
      <SubtaskRow
        subtask={makeSubtask({ deadline: '2020-01-01T12:00:00Z', completed: true })}
        onToggle={noop}
        onDelete={noop}
        onUpdate={jest.fn()}
      />
    );
    expect(screen.queryByText('Overdue')).toBeNull();
  });

  test('calls onToggle when the row content is pressed', () => {
    const onToggle = jest.fn();
    render(
      <SubtaskRow subtask={makeSubtask({ title: 'My subtask' })} onToggle={onToggle} onDelete={noop} onUpdate={jest.fn()} />
    );
    fireEvent.press(screen.getByText('My subtask'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  test('calls onDelete when the trash icon is pressed', () => {
    const onDelete = jest.fn();
    render(
      <SubtaskRow subtask={makeSubtask()} onToggle={noop} onDelete={onDelete} onUpdate={jest.fn()} />
    );
    fireEvent.press(screen.getByTestId('icon-trash'));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  test('switches to edit form when the pencil icon is pressed', () => {
    render(
      <SubtaskRow subtask={makeSubtask()} onToggle={noop} onDelete={noop} onUpdate={jest.fn()} />
    );
    fireEvent.press(screen.getByTestId('icon-pencil'));
    expect(screen.getByTestId('edit-form-cancel')).toBeTruthy();
  });

  test('exits edit form when cancel is pressed inside it', () => {
    render(
      <SubtaskRow subtask={makeSubtask({ title: 'My subtask' })} onToggle={noop} onDelete={noop} onUpdate={jest.fn()} />
    );
    fireEvent.press(screen.getByTestId('icon-pencil'));
    fireEvent.press(screen.getByTestId('edit-form-cancel'));
    expect(screen.getByText('My subtask')).toBeTruthy();
  });
});
