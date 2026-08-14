import type { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  requireAdmin,
  getSupabaseErrorMessage,
} from "@/lib/api";
import type { Setting } from "@/lib/supabase/types";

// ── GET /api/settings ─────────────────────────────────────────────
// Get global settings (public: basic info; admin: all).

export async function GET(request: NextRequest) {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { searchParams } = request.nextUrl;

  const isPublic = searchParams.get("public") !== "false";

  try {
    let query = supabase
      .from("settings")
      .select("*")
      .order("key", { ascending: true });

    if (isPublic) {
      // Public settings: only expose non-sensitive keys
      query = query.in("key", [
        "site_name",
        "site_tagline",
        "site_description",
        "logo_url",
        "favicon_url",
        "contact_email",
        "contact_phone",
        "social_twitter",
        "social_linkedin",
        "social_github",
        "analytics_id",
      ]);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Convert array to key-value object
    const settings: Record<string, unknown> = {};
    for (const item of (data ?? []) as Setting[]) {
      settings[item.key] = parseSettingValue(item.value, item.type);
    }

    return successResponse(settings);
  } catch (error) {
    return errorResponse([getSupabaseErrorMessage(error as { code?: string; message: string })], 500);
  }
}

// ── PUT /api/settings ─────────────────────────────────────────────
// Update settings (admin only).

export async function PUT(request: NextRequest) {
  const { supabase, user, isAdmin, error: authError } = await requireAdmin();

  if (!user || !isAdmin) {
    return errorResponse(
      [{ code: "FORBIDDEN", message: authError?.message ?? "Admin access required" }],
      403
    );
  }

  let body: { settings?: Record<string, unknown>; organization_id?: string };
  try {
    body = await request.json();
  } catch {
    return errorResponse([{ code: "INVALID_JSON", message: "Request body must be valid JSON" }], 400);
  }

  if (!body.settings || typeof body.settings !== "object") {
    return errorResponse(
      [{ code: "INVALID_PAYLOAD", message: "Request must include a settings object" }],
      422
    );
  }

  if (!body.organization_id) {
    return errorResponse(
      [{ code: "REQUIRED", message: "organization_id is required" }],
      422
    );
  }

  try {
    const results: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(body.settings)) {
      const type = inferSettingType(value);
      const stringValue = serializeSettingValue(value, type);

      // Upsert each setting
      const { data, error } = await supabase
        .from("settings")
        .upsert(
          {
            organization_id: body.organization_id,
            key,
            value: stringValue,
            type,
            updated_at: new Date().toISOString(),
          } as never,
          { onConflict: "organization_id,key" }
        )
        .select()
        .single();

      if (error) throw error;

      const row = data as Setting;
      results[key] = parseSettingValue(row.value, row.type);
    }

    return successResponse(results);
  } catch (error) {
    return errorResponse([getSupabaseErrorMessage(error as { code?: string; message: string })], 500);
  }
}

// ── Helpers ───────────────────────────────────────────────────────

function parseSettingValue(value: string | null, type: string): unknown {
  if (value === null) return null;

  switch (type) {
    case "number":
      return Number(value);
    case "boolean":
      return value === "true";
    case "json":
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    default:
      return value;
  }
}

function serializeSettingValue(value: unknown, type: string): string {
  if (value === null || value === undefined) return "";

  switch (type) {
    case "json":
      return typeof value === "string" ? value : JSON.stringify(value);
    default:
      return String(value);
  }
}

function inferSettingType(value: unknown): "string" | "number" | "boolean" | "json" {
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "number") return "number";
  if (typeof value === "object") return "json";
  return "string";
}
