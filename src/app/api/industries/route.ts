import type { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  requireAdmin,
  validateRequired,
  validateSlug,
  generateSlug,
  getSupabaseErrorMessage,
} from "@/lib/api";
import type { Industry } from "@/lib/supabase/types";

// ── GET /api/industries ───────────────────────────────────────────
// List industries (public: published only).

export async function GET(request: NextRequest) {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { searchParams } = request.nextUrl;

  const status = searchParams.get("status");
  const search = searchParams.get("search");

  try {
    let query = supabase
      .from("industries")
      .select("*", { count: "exact" });

    if (status !== "all") {
      query = query.eq("is_published", true);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error } = await query
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) throw error;

    return successResponse((data ?? []) as Industry[], undefined);
  } catch (error) {
    return errorResponse([getSupabaseErrorMessage(error as { code?: string; message: string })], 500);
  }
}

// ── POST /api/industries ──────────────────────────────────────────
// Create a new industry (admin only).

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
    name: body.name,
    organization_id: body.organization_id,
  });

  if (validationErrors.length > 0) {
    return errorResponse(validationErrors, 422);
  }

  const slug = (body.slug as string) || generateSlug(body.name as string);

  if (!validateSlug(slug)) {
    return errorResponse(
      [{ code: "INVALID_SLUG", message: "Slug must be lowercase alphanumeric with hyphens", field: "slug" }],
      422
    );
  }

  try {
    const { data, error } = await supabase
      .from("industries")
      .insert({
        organization_id: body.organization_id as string,
        name: body.name as string,
        slug,
        description: (body.description as string) ?? null,
        icon_name: (body.icon_name as string) ?? null,
        is_published: (body.is_published as boolean) ?? false,
        sort_order: (body.sort_order as number) ?? 0,
      } as never)
      .select()
      .single();

    if (error) throw error;

    return successResponse(data as Industry, undefined, 201);
  } catch (error) {
    return errorResponse([getSupabaseErrorMessage(error as { code?: string; message: string })], 500);
  }
}
