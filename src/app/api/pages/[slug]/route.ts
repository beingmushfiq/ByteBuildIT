import type { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  requireAdmin,
  getSupabaseErrorMessage,
} from "@/lib/api";
import type { Page, PageSection } from "@/lib/supabase/types";

// ── GET /api/pages/[slug] ─────────────────────────────────────────
// Get page with sections (public).

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("pages")
      .select(`
        *,
        sections:page_sections(
          *
        ),
        author:users(id, full_name, avatar_url)
      `)
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (error || !data) {
      return notFoundResponse(`Page "${slug}" not found`);
    }

    type PageWithSections = Page & {
      sections: PageSection[];
      author: { id: string; full_name: string | null; avatar_url: string | null } | null;
    };

    const page = data as PageWithSections;

    // Sort sections by sort_order
    if (page.sections && Array.isArray(page.sections)) {
      page.sections.sort((a, b) => a.sort_order - b.sort_order);

      // Filter to visible sections for public
      page.sections = page.sections.filter((s) => s.is_visible);
    }

    return successResponse(page);
  } catch (error) {
    return errorResponse([getSupabaseErrorMessage(error as { code?: string; message: string })], 500);
  }
}

// ── PUT /api/pages/[slug] ─────────────────────────────────────────
// Update page (admin only).

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

  try {
    // Fetch current page
    const { data: currentPage } = await supabase
      .from("pages")
      .select("id")
      .eq("slug", slug)
      .single();

    if (!currentPage) {
      return notFoundResponse(`Page "${slug}" not found`);
    }

    const page = currentPage as { id: string };

    // Update page fields
    const pageData: Record<string, unknown> = {};
    const allowedPageFields = [
      "title", "description", "meta_title", "meta_description",
      "is_published", "author_id",
    ] as const;

    for (const field of allowedPageFields) {
      if (field in body) {
        pageData[field] = body[field];
      }
    }

    if (body.slug) {
      pageData.slug = body.slug;
    }

    if (body.is_published === true && !body.published_at) {
      pageData.published_at = new Date().toISOString();
    }

    pageData.updated_at = new Date().toISOString();

    const { data: updatedPage, error: pageError } = await supabase
      .from("pages")
      .update(pageData as never)
      .eq("slug", slug)
      .select()
      .single();

    if (pageError) throw pageError;

    // Handle sections update if provided
    if (body.sections && Array.isArray(body.sections)) {
      // Delete existing sections and re-insert
      await supabase
        .from("page_sections")
        .delete()
        .eq("page_id", page.id);

      const sectionsToInsert = body.sections.map(
        (
          section: {
            title: string;
            slug: string;
            content?: string;
            section_type?: string;
            sort_order?: number;
            is_visible?: boolean;
            metadata?: Record<string, unknown>;
          },
          index: number
        ) => ({
          page_id: page.id,
          title: section.title,
          slug: section.slug,
          content: section.content ?? null,
          section_type: section.section_type ?? "content",
          sort_order: section.sort_order ?? index,
          is_visible: section.is_visible ?? true,
          metadata: section.metadata ?? null,
        })
      );

      const { error: sectionsError } = await supabase
        .from("page_sections")
        .insert(sectionsToInsert as never);

      if (sectionsError) throw sectionsError;
    }

    // Fetch the complete page with sections
    const { data: fullPage } = await supabase
      .from("pages")
      .select(`
        *,
        sections:page_sections(*),
        author:users(id, full_name, avatar_url)
      `)
      .eq("id", page.id)
      .single();

    type PageWithSections = Page & {
      sections: PageSection[];
      author: { id: string; full_name: string | null; avatar_url: string | null } | null;
    };

    return successResponse((fullPage ?? updatedPage) as PageWithSections);
  } catch (error) {
    return errorResponse([getSupabaseErrorMessage(error as { code?: string; message: string })], 500);
  }
}
