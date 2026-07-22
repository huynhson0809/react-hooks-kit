import { useState, useEffect, useCallback, useRef } from "react";

interface FetchState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

interface UseFetchOptions extends RequestInit {
  enabled?: boolean;
}

interface UseFetchReturn<T> extends FetchState<T> {
  refetch: () => void;
}

export function useFetch<T = unknown>(
  url: string,
  options: UseFetchOptions = {}
): UseFetchReturn<T> {
  const { enabled = true, ...fetchOptions } = options;
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    error: null,
    loading: false,
  });
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = (await response.json()) as T;
      setState({ data, error: null, loading: false });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setState({
        data: null,
        error: error instanceof Error ? error : new Error(String(error)),
        loading: false,
      });
    }
  }, [url]);

  useEffect(() => {
    if (!enabled) return;
    fetchData();
    return () => abortControllerRef.current?.abort();
  }, [fetchData, enabled]);

  return { ...state, refetch: fetchData };
}
