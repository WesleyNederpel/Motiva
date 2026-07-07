import {
  calculateTaskPoints,
  formatDeadline,
  getTaskProgress,
  isOverdue,
  sortByDeadline,
} from './utils';
import { Subtask, Task } from './types';

const PAST_DATE = '2020-01-01T12:00:00Z';
const FUTURE_DATE = '2099-12-31T12:00:00Z';

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: '1',
    title: 'Test task',
    completed: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

function makeSubtask(overrides: Partial<Subtask> = {}): Subtask {
  return {
    id: 's1',
    task_id: '1',
    title: 'Test subtask',
    completed: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

describe('isOverdue', () => {
  test('returns false when deadline is null', () => {
    expect(isOverdue(null)).toBe(false);
  });

  test('returns false when deadline is undefined', () => {
    expect(isOverdue(undefined)).toBe(false);
  });

  test('returns false when task is completed even with past deadline', () => {
    expect(isOverdue(PAST_DATE, true)).toBe(false);
  });

  test('returns true for past deadline on incomplete task', () => {
    expect(isOverdue(PAST_DATE, false)).toBe(true);
  });

  test('returns false for future deadline on incomplete task', () => {
    expect(isOverdue(FUTURE_DATE, false)).toBe(false);
  });

  test('returns false for invalid date string', () => {
    expect(isOverdue('not-a-date', false)).toBe(false);
  });
});

describe('getTaskProgress', () => {
  test('returns 0 for incomplete task with no subtasks', () => {
    expect(getTaskProgress(makeTask({ completed: false }))).toBe(0);
  });

  test('returns 100 for completed task with no subtasks', () => {
    expect(getTaskProgress(makeTask({ completed: true }))).toBe(100);
  });

  test('returns 0 for task with empty subtasks array', () => {
    expect(getTaskProgress(makeTask({ subtasks: [], completed: false }))).toBe(0);
  });

  test('returns 0 when no subtasks are completed', () => {
    const task = makeTask({
      subtasks: [
        makeSubtask({ id: 's1', completed: false }),
        makeSubtask({ id: 's2', completed: false }),
      ],
    });
    expect(getTaskProgress(task)).toBe(0);
  });

  test('returns 50 for task with half subtasks completed', () => {
    const task = makeTask({
      subtasks: [
        makeSubtask({ id: 's1', completed: true }),
        makeSubtask({ id: 's2', completed: false }),
      ],
    });
    expect(getTaskProgress(task)).toBe(50);
  });

  test('returns 100 when all subtasks are completed', () => {
    const task = makeTask({
      subtasks: [
        makeSubtask({ id: 's1', completed: true }),
        makeSubtask({ id: 's2', completed: true }),
      ],
    });
    expect(getTaskProgress(task)).toBe(100);
  });

  test('rounds progress to nearest integer', () => {
    const task = makeTask({
      subtasks: [
        makeSubtask({ id: 's1', completed: true }),
        makeSubtask({ id: 's2', completed: false }),
        makeSubtask({ id: 's3', completed: false }),
      ],
    });
    expect(getTaskProgress(task)).toBe(33);
  });
});

describe('calculateTaskPoints', () => {
  test('returns 0 for overdue incomplete task', () => {
    const task = makeTask({ deadline: PAST_DATE, completed: false });
    expect(calculateTaskPoints(task)).toBe(0);
  });

  test('returns 10 for a task with no subtasks and no deadline', () => {
    expect(calculateTaskPoints(makeTask())).toBe(10);
  });

  test('adds 5 points per non-overdue subtask', () => {
    const task = makeTask({
      subtasks: [
        makeSubtask({ id: 's1', deadline: FUTURE_DATE }),
        makeSubtask({ id: 's2', deadline: FUTURE_DATE }),
      ],
    });
    expect(calculateTaskPoints(task)).toBe(20);
  });

  test('deducts overdue subtasks from point calculation', () => {
    const task = makeTask({
      subtasks: [
        makeSubtask({ id: 's1', deadline: FUTURE_DATE }),
        makeSubtask({ id: 's2', deadline: PAST_DATE, completed: false }),
      ],
    });
    expect(calculateTaskPoints(task)).toBe(15);
  });

  test('result is never below 0', () => {
    const task = makeTask({
      subtasks: [
        makeSubtask({ id: 's1', deadline: PAST_DATE, completed: false }),
        makeSubtask({ id: 's2', deadline: PAST_DATE, completed: false }),
        makeSubtask({ id: 's3', deadline: PAST_DATE, completed: false }),
      ],
    });
    expect(calculateTaskPoints(task)).toBeGreaterThanOrEqual(0);
  });
});

describe('formatDeadline', () => {
  test('formats a date string as DD/MM', () => {
    const result = formatDeadline('2024-03-15T12:00:00Z');
    expect(result).toMatch(/^\d{2}\/\d{2}$/);
  });

  test('pads single-digit day and month with zeros', () => {
    const result = formatDeadline('2024-01-05T12:00:00Z');
    expect(result).toMatch(/^\d{2}\/\d{2}$/);
    expect(result.length).toBe(5);
  });
});

describe('sortByDeadline', () => {
  test('returns 0 when both deadlines are null', () => {
    expect(sortByDeadline({ deadline: null }, { deadline: null })).toBe(0);
  });

  test('null deadline sorts after a defined deadline', () => {
    expect(sortByDeadline({ deadline: null }, { deadline: FUTURE_DATE })).toBeGreaterThan(0);
  });

  test('defined deadline sorts before null deadline', () => {
    expect(sortByDeadline({ deadline: FUTURE_DATE }, { deadline: null })).toBeLessThan(0);
  });

  test('earlier deadline sorts before later deadline', () => {
    expect(sortByDeadline({ deadline: PAST_DATE }, { deadline: FUTURE_DATE })).toBeLessThan(0);
  });

  test('later deadline sorts after earlier deadline', () => {
    expect(sortByDeadline({ deadline: FUTURE_DATE }, { deadline: PAST_DATE })).toBeGreaterThan(0);
  });
});
