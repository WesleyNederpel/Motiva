import { renderHook } from '@testing-library/react-native';
import { Alert } from 'react-native';

import { useAccountActions } from './use-account-actions';

const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      updateUser: jest.fn().mockResolvedValue({ data: {}, error: null }),
      signInWithPassword: jest.fn().mockResolvedValue({ data: {}, error: null }),
      signOut: jest.fn().mockResolvedValue({ error: null }),
    },
    rpc: jest.fn().mockResolvedValue({ data: null, error: null }),
  },
}));

import { supabase } from '@/lib/supabase';

const alertMock = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

describe('useAccountActions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (supabase.auth.updateUser as jest.Mock).mockResolvedValue({ data: {}, error: null });
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({ data: {}, error: null });
    (supabase.auth.signOut as jest.Mock).mockResolvedValue({ error: null });
    (supabase.rpc as jest.Mock).mockResolvedValue({ data: null, error: null });
  });

  describe('updateEmail', () => {
    test('returns false for empty email', async () => {
      const { result } = renderHook(() => useAccountActions());
      const ok = await result.current.updateEmail('old@test.com', '  ');
      expect(ok).toBe(false);
      expect(Alert.alert).toHaveBeenCalledWith('Error', expect.any(String));
    });

    test('returns false when same email is provided', async () => {
      const { result } = renderHook(() => useAccountActions());
      const ok = await result.current.updateEmail('same@test.com', 'same@test.com');
      expect(ok).toBe(false);
      expect(Alert.alert).toHaveBeenCalledWith('No change', expect.any(String));
    });

    test('returns true and shows confirmation on success', async () => {
      const { result } = renderHook(() => useAccountActions());
      const ok = await result.current.updateEmail('old@test.com', 'new@test.com');
      expect(ok).toBe(true);
      expect(supabase.auth.updateUser).toHaveBeenCalledWith({ email: 'new@test.com' });
      expect(Alert.alert).toHaveBeenCalledWith('Confirmation email sent', expect.any(String));
    });

    test('returns false when supabase updateUser fails', async () => {
      (supabase.auth.updateUser as jest.Mock).mockResolvedValueOnce({ error: { message: 'Server error' } });
      const { result } = renderHook(() => useAccountActions());
      const ok = await result.current.updateEmail('old@test.com', 'new@test.com');
      expect(ok).toBe(false);
    });
  });

  describe('changePassword', () => {
    const base = { email: 'user@test.com', current: 'old123', next: 'new123', confirm: 'new123' };

    test('returns false when any field is empty', async () => {
      const { result } = renderHook(() => useAccountActions());
      const ok = await result.current.changePassword({ ...base, current: '' });
      expect(ok).toBe(false);
      expect(Alert.alert).toHaveBeenCalledWith('Error', expect.stringContaining('fill'));
    });

    test('returns false when new password is shorter than 6 characters', async () => {
      const { result } = renderHook(() => useAccountActions());
      const ok = await result.current.changePassword({ ...base, next: 'abc', confirm: 'abc' });
      expect(ok).toBe(false);
      expect(Alert.alert).toHaveBeenCalledWith('Error', expect.stringContaining('6'));
    });

    test('returns false when new and confirm passwords do not match', async () => {
      const { result } = renderHook(() => useAccountActions());
      const ok = await result.current.changePassword({ ...base, confirm: 'different123' });
      expect(ok).toBe(false);
      expect(Alert.alert).toHaveBeenCalledWith('Error', expect.stringContaining('match'));
    });

    test('returns false when new password is same as current', async () => {
      const { result } = renderHook(() => useAccountActions());
      const ok = await result.current.changePassword({ ...base, next: 'old123', confirm: 'old123' });
      expect(ok).toBe(false);
      expect(Alert.alert).toHaveBeenCalledWith('Error', expect.stringContaining('different'));
    });

    test('returns false when current password is wrong (signIn fails)', async () => {
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({ error: { message: 'Invalid credentials' } });
      const { result } = renderHook(() => useAccountActions());
      const ok = await result.current.changePassword(base);
      expect(ok).toBe(false);
      expect(Alert.alert).toHaveBeenCalledWith('Error', expect.stringContaining('incorrect'));
    });

    test('returns true and shows success alert on valid password change', async () => {
      const { result } = renderHook(() => useAccountActions());
      const ok = await result.current.changePassword(base);
      expect(ok).toBe(true);
      expect(supabase.auth.updateUser).toHaveBeenCalledWith({ password: 'new123' });
      expect(Alert.alert).toHaveBeenCalledWith('Password updated', expect.any(String));
    });
  });

  describe('logout', () => {
    test('shows confirmation alert', () => {
      const { result } = renderHook(() => useAccountActions());
      result.current.logout();
      expect(Alert.alert).toHaveBeenCalledWith('Log Out', expect.any(String), expect.any(Array));
    });

    test('calls signOut and navigates to login when confirmed', async () => {
      alertMock.mockImplementationOnce((_title, _msg, buttons: any) => {
        const confirmBtn = buttons?.find((b: any) => b.style === 'destructive');
        confirmBtn?.onPress?.();
      });

      const { result } = renderHook(() => useAccountActions());
      await result.current.logout();

      expect(supabase.auth.signOut).toHaveBeenCalled();
      expect(mockReplace).toHaveBeenCalledWith('/auth/login');
    });
  });
});
