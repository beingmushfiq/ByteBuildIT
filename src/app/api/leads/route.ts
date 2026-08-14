import type { NextRequest } from "next/server";
import {
  parsePagination,
  buildPaginationMeta,
  successResponse,
  errorResponse,
  requireAdmin,
  validateRequired,
  validateEmail,
  getSupabaseErrorMessage,
} from "@/lib/api";
import type { Lead } from "@/lib/supabase/types";

// ── GET /api/leads ────────────────────────────────────────────────
// List leads (admin only, with status filter, search, pagination).

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
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const assignedTo = searchParams.get("assigned_to");
  const dateFrom = searchParams.get("date_from");
  const dateTo = searchParams.get("date_to");

  try {
    let query = supabase
      .from("leads")
      .select(`
        *,
        assigned_user:users!leads_assigned_to_fkey(id, full_name, avatar_url)
      `, { count: "exact" });

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    if (assignedTo) {
      query = query.eq("assigned_to", assignedTo);
    }

    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,email.ilike.%${search}%,company_name.ilike.%${search}%`
      );
    }

    if (dateFrom) {
      query = query.gte("created_at", dateFrom);
    }

    if (dateTo) {
      query = query.lte("created_at", dateTo);
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(pagination.offset, pagination.offset + pagination.limit - 1);

    if (error) throw error;

    const meta = buildPaginationMeta(count ?? 0, pagination);
    return successResponse((data ?? []) as Lead[], meta);
  } catch (error) {
    return errorResponse([getSupabaseErrorMessage(error as { code?: string; message: string })], 500);
  }
}

// ── POST /api/leads ───────────────────────────────────────────────
// Submit new lead (public, from contact form).

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return errorResponse([{ code: "INVALID_JSON", message: "Request body must be valid JSON" }], 400);
  }

  const validationErrors = validateRequired({
    email: body.email,
    organization_id: body.organization_id,
  });

  if (validationErrors.length > 0) {
    return errorResponse(validationErrors, 422);
  }

  if (!validateEmail(body.email as string)) {
    return errorResponse(
      [{ code: "INVALID_EMAIL", message: "Please provide a valid email address", field: "email" }],
      422
    );
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  try {
    // Rate limiting: check for recent duplicate (within last 5 minutes)
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { data: recentLeads } = await supabase
      .from("leads")
      .select("id")
      .eq("email", body.email as string)
      .eq("organization_id", body.organization_id as string)
      .gte("created_at", fiveMinAgo)
      .limit(1);

    if (recentLeads && recentLeads.length > 0) {
      return errorResponse(
        [{ code: "DUPLICATE_SUBMISSION", message: "Please wait before submitting again" }],
        429
      );
    }

    // Capture UTM parameters and request metadata
    const leadData = {
      organization_id: body.organization_id as string,
      email: body.email as string,
      full_name: (body.full_name as string) ?? null,
      company_name: (body.company_name as string) ?? null,
      phone: (body.phone as string) ?? null,
      message: (body.message as string) ?? null,
      source: (body.source as string) ?? null,
      budget_range: (body.budget_range as string) ?? null,
      project_type: (body.project_type as string) ?? null,
      timeline: (body.timeline as string) ?? null,
      status: "new" as const,
    };

    const { data, error } = await supabase
      .from("leads")
      .insert(leadData as never)
      .select()
      .single();

    if (error) throw error;

    const lead = data as Lead;

    // Log initial status in history
    await supabase
      .from("lead_status_history")
      .insert({
        lead_id: lead.id,
        from_status: null,
        to_status: "new",
        note: "Lead submitted via contact form",
      } as never);

    return successResponse(lead, undefined, 201);
  } catch (error) {
    return errorResponse([getSupabaseErrorMessage(error as { code?: string; message: string })], 500);
  }
}
