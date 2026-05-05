import { AuthStyles, BaseStyles, DashboardStyles } from '@/constants/styles';
import { Colors } from '@/constants/theme';
import { useMemo } from 'react';
import { useColorScheme } from './use-color-scheme';

/**
 * Hook that provides theme-aware styles by combining base styles with current theme colors
 */
export function useThemedStyles() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const themedStyles = useMemo(() => {
    return {
      // Base styles with theme colors
      container: [
        BaseStyles.container,
        { backgroundColor: theme.background }
      ],
      centeredContainer: [
        BaseStyles.centeredContainer,
        { backgroundColor: theme.background }
      ],
      innerContainer: [
        BaseStyles.innerContainer,
        { backgroundColor: theme.background }
      ],
      title: [
        BaseStyles.title,
        { color: theme.primary }
      ],
      subtitle: [
        BaseStyles.subtitle,
        { color: theme.secondary }
      ],
      input: [
        BaseStyles.input,
        {
          backgroundColor: theme.inputBackground,
          borderColor: theme.border,
          color: theme.text,
        }
      ],
      button: [
        BaseStyles.button,
        { backgroundColor: theme.primary }
      ],
      buttonDisabled: [
        BaseStyles.buttonDisabled,
        { backgroundColor: theme.disabled }
      ],
      buttonText: [
        BaseStyles.buttonText,
        { color: theme.text }
      ],
      linkButton: BaseStyles.linkButton,
      linkText: [
        BaseStyles.linkText,
        { color: theme.primary }
      ],
      taskItem: [
        BaseStyles.taskItem,
        {
          backgroundColor: theme.surface,
          shadowColor: theme.shadow,
        }
      ],
      checkbox: [
        BaseStyles.checkbox,
        {
          borderColor: theme.border,
          backgroundColor: 'transparent',
        }
      ],
      checkboxChecked: [
        BaseStyles.checkboxChecked,
        {
          backgroundColor: theme.primary,
          borderColor: theme.primary,
        }
      ],
      checkmark: [
        BaseStyles.checkmark,
        { color: theme.text }
      ],
      deleteButton: BaseStyles.deleteButton,
      deleteButtonText: [
        BaseStyles.deleteButtonText,
        { color: theme.error }
      ],
      subtaskCheckbox: BaseStyles.subtaskCheckbox,

      // Dashboard styles with theme colors
      header: DashboardStyles.header,
      addButton: [
        DashboardStyles.addButton,
        { backgroundColor: theme.primary }
      ],
      addButtonText: [
        DashboardStyles.addButtonText,
        { color: 'white' }
      ],
      addTaskContainer: [
        DashboardStyles.addTaskContainer,
        { backgroundColor: theme.surface }
      ],
      addTaskButtons: [
        DashboardStyles.addTaskButtons,
        { backgroundColor: theme.surface }
      ],
      cancelButton: [
        DashboardStyles.cancelButton,
        { backgroundColor: theme.disabled }
      ],
      cancelButtonText: [
        DashboardStyles.cancelButtonText,
        { color: theme.text }
      ],
      saveButton: [
        DashboardStyles.saveButton,
        { backgroundColor: theme.primary }
      ],
      saveButtonText: [
        DashboardStyles.saveButtonText,
        { color: 'white' }
      ],
      taskList: DashboardStyles.taskList,
      emptyState: DashboardStyles.emptyState,
      emptyText: [
        DashboardStyles.emptyText,
        { color: theme.muted }
      ],
      taskRow: [
        DashboardStyles.taskRow,
        { backgroundColor: theme.surface }
      ],
      taskActions: [
        DashboardStyles.taskActions,
        { backgroundColor: theme.surface }
      ],
      taskTitleContainer: [
        DashboardStyles.taskTitleContainer,
        { backgroundColor: theme.surface }
      ],
      subtasksContainer: [
        DashboardStyles.subtasksContainer,
        { backgroundColor: theme.surface, borderTopColor: theme.border }
      ],
      addSubtaskButtons: [
        DashboardStyles.addSubtaskButtons,
        { backgroundColor: theme.surface }
      ],
      taskContent: DashboardStyles.taskContent,
      taskTitle: [
        DashboardStyles.taskTitle,
        { color: theme.text }
      ],
      taskTitleCompleted: [
        DashboardStyles.taskTitleCompleted,
        { color: theme.muted }
      ],
      subtaskCount: [
        DashboardStyles.subtaskCount,
        { color: theme.secondary }
      ],
      deadlineText: [
        DashboardStyles.deadlineText,
        { color: theme.primary }
      ],
      rewardText: DashboardStyles.rewardText,
      subtaskTitleContainer: [
        DashboardStyles.subtaskTitleContainer,
        { backgroundColor: theme.surface }
      ],
      subtaskDeadlineText: [
        DashboardStyles.subtaskDeadlineText,
        { color: theme.primary }
      ],
      expandButton: DashboardStyles.expandButton,
      expandButtonText: [
        DashboardStyles.expandButtonText,
        { color: theme.secondary }
      ],
      addSubtaskContainer: [
        DashboardStyles.addSubtaskContainer,
        { backgroundColor: theme.surface }
      ],
      subtaskInput: [
        DashboardStyles.subtaskInput,
        {
          backgroundColor: theme.inputBackground,
          borderColor: theme.border,
          color: theme.text,
        }
      ],
      subtaskItem: [
        DashboardStyles.subtaskItem,
        { backgroundColor: theme.surface }
      ],
      subtaskContent: DashboardStyles.subtaskContent,
      subtaskTitle: [
        DashboardStyles.subtaskTitle,
        { color: theme.text }
      ],
      addSubtaskButton: [
        DashboardStyles.addSubtaskButton,
        { backgroundColor: theme.disabled }
      ],
      addSubtaskButtonText: [
        DashboardStyles.addSubtaskButtonText,
        { color: theme.secondary }
      ],
      // Auth-specific styles
      authContainer: [
        AuthStyles.authContainer,
        { backgroundColor: theme.background }
      ],
      authForm: AuthStyles.authForm,

      // Settings-specific styles
      section: {
        backgroundColor: theme.surface,
        borderRadius: 10,
        marginBottom: 20,
      } as const,
      menuItem: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
      } as const,
      menuText: {
        fontSize: 16,
        marginLeft: 12,
        flex: 1,
        color: theme.text,
      } as const,
      // Progress bar styles
      progressContainer: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        marginTop: 8,
        gap: 8,
        backgroundColor: theme.surface,
      } as const,
      progressBar: {
        flex: 1,
        height: 8,
        backgroundColor: theme.inputBackground,
        borderRadius: 4,
        overflow: 'hidden' as const,
      } as const,
      progressFill: {
        height: '100%',
        backgroundColor: '#BF1A2F',
        borderRadius: 4,
      } as const,
      progressText: {
        fontSize: 12,
        color: theme.secondary,
        fontWeight: '600' as const,
        minWidth: 35,
        textAlign: 'right' as const,
      } as const,
    };
  }, [colorScheme, theme]);

  return themedStyles;
}

/**
 * Hook to get individual theme colors
 */
export function useThemeColors() {
  const colorScheme = useColorScheme() ?? 'light';
  return Colors[colorScheme];
}
