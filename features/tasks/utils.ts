import { Subtask, Task } from './types';

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isOverdue(deadline?: string | null, completed?: boolean): boolean {
  if (!deadline) return false;
  if (completed) return false;
  const due = new Date(deadline);
  if (isNaN(due.getTime())) return false;
  return due < startOfToday();
}

export function countOverdueSubtasks(task: Task): number {
  if (!task.subtasks || task.subtasks.length === 0) return 0;
  return task.subtasks.reduce(
    (n, st) => (isOverdue(st.deadline, st.completed) ? n + 1 : n),
    0,
  );
}

export function calculateTaskPoints(task: Task): number {
  if (isOverdue(task.deadline, task.completed)) return 0;
  const n = task.subtasks?.length ?? 0;
  const overdueSubs = countOverdueSubtasks(task);
  return Math.max(0, 10 + (n - overdueSubs) * 5);
}

export function getTaskProgress(task: Task): number {
  if (task.subtasks && task.subtasks.length > 0) {
    const completed = task.subtasks.filter(st => st.completed).length;
    return Math.round((completed / task.subtasks.length) * 100);
  }
  return task.completed ? 100 : 0;
}

export function formatDeadline(dateString: string): string {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}`;
}

export function sortByDeadline(
  a: { deadline?: string | null },
  b: { deadline?: string | null }
): number {
  if (!a.deadline && !b.deadline) return 0;
  if (!a.deadline) return 1;
  if (!b.deadline) return -1;
  return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
}

export const sortTasksByDeadline = (a: Task, b: Task) => sortByDeadline(a, b);
export const sortSubtasksByDeadline = (a: Subtask, b: Subtask) => sortByDeadline(a, b);
