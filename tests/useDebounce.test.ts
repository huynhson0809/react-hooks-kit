import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useDebounce } from "../src/useDebounce";

describe("useDebounce", () => {
  it("should return initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 500));
    expect(result.current).toBe("hello");
  });

  it("should debounce value changes", () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "hello", delay: 500 } }
    );

    rerender({ value: "world", delay: 500 });
    expect(result.current).toBe("hello");

    act(() => vi.advanceTimersByTime(500));
    expect(result.current).toBe("world");
    vi.useRealTimers();
  });

  it("should reset timer on rapid changes", () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "a", delay: 300 } }
    );

    rerender({ value: "b", delay: 300 });
    act(() => vi.advanceTimersByTime(100));
    rerender({ value: "c", delay: 300 });
    act(() => vi.advanceTimersByTime(300));

    expect(result.current).toBe("c");
    vi.useRealTimers();
  });
});
