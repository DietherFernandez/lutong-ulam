// Centralized error-message helper for the admin pages.
// Works for both axios-style errors and Supabase errors.
export function getErrorMessage(err: unknown, fallback = 'Something went wrong'): string {
  if (typeof err === 'object' && err !== null) {
    const e = err as Record<string, unknown>;
    if (e.response) {
      const resp = e.response as Record<string, unknown>;
      if (typeof resp.data === 'object' && resp.data !== null) {
        const data = resp.data as Record<string, unknown>;
        if (typeof data.error === 'string') return data.error;
      }
      if (typeof resp.status === 'number') return `Request failed (HTTP ${resp.status})`;
    }
    if (typeof e.message === 'string') return e.message;
  }
  if (typeof err === 'string') return err;
  return fallback;
}
