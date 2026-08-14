import type { NextRequest } from "next/server";
import {
  parsePagination,
  buildPaginationMeta,
  successResponse,
  errorResponse,
  requireAdmin,
  validateRequired,
  validateSlug,
  generateSlug,
  getSupabaseErrorMessage,
} from "@/lib/api";
import type { Project, Industry, Service } from "@/lib/supabase/types";

// ── GET /api/projects ─────────────────────────────────────────────
// List all published projects (public) with pagination and filtering.

export async function GET(request: NextRequest) {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { searchParams } = request.nextUrl;

  const pagination = parsePagination(searchParams);
  const industry = searchParams.get("industry");
  const solution = searchParams.get("solution");
  const status = searchParams.get("status"); // published | draft | all
  const featured = searchParams.get("featured");
  const search = searchParams.get("search");

  try {
    let query = supabase
      .from("projects")
      .select("*, industry:industries(*), service:services(*)", { count: "exact" });

    // Public users only see published; admins can pass ?status=all
    if (status !== "all") {
      query = query.eq("is_published", true);
    }

    if (industry) {
      query = query.eq("industry_id", industry);
    }

    if (solution) {
      const { data: service } = await supabase
        .from("services")
        .select("id")
        .eq("slug", solution)
        .single();

      if (service) {
        query = query.eq("service_id", (service as { id: string }).id);
      }
    }

    if (featured === "true") {
      query = query.eq("is_featured", true);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(pagination.offset, pagination.offset + pagination.limit - 1);

    if (error) throw error;

    type ProjectWithRelations = Project & {
      industry: Industry | null;
      service: Service | null;
    };

    const meta = buildPaginationMeta(count ?? 0, pagination);
    return successResponse((data ?? []) as ProjectWithRelations[], meta);
  } catch (error) {
    return errorResponse([getSupabaseErrorMessage(error as { code?: string; message: string })], 500);
  }
}

// ── POST /api/projects ────────────────────────────────────────────
// Create a new project (admin only).

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
    const insertData = {
      organization_id: body.organization_id as string,
      title: body.title as string,
      slug,
      description: (body.description as string) ?? null,
      content: (body.content as string) ?? null,
      thumbnail_url: (body.thumbnail_url as string) ?? null,
      live_url: (body.live_url as string) ?? null,
      repo_url: (body.repo_url as string) ?? null,
      industry_id: (body.industry_id as string) ?? null,
      service_id: (body.service_id as string) ?? null,
      is_featured: (body.is_featured as boolean) ?? false,
      is_published: (body.is_published as boolean) ?? false,
      published_at: body.is_published ? new Date().toISOString() : null,
      completed_at: (body.completed_at as string) ?? null,
      technologies: (body.technologies as string[]) ?? null,
    };

    const { data, error } = await supabase
      .from("projects")
      .insert(insertData as never)
      .select()
      .single();

    if (error) throw error;

    return successResponse(data as Project, undefined, 201);
  } catch (error) {
    return errorResponse([getSupabaseErrorMessage(error as { code?: string; message: string })], 500);
  }
}
