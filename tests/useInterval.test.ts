import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useInterval } from "../src/useInterval";

describe("useInterval", () => {
  it("should call callback at specified interval", () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    renderHook(() => useInterval(callback, 1000));

    expect(callback).not.toHaveBeenCalled();
    vi.advanceTimersByTime(3000);
    expect(callback).toHaveBeenCalledTimes(3);
    vi.useRealTimers();
  });

  it("should not call callback when delay is null", () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    renderHook(() => useInterval(callback, null));

    vi.advanceTimersByTime(5000);
    expect(callback).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it("should clear interval on unmount", () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const { unmount } = renderHook(() => useInterval(callback, 100));

    vi.advanceTimersByTime(250);
    unmount();
    vi.advanceTimersByTime(500);

    expect(callback).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });

  it("should use latest callback", () => {
    vi.useFakeTimers();
    const results: number[] = [];
    const { rerender } = renderHook(
      ({ val }) => useInterval(() => results.push(val), 100),
      { initialProps: { val: 1 } }
    );

    vi.advanceTimersByTime(100);
    rerender({ val: 2 });
    vi.advanceTimersByTime(100);

    expect(results).toEqual([1, 2]);
    vi.useRealTimers();
  });
});
