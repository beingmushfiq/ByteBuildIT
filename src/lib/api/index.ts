import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ── Types ─────────────────────────────────────────────────────────

export type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
  errors: ApiError[];
}

export interface ApiError {
  code: string;
  message: string;
  field?: string;
}

// ── Pagination ────────────────────────────────────────────────────

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export function parsePagination(searchParams: URLSearchParams): PaginationParams {
  const page = Math.max(1, parseInt(searchParams.get("page") ?? String(DEFAULT_PAGE), 10) || DEFAULT_PAGE);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseInt(searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT)
  );
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

export function buildPaginationMeta(total: number, params: PaginationParams): PaginationMeta {
  return {
    page: params.page,
    limit: params.limit,
    total,
    totalPages: Math.ceil(total / params.limit),
  };
}

// ── Response builders ─────────────────────────────────────────────

export function successResponse<T>(data: T, meta?: PaginationMeta, status = 200) {
  const body: ApiResponse<T> = { data, errors: [] };
  if (meta) body.meta = meta;
  return NextResponse.json(body, { status });
}

export function errorResponse(errors: ApiError[], status = 400) {
  const body: ApiResponse<null> = { data: null, errors };
  return NextResponse.json(body, { status });
}

export function notFoundResponse(message = "Resource not found") {
  return errorResponse([{ code: "NOT_FOUND", message }], 404);
}

export function unauthorizedResponse(message = "Unauthorized") {
  return errorResponse([{ code: "UNAUTHORIZED", message }], 401);
}

export function forbiddenResponse(message = "Forbidden") {
  return errorResponse([{ code: "FORBIDDEN", message }], 403);
}

export function conflictResponse(message = "Resource already exists") {
  return errorResponse([{ code: "CONFLICT", message }], 409);
}

export function validationError(errors: ApiError[]) {
  return errorResponse(errors, 422);
}

// ── Auth helpers ──────────────────────────────────────────────────

export async function getAuthUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return { supabase, user: null, error };
  }

  return { supabase, user, error: null };
}

export async function requireAdmin() {
  const { supabase, user, error } = await getAuthUser();

  if (!user) {
    return { supabase, user: null, isAdmin: false, error: error ?? new Error("Not authenticated") };
  }

  // Check if user has admin role via organization membership
  const { data: userData } = await supabase
    .from("users")
    .select("role_id, roles!inner(name)")
    .eq("id", user.id)
    .single();

  const isAdmin = (userData as unknown as { roles?: { name: string } } | null)?.roles?.name === "admin";

  return { supabase, user, isAdmin, error: null };
}

// ── Input validation ──────────────────────────────────────────────

export function validateRequired(fields: Record<string, unknown>): ApiError[] {
  const errors: ApiError[] = [];
  for (const [field, value] of Object.entries(fields)) {
    if (value === undefined || value === null || (typeof value === "string" && value.trim() === "")) {
      errors.push({
        code: "REQUIRED",
        message: `${field} is required`,
        field,
      });
    }
  }
  return errors;
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

// ── Slug generation ───────────────────────────────────────────────

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ── Database helpers ──────────────────────────────────────────────

export function getSupabaseErrorMessage(error: { code?: string; message: string }): ApiError {
  switch (error.code) {
    case "23505":
      return { code: "DUPLICATE", message: "A record with this value already exists" };
    case "23503":
      return { code: "REFERENCE", message: "Referenced record does not exist" };
    case "PGRST116":
      return { code: "NOT_FOUND", message: "Record not found" };
    default:
      return { code: "DATABASE_ERROR", message: error.message };
  }
}
