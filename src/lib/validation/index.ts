// ── Schema Validation Utilities ───────────────────────────────────
// Pure TypeScript validators with no external dependencies.

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

// ── Email ────────────────────────────────────────────────────────

/**
 * Validate an email address against a practical RFC-compliant pattern.
 * Accepts standard formats like user@domain.com, user.name+tag@sub.domain.co
 */
export function validateEmail(email: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!email || email.trim().length === 0) {
    errors.push({ field: "email", message: "Email is required" });
    return { valid: false, errors };
  }

  const trimmed = email.trim();

  if (trimmed.length > 254) {
    errors.push({ field: "email", message: "Email must be 254 characters or less" });
    return { valid: false, errors };
  }

  // Standard email pattern: local@domain with valid characters
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(trimmed)) {
    errors.push({ field: "email", message: "Please enter a valid email address" });
    return { valid: false, errors };
  }

  // Must have at least one dot in the domain part
  const domain = trimmed.split("@")[1];
  if (!domain || !domain.includes(".")) {
    errors.push({ field: "email", message: "Please enter a valid email address" });
    return { valid: false, errors };
  }

  return { valid: true, errors: [] };
}

// ── Phone ────────────────────────────────────────────────────────

/**
 * Validate a phone number. Accepts international format (+ prefix)
 * and common local formats. Strips common separators before checking.
 */
export function validatePhone(phone: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!phone || phone.trim().length === 0) {
    errors.push({ field: "phone", message: "Phone number is required" });
    return { valid: false, errors };
  }

  // Strip common separators
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, "");

  // Must be at least 7 digits (shortest international)
  if (!/^\+?\d{7,15}$/.test(cleaned)) {
    errors.push({ field: "phone", message: "Please enter a valid phone number" });
    return { valid: false, errors };
  }

  return { valid: true, errors: [] };
}

// ── URL ──────────────────────────────────────────────────────────

/** Validate a URL string. Requires a valid protocol (http/https). */
export function validateURL(url: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!url || url.trim().length === 0) {
    errors.push({ field: "url", message: "URL is required" });
    return { valid: false, errors };
  }

  const trimmed = url.trim();

  try {
    const parsed = new URL(trimmed);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      errors.push({ field: "url", message: "URL must use http or https protocol" });
      return { valid: false, errors };
    }
  } catch {
    errors.push({ field: "url", message: "Please enter a valid URL" });
    return { valid: false, errors };
  }

  return { valid: true, errors: [] };
}

// ── Slug ─────────────────────────────────────────────────────────

/**
 * Validate a URL slug. Must be lowercase alphanumeric with hyphens only.
 * Cannot start or end with a hyphen.
 */
export function validateSlug(slug: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!slug || slug.trim().length === 0) {
    errors.push({ field: "slug", message: "Slug is required" });
    return { valid: false, errors };
  }

  const trimmed = slug.trim();

  if (trimmed.length > 128) {
    errors.push({ field: "slug", message: "Slug must be 128 characters or less" });
    return { valid: false, errors };
  }

  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  if (!slugRegex.test(trimmed)) {
    errors.push({
      field: "slug",
      message: "Slug must contain only lowercase letters, numbers, and hyphens",
    });
    return { valid: false, errors };
  }

  return { valid: true, errors: [] };
}

// ── Required ─────────────────────────────────────────────────────

/** Validate that a value is not empty/undefined/null. */
export function validateRequired(
  value: unknown,
  fieldName: string
): ValidationResult {
  const errors: ValidationError[] = [];

  if (value === undefined || value === null) {
    errors.push({ field: fieldName, message: `${fieldName} is required` });
    return { valid: false, errors };
  }

  if (typeof value === "string" && value.trim().length === 0) {
    errors.push({ field: fieldName, message: `${fieldName} is required` });
    return { valid: false, errors };
  }

  return { valid: true, errors: [] };
}

// ── Length ───────────────────────────────────────────────────────

/** Validate that a string value is within the specified length range. */
export function validateLength(
  value: string,
  min: number,
  max: number,
  fieldName: string
): ValidationResult {
  const errors: ValidationError[] = [];

  if (!value || value.trim().length === 0) {
    errors.push({ field: fieldName, message: `${fieldName} is required` });
    return { valid: false, errors };
  }

  const length = value.trim().length;

  if (length < min) {
    errors.push({
      field: fieldName,
      message: `${fieldName} must be at least ${min} characters`,
    });
    return { valid: false, errors };
  }

  if (length > max) {
    errors.push({
      field: fieldName,
      message: `${fieldName} must be ${max} characters or less`,
    });
    return { valid: false, errors };
  }

  return { valid: true, errors: [] };
}

// ── Batch Validation ─────────────────────────────────────────────

/** Run multiple validation results and combine their errors. */
export function combineResults(...results: ValidationResult[]): ValidationResult {
  const errors = results.flatMap((r) => r.errors);
  return { valid: errors.length === 0, errors };
}
