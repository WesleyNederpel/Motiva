import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

export type ThemePreference = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'motiva.themePreference';

interface ThemePreferenceContextValue {
  pref: ThemePreference;
  setPref: (pref: ThemePreference) => void;
  hydrated: boolean;
}

const ThemePreferenceContext = createContext<ThemePreferenceContextValue | null>(
  null
);

export function ThemePreferenceProvider({ children }: { children: ReactNode }) {
  const [pref, setPrefState] = useState<ThemePreference>('system');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then(value => {
        if (!mounted) return;
        if (value === 'light' || value === 'dark' || value === 'system') {
          setPrefState(value);
        }
      })
      .catch(err => console.error('ThemePreference load error:', err))
      .finally(() => {
        if (mounted) setHydrated(true);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const setPref = (next: ThemePreference) => {
    setPrefState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(err =>
      console.error('ThemePreference save error:', err)
    );
  };

  return (
    <ThemePreferenceContext.Provider value={{ pref, setPref, hydrated }}>
      {children}
    </ThemePreferenceContext.Provider>
  );
}

export function useThemePreference() {
  const ctx = useContext(ThemePreferenceContext);
  if (!ctx) {
    throw new Error(
      'useThemePreference must be used inside a ThemePreferenceProvider'
    );
  }
  return ctx;
}

export function useEffectiveColorScheme(): 'light' | 'dark' {
  const system = useRNColorScheme();
  const ctx = useContext(ThemePreferenceContext);
  const pref = ctx?.pref ?? 'system';
  if (pref === 'light' || pref === 'dark') return pref;
  return system === 'dark' ? 'dark' : 'light';
}
