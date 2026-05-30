const requests = new Map<string, number[]>();

const WINDOW_MS  = 60_000; // 1 minute
const MAX_REQ    = 20;     // 20 requests per minute per IP

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now  = Date.now();
  const hits = (requests.get(ip) ?? []).filter(t => now - t < WINDOW_MS);

  if (hits.length >= MAX_REQ) {
    return { allowed: false, remaining: 0 };
  }

  hits.push(now);
  requests.set(ip, hits);
  return { allowed: true, remaining: MAX_REQ - hits.length };
}
