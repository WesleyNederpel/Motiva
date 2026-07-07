import { act, renderHook } from '@testing-library/react-native';
import { Alert } from 'react-native';

import { useTasks } from './use-tasks';

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
      updateUser: jest.fn().mockResolvedValue({ data: {}, error: null }),
    },
    from: jest.fn(),
  },
}));

jest.mock('./celebration', () => ({
  triggerCelebration: jest.fn(),
}));

jest.spyOn(Alert, 'alert').mockImplementation(() => {});

import { supabase } from '@/lib/supabase';

const MOCK_USER = { id: 'user-1', user_metadata: { points: 10 } };

function makeTaskRow(overrides = {}) {
  return {
    id: 't1',
    title: 'Task',
    completed: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    deadline: null,
    reward: null,
    points_awarded: false,
    completed_at: null,
    subtasks: [],
    ...overrides,
  };
}

describe('useTasks', () => {
  let mockBuilder: any;

  beforeEach(() => {
    jest.clearAllMocks();
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({ data: { user: MOCK_USER } });

    mockBuilder = {
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ data: null, error: null }),
      order: jest.fn().mockResolvedValue({ data: [], error: null }),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    };
    (supabase.from as jest.Mock).mockReturnValue(mockBuilder);
  });

  describe('fetchTasks', () => {
    test('populates tasks from DB', async () => {
      const rows = [makeTaskRow({ id: 't1', title: 'First' })];
      mockBuilder.order.mockResolvedValueOnce({ data: rows, error: null });

      const { result } = renderHook(() => useTasks());
      await act(async () => { await result.current.fetchTasks(); });

      expect(result.current.tasks).toHaveLength(1);
      expect(result.current.tasks[0].title).toBe('First');
    });

    test('does nothing when no user is authenticated', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValueOnce({ data: { user: null } });

      const { result } = renderHook(() => useTasks());
      await act(async () => { await result.current.fetchTasks({ silent: true }); });

      expect(result.current.tasks).toHaveLength(0);
    });

    test('sets loading to false after fetch completes', async () => {
      mockBuilder.order.mockResolvedValueOnce({ data: [], error: null });

      const { result } = renderHook(() => useTasks());
      await act(async () => { await result.current.fetchTasks(); });

      expect(result.current.loading).toBe(false);
    });
  });

  describe('addTask', () => {
    test('returns false for empty title', async () => {
      const { result } = renderHook(() => useTasks());
      let ok: boolean;
      await act(async () => {
        ok = await result.current.addTask({ title: '  ', deadline: null, reward: '' });
      });
      expect(ok!).toBe(false);
      expect(Alert.alert).toHaveBeenCalled();
    });

    test('inserts task and adds to state on success', async () => {
      const newTask = makeTaskRow({ id: 't2', title: 'New Task' });
      mockBuilder.single.mockResolvedValueOnce({ data: newTask, error: null });

      const { result } = renderHook(() => useTasks());
      let ok: boolean;
      await act(async () => {
        ok = await result.current.addTask({ title: 'New Task', deadline: null, reward: '' });
      });

      expect(ok!).toBe(true);
      expect(result.current.tasks).toHaveLength(1);
      expect(result.current.tasks[0].id).toBe('t2');
    });

    test('returns false when DB insert fails', async () => {
      mockBuilder.single.mockResolvedValueOnce({ data: null, error: { message: 'DB error' } });

      const { result } = renderHook(() => useTasks());
      let ok: boolean;
      await act(async () => {
        ok = await result.current.addTask({ title: 'Task', deadline: null, reward: '' });
      });

      expect(ok!).toBe(false);
    });
  });

  describe('updateTask', () => {
    test('returns false for empty title', async () => {
      const { result } = renderHook(() => useTasks());
      let ok: boolean;
      await act(async () => {
        ok = await result.current.updateTask('t1', { title: '', deadline: null, reward: '' });
      });
      expect(ok!).toBe(false);
    });

    test('updates task in state on success', async () => {
      const task = makeTaskRow({ id: 't1', title: 'Original' });
      mockBuilder.order.mockResolvedValueOnce({ data: [task], error: null });
      mockBuilder.eq.mockResolvedValueOnce({ data: null, error: null });

      const { result } = renderHook(() => useTasks());
      await act(async () => { await result.current.fetchTasks(); });
      await act(async () => {
        await result.current.updateTask('t1', { title: 'Updated', deadline: null, reward: '' });
      });

      expect(result.current.tasks[0].title).toBe('Updated');
    });
  });

  describe('toggleTaskExpansion', () => {
    test('adds task to expandedTasks when not already expanded', () => {
      const { result } = renderHook(() => useTasks());
      act(() => { result.current.toggleTaskExpansion('t1'); });
      expect(result.current.expandedTasks.has('t1')).toBe(true);
    });

    test('removes task from expandedTasks when already expanded', () => {
      const { result } = renderHook(() => useTasks());
      act(() => { result.current.toggleTaskExpansion('t1'); });
      act(() => { result.current.toggleTaskExpansion('t1'); });
      expect(result.current.expandedTasks.has('t1')).toBe(false);
    });
  });

  describe('reset', () => {
    test('clears tasks and resets loading', async () => {
      const task = makeTaskRow();
      mockBuilder.order.mockResolvedValueOnce({ data: [task], error: null });

      const { result } = renderHook(() => useTasks());
      await act(async () => { await result.current.fetchTasks(); });
      expect(result.current.tasks).toHaveLength(1);

      act(() => { result.current.reset(); });
      expect(result.current.tasks).toHaveLength(0);
      expect(result.current.loading).toBe(true);
    });
  });

  describe('addSubtask', () => {
    test('returns false for empty title', async () => {
      const { result } = renderHook(() => useTasks());
      let ok: boolean;
      await act(async () => {
        ok = await result.current.addSubtask('t1', { title: '  ', deadline: null });
      });
      expect(ok!).toBe(false);
    });

    test('adds subtask to the correct task on success', async () => {
      const task = makeTaskRow({ id: 't1', subtasks: [] });
      mockBuilder.order.mockResolvedValueOnce({ data: [task], error: null });
      const newSubtask = { id: 's1', task_id: 't1', title: 'Sub', completed: false, created_at: '', updated_at: '' };
      mockBuilder.single.mockResolvedValueOnce({ data: newSubtask, error: null });

      const { result } = renderHook(() => useTasks());
      await act(async () => { await result.current.fetchTasks(); });
      await act(async () => {
        await result.current.addSubtask('t1', { title: 'Sub', deadline: null });
      });

      expect(result.current.tasks[0].subtasks).toHaveLength(1);
      expect(result.current.tasks[0].subtasks![0].title).toBe('Sub');
    });
  });

  describe('deleteSubtask', () => {
    test('removes subtask from task state after DB delete', async () => {
      const subtask = { id: 's1', task_id: 't1', title: 'Sub', completed: false, created_at: '', updated_at: '' };
      const task = makeTaskRow({ id: 't1', subtasks: [subtask] });
      mockBuilder.order.mockResolvedValueOnce({ data: [task], error: null });
      mockBuilder.eq.mockResolvedValueOnce({ data: null, error: null });

      const { result } = renderHook(() => useTasks());
      await act(async () => { await result.current.fetchTasks(); });
      await act(async () => {
        await result.current.deleteSubtask('s1', 't1');
      });

      expect(result.current.tasks[0].subtasks).toHaveLength(0);
    });
  });

  describe('updateSubtask', () => {
    test('returns false for empty title', async () => {
      const { result } = renderHook(() => useTasks());
      let ok: boolean;
      await act(async () => {
        ok = await result.current.updateSubtask('s1', 't1', { title: '', deadline: null });
      });
      expect(ok!).toBe(false);
    });

    test('updates subtask title in state on success', async () => {
      const subtask = { id: 's1', task_id: 't1', title: 'Old', completed: false, created_at: '', updated_at: '' };
      const task = makeTaskRow({ id: 't1', subtasks: [subtask] });
      mockBuilder.order.mockResolvedValueOnce({ data: [task], error: null });
      mockBuilder.eq.mockResolvedValueOnce({ data: null, error: null });

      const { result } = renderHook(() => useTasks());
      await act(async () => { await result.current.fetchTasks(); });
      await act(async () => {
        await result.current.updateSubtask('s1', 't1', { title: 'New', deadline: null });
      });

      expect(result.current.tasks[0].subtasks![0].title).toBe('New');
    });
  });
});
