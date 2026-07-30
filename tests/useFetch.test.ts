import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useFetch } from "../src/useFetch";

const mockFetch = vi.fn();

describe("useFetch", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
    mockFetch.mockReset();
  });

  it("should fetch data successfully", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ name: "test" }),
    });

    const { result } = renderHook(() => useFetch("https://api.example.com"));

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual({ name: "test" });
    expect(result.current.error).toBeNull();
  });

  it("should handle fetch error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });

    const { result } = renderHook(() => useFetch("https://api.example.com"));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error?.message).toBe("HTTP 404: Not Found");
    expect(result.current.data).toBeNull();
  });

  it("should not fetch when enabled is false", () => {
    const { result } = renderHook(() =>
      useFetch("https://api.example.com", { enabled: false })
    );

    expect(result.current.loading).toBe(false);
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
