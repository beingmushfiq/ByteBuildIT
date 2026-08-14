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
import type { Project, Industry, Service, Media } from "@/lib/supabase/types";

// ── GET /api/projects/[slug] ──────────────────────────────────────
// Get a single project by slug with all relations.

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("projects")
      .select(`
        *,
        industry:industries(*),
        service:services(*),
        media:media(*)
      `)
      .eq("slug", slug)
      .single();

    if (error || !data) {
      return notFoundResponse(`Project "${slug}" not found`);
    }

    type ProjectWithMedia = Project & {
      industry: Industry | null;
      service: Service | null;
      media: Media[];
    };

    const project = data as ProjectWithMedia;

    // Fetch related projects (same industry or service, excluding current)
    const { data: relatedProjects } = await supabase
      .from("projects")
      .select("id, title, slug, description, thumbnail_url, is_published")
      .eq("is_published", true)
      .neq("id", project.id)
      .limit(4);

    return successResponse({ ...project, related_projects: relatedProjects ?? [] });
  } catch (error) {
    return errorResponse([getSupabaseErrorMessage(error as { code?: string; message: string })], 500);
  }
}

// ── PUT /api/projects/[slug] ──────────────────────────────────────
// Update a project (admin only).

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

  // Build update payload — only include fields that are present
  const updateData: Record<string, unknown> = {};
  const allowedFields = [
    "title", "description", "content", "thumbnail_url", "live_url",
    "repo_url", "industry_id", "service_id", "is_featured", "is_published",
    "completed_at", "technologies",
  ] as const;

  for (const field of allowedFields) {
    if (field in body) {
      updateData[field] = body[field];
    }
  }

  // Generate new slug if title changed
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

  // Set published_at when transitioning to published
  if (body.is_published === true) {
    updateData.published_at = new Date().toISOString();
  }

  updateData.updated_at = new Date().toISOString();

  try {
    const { data, error } = await supabase
      .from("projects")
      .update(updateData as never)
      .eq("slug", slug)
      .select()
      .single();

    if (error) throw error;
    if (!data) return notFoundResponse(`Project "${slug}" not found`);

    return successResponse(data as Project);
  } catch (error) {
    return errorResponse([getSupabaseErrorMessage(error as { code?: string; message: string })], 500);
  }
}

// ── DELETE /api/projects/[slug] ───────────────────────────────────
// Soft delete / archive a project (admin only).

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
    // Soft delete: unpublish
    const { data, error } = await supabase
      .from("projects")
      .update({ is_published: false, updated_at: new Date().toISOString() } as never)
      .eq("slug", slug)
      .select()
      .single();

    if (error) throw error;
    if (!data) return notFoundResponse(`Project "${slug}" not found`);

    return successResponse(data as Project);
  } catch (error) {
    return errorResponse([getSupabaseErrorMessage(error as { code?: string; message: string })], 500);
  }
}
