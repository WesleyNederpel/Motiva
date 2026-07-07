import { act, renderHook } from '@testing-library/react-native';

import { triggerCelebration, useCelebrationTrigger } from './celebration';

describe('useCelebrationTrigger', () => {
  test('starts at 0', () => {
    const { result } = renderHook(() => useCelebrationTrigger());
    expect(result.current).toBe(0);
  });

  test('increments by 1 on each triggerCelebration call', () => {
    const { result } = renderHook(() => useCelebrationTrigger());

    act(() => {
      triggerCelebration();
    });
    expect(result.current).toBe(1);

    act(() => {
      triggerCelebration();
    });
    expect(result.current).toBe(2);
  });

  test('cleans up listener on unmount', () => {
    const { result, unmount } = renderHook(() => useCelebrationTrigger());
    unmount();

    act(() => {
      triggerCelebration();
    });
    expect(result.current).toBe(0);
  });

  test('multiple mounted hooks all receive the trigger', () => {
    const { result: r1 } = renderHook(() => useCelebrationTrigger());
    const { result: r2 } = renderHook(() => useCelebrationTrigger());

    act(() => {
      triggerCelebration();
    });

    expect(r1.current).toBe(1);
    expect(r2.current).toBe(1);
  });
});
