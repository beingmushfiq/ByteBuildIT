"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Project, Solution, Industry, Page } from "@/lib/supabase/types";

// ── Types ────────────────────────────────────────────────────────

type EntityKind = "project" | "solution" | "industry" | "page";

interface SEOTEntity {
  id: string;
  kind: EntityKind;
  title: string;
  slug: string;
  description: string | null;
  meta_title: string | null;
  meta_description: string | null;
  is_published: boolean;
  updated_at: string;
}

// ── Helpers ──────────────────────────────────────────────────────

const KIND_LABELS: Record<EntityKind, { label: string; color: string; bg: string; border: string }> = {
  project: { label: "Project", color: "#4ADE80", bg: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.3)" },
  solution: { label: "Solution", color: "#A78BFA", bg: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.3)" },
  industry: { label: "Industry", color: "#FBBF24", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)" },
  page: { label: "Page", color: "#38BDF8", bg: "rgba(56,189,248,0.12)", border: "rgba(56,189,248,0.3)" },
};

function getSEOScore(entity: SEOTEntity): { score: number; label: string; color: string } {
  let score = 0;
  if (entity.meta_title) score += 30;
  else if (entity.title) score += 15;
  if (entity.meta_description) score += 40;
  else if (entity.description) score += 15;
  if (entity.description && entity.description.length >= 120) score += 15;
  if (entity.slug) score += 5;
  if (entity.is_published) score += 10;

  if (score >= 80) return { score, label: "Good", color: "#4ADE80" };
  if (score >= 50) return { score, label: "Needs Work", color: "#FBBF24" };
  return { score, label: "Missing", color: "#F87171" };
}

function getGooglePreviewUrl(entity: SEOTEntity): string {
  const siteUrl = "https://bytebuildit.com";
  return `${siteUrl}/${entity.kind === "project" ? "work" : entity.kind === "solution" ? "solutions" : entity.kind === "industry" ? "industries" : ""}/${entity.slug}`;
}

// ── Component ────────────────────────────────────────────────────

export default function SEOManagementPage() {
  const [entities, setEntities] = useState<SEOTEntity[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [kindFilter, setKindFilter] = useState<EntityKind | "all">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ meta_title: "", meta_description: "" });
  const [saving, setSaving] = useState(false);
  const [previewEntity, setPreviewEntity] = useState<SEOTEntity | null>(null);

  const loadData = useCallback(async () => {
    if (loaded) return;

    const supabase = createClient();

    try {
      const [projectsRes, solutionsRes, industriesRes, pagesRes] = await Promise.all([
        supabase.from("projects")
          .select("id, title, slug, description, meta_title, meta_description, is_published, updated_at")
          .order("updated_at", { ascending: false }),
        supabase.from("solutions")
          .select("id, title, slug, description, meta_title, meta_description, is_published, updated_at")
          .order("updated_at", { ascending: false }),
        supabase.from("industries")
          .select("id, name, slug, description, meta_title, meta_description, is_published, updated_at")
          .order("updated_at", { ascending: false }),
        supabase.from("pages")
          .select("id, title, slug, description, meta_title, meta_description, is_published, updated_at")
          .order("updated_at", { ascending: false }),
      ]);

      const all: SEOTEntity[] = [
        ...((projectsRes.data ?? []) as Project[]).map((p) => ({
          id: p.id, kind: "project" as const, title: p.title, slug: p.slug,
          description: p.description, meta_title: null, meta_description: null,
          is_published: p.is_published, updated_at: p.updated_at,
        })),
        ...((solutionsRes.data ?? []) as Solution[]).map((s) => ({
          id: s.id, kind: "solution" as const, title: s.title, slug: s.slug,
          description: s.description, meta_title: null, meta_description: null,
          is_published: s.is_published, updated_at: s.updated_at,
        })),
        ...((industriesRes.data ?? []) as Industry[]).map((i) => ({
          id: i.id, kind: "industry" as const, title: i.name, slug: i.slug,
          description: i.description, meta_title: null, meta_description: null,
          is_published: i.is_published, updated_at: i.updated_at,
        })),
        ...((pagesRes.data ?? []) as Page[]).map((p) => ({
          id: p.id, kind: "page" as const, title: p.title, slug: p.slug,
          description: p.description, meta_title: p.meta_title, meta_description: p.meta_description,
          is_published: p.is_published, updated_at: p.updated_at,
        })),
      ];

      setEntities(all);
    } catch {
      // Silently fail
    }
    setLoaded(true);
  }, [loaded]);

  if (!loaded) {
    loadData();
  }

  // Filtered entities
  const filtered = useMemo(() => {
    let result = entities;

    if (kindFilter !== "all") {
      result = result.filter((e) => e.kind === kindFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.slug.toLowerCase().includes(q) ||
          (e.meta_title ?? "").toLowerCase().includes(q) ||
          (e.meta_description ?? "").toLowerCase().includes(q)
      );
    }

    return result;
  }, [entities, kindFilter, search]);

  // Summary stats
  const stats = useMemo(() => {
    const withMetaTitle = entities.filter((e) => e.meta_title).length;
    const withMetaDesc = entities.filter((e) => e.meta_description).length;
    return { total: entities.length, withMetaTitle, withMetaDesc };
  }, [entities]);

  // Start editing
  function startEditing(entity: SEOTEntity) {
    setEditingId(entity.id);
    setEditForm({
      meta_title: entity.meta_title ?? "",
      meta_description: entity.meta_description ?? "",
    });
  }

  // Save SEO fields
  async function saveSEO(entity: SEOTEntity) {
    setSaving(true);
    const tableMap: Record<EntityKind, string> = {
      project: "projects",
      solution: "solutions",
      industry: "industries",
      page: "pages",
    };
    const table = tableMap[entity.kind];

    try {
      const supabase = createClient();
      await (supabase.from(table as string) as any)
        .update({
          meta_title: editForm.meta_title || null,
          meta_description: editForm.meta_description || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", entity.id);

      setEntities((prev) =>
        prev.map((e) =>
          e.id === entity.id
            ? { ...e, meta_title: editForm.meta_title || null, meta_description: editForm.meta_description || null }
            : e
        )
      );

      if (previewEntity?.id === entity.id) {
        setPreviewEntity((prev) =>
          prev ? { ...prev, meta_title: editForm.meta_title || null, meta_description: editForm.meta_description || null } : null
        );
      }
    } catch {
      // Silently fail
    }

    setEditingId(null);
    setSaving(false);
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--color-light)" }}>
            SEO Management
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-muted)", marginTop: "var(--space-1)" }}>
            {stats.total} entities · {stats.withMetaTitle} with meta title · {stats.withMetaDesc} with meta description
          </p>
        </div>
      </div>

      {/* Content: list + preview */}
      <div className="flex gap-4">
        {/* List */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div
            className="mb-4 flex flex-wrap items-center gap-3 rounded-lg"
            style={{
              padding: "var(--space-3) var(--space-4)",
              backgroundColor: "var(--color-deep-navy)",
              border: "1px solid var(--color-gray-700)",
            }}
          >
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
                placeholder="Search entities..."
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

            <div className="flex gap-1">
              {(["all", "project", "solution", "industry", "page"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setKindFilter(k)}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    fontWeight: 500,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: kindFilter === k ? "var(--color-light)" : "var(--color-muted)",
                    backgroundColor: kindFilter === k ? "var(--color-accent-dim)" : "transparent",
                    border: kindFilter === k ? "1px solid rgba(46,74,249,0.3)" : "1px solid transparent",
                    borderRadius: "var(--radius-md)",
                    padding: "4px 10px",
                    cursor: "pointer",
                    transition: "all 150ms",
                  }}
                >
                  {k === "all" ? "All" : KIND_LABELS[k].label}
                </button>
              ))}
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
                  {["Entity", "Type", "SEO Score", "Meta Title", "Meta Description", "Actions"].map((h) => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: h === "Actions" ? "center" : "left", fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-muted)" }}>
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
                        {entities.length === 0 ? "Loading entities..." : "No entities match your filters."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((entity) => {
                    const seoScore = getSEOScore(entity);
                    const kindConfig = KIND_LABELS[entity.kind];
                    const isEditing = editingId === entity.id;

                    return (
                      <tr key={entity.id} style={{ borderBottom: "1px solid var(--color-gray-700)" }}>
                        <td style={{ padding: "10px 16px" }}>
                          <div style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-light)" }}>
                            {entity.title}
                          </div>
                          <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--color-muted)", marginTop: 2 }}>
                            /{entity.slug}
                          </div>
                        </td>
                        <td style={{ padding: "10px 16px" }}>
                          <span style={{
                            fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 500,
                            letterSpacing: "0.04em", textTransform: "uppercase",
                            color: kindConfig.color, backgroundColor: kindConfig.bg,
                            border: `1px solid ${kindConfig.border}`, borderRadius: "var(--radius-full)", padding: "2px 8px",
                          }}>
                            {kindConfig.label}
                          </span>
                        </td>
                        <td style={{ padding: "10px 16px" }}>
                          <span style={{
                            fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 600,
                            color: seoScore.color,
                          }}>
                            {seoScore.score}%
                          </span>
                          <span style={{
                            fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--color-muted)", marginLeft: 6,
                          }}>
                            {seoScore.label}
                          </span>
                        </td>
                        <td style={{ padding: "10px 16px", maxWidth: 200 }}>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editForm.meta_title}
                              onChange={(e) => setEditForm((f) => ({ ...f, meta_title: e.target.value }))}
                              placeholder={entity.title}
                              className="w-full"
                              style={{
                                fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
                                color: "var(--color-light)", backgroundColor: "var(--color-dark)",
                                border: "1px solid var(--color-accent)", borderRadius: "var(--radius-md)",
                                padding: "4px 8px", outline: "none",
                              }}
                            />
                          ) : (
                            <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", color: entity.meta_title ? "var(--color-light)" : "var(--color-gray-500)", fontStyle: entity.meta_title ? "normal" : "italic" }}>
                              {entity.meta_title || "(uses title)"}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: "10px 16px", maxWidth: 250 }}>
                          {isEditing ? (
                            <textarea
                              value={editForm.meta_description}
                              onChange={(e) => setEditForm((f) => ({ ...f, meta_description: e.target.value }))}
                              placeholder={entity.description?.slice(0, 160) || "Add a meta description..."}
                              rows={2}
                              className="w-full"
                              style={{
                                fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
                                color: "var(--color-light)", backgroundColor: "var(--color-dark)",
                                border: "1px solid var(--color-accent)", borderRadius: "var(--radius-md)",
                                padding: "4px 8px", outline: "none", resize: "vertical",
                              }}
                            />
                          ) : (
                            <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", color: entity.meta_description ? "var(--color-light)" : "var(--color-gray-500)", fontStyle: entity.meta_description ? "normal" : "italic", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                              {entity.meta_description || "(uses description)"}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: "10px 16px", textAlign: "center" }}>
                          <div className="flex items-center justify-center gap-1">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => saveSEO(entity)}
                                  disabled={saving}
                                  style={{
                                    fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 500,
                                    letterSpacing: "0.04em", textTransform: "uppercase",
                                    color: "var(--color-white)", backgroundColor: "var(--color-accent)",
                                    border: "none", borderRadius: "var(--radius-md)", padding: "3px 8px",
                                    cursor: saving ? "not-allowed" : "pointer",
                                  }}
                                >
                                  {saving ? "..." : "Save"}
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  style={{
                                    fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 500,
                                    letterSpacing: "0.04em", textTransform: "uppercase",
                                    color: "var(--color-muted)", backgroundColor: "transparent",
                                    border: "1px solid var(--color-gray-700)", borderRadius: "var(--radius-md)",
                                    padding: "3px 8px", cursor: "pointer",
                                  }}
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEditing(entity)}
                                  style={{
                                    fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 500,
                                    letterSpacing: "0.04em", textTransform: "uppercase",
                                    color: "var(--color-accent)", backgroundColor: "transparent",
                                    border: "1px solid rgba(46,74,249,0.3)", borderRadius: "var(--radius-md)",
                                    padding: "3px 8px", cursor: "pointer",
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => setPreviewEntity(previewEntity?.id === entity.id ? null : entity)}
                                  style={{
                                    fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 500,
                                    letterSpacing: "0.04em", textTransform: "uppercase",
                                    color: previewEntity?.id === entity.id ? "var(--color-light)" : "var(--color-muted)",
                                    backgroundColor: previewEntity?.id === entity.id ? "var(--color-accent-dim)" : "transparent",
                                    border: previewEntity?.id === entity.id ? "1px solid rgba(46,74,249,0.3)" : "1px solid var(--color-gray-700)",
                                    borderRadius: "var(--radius-md)", padding: "3px 8px", cursor: "pointer",
                                  }}
                                >
                                  Preview
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Google Preview Panel */}
        {previewEntity && (
          <div
            style={{
              width: 380,
              flexShrink: 0,
              backgroundColor: "var(--color-deep-navy)",
              border: "1px solid var(--color-gray-700)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-4)",
              height: "fit-content",
              position: "sticky",
              top: 80,
            }}
          >
            <h3 style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--color-muted)", marginBottom: "var(--space-3)" }}>
              Google Search Preview
            </h3>

            {/* Google-style preview */}
            <div style={{ padding: "var(--space-3)", backgroundColor: "var(--color-white)", borderRadius: "var(--radius-md)", marginBottom: "var(--space-3)" }}>
              <div style={{ fontFamily: "arial, sans-serif", marginBottom: 4 }}>
                <span style={{ fontSize: "13px", color: "#202124" }}>
                  {getGooglePreviewUrl(previewEntity)}
                </span>
              </div>
              <div style={{ fontSize: "18px", color: "#1a0dab", fontFamily: "arial, sans-serif", fontWeight: 400, lineHeight: 1.3, marginBottom: 3 }}>
                {previewEntity.meta_title || previewEntity.title}
              </div>
              <div style={{ fontSize: "13px", color: "#4d5156", fontFamily: "arial, sans-serif", lineHeight: 1.4 }}>
                {previewEntity.meta_description ||
                  previewEntity.description?.slice(0, 160) ||
                  "No description available. Add a meta description to control how this page appears in search results."}
              </div>
            </div>

            {/* SEO details */}
            <div style={{ marginBottom: "var(--space-3)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--color-muted)", marginBottom: "var(--space-2)" }}>
                SEO Checklist
              </div>

              {[
                {
                  label: "Meta title",
                  ok: !!previewEntity.meta_title,
                  hint: previewEntity.meta_title
                    ? `${previewEntity.meta_title.length} chars`
                    : "Missing — will use entity title",
                },
                {
                  label: "Meta description",
                  ok: !!previewEntity.meta_description,
                  hint: previewEntity.meta_description
                    ? `${previewEntity.meta_description.length} chars (recommended: 120–160)`
                    : "Missing — will auto-generate",
                },
                {
                  label: "Description length",
                  ok: !!previewEntity.meta_description && previewEntity.meta_description.length >= 120,
                  hint: previewEntity.meta_description
                    ? `${previewEntity.meta_description.length} chars`
                    : "No description",
                },
                {
                  label: "Slug",
                  ok: true,
                  hint: `/${previewEntity.slug}`,
                },
                {
                  label: "Published",
                  ok: previewEntity.is_published,
                  hint: previewEntity.is_published ? "Visible in sitemap" : "Not in sitemap",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-2" style={{ padding: "4px 0" }}>
                  <span style={{ color: item.ok ? "#4ADE80" : "#F87171", fontSize: "12px", lineHeight: "16px", flexShrink: 0 }}>
                    {item.ok ? "✓" : "✗"}
                  </span>
                  <div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", color: "var(--color-light)", fontWeight: 500 }}>
                      {item.label}
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--color-muted)" }}>
                      {item.hint}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setPreviewEntity(null)}
              style={{
                width: "100%",
                fontFamily: "var(--font-mono)", fontSize: "11px",
                color: "var(--color-muted)", background: "none", border: "none",
                cursor: "pointer", padding: "4px",
              }}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
