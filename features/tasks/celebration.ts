import { useEffect, useState } from 'react';

// Tiny event emitter so any place in the app can fire a celebration,
// and a single overlay subscribes to render the confetti/sound/haptic.
type Listener = () => void;
const listeners = new Set<Listener>();

export function triggerCelebration() {
  listeners.forEach(l => l());
}

/**
 * Returns a number that increments every time `triggerCelebration()` fires.
 * Mount once in the dashboard and use the value as a key/effect dep to
 * re-run the celebration animation.
 */
export function useCelebrationTrigger(): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const listener = () => setCount(c => c + 1);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);
  return count;
}
