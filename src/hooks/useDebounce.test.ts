import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('deve retornar o valor inicial imediatamente', () => {
    const { result } = renderHook(() => useDebounce('teste inicial', 400));
    expect(result.current).toBe('teste inicial');
  });

  it('não deve atualizar o valor antes do tempo de delay expirar', () => {
    const { result, rerender } = renderHook(({ val }) => useDebounce(val, 400), {
      initialProps: { val: 'primeiro' },
    });

    rerender({ val: 'segundo' });

    // Avança apenas 200ms (metade do delay de 400ms)
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe('primeiro');
  });

  it('deve atualizar o valor após o delay completo', () => {
    const { result, rerender } = renderHook(({ val }) => useDebounce(val, 400), {
      initialProps: { val: 'primeiro' },
    });

    rerender({ val: 'segundo' });

    // Avança 400ms completos
    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(result.current).toBe('segundo');
  });

  it('deve reiniciar o timer se o valor mudar continuamente antes do prazo', () => {
    const { result, rerender } = renderHook(({ val }) => useDebounce(val, 400), {
      initialProps: { val: 'a' },
    });

    act(() => {
      vi.advanceTimersByTime(200);
    });
    rerender({ val: 'ab' });

    act(() => {
      vi.advanceTimersByTime(200);
    });
    rerender({ val: 'abc' });

    // Ainda não se passaram 400ms ininterruptos após 'abc'
    expect(result.current).toBe('a');

    // Avança 400ms finais
    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(result.current).toBe('abc');
  });
});
