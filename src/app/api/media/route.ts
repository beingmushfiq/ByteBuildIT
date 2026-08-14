import type { NextRequest } from "next/server";
import {
  parsePagination,
  buildPaginationMeta,
  successResponse,
  errorResponse,
  requireAdmin,
  getSupabaseErrorMessage,
} from "@/lib/api";
import type { Media } from "@/lib/supabase/types";

// ── Constants ────────────────────────────────────────────────────

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

const ALLOWED_MIME_TYPES = [
  // Images
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/avif",
  // Videos
  "video/mp4",
  "video/webm",
  "video/quicktime",
  // Documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "text/csv",
];

const STORAGE_BUCKET = "media";

// ── GET /api/media ───────────────────────────────────────────────
// List media with pagination and search (admin only).

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
  const type = searchParams.get("type"); // image | video | document

  try {
    let query = supabase
      .from("media")
      .select("*", { count: "exact" });

    if (search) {
      query = query.or(
        `filename.ilike.%${search}%,alt_text.ilike.%${search}%,caption.ilike.%${search}%`
      );
    }

    if (type) {
      switch (type) {
        case "image":
          query = query.like("mime_type", "image/%");
          break;
        case "video":
          query = query.like("mime_type", "video/%");
          break;
        case "document":
          query = query.or(
            "mime_type.like.application/pdf,mime_type.like.application/msword,mime_type.like.application/vnd.openxmlformats%,mime_type.like,text/%,mime_type.like.application/vnd.ms-excel"
          );
          break;
      }
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(pagination.offset, pagination.offset + pagination.limit - 1);

    if (error) throw error;

    const meta = buildPaginationMeta(count ?? 0, pagination);
    return successResponse((data ?? []) as Media[], meta);
  } catch (error) {
    return errorResponse([getSupabaseErrorMessage(error as { code?: string; message: string })], 500);
  }
}

// ── POST /api/media ──────────────────────────────────────────────
// Upload a new media file (admin only).

export async function POST(request: NextRequest) {
  const { supabase, user, isAdmin, error: authError } = await requireAdmin();

  if (!user || !isAdmin) {
    return errorResponse(
      [{ code: "FORBIDDEN", message: authError?.message ?? "Admin access required" }],
      403
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return errorResponse(
      [{ code: "INVALID_FORM", message: "Request must be multipart/form-data" }],
      400
    );
  }

  const file = formData.get("file") as File | null;
  if (!file || !(file instanceof File)) {
    return errorResponse(
      [{ code: "REQUIRED", message: "A file is required", field: "file" }],
      422
    );
  }

  // Validate file type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return errorResponse(
      [
        {
          code: "INVALID_TYPE",
          message: `File type "${file.type}" is not allowed. Accepted: images, videos, and common documents.`,
          field: "file",
        },
      ],
      422
    );
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return errorResponse(
      [
        {
          code: "FILE_TOO_LARGE",
          message: `File size must be under ${Math.round(MAX_FILE_SIZE / 1024 / 1024)}MB`,
          field: "file",
        },
      ],
      422
    );
  }

  const altText = (formData.get("alt_text") as string) || null;
  const caption = (formData.get("caption") as string) || null;

  try {
    // Generate a unique filename
    const ext = file.name.split(".").pop() ?? "bin";
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const storagePath = `${timestamp}-${random}.${ext}`;

    // Upload to Supabase Storage
    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(storagePath);

    // Save metadata to database
    const { data: mediaRecord, error: dbError } = await supabase
      .from("media")
      .insert({
        organization_id: user.app_metadata?.org_id ?? "",
        filename: file.name,
        original_url: urlData.publicUrl,
        file_size: file.size,
        mime_type: file.type,
        alt_text: altText,
        caption,
        uploaded_by: user.id,
      } as never)
      .select()
      .single();

    if (dbError) throw dbError;

    return successResponse(mediaRecord as Media, undefined, 201);
  } catch (error) {
    return errorResponse(
      [getSupabaseErrorMessage(error as { code?: string; message: string })],
      500
    );
  }
}
