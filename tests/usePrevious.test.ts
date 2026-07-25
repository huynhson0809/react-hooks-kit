import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { usePrevious } from "../src/usePrevious";

describe("usePrevious", () => {
  it("should return undefined on first render", () => {
    const { result } = renderHook(() => usePrevious(0));
    expect(result.current).toBeUndefined();
  });

  it("should return previous value after update", () => {
    const { result, rerender } = renderHook(({ val }) => usePrevious(val), {
      initialProps: { val: 0 },
    });

    rerender({ val: 1 });
    expect(result.current).toBe(0);

    rerender({ val: 2 });
    expect(result.current).toBe(1);
  });

  it("should work with strings", () => {
    const { result, rerender } = renderHook(({ val }) => usePrevious(val), {
      initialProps: { val: "a" },
    });

    rerender({ val: "b" });
    expect(result.current).toBe("a");
  });
});
