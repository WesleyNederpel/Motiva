import { act, renderHook, waitFor } from '@testing-library/react-native';

import { useAuth } from './useAuth';

jest.mock('@/lib/supabase');

import { supabase } from '@/lib/supabase';

const MOCK_USER = { id: 'user-1', email: 'test@test.com' };

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({ data: { session: null } });
    (supabase.auth.onAuthStateChange as jest.Mock).mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } },
    });
    (supabase.auth.signOut as jest.Mock).mockResolvedValue({ error: null });
  });

  test('user is null initially when there is no session', async () => {
    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toBeNull();
  });

  test('loading starts as true and becomes false after getSession resolves', async () => {
    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.loading).toBe(false);
  });

  test('user is populated when session contains a user', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValueOnce({
      data: { session: { user: MOCK_USER } },
    });

    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.user).toEqual(MOCK_USER);
  });

  test('user updates when onAuthStateChange fires with a new session', async () => {
    let capturedCallback: ((event: string, session: any) => void) | null = null;
    (supabase.auth.onAuthStateChange as jest.Mock).mockImplementation((cb: any) => {
      capturedCallback = cb;
      return { data: { subscription: { unsubscribe: jest.fn() } } };
    });

    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      capturedCallback?.('SIGNED_IN', { user: MOCK_USER });
    });

    expect(result.current.user).toEqual(MOCK_USER);
  });

  test('unsubscribes from auth listener on unmount', () => {
    const unsubscribe = jest.fn();
    (supabase.auth.onAuthStateChange as jest.Mock).mockReturnValue({
      data: { subscription: { unsubscribe } },
    });

    const { unmount } = renderHook(() => useAuth());
    unmount();

    expect(unsubscribe).toHaveBeenCalled();
  });

  test('logout calls supabase.auth.signOut', async () => {
    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => { await result.current.logout(); });

    expect(supabase.auth.signOut).toHaveBeenCalled();
  });
});
