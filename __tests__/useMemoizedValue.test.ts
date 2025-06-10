import { renderHook, act } from '@testing-library/react';
import { useMemoizedValue } from '../lib/hooks/useMemoizedValue';

describe('useMemoizedValue', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should compute and cache values', () => {
    let computeCount = 0;
    const computeFn = () => {
      computeCount++;
      return computeCount;
    };

    const { result, rerender } = renderHook(
      ({ deps }) => useMemoizedValue(computeFn, deps),
      { initialProps: { deps: [1] } }
    );

    // First render should compute
    expect(result.current).toBe(1);
    expect(computeCount).toBe(1);

    // Same dependencies should use cache
    act(() => {
      rerender({ deps: [1] });
    });
    expect(result.current).toBe(1);
    expect(computeCount).toBe(1);

    // Different dependencies should recompute
    act(() => {
      rerender({ deps: [2] });
    });
    expect(result.current).toBe(2);
    expect(computeCount).toBe(2);
  });

  it('should respect cache size limit', () => {
    let computeCount = 0;
    const computeFn = () => {
      computeCount++;
      return computeCount;
    };

    const { result, rerender } = renderHook(
      ({ deps }) => useMemoizedValue(computeFn, deps, 2),
      { initialProps: { deps: [1] } }
    );

    // Fill cache
    expect(result.current).toBe(1);
    act(() => {
      rerender({ deps: [2] });
    });
    expect(result.current).toBe(2);

    // Add third value, should remove first
    act(() => {
      rerender({ deps: [3] });
    });
    expect(result.current).toBe(3);

    // Re-add first value, should recompute
    act(() => {
      rerender({ deps: [1] });
    });
    expect(result.current).toBe(4);
  });
}); 