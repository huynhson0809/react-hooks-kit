# API Reference — v1.0

Public API surface for **react-hookz-kit**. All exports are named and tree-shakeable.

---

## useToggle

```ts
function useToggle(initialValue?: boolean): [boolean, () => void]
```

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `initialValue` | `boolean` | `false` | Starting state |

**Returns** `[value, toggle]` — current boolean and a stable toggle function.

---

## useLocalStorage

```ts
function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>, () => void]
```

| Param | Type | Description |
|-------|------|-------------|
| `key` | `string` | localStorage key |
| `initialValue` | `T` | Fallback when key is not found |

**Returns** `[storedValue, setValue, removeValue]`

| Return | Type | Description |
|--------|------|-------------|
| `storedValue` | `T` | Current value (from storage or initial) |
| `setValue` | `(value: T \| (prev: T) => T) => void` | Update value (supports updater function) |
| `removeValue` | `() => void` | Remove key from localStorage and reset to initial |

---

## useDebounce

```ts
function useDebounce<T>(value: T, delay: number): T
```

| Param | Type | Description |
|-------|------|-------------|
| `value` | `T` | Value to debounce |
| `delay` | `number` | Delay in milliseconds |

**Returns** the debounced value. Updates only after `delay` ms of inactivity.

---

## useFetch

```ts
function useFetch<T>(url: string, options?: UseFetchOptions): UseFetchReturn<T>
```

| Param | Type | Description |
|-------|------|-------------|
| `url` | `string` | Fetch URL |
| `options.enabled` | `boolean` | Skip fetch when `false` (default `true`) |
| `options.*` | `RequestInit` | Standard fetch options (method, headers, body, etc.) |

**Returns**

| Field | Type | Description |
|-------|------|-------------|
| `data` | `T \| null` | Resolved data |
| `error` | `Error \| null` | Error if fetch failed |
| `loading` | `boolean` | `true` while fetching |
| `refetch` | `() => void` | Manually re-trigger the fetch |

Automatically aborts in-flight requests on unmount or URL change.

---

## useMediaQuery

```ts
function useMediaQuery(query: string): boolean
```

| Param | Type | Description |
|-------|------|-------------|
| `query` | `string` | CSS media query string |

**Returns** `true` when the media query matches. Updates live on viewport changes. SSR-safe (returns `false` on server).

---

## useClickOutside

```ts
function useClickOutside<T extends HTMLElement>(handler: () => void): RefObject<T | null>
```

| Param | Type | Description |
|-------|------|-------------|
| `handler` | `() => void` | Called on click/touch outside the referenced element |

**Returns** a `ref` to attach to the target element. Listens to both `mousedown` and `touchstart`.

---

## usePrevious

```ts
function usePrevious<T>(value: T): T | undefined
```

| Param | Type | Description |
|-------|------|-------------|
| `value` | `T` | Current value to track |

**Returns** the value from the previous render. `undefined` on first render.

---

## useInterval

```ts
function useInterval(callback: () => void, delay: number | null): void
```

| Param | Type | Description |
|-------|------|-------------|
| `callback` | `() => void` | Function to call on each interval tick |
| `delay` | `number \| null` | Interval in ms. Pass `null` to pause |

Always uses the latest `callback` without restarting the interval. Cleans up on unmount.

---

## Stability

v1.x API is frozen. Breaking changes only in major versions — see [CHANGELOG.md](../CHANGELOG.md).
