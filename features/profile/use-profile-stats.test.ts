import { renderHook, waitFor } from '@testing-library/react-native';

import { useProfileStats } from './use-profile-stats';

jest.mock('expo-router', () => ({
  useFocusEffect: jest.fn((cb: () => void) => cb()),
}));

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(),
  },
}));

import { supabase } from '@/lib/supabase';

const FUTURE = '2099-12-31T12:00:00Z';
const PAST = '2020-01-01T12:00:00Z';

describe('useProfileStats', () => {
  let mockBuilder: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockBuilder = {
      select: jest.fn().mockReturnThis(),
      then(resolve: any, reject?: any) {
        return Promise.resolve({ data: [], error: null }).then(resolve, reject);
      },
      catch(reject: any) {
        return Promise.resolve({ data: [], error: null }).catch(reject);
      },
      finally(fn: any) {
        return Promise.resolve({ data: [], error: null }).finally(fn);
      },
    };
    (supabase.from as jest.Mock).mockReturnValue(mockBuilder);
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({ data: { user: null } });
  });

  test('starts with loading=true', () => {
    const { result } = renderHook(() => useProfileStats());
    expect(result.current.loading).toBe(true);
  });

  test('sets loading=false after fetch resolves', async () => {
    const { result } = renderHook(() => useProfileStats());
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  test('computes totalTasks and completedTasks correctly', async () => {
    const tasks = [
      { completed: true, reward: 'Coffee', deadline: FUTURE },
      { completed: false, reward: null, deadline: null },
      { completed: true, reward: null, deadline: null },
    ];
    mockBuilder.then = (resolve: any, reject?: any) =>
      Promise.resolve({ data: tasks, error: null }).then(resolve, reject);

    const { result } = renderHook(() => useProfileStats());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.stats.totalTasks).toBe(3);
    expect(result.current.stats.completedTasks).toBe(2);
  });

  test('only counts non-overdue completed tasks with a reward as rewardsEarned', async () => {
    const tasks = [
      { completed: true, reward: 'Coffee', deadline: FUTURE },
      { completed: true, reward: 'Book', deadline: PAST },
      { completed: true, reward: null, deadline: null },
      { completed: true, reward: 'Movie', deadline: null },
      { completed: false, reward: 'Cake', deadline: FUTURE },
    ];
    mockBuilder.then = (resolve: any, reject?: any) =>
      Promise.resolve({ data: tasks, error: null }).then(resolve, reject);

    const { result } = renderHook(() => useProfileStats());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.stats.rewardsEarned).toBe(2);
  });

  test('reads points from user_metadata', async () => {
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { user_metadata: { points: 42 } } },
    });

    const { result } = renderHook(() => useProfileStats());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.stats.points).toBe(42);
  });

  test('defaults points to 0 when user_metadata has no points', async () => {
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { user_metadata: {} } },
    });

    const { result } = renderHook(() => useProfileStats());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.stats.points).toBe(0);
  });

  test('sets all stats to 0 and loading=false when DB returns error', async () => {
    mockBuilder.then = (resolve: any, reject?: any) =>
      Promise.resolve({ data: null, error: { message: 'fail' } }).then(resolve, reject);

    const { result } = renderHook(() => useProfileStats());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.stats.totalTasks).toBe(0);
  });
});
