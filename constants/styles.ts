import { StyleSheet } from 'react-native';

// Color palette
export const Colors = {
  primary: '#007AFF',
  secondary: '#666',
  muted: '#999',
  background: '#fff',
  surface: '#f8f8f8',
  border: '#ddd',
  error: '#FF3B30',
  success: '#34C759',
  disabled: '#ccc',
};

// Common spacing values
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Common border radius values
export const BorderRadius = {
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
};

// Common font sizes
export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

// Base styles
export const BaseStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  innerContainer: {
    flex: 1,
    padding: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.secondary,
    textAlign: 'center',
    marginBottom: Spacing.xxxl,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    fontSize: FontSizes.md,
    backgroundColor: Colors.surface,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  buttonDisabled: {
    backgroundColor: Colors.disabled,
  },
  buttonText: {
    color: Colors.background,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  linkButton: {
    alignItems: 'center',
  },
  linkText: {
    color: Colors.primary,
    fontSize: FontSizes.sm,
  },
  taskItem: {
    flexDirection: 'column',
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkmark: {
    color: Colors.background,
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: Spacing.sm,
    marginLeft: Spacing.sm,
  },
  deleteButtonText: {
    color: Colors.error,
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
  },
  subtaskCheckbox: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
});

// Auth specific styles
export const AuthStyles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  form: {
    width: '100%',
  },
});

// Dashboard specific styles
export const DashboardStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  addButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  addButtonText: {
    color: Colors.background,
    fontWeight: '600',
  },
  addTaskContainer: {
    backgroundColor: '#f5f5f5',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
  },
  addTaskButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: Colors.primary,
  },
  saveButtonText: {
    color: Colors.background,
    fontWeight: '600',
  },
  taskList: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: Colors.muted,
    fontSize: FontSizes.md,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskTitleContainer: {
    flex: 1,
  },
  subtasksContainer: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  addSubtaskButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskTitle: {
    flex: 1,
    fontSize: FontSizes.md,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.muted,
  },
  subtaskCount: {
    fontSize: FontSizes.xs,
    color: Colors.secondary,
    marginTop: 2,
  },
  deadlineText: {
    fontSize: FontSizes.xs,
    color: Colors.primary,
    marginTop: 2,
  },
  subtaskTitleContainer: {
    flex: 1,
  },
  subtaskDeadlineText: {
    fontSize: FontSizes.xs,
    color: Colors.primary,
    marginTop: 2,
  },
  expandButton: {
    padding: Spacing.sm,
    marginRight: Spacing.sm,
  },
  expandButtonText: {
    fontSize: FontSizes.md,
    color: Colors.secondary,
  },
  addSubtaskContainer: {
    backgroundColor: '#f0f0f0',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  subtaskInput: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: 10,
    marginBottom: Spacing.sm,
    fontSize: FontSizes.sm,
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 10,
    marginBottom: 6,
    borderRadius: BorderRadius.md,
  },
  subtaskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  subtaskCheckbox: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  subtaskTitle: {
    flex: 1,
    fontSize: FontSizes.sm,
  },
  addSubtaskButton: {
    backgroundColor: '#e8e8e8',
    padding: 10,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginTop: 4,
  },
  addSubtaskButtonText: {
    color: Colors.secondary,
    fontSize: FontSizes.sm,
    fontWeight: '500',
  },
});
