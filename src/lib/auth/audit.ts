import "server-only";
import { createClient } from "@/lib/supabase/server";
export { AUDIT_ACTIONS, type AuditAction } from "./audit-constants";

// ── Types ─────────────────────────────────────────────────────────

export interface LogAuditParams {
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  userId?: string;
  orgId?: string;
}

// ── Core ──────────────────────────────────────────────────────────

/**
 * Write an entry to the `audit_logs` table.
 * Silently returns if the write fails — audit logging should never break the caller.
 */
export async function logAudit(params: LogAuditParams): Promise<void> {
  try {
    const supabase = await createClient();

    // Resolve actor and org from the current session if not provided
    let actorId = params.userId;
    let orgId = params.orgId;

    if (!actorId || !orgId) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        actorId = actorId ?? user.id;

        if (!orgId) {
          const { data: profile } = await supabase
            .from("users")
            .select("org_id")
            .eq("id", user.id)
            .single();

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          orgId = orgId ?? (profile as any)?.org_id;
        }
      }
    }

    if (!orgId) return; // Can't write audit log without an org

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("audit_logs") as any).insert({
      action: params.action,
      entity_type: params.entityType,
      entity_id: params.entityId ?? null,
      metadata: params.metadata ?? {},
      actor_id: actorId ?? null,
      org_id: orgId,
    });
  } catch {
    // Audit logging is best-effort; never throw
  }
}
