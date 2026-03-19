## Context

The web app lists directories via `GET /api/listing?path=…` using a debounced path input. The archived spec `file-browser-listing-ui` defined debounce, Enter/Tab, and presentational listing. This change focuses on **layout**, **client-side filtering** of the current result set, **input limits**, and **English-only user feedback** via toasts and timed hints.

## Goals / Non-Goals

**Goals:**

- Horizontally balanced layout on common breakpoints (mobile through wide desktop).
- Prefix filter (case-insensitive) on **names** of entries returned for the **current resolved listing path**, active only when the path input contains **≥ 3** characters (filter applied to the last path segment’s “search term” or the whole string — see Decisions).
- **200** character hard cap on path input.
- **404** from listing API → user-visible **toast** in English with a friendly explanation.
- If input length is **1** and **3 seconds** elapse without change → **toast or inline** English message that **3 characters minimum** are needed for filtering (not blocking listing of the resolved path).

**Non-Goals:**

- New backend “search” or glob endpoints.
- Fuzzy/Levenshtein matching beyond simple prefix on names.
- Changing HTTP status codes or Nest exception types for 404.

## Decisions

1. **Listing path vs name filter (single input)**

   **Decision:** Parse the trimmed input (max 200 chars) into:

   - **`listingWirePath`**: Wire path sent to `GET /api/listing?path=…`.
   - **`namePrefix`**: Optional filter on `entry.name` (client-side only).

   Rules:

   - If the input contains **`/`**: `listingWirePath` = all segments except the last, joined with `/` (empty means root). `namePrefix` = the segment after the final `/`. If `namePrefix.length >= 3`, filter the returned entries by **case-insensitive prefix** on `name`. If `namePrefix.length` is 0–2, do **not** filter (show full listing for `listingWirePath`).
   - If the input contains **no** `/`: `listingWirePath` = `""` (root). `namePrefix` = the full input. If `namePrefix.length >= 3`, filter root listing by prefix; otherwise show full root listing.

   Debounce / Enter / Tab apply to fetching **`listingWirePath`** (same as today’s “path” semantics, but derived from the split above instead of raw string equals path).

   **Alternative considered:** Send the full string to the API always — rejected because short tokens like `app` are not valid directory paths and would 404.

2. **Layout**

   **Decision:** Use Chakra `Container` with `centerContent` or horizontal `margin: auto` / `maxW` with **equal** `px` on left and right, or a `Box` wrapper with `width="100%"` and `px` symmetric; verify `container.md` vs `container.lg` vs full width with padding. Prefer **centered** column on xl screens.

3. **404 → Toast**

   **Decision:** In the React Query `onError` or component `useEffect` watching `error`, when status is 404 (from `fetch` or parsed message), call Chakra **toast** with English title/body; keep or remove duplicate inline error per spec tasks.

4. **One character + 3 seconds**

   **Decision:** `useEffect` + timer: when `pathInput.length === 1`, start **3s** timer; clear on unmount or when length changes; fire **once** per “session” of length-1 or debounce resets — spec will require single feedback per stable single-char state.

## Risks / Trade-offs

- **Path vs filter parsing** → Users familiar with “full path only” may need helper text; mitigate with placeholder/help copy in English.
- **Root + short input** → Listing is root; filter hides non-matches; **mitigation:** tests for `app` vs `applications`.
- **Toast noise** → Limit 404 toasts to one per failed request; throttle duplicate “need 3 letters” toasts.

## Migration Plan

Deploy web only; no DB or API migration. Rollback: revert web PR.

## Open Questions

- Whether Tab/Enter should commit **filter-only** vs **navigate into** first match — **out of scope** unless tasks add keyboard navigation.
