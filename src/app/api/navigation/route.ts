import type { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  requireAdmin,
  getSupabaseErrorMessage,
} from "@/lib/api";
import type { NavigationItem, NavigationItemWithChildren } from "@/lib/supabase/types";

// ── GET /api/navigation ───────────────────────────────────────────
// Get navigation items by location (primary/footer).

export async function GET() {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("navigation_items")
      .select("*")
      .eq("is_visible", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;

    // Build nested tree structure
    const items = (data ?? []) as NavigationItem[];
    const tree = buildNavigationTree(items);

    return successResponse(tree);
  } catch (error) {
    return errorResponse([getSupabaseErrorMessage(error as { code?: string; message: string })], 500);
  }
}

// ── PUT /api/navigation ───────────────────────────────────────────
// Update navigation items (admin only).
// Accepts a full navigation tree and reconciles it.

export async function PUT(request: NextRequest) {
  const { supabase, user, isAdmin, error: authError } = await requireAdmin();

  if (!user || !isAdmin) {
    return errorResponse(
      [{ code: "FORBIDDEN", message: authError?.message ?? "Admin access required" }],
      403
    );
  }

  let body: { items?: Array<Record<string, unknown>> };
  try {
    body = await request.json();
  } catch {
    return errorResponse([{ code: "INVALID_JSON", message: "Request body must be valid JSON" }], 400);
  }

  if (!body.items || !Array.isArray(body.items)) {
    return errorResponse(
      [{ code: "INVALID_PAYLOAD", message: "Request must include an items array" }],
      422
    );
  }

  try {
    // Get organization_id from first existing item or require it
    const { data: existingItems } = await supabase
      .from("navigation_items")
      .select("organization_id")
      .limit(1);

    const existingRow = existingItems?.[0] as { organization_id: string } | undefined;
    const organizationId = existingRow?.organization_id ?? (body.items[0]?.organization_id as string);

    if (!organizationId) {
      return errorResponse(
        [{ code: "REQUIRED", message: "organization_id is required" }],
        422
      );
    }

    // Delete all existing nav items for this org and re-insert (full replace strategy)
    await supabase
      .from("navigation_items")
      .delete()
      .eq("organization_id", organizationId);

    // Insert all items with sort_order recalculation
    const itemsToInsert = body.items.map((item, index) => ({
      organization_id: organizationId,
      label: item.label as string,
      href: item.href as string,
      parent_id: (item.parent_id as string) ?? null,
      sort_order: (item.sort_order as number) ?? index,
      is_external: (item.is_external as boolean) ?? false,
      is_visible: (item.is_visible as boolean) ?? true,
    }));

    const { data, error } = await supabase
      .from("navigation_items")
      .insert(itemsToInsert as never)
      .select();

    if (error) throw error;

    const tree = buildNavigationTree((data ?? []) as NavigationItem[]);
    return successResponse(tree);
  } catch (error) {
    return errorResponse([getSupabaseErrorMessage(error as { code?: string; message: string })], 500);
  }
}

// ── Helpers ───────────────────────────────────────────────────────

function buildNavigationTree(items: NavigationItem[]): NavigationItemWithChildren[] {
  const map = new Map<string, NavigationItemWithChildren>();
  const roots: NavigationItemWithChildren[] = [];

  // Create map entries
  for (const item of items) {
    map.set(item.id, { ...item, children: [] });
  }

  // Build tree
  for (const item of items) {
    const node = map.get(item.id)!;
    if (item.parent_id && map.has(item.parent_id)) {
      map.get(item.parent_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  // Sort children recursively
  const sortChildren = (nodes: NavigationItemWithChildren[]) => {
    nodes.sort((a, b) => a.sort_order - b.sort_order);
    for (const node of nodes) {
      sortChildren(node.children);
    }
  };

  sortChildren(roots);
  return roots;
}
