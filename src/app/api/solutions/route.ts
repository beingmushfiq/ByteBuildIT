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
import type { Solution } from "@/lib/supabase/types";

// ── GET /api/solutions ────────────────────────────────────────────
// List solutions (public: published only).

export async function GET(request: NextRequest) {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { searchParams } = request.nextUrl;

  const status = searchParams.get("status");
  const search = searchParams.get("search");

  try {
    let query = supabase
      .from("solutions")
      .select("*", { count: "exact" });

    if (status !== "all") {
      query = query.eq("is_published", true);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error } = await query
      .order("sort_order", { ascending: true })
      .order("title", { ascending: true });

    if (error) throw error;

    return successResponse((data ?? []) as Solution[], undefined);
  } catch (error) {
    return errorResponse([getSupabaseErrorMessage(error as { code?: string; message: string })], 500);
  }
}

// ── POST /api/solutions ───────────────────────────────────────────
// Create a new solution (admin only).

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
    title: body.title,
    organization_id: body.organization_id,
  });

  if (validationErrors.length > 0) {
    return errorResponse(validationErrors, 422);
  }

  const slug = (body.slug as string) || generateSlug(body.title as string);

  if (!validateSlug(slug)) {
    return errorResponse(
      [{ code: "INVALID_SLUG", message: "Slug must be lowercase alphanumeric with hyphens", field: "slug" }],
      422
    );
  }

  try {
    const { data, error } = await supabase
      .from("solutions")
      .insert({
        organization_id: body.organization_id as string,
        title: body.title as string,
        slug,
        description: (body.description as string) ?? null,
        content: (body.content as string) ?? null,
        icon_name: (body.icon_name as string) ?? null,
        features: (body.features as string[]) ?? null,
        is_published: (body.is_published as boolean) ?? false,
        sort_order: (body.sort_order as number) ?? 0,
      } as never)
      .select()
      .single();

    if (error) throw error;

    return successResponse(data as Solution, undefined, 201);
  } catch (error) {
    return errorResponse([getSupabaseErrorMessage(error as { code?: string; message: string })], 500);
  }
}
