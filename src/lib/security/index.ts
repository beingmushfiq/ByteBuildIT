// ── Security Utilities ────────────────────────────────────────────
// Pure utility functions for input sanitization, CSRF protection,
// rate limiting, and file validation.

// ── Input Sanitization ───────────────────────────────────────────

/** Strip characters that could be used for XSS or injection attacks. */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, "") // Strip angle brackets (HTML/JSX injection)
    .replace(/javascript:/gi, "") // Strip javascript: protocol
    .replace(/on\w+\s*=/gi, "") // Strip inline event handlers
    .replace(/data:/gi, "") // Strip data: URIs
    .replace(/vbscript:/gi, "") // Strip vbscript: protocol
    .replace(/\0/g, "") // Strip null bytes
    .trim();
}

// ── CSRF Protection ──────────────────────────────────────────────

/** Generate a random CSRF token (32 hex characters). */
export function generateCSRFToken(): string {
  const array = new Uint8Array(16);
  // Use crypto.getRandomValues if available (browser/Node 19+), fallback to Math.random
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/** Simple CSRF token comparison. Uses timing-safe comparison internally. */
export function validateCSRFToken(token: string, session: string): boolean {
  if (!token || !session) return false;
  if (token.length !== session.length) return false;

  // Constant-time comparison to prevent timing attacks
  let result = 0;
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ session.charCodeAt(i);
  }
  return result === 0;
}

// ── Rate Limiting ────────────────────────────────────────────────

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/** Clean up expired entries periodically (max 1000 entries). */
function cleanupStore(): void {
  if (rateLimitStore.size <= 1000) return;

  const now = Date.now();
  for (const [key, entry] of rateLimitStore) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * In-memory sliding-window rate limiter.
 * Returns `true` if the request is allowed, `false` if rate limit exceeded.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetAt: number } {
  cleanupStore();

  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    // New window
    const resetAt = now + windowMs;
    rateLimitStore.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

// ── File Validation ──────────────────────────────────────────────

/** Check if a file's MIME type matches the allowed list. */
export function validateMimeType(
  file: { type: string },
  allowed: string[]
): boolean {
  if (!file.type || allowed.length === 0) return false;
  return allowed.some(
    (mime) => file.type === mime || file.type.startsWith(mime.replace(/\*$/, ""))
  );
}

/** Check if a file's size is within the maximum allowed (in MB). */
export function validateFileSize(
  file: { size: number },
  maxSizeMB: number
): boolean {
  const maxBytes = maxSizeMB * 1024 * 1024;
  return file.size > 0 && file.size <= maxBytes;
}
