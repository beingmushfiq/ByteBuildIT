import type { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  requireAdmin,
  validateSlug,
  generateSlug,
  getSupabaseErrorMessage,
} from "@/lib/api";
import type { Solution } from "@/lib/supabase/types";

// ── GET /api/solutions/[slug] ─────────────────────────────────────

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("solutions")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      return notFoundResponse(`Solution "${slug}" not found`);
    }

    return successResponse(data as Solution);
  } catch (error) {
    return errorResponse([getSupabaseErrorMessage(error as { code?: string; message: string })], 500);
  }
}

// ── PUT /api/solutions/[slug] ─────────────────────────────────────

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
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

  const updateData: Record<string, unknown> = {};
  const allowedFields = [
    "title", "description", "content", "icon_name", "features",
    "is_published", "sort_order",
  ] as const;

  for (const field of allowedFields) {
    if (field in body) {
      updateData[field] = body[field];
    }
  }

  if (body.title && !body.slug) {
    updateData.slug = generateSlug(body.title as string);
  }

  if (body.slug) {
    const newSlug = body.slug as string;
    if (!validateSlug(newSlug)) {
      return errorResponse(
        [{ code: "INVALID_SLUG", message: "Slug must be lowercase alphanumeric with hyphens", field: "slug" }],
        422
      );
    }
    updateData.slug = newSlug;
  }

  updateData.updated_at = new Date().toISOString();

  try {
    const { data, error } = await supabase
      .from("solutions")
      .update(updateData as never)
      .eq("slug", slug)
      .select()
      .single();

    if (error) throw error;
    if (!data) return notFoundResponse(`Solution "${slug}" not found`);

    return successResponse(data as Solution);
  } catch (error) {
    return errorResponse([getSupabaseErrorMessage(error as { code?: string; message: string })], 500);
  }
}

// ── DELETE /api/solutions/[slug] ──────────────────────────────────

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { supabase, user, isAdmin, error: authError } = await requireAdmin();

  if (!user || !isAdmin) {
    return errorResponse(
      [{ code: "FORBIDDEN", message: authError?.message ?? "Admin access required" }],
      403
    );
  }

  try {
    const { data, error } = await supabase
      .from("solutions")
      .delete()
      .eq("slug", slug)
      .select()
      .single();

    if (error) throw error;
    if (!data) return notFoundResponse(`Solution "${slug}" not found`);

    return successResponse(data as Solution);
  } catch (error) {
    return errorResponse([getSupabaseErrorMessage(error as { code?: string; message: string })], 500);
  }
}
