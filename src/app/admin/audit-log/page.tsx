"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { AUDIT_ACTIONS } from "@/lib/auth/audit-constants";

// ── Types ─────────────────────────────────────────────────────────

interface AuditLogRow {
  id: string;
  org_id: string;
  actor_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
  users?: { name: string; email: string } | null;
}

// ── Action label map ──────────────────────────────────────────────

const ACTION_LABELS: Record<string, string> = Object.fromEntries(
  Object.entries(AUDIT_ACTIONS).map(([key, value]) => [
    value,
    key
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase()),
  ])
);

function getActionLabel(action: string): string {
  return ACTION_LABELS[action] ?? action;
}

// ── Entity type filter options ────────────────────────────────────

const ENTITY_TYPES = [
  "user",
  "project",
  "solution",
  "industry",
  "page",
  "lead",
  "media",
  "settings",
  "navigation",
  "role",
];

const ACTION_TYPES = Object.values(AUDIT_ACTIONS);

// ── Styles ────────────────────────────────────────────────────────

const SELECT_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "var(--text-sm)",
  color: "var(--color-light)",
  backgroundColor: "var(--color-dark)",
  border: "1px solid var(--color-gray-700)",
  borderRadius: "var(--radius-md)",
  padding: "8px 12px",
  outline: "none",
  cursor: "pointer",
  appearance: "none" as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23858D9A' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  paddingRight: "32px",
  transition: "border-color 150ms",
};

const DATE_INPUT_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "var(--text-sm)",
  color: "var(--color-light)",
  backgroundColor: "var(--color-dark)",
  border: "1px solid var(--color-gray-700)",
  borderRadius: "var(--radius-md)",
  padding: "8px 12px",
  outline: "none",
  transition: "border-color 150ms",
  colorScheme: "dark",
};

// ── Component ─────────────────────────────────────────────────────

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [filterAction, setFilterAction] = useState("");
  const [filterEntity, setFilterEntity] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 25;

  useEffect(() => {
    let cancelled = false;
    async function fetchLogs() {
      setLoading(true);
      try {
        const supabase = createClient();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let query = (supabase.from("audit_logs") as any)
          .select(
            `
              id, org_id, actor_id, action, entity_type, entity_id,
              metadata, ip_address, created_at,
              users (name, email)
            `,
            { count: "exact" }
          )
          .order("created_at", { ascending: false });

        if (filterAction) query = query.eq("action", filterAction);
        if (filterEntity) query = query.eq("entity_type", filterEntity);
        if (filterDateFrom) query = query.gte("created_at", new Date(filterDateFrom).toISOString());
        if (filterDateTo) {
          const toDate = new Date(filterDateTo);
          toDate.setHours(23, 59, 59, 999);
          query = query.lte("created_at", toDate.toISOString());
        }

        const from = (page - 1) * pageSize;
        query = query.range(from, from + pageSize - 1);

        const { data, count, error } = await query;
        if (!cancelled && !error && data) {
          setLogs(data as AuditLogRow[]);
          setTotalCount(count ?? 0);
        }
      } catch {
        // Silently fail
      }
      if (!cancelled) setLoading(false);
    }
    fetchLogs();
    return () => { cancelled = true; };
  }, [filterAction, filterEntity, filterDateFrom, filterDateTo, page]);

  function resetFilters() {
    setFilterAction("");
    setFilterEntity("");
    setFilterDateFrom("");
    setFilterDateTo("");
    setPage(1);
  }

  function formatDateTime(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatMetadata(metadata: Record<string, unknown> | null): string {
    if (!metadata || Object.keys(metadata).length === 0) return "—";
    const entries = Object.entries(metadata);
    return entries
      .slice(0, 3)
      .map(([k, v]) => `${k}: ${typeof v === "string" ? v : JSON.stringify(v)}`)
      .join(", ");
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const hasFilters = filterAction || filterEntity || filterDateFrom || filterDateTo;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-2xl)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "var(--color-light)",
          }}
        >
          Audit Log
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-sm)",
            color: "var(--color-muted)",
            marginTop: "var(--space-1)",
          }}
        >
          Track all actions performed in the CMS
        </p>
      </div>

      {/* Filters */}
      <div
        className="mb-4 rounded-lg flex flex-wrap items-end gap-3"
        style={{
          backgroundColor: "var(--color-deep-navy)",
          border: "1px solid var(--color-gray-700)",
          padding: "var(--space-4) var(--space-5)",
        }}
      >
        <div>
          <label
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--color-muted)",
              display: "block",
              marginBottom: "4px",
            }}
          >
            Action
          </label>
          <select
            value={filterAction}
            onChange={(e) => { setFilterAction(e.target.value); setPage(1); }}
            style={SELECT_STYLE}
          >
            <option value="">All actions</option>
            {ACTION_TYPES.map((action) => (
              <option key={action} value={action}>
                {getActionLabel(action)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--color-muted)",
              display: "block",
              marginBottom: "4px",
            }}
          >
            Entity
          </label>
          <select
            value={filterEntity}
            onChange={(e) => { setFilterEntity(e.target.value); setPage(1); }}
            style={SELECT_STYLE}
          >
            <option value="">All entities</option>
            {ENTITY_TYPES.map((entity) => (
              <option key={entity} value={entity}>
                {entity.charAt(0).toUpperCase() + entity.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--color-muted)",
              display: "block",
              marginBottom: "4px",
            }}
          >
            From
          </label>
          <input
            type="date"
            value={filterDateFrom}
            onChange={(e) => { setFilterDateFrom(e.target.value); setPage(1); }}
            style={DATE_INPUT_STYLE}
          />
        </div>

        <div>
          <label
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--color-muted)",
              display: "block",
              marginBottom: "4px",
            }}
          >
            To
          </label>
          <input
            type="date"
            value={filterDateTo}
            onChange={(e) => { setFilterDateTo(e.target.value); setPage(1); }}
            style={DATE_INPUT_STYLE}
          />
        </div>

        {hasFilters && (
          <button
            onClick={resetFilters}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "var(--color-muted)",
              backgroundColor: "transparent",
              border: "1px solid var(--color-gray-700)",
              borderRadius: "var(--radius-md)",
              padding: "8px 12px",
              cursor: "pointer",
              transition: "color 150ms, border-color 150ms",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-light)"; e.currentTarget.style.borderColor = "var(--color-gray-600)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-muted)"; e.currentTarget.style.borderColor = "var(--color-gray-700)"; }}
          >
            Clear
          </button>
        )}

        <div
          className="ml-auto"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--color-muted)",
          }}
        >
          {totalCount.toLocaleString()} entries
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-lg overflow-hidden"
        style={{
          backgroundColor: "var(--color-deep-navy)",
          border: "1px solid var(--color-gray-700)",
        }}
      >
        {loading ? (
          <div style={{ padding: "var(--space-8)", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)", color: "var(--color-muted)" }}>
              Loading...
            </p>
          </div>
        ) : logs.length === 0 ? (
          <div style={{ padding: "var(--space-8)", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-muted)" }}>
              {hasFilters ? "No entries match the current filters." : "No audit entries yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--color-gray-700)" }}>
                  {["Timestamp", "Actor", "Action", "Entity", "Details"].map(
                    (header) => (
                      <th
                        key={header}
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "11px",
                          fontWeight: 500,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          color: "var(--color-muted)",
                          textAlign: "left",
                          padding: "12px 16px",
                        }}
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const actor =
                    typeof log.users === "object" && log.users
                      ? log.users
                      : null;

                  return (
                    <tr
                      key={log.id}
                      style={{ borderBottom: "1px solid var(--color-gray-700)" }}
                    >
                      <td
                        style={{
                          padding: "12px 16px",
                          fontFamily: "var(--font-mono)",
                          fontSize: "11px",
                          color: "var(--color-gray-500)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatDateTime(log.created_at)}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        {actor ? (
                          <div>
                            <div
                              style={{
                                fontFamily: "var(--font-body)",
                                fontSize: "var(--text-sm)",
                                fontWeight: 500,
                                color: "var(--color-light)",
                              }}
                            >
                              {actor.name}
                            </div>
                            <div
                              style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "10px",
                                color: "var(--color-muted)",
                              }}
                            >
                              {actor.email}
                            </div>
                          </div>
                        ) : (
                          <span
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "11px",
                              color: "var(--color-gray-600)",
                            }}
                          >
                            System
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "10px",
                            fontWeight: 500,
                            letterSpacing: "0.02em",
                            color: "var(--color-light)",
                            backgroundColor: "var(--color-accent-dim)",
                            border: "1px solid rgba(46, 74, 249, 0.2)",
                            borderRadius: "var(--radius-full)",
                            padding: "2px 8px",
                          }}
                        >
                          {getActionLabel(log.action)}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div>
                          <span
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "11px",
                              fontWeight: 500,
                              color: "var(--color-light)",
                              textTransform: "capitalize",
                            }}
                          >
                            {log.entity_type}
                          </span>
                          {log.entity_id && (
                            <span
                              style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "10px",
                                color: "var(--color-gray-600)",
                                marginLeft: "6px",
                              }}
                            >
                              {log.entity_id.slice(0, 8)}...
                            </span>
                          )}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontFamily: "var(--font-mono)",
                          fontSize: "11px",
                          color: "var(--color-muted)",
                          maxWidth: 300,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatMetadata(log.metadata)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="flex items-center justify-between"
            style={{
              padding: "12px 16px",
              borderTop: "1px solid var(--color-gray-700)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--color-muted)",
              }}
            >
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  fontWeight: 500,
                  color: page <= 1 ? "var(--color-gray-600)" : "var(--color-muted)",
                  backgroundColor: "transparent",
                  border: "1px solid var(--color-gray-700)",
                  borderRadius: "var(--radius-md)",
                  padding: "4px 12px",
                  cursor: page <= 1 ? "not-allowed" : "pointer",
                }}
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  fontWeight: 500,
                  color: page >= totalPages ? "var(--color-gray-600)" : "var(--color-muted)",
                  backgroundColor: "transparent",
                  border: "1px solid var(--color-gray-700)",
                  borderRadius: "var(--radius-md)",
                  padding: "4px 12px",
                  cursor: page >= totalPages ? "not-allowed" : "pointer",
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
