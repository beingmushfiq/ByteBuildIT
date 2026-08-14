import type { NextRequest } from "next/server";
import {
  parsePagination,
  buildPaginationMeta,
  successResponse,
  errorResponse,
  requireAdmin,
  validateRequired,
  getSupabaseErrorMessage,
} from "@/lib/api";
import type { Redirect } from "@/lib/supabase/types";

// ── GET /api/redirects ───────────────────────────────────────────
// List all redirects (admin only).

export async function GET(request: NextRequest) {
  const { supabase, user, isAdmin, error: authError } = await requireAdmin();

  if (!user || !isAdmin) {
    return errorResponse(
      [{ code: "FORBIDDEN", message: authError?.message ?? "Admin access required" }],
      403
    );
  }

  const { searchParams } = request.nextUrl;
  const pagination = parsePagination(searchParams);
  const search = searchParams.get("search");

  try {
    let query = supabase
      .from("redirects")
      .select("*", { count: "exact" });

    if (search) {
      query = query.or(
        `source_path.ilike.%${search}%,target_path.ilike.%${search}%`
      );
    }

    const { data, error, count } = await query
      .order("source_path", { ascending: true })
      .range(pagination.offset, pagination.offset + pagination.limit - 1);

    if (error) throw error;

    const meta = buildPaginationMeta(count ?? 0, pagination);
    return successResponse((data ?? []) as Redirect[], meta);
  } catch (error) {
    return errorResponse([getSupabaseErrorMessage(error as { code?: string; message: string })], 500);
  }
}

// ── POST /api/redirects ──────────────────────────────────────────
// Create a new redirect (admin only). Validates no redirect loops.

export async function POST(request: NextRequest) {
  const { supabase, user, isAdmin, error: authError } = await requireAdmin();

  if (!user || !isAdmin) {
    return errorResponse(
      [{ code: "FORBIDDEN", message: authError?.message ?? "Admin access required" }],
      403
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return errorResponse([{ code: "INVALID_JSON", message: "Request body must be valid JSON" }], 400);
  }

  const validationErrors = validateRequired({
    source_path: body.source_path,
    target_path: body.target_path,
  });

  if (validationErrors.length > 0) {
    return errorResponse(validationErrors, 422);
  }

  const sourcePath = normalizePath(body.source_path as string);
  const targetPath = normalizePath(body.target_path as string);
  const statusCode = (body.status_code as number) || 301;

  // Validate status code
  const validStatusCodes = [301, 302, 307, 308];
  if (!validStatusCodes.includes(statusCode)) {
    return errorResponse(
      [
        {
          code: "INVALID_STATUS",
          message: `Status code must be one of: ${validStatusCodes.join(", ")}`,
          field: "status_code",
        },
      ],
      422
    );
  }

  // Cannot redirect to self
  if (sourcePath === targetPath) {
    return errorResponse(
      [
        {
          code: "REDIRECT_LOOP",
          message: "Source and target paths cannot be the same",
          field: "target_path",
        },
      ],
      422
    );
  }

  // Check for existing redirect with the same source
  const { data: existing } = await supabase
    .from("redirects")
    .select("id")
    .eq("source_path", sourcePath)
    .eq("is_active", true)
    .single();

  if (existing) {
    return errorResponse(
      [
        {
          code: "CONFLICT",
          message: `A redirect already exists for "${sourcePath}"`,
          field: "source_path",
        },
      ],
      409
    );
  }

  // Check for redirect loops: follow the chain to see if target eventually points back to source
  const loopDetected = await detectRedirectLoop(
    supabase,
    sourcePath,
    targetPath
  );

  if (loopDetected) {
    return errorResponse(
      [
        {
          code: "REDIRECT_LOOP",
          message: `Creating this redirect would form a redirect loop`,
          field: "target_path",
        },
      ],
      422
    );
  }

  try {
    const { data, error } = await supabase
      .from("redirects")
      .insert({
        organization_id: user.app_metadata?.org_id ?? "",
        source_path: sourcePath,
        target_path: targetPath,
        status_code: statusCode,
        is_active: body.is_active !== false,
      } as never)
      .select()
      .single();

    if (error) throw error;

    return successResponse(data as Redirect, undefined, 201);
  } catch (error) {
    return errorResponse([getSupabaseErrorMessage(error as { code?: string; message: string })], 500);
  }
}

// ── Helpers ──────────────────────────────────────────────────────

function normalizePath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

async function detectRedirectLoop(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  sourcePath: string,
  initialTarget: string
): Promise<boolean> {
  const visited = new Set<string>([sourcePath]);
  let currentTarget = initialTarget;
  const MAX_DEPTH = 10;

  for (let i = 0; i < MAX_DEPTH; i++) {
    if (visited.has(currentTarget)) {
      return true;
    }

    visited.add(currentTarget);

    const { data } = await supabase
      .from("redirects")
      .select("target_path")
      .eq("source_path", currentTarget)
      .eq("is_active", true)
      .single();

    if (!data) break;

    currentTarget = (data as Redirect).target_path;
  }

  return visited.has(sourcePath);
}
