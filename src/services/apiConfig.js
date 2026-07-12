// Central API base — use VITE_API_URL in production (hosted frontend → backend).
// Local Vite proxy keeps '/api' working when VITE_API_URL is unset.

const raw = (import.meta.env.VITE_API_URL || '').trim().replace(/\/$/, '');

export const API_BASE = raw;

export function apiUrl(path) {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${p}`;
}
