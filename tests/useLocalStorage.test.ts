import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { useLocalStorage } from "../src/useLocalStorage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should return initial value when key not in storage", () => {
    const { result } = renderHook(() => useLocalStorage("key", "default"));
    expect(result.current[0]).toBe("default");
  });

  it("should persist value to localStorage", () => {
    const { result } = renderHook(() => useLocalStorage("key", "default"));
    act(() => result.current[1]("updated"));
    expect(result.current[0]).toBe("updated");
    expect(JSON.parse(localStorage.getItem("key")!)).toBe("updated");
  });

  it("should read existing value from localStorage", () => {
    localStorage.setItem("key", JSON.stringify("existing"));
    const { result } = renderHook(() => useLocalStorage("key", "default"));
    expect(result.current[0]).toBe("existing");
  });

  it("should remove value from localStorage", () => {
    const { result } = renderHook(() => useLocalStorage("key", "default"));
    act(() => result.current[1]("value"));
    act(() => result.current[2]());
    expect(result.current[0]).toBe("default");
    expect(localStorage.getItem("key")).toBeNull();
  });

  it("should handle objects", () => {
    const { result } = renderHook(() =>
      useLocalStorage("obj", { name: "test" })
    );
    act(() => result.current[1]({ name: "updated" }));
    expect(result.current[0]).toEqual({ name: "updated" });
  });
});
