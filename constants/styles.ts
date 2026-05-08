import { StyleSheet, useColorScheme } from 'react-native';
import { Colors } from './theme';

// Theme-aware color getter (will be used in components)
export function useThemeColors() {
  const colorScheme = useColorScheme() ?? 'light';
  return Colors[colorScheme];
}

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
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 16,
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
    borderWidth: 2,
    borderRadius: BorderRadius.sm,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtaskCheckmark: {
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 16,
    fontSize: 14,
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
    paddingHorizontal: Spacing.xl,
  },
  form: {
    width: '100%',
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  authForm: {
    width: '100%',
    maxWidth: 400,
  },
});

// Dashboard specific styles
export const DashboardStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingHorizontal: 2,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 34,
  },
  addCircleButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCircleButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 26,
    fontWeight: '400',
    marginTop: -1,
  },
  addTaskContainer: {
    padding: Spacing.lg,
    borderRadius: 16,
    marginBottom: Spacing.lg,
  },
  addTaskButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
  },
  cancelButtonText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  saveButton: {
    flex: 1,
  },
  saveButtonText: {
    fontWeight: '600',
    textAlign: 'center',
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
  // Task card
  taskCard: {
    borderRadius: 16,
    marginBottom: Spacing.md,
    padding: Spacing.lg,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  taskCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  taskTitleArea: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  taskIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconButton: {
    padding: 6,
  },
  deleteIconText: {
    fontSize: 17,
  },
  editIconText: {
    fontSize: 17,
  },
  chevronText: {
    fontSize: 18,
    fontWeight: '600',
  },
  // Progress bar
  progressTrackContainer: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFillBar: {
    height: '100%',
    backgroundColor: '#BF1A2F',
    borderRadius: 3,
  },
  // Date label
  dateLabel: {
    fontSize: FontSizes.xs,
    textAlign: 'center',
    marginBottom: 2,
  },
  // Subtasks section
  subtasksSection: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
  },
  subtaskItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  subtaskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  subtaskCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtaskCheckboxDone: {
    borderWidth: 0,
  },
  subtaskCheckmarkText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
    lineHeight: 16,
  },
  subtaskTitle: {
    fontSize: FontSizes.sm,
  },
  // Add subtask
  addSubtaskContainer: {
    paddingTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  addSubtaskButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    justifyContent: 'space-between',
  },
  subtaskInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: 10,
    marginBottom: Spacing.sm,
    fontSize: FontSizes.sm,
  },
  addSubtaskButton: {
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  addSubtaskButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
  },
  // Edit form
  editFormButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  // Legacy / shared
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
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskTitleCompleted2: {
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
  rewardText: {
    fontSize: FontSizes.xs,
    marginTop: 4,
    textAlign: 'center' as const,
    fontWeight: '500' as const,
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
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 6,
    borderRadius: BorderRadius.md,
  },
});
