import type { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  requireAdmin,
  validateRequired,
  getSupabaseErrorMessage,
} from "@/lib/api";

// ── GET /api/team ─────────────────────────────────────────────────
// List published team members (public).

export async function GET(request: NextRequest) {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { searchParams } = request.nextUrl;

  const search = searchParams.get("search");
  const teamId = searchParams.get("team_id");

  try {
    let query = supabase
      .from("users")
      .select(`
        id, full_name, email, avatar_url,
        team_members!inner(
          team_id,
          teams(name, slug)
        )
      `, { count: "exact" })
      .eq("is_active", true);

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    if (teamId) {
      query = query.eq("team_members.team_id", teamId);
    }

    const { data, error } = await query.order("full_name", { ascending: true });

    if (error) throw error;

    // Flatten the nested structure
    interface TeamMemberRow {
      id: string;
      full_name: string | null;
      email: string;
      avatar_url: string | null;
      team_members: Array<{
        team_id: string;
        teams: { name: string; slug: string } | null;
      }>;
    }

    const members = ((data ?? []) as TeamMemberRow[]).map((member) => {
      const tm = member.team_members;
      return {
        id: member.id,
        full_name: member.full_name,
        email: member.email,
        avatar_url: member.avatar_url,
        team: tm?.[0]?.teams ?? null,
      };
    });

    return successResponse(members, undefined);
  } catch (error) {
    return errorResponse([getSupabaseErrorMessage(error as { code?: string; message: string })], 500);
  }
}

// ── POST /api/team ────────────────────────────────────────────────
// Create a new team member (admin only).

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
    email: body.email,
    team_id: body.team_id,
  });

  if (validationErrors.length > 0) {
    return errorResponse(validationErrors, 422);
  }

  try {
    // First, check if the user already exists
    let userId = body.user_id as string | undefined;

    if (!userId) {
      // Create a new user record
      const { data: newUser, error: userError } = await supabase
        .from("users")
        .insert({
          email: body.email as string,
          full_name: (body.full_name as string) ?? null,
          avatar_url: (body.avatar_url as string) ?? null,
          organization_id: (body.organization_id as string) ?? null,
        } as never)
        .select("id")
        .single();

      if (userError) throw userError;
      userId = (newUser as { id: string }).id;
    }

    // Add user to team
    const { data, error } = await supabase
      .from("team_members")
      .insert({
        team_id: body.team_id as string,
        user_id: userId,
        role_id: (body.role_id as string) ?? null,
      } as never)
      .select()
      .single();

    if (error) throw error;

    return successResponse(data, undefined, 201);
  } catch (error) {
    return errorResponse([getSupabaseErrorMessage(error as { code?: string; message: string })], 500);
  }
}
