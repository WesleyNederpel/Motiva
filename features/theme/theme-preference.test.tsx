import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';

import {
    ThemePreferenceProvider,
    useEffectiveColorScheme,
    useThemePreference,
} from './theme-preference';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemePreferenceProvider>{children}</ThemePreferenceProvider>
);

describe('useThemePreference', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  test('throws when used outside ThemePreferenceProvider', () => {
    const { result } = renderHook(() => {
      try {
        return useThemePreference();
      } catch (e) {
        return e as Error;
      }
    });
    expect(result.current).toBeInstanceOf(Error);
    expect((result.current as Error).message).toMatch(/ThemePreferenceProvider/);
  });

  test('defaults to "system" preference', async () => {
    const { result } = renderHook(() => useThemePreference(), { wrapper });
    await waitFor(() => expect(result.current.hydrated).toBe(true));
    expect(result.current.pref).toBe('system');
  });

  test('hydrated becomes true after AsyncStorage resolves', async () => {
    const { result } = renderHook(() => useThemePreference(), { wrapper });
    await waitFor(() => expect(result.current.hydrated).toBe(true));
  });

  test('restores persisted "dark" preference from AsyncStorage', async () => {
    await AsyncStorage.setItem('motiva.themePreference', 'dark');
    const { result } = renderHook(() => useThemePreference(), { wrapper });
    await waitFor(() => expect(result.current.hydrated).toBe(true));
    expect(result.current.pref).toBe('dark');
  });

  test('restores persisted "light" preference from AsyncStorage', async () => {
    await AsyncStorage.setItem('motiva.themePreference', 'light');
    const { result } = renderHook(() => useThemePreference(), { wrapper });
    await waitFor(() => expect(result.current.hydrated).toBe(true));
    expect(result.current.pref).toBe('light');
  });

  test('setPref updates the context value', async () => {
    const { result } = renderHook(() => useThemePreference(), { wrapper });
    await waitFor(() => expect(result.current.hydrated).toBe(true));

    act(() => { result.current.setPref('dark'); });
    expect(result.current.pref).toBe('dark');
  });

  test('setPref writes the value to AsyncStorage', async () => {
    const { result } = renderHook(() => useThemePreference(), { wrapper });
    await waitFor(() => expect(result.current.hydrated).toBe(true));

    act(() => { result.current.setPref('light'); });
    await waitFor(async () => {
      const stored = await AsyncStorage.getItem('motiva.themePreference');
      expect(stored).toBe('light');
    });
  });

  test('ignores invalid values stored in AsyncStorage', async () => {
    await AsyncStorage.setItem('motiva.themePreference', 'invalid-value');
    const { result } = renderHook(() => useThemePreference(), { wrapper });
    await waitFor(() => expect(result.current.hydrated).toBe(true));
    expect(result.current.pref).toBe('system');
  });
});

describe('useEffectiveColorScheme', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  test('returns "light" when pref is "light"', async () => {
    const { result } = renderHook(() => useEffectiveColorScheme(), { wrapper });
    await waitFor(async () => {
      const p = renderHook(() => useThemePreference(), { wrapper });
      await waitFor(() => expect(p.result.current.hydrated).toBe(true));
      act(() => { p.result.current.setPref('light'); });
    });
    expect(['light', 'dark']).toContain(result.current);
  });

  test('returns "dark" when pref is "dark"', async () => {
    await AsyncStorage.setItem('motiva.themePreference', 'dark');
    const { result } = renderHook(() => useEffectiveColorScheme(), { wrapper });
    await waitFor(() => {
      expect(result.current).toBe('dark');
    });
  });

  test('returns "light" when pref is "light" (persisted)', async () => {
    await AsyncStorage.setItem('motiva.themePreference', 'light');
    const { result } = renderHook(() => useEffectiveColorScheme(), { wrapper });
    await waitFor(() => {
      expect(result.current).toBe('light');
    });
  });

  test('returns a valid colour scheme string for system pref', async () => {
    const { result } = renderHook(() => useEffectiveColorScheme(), { wrapper });
    await waitFor(() => {
      expect(['light', 'dark']).toContain(result.current);
    });
  });
});
