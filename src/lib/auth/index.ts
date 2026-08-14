import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Permission } from "./permissions";

// ── Types ─────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  orgId: string;
  roleId: string;
  roleName: string;
  departmentId: string | null;
  isActive: boolean;
  permissions: Permission[];
}

// ── Request-lifetime cache ────────────────────────────────────────
// WeakMap keyed by the Supabase client so each request only fetches once.

const userCache = new WeakMap<object, Promise<AuthUser | null>>();

// ── Core ──────────────────────────────────────────────────────────

/**
 * Get the current authenticated user with role and permissions.
 * Returns `null` if not authenticated or user profile is missing.
 * Results are cached for the lifetime of the Supabase client (request).
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = await createClient();

  const existing = userCache.get(supabase);
  if (existing) return existing;

  const promise = fetchCurrentUser(supabase);
  userCache.set(supabase, promise);
  return promise;
}

async function fetchCurrentUser(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any
): Promise<AuthUser | null> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return null;

  // Fetch CMS profile with role and permissions
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select(
      `
      id,
      email,
      name,
      avatar_url,
      org_id,
      role_id,
      department_id,
      is_active,
      roles!inner (
        id,
        name,
        slug
      )
    `
    )
    .eq("id", user.id)
    .single();

  if (profileError || !profile) return null;
  if (!profile.is_active) return null;

  // Fetch permissions via role_permissions → permissions
  const { data: rolePerms } = await supabase
    .from("role_permissions")
    .select("permissions (name)")
    .eq("role_id", profile.role_id);

  const permissions: Permission[] = (rolePerms ?? [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((rp: any) => rp.permissions?.name)
    .filter((name: string | undefined): name is Permission => Boolean(name));

  const role = profile.roles as { id: string; name: string; slug: string };

  return {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    avatarUrl: profile.avatar_url,
    orgId: profile.org_id,
    roleId: profile.role_id,
    roleName: role.name,
    departmentId: profile.department_id,
    isActive: profile.is_active,
    permissions,
  };
}

// ── Guards ────────────────────────────────────────────────────────

/**
 * Throws if the user is not authenticated.
 * Returns the authenticated AuthUser on success.
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthError("UNAUTHORIZED", "You must be signed in to access this resource.");
  }
  return user;
}

/**
 * Throws if the user does not have the specified role.
 * Returns the authenticated AuthUser on success.
 */
export async function requireRole(role: string): Promise<AuthUser> {
  const user = await requireAuth();
  if (user.roleName !== role) {
    throw new AuthError(
      "FORBIDDEN",
      `This action requires the "${role}" role. Your current role is "${user.roleName}".`
    );
  }
  return user;
}

/**
 * Throws if the user is missing the specified permission.
 * Returns the authenticated AuthUser on success.
 */
export async function requirePermission(permission: string): Promise<AuthUser> {
  const user = await requireAuth();
  if (!hasPermission(user, permission)) {
    throw new AuthError(
      "FORBIDDEN",
      `You do not have the "${permission}" permission.`
    );
  }
  return user;
}

// ── Pure check helpers ────────────────────────────────────────────

/** Check whether a user has a specific permission. */
export function hasPermission(user: AuthUser, permission: string): boolean {
  return user.permissions.includes(permission as Permission);
}

/** Check whether a user has a specific role. */
export function hasRole(user: AuthUser, role: string): boolean {
  return user.roleName === role;
}

// ── Error class ───────────────────────────────────────────────────

export class AuthError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "AuthError";
    this.code = code;
  }
}
