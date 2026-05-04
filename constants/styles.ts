import { StyleSheet } from 'react-native';
import { Colors as ThemeColors } from './theme';

// Theme-aware color getter (will be used in components)
export const useThemeColors = () => ThemeColors;

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

// Base styles - these will be used with theme colors in components
export const BaseStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    flex: 1,
    padding: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.md,
    textAlign: 'center',
    marginBottom: Spacing.xxxl,
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    fontSize: FontSizes.md,
  },
  button: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  buttonDisabled: {
  },
  buttonText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  linkButton: {
    alignItems: 'center',
  },
  linkText: {
    fontSize: FontSizes.sm,
  },
  taskItem: {
    flexDirection: 'column',
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
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
  },
  checkmark: {
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: Spacing.sm,
    marginLeft: Spacing.sm,
  },
  deleteButtonText: {
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  addButtonText: {
    fontWeight: '600',
  },
  addTaskContainer: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
  },
  addTaskButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  cancelButton: {
  },
  cancelButtonText: {
    fontWeight: '600',
  },
  saveButton: {
  },
  saveButtonText: {
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
  },
  subtaskCount: {
    fontSize: FontSizes.xs,
    marginTop: 2,
  },
  deadlineText: {
    fontSize: FontSizes.xs,
    marginTop: 2,
  },
  subtaskTitleContainer: {
    flex: 1,
  },
  subtaskDeadlineText: {
    fontSize: FontSizes.xs,
    marginTop: 2,
  },
  expandButton: {
    padding: Spacing.sm,
    marginRight: Spacing.sm,
  },
  expandButtonText: {
    fontSize: FontSizes.md,
  },
  addSubtaskContainer: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  subtaskInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: 10,
    marginBottom: Spacing.sm,
    fontSize: FontSizes.sm,
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
    padding: 10,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginTop: 4,
  },
  addSubtaskButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
  },
});
