import { useEffect, useState } from 'react';

type Listener = () => void;
const listeners = new Set<Listener>();

export function triggerCelebration() {
  listeners.forEach(l => l());
}

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
