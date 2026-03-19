import { useHelloQuery } from './api/useHelloQuery';

/** Presentational: displays a single message (no business logic). */
export const HelloMessage = ({ message }: { message: string }) => (
  <p data-testid="hello-message">{message}</p>
);

/**
 * Connection test: fetches message from API and renders it.
 * Not spec-driven; only validates API ↔ React connectivity.
 */
const isConnectionError = (err: unknown): boolean => {
  const msg = err instanceof Error ? err.message : String(err);
  return /failed to fetch|network error|connection refused|econnrefused/i.test(msg);
};

export function HelloFromApi() {
  const { data, isPending, isError, error } = useHelloQuery();

  if (isPending) return <HelloMessage message="Loading…" />;
  if (isError) {
    const message = isConnectionError(error)
      ? 'API not available. Start it with: npm run serve:api'
      : `Error: ${error instanceof Error ? error.message : String(error)}`;
    return <HelloMessage message={message} />;
  }
  return <HelloMessage message={data?.message ?? '—'} />;
}
