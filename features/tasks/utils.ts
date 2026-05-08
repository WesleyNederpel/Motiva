import { Subtask, Task } from './types';

// Calculate task progress percentage based on subtasks (or completed flag).
export function getTaskProgress(task: Task): number {
  if (task.subtasks && task.subtasks.length > 0) {
    const completed = task.subtasks.filter(st => st.completed).length;
    return Math.round((completed / task.subtasks.length) * 100);
  }
  return task.completed ? 100 : 0;
}

// Format an ISO date string as DD/MM.
export function formatDeadline(dateString: string): string {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}`;
}

// Comparator that sorts items by deadline ascending; null deadlines go last.
export function sortByDeadline(
  a: { deadline?: string | null },
  b: { deadline?: string | null }
): number {
  if (!a.deadline && !b.deadline) return 0;
  if (!a.deadline) return 1;
  if (!b.deadline) return -1;
  return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
}

// Convenience typed comparators (same logic, narrower types).
export const sortTasksByDeadline = (a: Task, b: Task) => sortByDeadline(a, b);
export const sortSubtasksByDeadline = (a: Subtask, b: Subtask) => sortByDeadline(a, b);
