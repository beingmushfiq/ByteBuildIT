"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Project, Industry } from "@/lib/supabase/types";

type ProjectStatus = "draft" | "published" | "scheduled" | "archived";

function getStatus(project: Project): ProjectStatus {
  if (project.is_published && project.published_at && new Date(project.published_at) > new Date()) {
    return "scheduled";
  }
  if (project.is_published) return "published";
  return "draft";
}

const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string; bg: string; border: string }> = {
  draft: { label: "Draft", color: "#FBBF24", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)" },
  published: { label: "Published", color: "#4ADE80", bg: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.3)" },
  scheduled: { label: "Scheduled", color: "#A78BFA", bg: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.3)" },
  archived: { label: "Archived", color: "#858D9A", bg: "rgba(133,141,154,0.12)", border: "rgba(133,141,154,0.3)" },
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function ProjectsListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

  // Load data on mount
  const loadData = useCallback(async () => {
    if (loaded) return;
    try {
      const supabase = createClient();
      const [projectsRes, industriesRes] = await Promise.all([
        supabase.from("projects" as any).select("*").order("updated_at", { ascending: false }),
        supabase.from("industries" as any).select("*").order("name"),
      ]);
      setProjects((projectsRes.data ?? []) as Project[]);
      setIndustries((industriesRes.data ?? []) as Industry[]);
    } catch {
      // Silently fail — will show empty state
    }
    setLoaded(true);
  }, [loaded]);

  // Trigger load
  if (!loaded) {
    loadData();
  }

  const filtered = useMemo(() => {
    let result = projects;

    if (statusFilter !== "all") {
      result = result.filter((p) => {
        const status = getStatus(p);
        if (statusFilter === "archived") return !p.is_published && p.published_at === null && false; // archived isn't auto-detected well, treat as filter
        return status === statusFilter;
      });
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          (p.description ?? "").toLowerCase().includes(q)
      );
    }

    return result;
  }, [projects, statusFilter, search]);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((p) => p.id)));
    }
  }

  async function bulkDelete() {
    if (selected.size === 0 || !confirm(`Delete ${selected.size} project(s)?`)) return;
    setDeleting(true);
    try {
      const supabase = createClient();
      await (supabase.from("projects") as any).delete().in("id", Array.from(selected));
      setProjects((prev) => prev.filter((p) => !selected.has(p.id)));
      setSelected(new Set());
    } catch {
      alert("Failed to delete projects.");
    }
    setDeleting(false);
  }

  function getIndustryName(id: string | null): string {
    if (!id) return "—";
    return industries.find((i) => i.id === id)?.name ?? "—";
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--color-light)" }}>
            Projects
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-muted)", marginTop: "var(--space-1)" }}>
            {projects.length} total
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            fontWeight: 500,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "var(--color-white)",
            backgroundColor: "var(--color-accent)",
            borderRadius: "var(--radius-md)",
            padding: "8px 16px",
            textDecoration: "none",
            transition: "background-color 150ms",
          }}
        >
          + New Project
        </Link>
      </div>

      {/* Toolbar */}
      <div
        className="mb-4 flex flex-wrap items-center gap-3 rounded-lg"
        style={{
          padding: "var(--space-3) var(--space-4)",
          backgroundColor: "var(--color-deep-navy)",
          border: "1px solid var(--color-gray-700)",
        }}
      >
        {/* Search */}
        <div className="relative flex-1" style={{ minWidth: 200 }}>
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
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sm)",
              color: "var(--color-light)",
              backgroundColor: "var(--color-dark)",
              border: "1px solid var(--color-gray-700)",
              borderRadius: "var(--radius-md)",
              padding: "6px 12px 6px 32px",
              outline: "none",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-accent)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-gray-700)"; }}
          />
        </div>

        {/* Status filter tabs */}
        <div className="flex gap-1">
          {(["all", "draft", "published", "scheduled"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: statusFilter === s ? "var(--color-light)" : "var(--color-muted)",
                backgroundColor: statusFilter === s ? "var(--color-accent-dim)" : "transparent",
                border: statusFilter === s ? "1px solid rgba(46,74,249,0.3)" : "1px solid transparent",
                borderRadius: "var(--radius-md)",
                padding: "4px 10px",
                cursor: "pointer",
                transition: "all 150ms",
              }}
            >
              {s === "all" ? "All" : STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>

        {/* Bulk actions */}
        {selected.size > 0 && (
          <div className="flex items-center gap-2" style={{ marginLeft: "auto" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--color-muted)" }}>
              {selected.size} selected
            </span>
            <button
              onClick={bulkDelete}
              disabled={deleting}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "#F87171",
                backgroundColor: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: "var(--radius-md)",
                padding: "4px 10px",
                cursor: deleting ? "not-allowed" : "pointer",
                opacity: deleting ? 0.5 : 1,
              }}
            >
              Delete
            </button>
          </div>
        )}
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
              <th style={{ padding: "10px 12px", textAlign: "left", width: 40 }}>
                <input
                  type="checkbox"
                  checked={filtered.length > 0 && selected.size === filtered.length}
                  onChange={toggleSelectAll}
                  style={{ accentColor: "var(--color-accent)" }}
                  aria-label="Select all"
                />
              </th>
              <th style={{ padding: "10px 16px", textAlign: "left", fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-muted)" }}>
                Title
              </th>
              <th style={{ padding: "10px 16px", textAlign: "left", fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-muted)" }}>
                Status
              </th>
              <th style={{ padding: "10px 16px", textAlign: "center", fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-muted)" }}>
                Featured
              </th>
              <th style={{ padding: "10px 16px", textAlign: "left", fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-muted)" }}>
                Industry
              </th>
              <th style={{ padding: "10px 16px", textAlign: "left", fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-muted)" }}>
                Updated
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: "var(--space-12) var(--space-4)", textAlign: "center" }}>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-muted)", marginBottom: "var(--space-3)" }}>
                    {projects.length === 0 ? "No projects yet. Create your first case study." : "No projects match your filters."}
                  </p>
                  {projects.length === 0 && (
                    <Link
                      href="/admin/projects/new"
                      style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--color-accent)", textDecoration: "none" }}
                    >
                      + Create Project
                    </Link>
                  )}
                </td>
              </tr>
            ) : (
              filtered.map((project) => {
                const status = getStatus(project);
                const config = STATUS_CONFIG[status];
                return (
                  <tr
                    key={project.id}
                    style={{ borderBottom: "1px solid var(--color-gray-700)" }}
                  >
                    <td style={{ padding: "10px 12px" }}>
                      <input
                        type="checkbox"
                        checked={selected.has(project.id)}
                        onChange={() => toggleSelect(project.id)}
                        style={{ accentColor: "var(--color-accent)" }}
                        aria-label={`Select ${project.title}`}
                      />
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      <Link
                        href={`/admin/projects/${project.slug}`}
                        style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-light)", textDecoration: "none" }}
                      >
                        {project.title}
                      </Link>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--color-muted)", marginTop: 2 }}>
                        /{project.slug}
                      </div>
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      <span
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
                          padding: "2px 8px",
                        }}
                      >
                        {config.label}
                      </span>
                    </td>
                    <td style={{ padding: "10px 16px", textAlign: "center" }}>
                      {project.is_featured ? (
                        <span style={{ color: "var(--color-accent)" }}>★</span>
                      ) : (
                        <span style={{ color: "var(--color-gray-600)" }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: "10px 16px", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-muted)" }}>
                      {getIndustryName(project.industry_id)}
                    </td>
                    <td style={{ padding: "10px 16px", fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--color-gray-500)", whiteSpace: "nowrap" }}>
                      {formatDate(project.updated_at)}
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
