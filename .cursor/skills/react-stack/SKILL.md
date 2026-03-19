---
name: react-stack
description: React 18 + TypeScript in this workspace. Use when implementing or reviewing React code, hooks, React Query, or presentational components. Follows feature-based structure, UI without business logic, logic in services.
---

# React stack (this workspace)

## Stack

- **React 18** with **TypeScript** (strict).
- **React Query** (`@tanstack/react-query`) for server state (fetch, cache, loading/error).
- **Vite** for build and dev (app: `apps/web`).

## Conventions

1. **Presentational UI**: Components receive data via props; no direct API calls or business rules in components.
2. **Logic in services**: API calls and data shaping live in services; hooks (e.g. `useQuery`) use those services.
3. **Feature-based**: Group by feature (e.g. `file-browser/`) with components, hooks, and services inside.
4. **Named exports**: Prefer `export const Component`; file name matches main export.
5. **Typing**: No `any`; type props, state, and API responses explicitly.

## React Query usage

- Wrap the app with `QueryClientProvider` (already in `main.tsx`).
- Use `useQuery` for GET; call a **service** from the query function, not inline fetch in the component.
- Use query keys that reflect the resource (e.g. `['fileListing', path]`).

## Example (pattern)

```ts
// service
export const getHello = (): Promise<{ message: string }> =>
  fetch('/api').then((r) => r.json());

// hook
export const useHello = () => useQuery({ queryKey: ['hello'], queryFn: getHello });

// component (presentational)
export const HelloMessage = ({ message }: { message: string }) => <p>{message}</p>;
```

Apply these patterns when adding or changing React code in this repo.
