import { AuthStyles, BaseStyles, DashboardStyles } from '@/constants/styles';
import { Colors } from '@/constants/theme';
import { useMemo } from 'react';
import { useColorScheme } from './use-color-scheme';

export function useThemedStyles() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const themedStyles = useMemo(() => {
    return {
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
        { color: theme.text }
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
        { color: '#FFFFFF' }
      ],
      linkButton: BaseStyles.linkButton,
      linkText: [
        BaseStyles.linkText,
        { color: theme.secondary }
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
          borderColor: theme.secondary,
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
        { color: '#FFFFFF' }
      ],
      subtaskCheckmark: [
        BaseStyles.subtaskCheckmark,
        { color: '#FFFFFF' }
      ],
      deleteButton: BaseStyles.deleteButton,
      deleteButtonText: [
        BaseStyles.deleteButtonText,
        { color: theme.error }
      ],

      header: DashboardStyles.header,
      headerTitle: [
        DashboardStyles.headerTitle,
        { color: theme.text }
      ],
      addCircleButton: [
        DashboardStyles.addCircleButton,
        { backgroundColor: theme.addButtonBg }
      ],
      addCircleButtonText: DashboardStyles.addCircleButtonText,
      addTaskContainer: [
        DashboardStyles.addTaskContainer,
        { backgroundColor: theme.surface, shadowColor: theme.shadow }
      ],
      addTaskButtons: DashboardStyles.addTaskButtons,
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
        { color: '#FFFFFF' }
      ],
      taskList: DashboardStyles.taskList,
      emptyState: DashboardStyles.emptyState,
      emptyText: [
        DashboardStyles.emptyText,
        { color: theme.muted }
      ],
      taskCard: [
        DashboardStyles.taskCard,
        {
          backgroundColor: theme.surface,
          shadowColor: theme.shadow,
        }
      ],
      taskCardHeader: DashboardStyles.taskCardHeader,
      taskTitleArea: DashboardStyles.taskTitleArea,
      taskTitle: [
        DashboardStyles.taskTitle,
        { color: theme.text }
      ],
      taskTitleCompleted: DashboardStyles.taskTitleCompleted,
      taskIcons: DashboardStyles.taskIcons,
      iconButton: DashboardStyles.iconButton,
      deleteIconText: [
        DashboardStyles.deleteIconText,
        { color: theme.error }
      ],
      editIconText: [
        DashboardStyles.editIconText,
        { color: theme.secondary }
      ],
      chevronText: [
        DashboardStyles.chevronText,
        { color: theme.text }
      ],
      progressTrackContainer: [
        DashboardStyles.progressTrackContainer,
        { backgroundColor: theme.progressTrack }
      ],
      progressFillBar: DashboardStyles.progressFillBar,
      dateLabel: [
        DashboardStyles.dateLabel,
        { color: theme.muted }
      ],
      subtasksSection: [
        DashboardStyles.subtasksSection,
        { borderTopColor: theme.border }
      ],
      subtaskItemRow: DashboardStyles.subtaskItemRow,
      subtaskContent: DashboardStyles.subtaskContent,
      subtaskCheckbox: [
        DashboardStyles.subtaskCheckbox,
        { borderColor: theme.secondary }
      ],
      subtaskCheckboxDone: [
        DashboardStyles.subtaskCheckboxDone,
        { backgroundColor: theme.primary }
      ],
      subtaskCheckmarkText: DashboardStyles.subtaskCheckmarkText,
      subtaskTitle: [
        DashboardStyles.subtaskTitle,
        { color: theme.text }
      ],
      addSubtaskContainer: DashboardStyles.addSubtaskContainer,
      addSubtaskButtons: DashboardStyles.addSubtaskButtons,
      subtaskInput: [
        DashboardStyles.subtaskInput,
        {
          backgroundColor: theme.inputBackground,
          borderColor: theme.border,
          color: theme.text,
        }
      ],
      addSubtaskButton: DashboardStyles.addSubtaskButton,
      addSubtaskButtonText: [
        DashboardStyles.addSubtaskButtonText,
        { color: theme.secondary }
      ],
      editFormButtons: DashboardStyles.editFormButtons,
      authContainer: [
        AuthStyles.authContainer,
        { backgroundColor: theme.background }
      ],
      authForm: AuthStyles.authForm,

      section: {
        backgroundColor: theme.surface,
        borderRadius: 12,
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
      progressContainer: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        marginTop: 8,
        gap: 8,
        backgroundColor: 'transparent',
      } as const,
      progressBar: {
        flex: 1,
        height: 6,
        backgroundColor: theme.progressTrack,
        borderRadius: 3,
        overflow: 'hidden' as const,
      } as const,
      progressFill: {
        height: '100%',
        backgroundColor: '#BF1A2F',
        borderRadius: 3,
      } as const,
      progressText: {
        fontSize: 12,
        color: theme.muted,
        fontWeight: '600' as const,
        minWidth: 35,
        textAlign: 'right' as const,
      } as const,
      taskRow: [
        DashboardStyles.taskRow,
        { backgroundColor: theme.surface }
      ],
      taskActions: DashboardStyles.taskActions,
      taskTitleContainer: DashboardStyles.taskTitleContainer,
      subtasksContainer: [
        DashboardStyles.subtasksContainer,
        { borderTopColor: theme.border }
      ],
      taskContent: DashboardStyles.taskContent,
      deadlineText: [
        DashboardStyles.deadlineText,
        { color: theme.secondary }
      ],
      rewardText: [
        DashboardStyles.rewardText,
        { color: theme.rewardColor }
      ],
      expandButton: DashboardStyles.expandButton,
      expandButtonText: [
        DashboardStyles.expandButtonText,
        { color: theme.secondary }
      ],
      subtaskItem: [
        DashboardStyles.subtaskItem,
        { backgroundColor: theme.surface }
      ],
      progressRow: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 8,
        marginBottom: 8,
      } as const,
      rewardPill: {
        alignSelf: 'flex-start' as const,
        backgroundColor: theme.rewardColor,
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 3,
        marginTop: 4,
      } as const,
      rewardPillText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700' as const,
      } as const,
      pointsPill: {
        alignSelf: 'flex-start' as const,
        backgroundColor: theme.progressTrack,
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 3,
        marginTop: 4,
      } as const,
      pointsPillText: {
        color: theme.text,
        fontSize: 12,
        fontWeight: '600' as const,
      } as const,
    };
  }, [colorScheme, theme]);

  return themedStyles;
}

export function useThemeColors() {
  const colorScheme = useColorScheme() ?? 'light';
  return Colors[colorScheme];
}
