import { useState, useEffect } from 'react';

/**
 * Lightweight in-memory pub/sub for broadcasting data-change signals.
 * When any part of the app (e.g. admin save) calls `broadcastRefresh()`, every
 * `useAutoRefresh` listener on the page will re-fetch automatically — even
 * without a page reload or tab switch.
 *
 * Usage:
 *   import { broadcastRefresh } from '../hooks/useFetch';
 *   broadcastRefresh();        // in admin save handler
 */
type Listener = () => void;
const listeners = new Set<Listener>();

export function broadcastRefresh() {
  listeners.forEach((fn) => fn());
}

function subscribeToRefresh(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Normalise an error to a human-readable string.
// Handles both axios-style errors (err.response?.data?.error)
// and Supabase errors (err.message).
function getErrorMessage(err: unknown): string {
  if (typeof err === 'object' && err !== null) {
    const e = err as Record<string, unknown>;
    // Axios-style.
    if (e.response) {
      const resp = e.response as Record<string, unknown>;
      if (typeof resp.data === 'object' && resp.data !== null) {
        const data = resp.data as Record<string, unknown>;
        if (typeof data.error === 'string') return data.error;
      }
      if (typeof resp.status === 'number') return `Request failed (HTTP ${resp.status})`;
    }
    // Supabase / generic.
    if (typeof e.message === 'string') return e.message;
  }
  if (typeof err === 'string') return err;
  return 'Something went wrong. Please try again.';
}

export function useFetch<T>(
  fetchFn: () => Promise<T>,
  deps: unknown[] = [],
  options: { autoRefresh?: boolean } = { autoRefresh: true }
): UseFetchResult<T> {
  const { autoRefresh = true } = options;
  const [data, setData]       = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]    = useState<string | null>(null);
  const [reload, setReload]  = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchFn()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reload]);

  // Auto-refresh: re-fetch when the tab regains focus (e.g. admin switches
  // back to the public site) and when any part of the app calls
  // broadcastRefresh() (e.g. admin saves a new setting).
  useEffect(() => {
    if (!autoRefresh) return;

    const onFocus = () => setReload((n) => n + 1);
    const unsubBroadcast = subscribeToRefresh(() => onFocus());

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);

    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
      unsubBroadcast();
    };
  }, [autoRefresh]);

  return {
    data,
    loading,
    error,
    refetch: () => setReload((n) => n + 1),
  };
}
