import { useEffect, useState } from 'react';

import { useEffectiveColorScheme } from '@/features/theme/theme-preference';

export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const colorScheme = useEffectiveColorScheme();

  if (hasHydrated) return colorScheme;
  return 'light';
}
