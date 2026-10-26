import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useOptimistic } from '@/lib/use-optimistic';

describe('useOptimistic', () => {
  it('flips at once and keeps the value when the save works', async () => {
    const { result } = renderHook(() => useOptimistic(false, async () => {}));
    await act(async () => { await result.current[1](true); });
    expect(result.current[0]).toBe(true);
  });
  it('rolls back and reports the error when the save fails', async () => {
    const { result } = renderHook(() => useOptimistic(false, async () => { throw new Error('nope'); }));
    let p!: Promise<void>;
    act(() => { p = result.current[1](true); });
    expect(result.current[0]).toBe(true); // optimistic
    await act(async () => { await p; });
    expect(result.current[0]).toBe(false);
    expect(result.current[2].error).toBeInstanceOf(Error);
  });
});
