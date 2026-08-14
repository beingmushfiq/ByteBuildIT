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
import type { Industry } from "@/lib/supabase/types";

// ── GET /api/industries/[slug] ────────────────────────────────────

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("industries")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      return notFoundResponse(`Industry "${slug}" not found`);
    }

    return successResponse(data as Industry);
  } catch (error) {
    return errorResponse([getSupabaseErrorMessage(error as { code?: string; message: string })], 500);
  }
}

// ── PUT /api/industries/[slug] ────────────────────────────────────

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
  const allowedFields = ["name", "description", "icon_name", "is_published", "sort_order"] as const;

  for (const field of allowedFields) {
    if (field in body) {
      updateData[field] = body[field];
    }
  }

  if (body.name && !body.slug) {
    updateData.slug = generateSlug(body.name as string);
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
      .from("industries")
      .update(updateData as never)
      .eq("slug", slug)
      .select()
      .single();

    if (error) throw error;
    if (!data) return notFoundResponse(`Industry "${slug}" not found`);

    return successResponse(data as Industry);
  } catch (error) {
    return errorResponse([getSupabaseErrorMessage(error as { code?: string; message: string })], 500);
  }
}

// ── DELETE /api/industries/[slug] ─────────────────────────────────

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
      .from("industries")
      .delete()
      .eq("slug", slug)
      .select()
      .single();

    if (error) throw error;
    if (!data) return notFoundResponse(`Industry "${slug}" not found`);

    return successResponse(data as Industry);
  } catch (error) {
    return errorResponse([getSupabaseErrorMessage(error as { code?: string; message: string })], 500);
  }
}
