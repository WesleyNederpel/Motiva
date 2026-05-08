import { useEffect, useState } from 'react';

import { useEffectiveColorScheme } from '@/features/theme/theme-preference';

/**
 * To support static rendering, the value needs to be re-calculated on the client side for web.
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const colorScheme = useEffectiveColorScheme();

  if (hasHydrated) return colorScheme;
  return 'light';
}
