# Hook Guide

Patterns and recipes for common use cases with **react-hookz-kit**.

---

## Combining hooks

Hooks compose naturally. Here are real-world patterns:

### Dark mode with persistence

```tsx
import { useLocalStorage, useMediaQuery } from "react-hookz-kit";

function useDarkMode() {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const [stored, setStored] = useLocalStorage<"light" | "dark" | "system">(
    "theme",
    "system"
  );

  const isDark = stored === "system" ? prefersDark : stored === "dark";

  return { isDark, theme: stored, setTheme: setStored } as const;
}
```

### Search with debounce + fetch

```tsx
import { useState } from "react";
import { useDebounce, useFetch } from "react-hookz-kit";

function useSearch(endpoint: string) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const { data, loading } = useFetch<SearchResult[]>(
    `${endpoint}?q=${encodeURIComponent(debouncedQuery)}`,
    { enabled: debouncedQuery.length > 0 }
  );

  return { query, setQuery, results: data, loading };
}
```

### Dropdown with click outside

```tsx
import { useState } from "react";
import { useClickOutside, useToggle } from "react-hookz-kit";

function Dropdown({ items }: { items: string[] }) {
  const [open, toggle] = useToggle(false);
  const ref = useClickOutside<HTMLDivElement>(() => {
    if (open) toggle();
  });

  return (
    <div ref={ref}>
      <button onClick={toggle}>Menu</button>
      {open && (
        <ul>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### Auto-save with interval

```tsx
import { useRef } from "react";
import { useInterval, usePrevious } from "react-hookz-kit";

function useAutoSave(data: object, saveFn: (d: object) => Promise<void>) {
  const prev = usePrevious(data);
  const dirty = useRef(false);

  if (prev && JSON.stringify(prev) !== JSON.stringify(data)) {
    dirty.current = true;
  }

  useInterval(
    async () => {
      if (dirty.current) {
        await saveFn(data);
        dirty.current = false;
      }
    },
    dirty.current ? 5000 : null
  );
}
```

---

## SSR considerations

| Hook | SSR behavior |
|------|-------------|
| `useMediaQuery` | Returns `false` on server (no `window`) |
| `useLocalStorage` | Returns `initialValue` on server |
| `useClickOutside` | No-op on server (no `document`) |
| `useFetch` | Runs on client only (uses `useEffect`) |
| All others | Safe — pure React state |

---

## Bundle size

Each hook is in its own file. With tree-shaking (Vite, webpack 5+, Rollup):

```tsx
// Only useToggle code is included in your bundle
import { useToggle } from "react-hookz-kit";
```

Unused hooks are completely eliminated. Typical per-hook cost: **200–500 bytes** minified.
