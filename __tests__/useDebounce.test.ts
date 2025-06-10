import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../lib/hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    // Change the value
    rerender({ value: 'changed', delay: 500 });

    // Value should not have changed yet
    expect(result.current).toBe('initial');

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Now the value should be updated
    expect(result.current).toBe('changed');
  });

  it('should cancel previous timeout when value changes rapidly', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    // Change value multiple times
    rerender({ value: 'changed1', delay: 500 });
    rerender({ value: 'changed2', delay: 500 });
    rerender({ value: 'changed3', delay: 500 });

    // Value should still be initial
    expect(result.current).toBe('initial');

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Should only show the last value
    expect(result.current).toBe('changed3');
  });

  it('should handle different delay values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 1000 } }
    );

    // Change value and delay
    rerender({ value: 'changed', delay: 2000 });

    // Fast forward time by 1000ms
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Value should not have changed yet
    expect(result.current).toBe('initial');

    // Fast forward remaining time
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Now the value should be updated
    expect(result.current).toBe('changed');
  });
}); 