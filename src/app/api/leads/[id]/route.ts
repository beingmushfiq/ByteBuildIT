import type { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  requireAdmin,
  getSupabaseErrorMessage,
} from "@/lib/api";
import type { Lead, LeadStatusHistory } from "@/lib/supabase/types";

// ── GET /api/leads/[id] ───────────────────────────────────────────
// Get single lead with full details (admin only).

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
      .from("leads")
      .select(`
        *,
        assigned_user:users!leads_assigned_to_fkey(id, full_name, avatar_url),
        notes:lead_notes(
          *,
          author:users(id, full_name, avatar_url)
        ),
        status_history:lead_status_history(*)
      `)
      .eq("id", id)
      .single();

    if (error || !data) {
      return notFoundResponse("Lead not found");
    }

    return successResponse(data as Lead & { status_history: LeadStatusHistory[] });
  } catch (error) {
    return errorResponse([getSupabaseErrorMessage(error as { code?: string; message: string })], 500);
  }
}

// ── PUT /api/leads/[id] ───────────────────────────────────────────
// Update lead (admin only). Tracks status changes.

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

  try {
    // Fetch current lead to track status change
    const { data: currentLead, error: fetchError } = await supabase
      .from("leads")
      .select("status")
      .eq("id", id)
      .single();

    if (fetchError || !currentLead) {
      return notFoundResponse("Lead not found");
    }

    const lead = currentLead as { status: string };

    const updateData: Record<string, unknown> = {};
    const allowedFields = [
      "full_name", "company_name", "phone", "message", "status",
      "assigned_to", "budget_range", "project_type", "timeline",
    ] as const;

    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field];
      }
    }

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("leads")
      .update(updateData as never)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Track status change
    if (body.status && body.status !== lead.status) {
      await supabase
        .from("lead_status_history")
        .insert({
          lead_id: id,
          from_status: lead.status,
          to_status: body.status as string,
          changed_by: user.id,
          note: (body.status_note as string) ?? null,
        } as never);
    }

    return successResponse(data as Lead);
  } catch (error) {
    return errorResponse([getSupabaseErrorMessage(error as { code?: string; message: string })], 500);
  }
}
