import type { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  requireAdmin,
  getSupabaseErrorMessage,
} from "@/lib/api";
import type { Media } from "@/lib/supabase/types";

// ── GET /api/media/[id] ──────────────────────────────────────────
// Get a single media item by ID.

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { supabase, user, isAdmin, error: authError } = await requireAdmin();

  if (!user || !isAdmin) {
    return errorResponse(
      [{ code: "FORBIDDEN", message: authError?.message ?? "Admin access required" }],
      403
    );
  }

  try {
    const { data, error } = await supabase
      .from("media")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return notFoundResponse(`Media item "${id}" not found`);
    }

    return successResponse(data as Media);
  } catch (error) {
    return errorResponse([getSupabaseErrorMessage(error as { code?: string; message: string })], 500);
  }
}

// ── PUT /api/media/[id] ──────────────────────────────────────────
// Update media metadata (alt text, caption).

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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
  const allowedFields = ["alt_text", "caption"] as const;

  for (const field of allowedFields) {
    if (field in body) {
      updateData[field] = body[field] ?? null;
    }
  }

  if (Object.keys(updateData).length === 0) {
    return errorResponse(
      [{ code: "NO_CHANGES", message: "No valid fields to update" }],
      422
    );
  }

  updateData.updated_at = new Date().toISOString();

  try {
    const { data, error } = await supabase
      .from("media")
      .update(updateData as never)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return notFoundResponse(`Media item "${id}" not found`);

    return successResponse(data as Media);
  } catch (error) {
    return errorResponse([getSupabaseErrorMessage(error as { code?: string; message: string })], 500);
  }
}

// ── DELETE /api/media/[id] ───────────────────────────────────────
// Delete media from storage and database.

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { supabase, user, isAdmin, error: authError } = await requireAdmin();

  if (!user || !isAdmin) {
    return errorResponse(
      [{ code: "FORBIDDEN", message: authError?.message ?? "Admin access required" }],
      403
    );
  }

  try {
    // Fetch the media record to get the storage URL
    const { data: media, error: fetchError } = await supabase
      .from("media")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !media) {
      return notFoundResponse(`Media item "${id}" not found`);
    }

    const mediaRecord = media as Media;

    // Extract storage path from the URL
    // URL format: .../storage/v1/object/public/media/filename
    const storagePathMatch = mediaRecord.original_url.match(
      /\/storage\/v1\/object\/public\/media\/(.+)$/
    );

    if (storagePathMatch) {
      const storagePath = decodeURIComponent(storagePathMatch[1]);
      const { error: storageError } = await supabase.storage
        .from("media")
        .remove([storagePath]);

      // Don't fail the whole request if storage deletion fails
      // (file might have been deleted already)
      if (storageError) {
        console.warn("Storage deletion warning:", storageError.message);
      }
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from("media")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    return successResponse({ id } as { id: string });
  } catch (error) {
    return errorResponse([getSupabaseErrorMessage(error as { code?: string; message: string })], 500);
  }
}
