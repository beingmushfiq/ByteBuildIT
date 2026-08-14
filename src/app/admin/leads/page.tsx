"use client";

import { useState, useMemo, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Lead } from "@/lib/supabase/types";

type LeadStatus = Lead["status"];

const STATUS_TABS: { value: LeadStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "proposal", label: "Proposal" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

const STATUS_CONFIG: Record<LeadStatus, { label: string; color: string; bg: string; border: string }> = {
  new: { label: "New", color: "#4A62FF", bg: "rgba(46,74,249,0.12)", border: "rgba(46,74,249,0.3)" },
  contacted: { label: "Contacted", color: "#60A5FA", bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.3)" },
  qualified: { label: "Qualified", color: "#A78BFA", bg: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.3)" },
  proposal: { label: "Proposal", color: "#FBBF24", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)" },
  negotiation: { label: "Negotiation", color: "#FB923C", bg: "rgba(251,146,60,0.12)", border: "rgba(251,146,60,0.3)" },
  won: { label: "Won", color: "#4ADE80", bg: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.3)" },
  lost: { label: "Lost", color: "#F87171", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.3)" },
  archived: { label: "Archived", color: "#858D9A", bg: "rgba(133,141,154,0.12)", border: "rgba(133,141,154,0.3)" },
};

const ALL_STATUSES: LeadStatus[] = ["new", "contacted", "qualified", "proposal", "negotiation", "won", "lost", "archived"];

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function LeadsListPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (loaded) return;
    try {
      const supabase = createClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase.from("leads") as any).select("*").order("created_at", { ascending: false });
      setLeads((data ?? []) as Lead[]);
    } catch {
      // Silently fail
    }
    setLoaded(true);
  }, [loaded]);

  if (!loaded) {
    loadData();
  }

  const filtered = useMemo(() => {
    let result = leads;

    if (statusFilter !== "all") {
      result = result.filter((l) => l.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          (l.full_name ?? "").toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          (l.company_name ?? "").toLowerCase().includes(q)
      );
    }

    return result;
  }, [leads, statusFilter, search]);

  async function updateStatus(leadId: string, newStatus: LeadStatus) {
    setUpdatingId(leadId);
    try {
      const supabase = createClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from("leads") as any).update({ status: newStatus }).eq("id", leadId);
      if (error) throw error;
      setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)));
    } catch {
      alert("Failed to update lead status.");
    }
    setUpdatingId(null);
  }

  // Count leads per status for tab badges
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: leads.length };
    for (const lead of leads) {
      counts[lead.status] = (counts[lead.status] ?? 0) + 1;
    }
    return counts;
  }, [leads]);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--color-light)" }}>
          Leads
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-muted)", marginTop: "var(--space-1)" }}>
          {leads.length} total inquiries
        </p>
      </div>

      {/* Status tabs */}
      <div className="mb-4 flex flex-wrap gap-1">
        {STATUS_TABS.map((tab) => {
          const count = statusCounts[tab.value] ?? 0;
          const active = statusFilter === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className="flex items-center gap-1.5"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: active ? "var(--color-light)" : "var(--color-muted)",
                backgroundColor: active ? "var(--color-accent-dim)" : "transparent",
                border: active ? "1px solid rgba(46,74,249,0.3)" : "1px solid transparent",
                borderRadius: "var(--radius-md)",
                padding: "5px 10px",
                cursor: "pointer",
                transition: "all 150ms",
              }}
            >
              {tab.label}
              <span
                style={{
                  fontSize: "10px",
                  color: active ? "var(--color-accent)" : "var(--color-gray-500)",
                  backgroundColor: active ? "rgba(46,74,249,0.15)" : "rgba(133,141,154,0.12)",
                  borderRadius: "var(--radius-full)",
                  padding: "1px 6px",
                  lineHeight: "16px",
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative" style={{ maxWidth: 400 }}>
          <svg
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-gray-500)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, email, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sm)",
              color: "var(--color-light)",
              backgroundColor: "var(--color-deep-navy)",
              border: "1px solid var(--color-gray-700)",
              borderRadius: "var(--radius-md)",
              padding: "7px 12px 7px 32px",
              outline: "none",
              transition: "border-color 150ms",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-accent)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-gray-700)"; }}
          />
        </div>
      </div>

      {/* Table */}
      <div
        className="overflow-x-auto rounded-lg"
        style={{
          backgroundColor: "var(--color-deep-navy)",
          border: "1px solid var(--color-gray-700)",
        }}
      >
        <table className="w-full" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-gray-700)" }}>
              {["Name", "Email", "Company", "Status", "Assigned", "Created"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "10px 16px",
                    textAlign: h === "Status" ? "center" : "left",
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    fontWeight: 500,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--color-muted)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: "var(--space-12) var(--space-4)", textAlign: "center" }}>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-muted)" }}>
                    {leads.length === 0 ? "No leads yet. They'll appear here when someone submits an inquiry." : "No leads match your filters."}
                  </p>
                </td>
              </tr>
            ) : (
              filtered.map((lead) => {
                const config = STATUS_CONFIG[lead.status];
                return (
                  <tr key={lead.id} style={{ borderBottom: "1px solid var(--color-gray-700)" }}>
                    <td style={{ padding: "10px 16px" }}>
                      <div style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-light)" }}>
                        {lead.full_name ?? "—"}
                      </div>
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      <a
                        href={`mailto:${lead.email}`}
                        style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--color-accent)", textDecoration: "none" }}
                      >
                        {lead.email}
                      </a>
                    </td>
                    <td style={{ padding: "10px 16px", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-muted)" }}>
                      {lead.company_name ?? "—"}
                    </td>
                    <td style={{ padding: "10px 16px", textAlign: "center" }}>
                      <div className="relative inline-block">
                        <select
                          value={lead.status}
                          onChange={(e) => updateStatus(lead.id, e.target.value as LeadStatus)}
                          disabled={updatingId === lead.id}
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "10px",
                            fontWeight: 500,
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                            color: config.color,
                            backgroundColor: config.bg,
                            border: `1px solid ${config.border}`,
                            borderRadius: "var(--radius-full)",
                            padding: "3px 24px 3px 8px",
                            cursor: updatingId === lead.id ? "not-allowed" : "pointer",
                            appearance: "none",
                            outline: "none",
                            opacity: updatingId === lead.id ? 0.5 : 1,
                          }}
                        >
                          {ALL_STATUSES.map((s) => (
                            <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                          ))}
                        </select>
                        <svg
                          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={config.color}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                    </td>
                    <td style={{ padding: "10px 16px", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-muted)" }}>
                      {lead.assigned_to ? "Assigned" : "—"}
                    </td>
                    <td style={{ padding: "10px 16px", fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--color-gray-500)", whiteSpace: "nowrap" }}>
                      {formatDate(lead.created_at)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
