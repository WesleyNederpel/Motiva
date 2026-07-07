import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { FormButtons } from './form-buttons';

jest.mock('@/hooks/use-themed-styles', () => ({
  useThemedStyles: () => ({
    addTaskButtons: {},
    button: {},
    cancelButton: {},
    saveButton: {},
    cancelButtonText: {},
    saveButtonText: {},
  }),
}));

describe('FormButtons', () => {
  test('renders default "Cancel" and "Save" labels', () => {
    render(<FormButtons onCancel={() => {}} onConfirm={() => {}} />);
    expect(screen.getByText('Cancel')).toBeTruthy();
    expect(screen.getByText('Save')).toBeTruthy();
  });

  test('renders custom cancelLabel and confirmLabel', () => {
    render(
      <FormButtons
        onCancel={() => {}}
        onConfirm={() => {}}
        cancelLabel="Discard"
        confirmLabel="Submit"
      />
    );
    expect(screen.getByText('Discard')).toBeTruthy();
    expect(screen.getByText('Submit')).toBeTruthy();
  });

  test('calls onCancel when the cancel button is pressed', () => {
    const onCancel = jest.fn();
    render(<FormButtons onCancel={onCancel} onConfirm={() => {}} />);
    fireEvent.press(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test('calls onConfirm when the confirm button is pressed', () => {
    const onConfirm = jest.fn();
    render(<FormButtons onCancel={() => {}} onConfirm={onConfirm} />);
    fireEvent.press(screen.getByText('Save'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
