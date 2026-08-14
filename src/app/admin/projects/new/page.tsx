"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Industry, Solution } from "@/lib/supabase/types";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

interface ProjectForm {
  title: string;
  slug: string;
  description: string;
  content: string;
  problem: string;
  solution: string;
  outcomes: string;
  industry_id: string;
  service_id: string;
  technologies: string[];
  thumbnail_url: string;
  live_url: string;
  repo_url: string;
  is_featured: boolean;
  status: "draft" | "published" | "scheduled";
  // SEO
  meta_title: string;
  meta_description: string;
}

const EMPTY_FORM: ProjectForm = {
  title: "",
  slug: "",
  description: "",
  content: "",
  problem: "",
  solution: "",
  outcomes: "",
  industry_id: "",
  service_id: "",
  technologies: [],
  thumbnail_url: "",
  live_url: "",
  repo_url: "",
  is_featured: false,
  status: "draft",
  meta_title: "",
  meta_description: "",
};

const INPUT_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "var(--text-sm)",
  color: "var(--color-light)",
  backgroundColor: "var(--color-dark)",
  border: "1px solid var(--color-gray-700)",
  borderRadius: "var(--radius-md)",
  padding: "8px 12px",
  outline: "none",
  width: "100%",
  transition: "border-color 150ms",
};

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "11px",
  fontWeight: 500,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "var(--color-muted)",
  display: "block",
  marginBottom: "6px",
};

export default function NewProjectPage() {
  const router = useRouter();
  const [form, setForm] = useState<ProjectForm>(EMPTY_FORM);
  const [techInput, setTechInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [seoOpen, setSeoOpen] = useState(false);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loaded, setLoaded] = useState(false);

  const loadOptions = useCallback(async () => {
    if (loaded) return;
    try {
      const supabase = createClient();
      const [indRes, solRes] = await Promise.all([
        (supabase.from("industries") as any).select("*").order("name"),
        (supabase.from("solutions") as any).select("*").order("title"),
      ]);
      setIndustries((indRes.data ?? []) as Industry[]);
      setSolutions((solRes.data ?? []) as Solution[]);
    } catch {
      // Silently fail
    }
    setLoaded(true);
  }, [loaded]);

  if (!loaded) {
    loadOptions();
  }

  function update<K extends keyof ProjectForm>(key: K, value: ProjectForm[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      // Auto-generate slug from title
      if (key === "title" && !prev.slug) {
        next.slug = slugify(value as string);
      }
      return next;
    });
  }

  function addTechnology() {
    const tag = techInput.trim();
    if (tag && !form.technologies.includes(tag)) {
      update("technologies", [...form.technologies, tag]);
    }
    setTechInput("");
  }

  function removeTechnology(tag: string) {
    update("technologies", form.technologies.filter((t) => t !== tag));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim()) {
      alert("Title and slug are required.");
      return;
    }

    setSaving(true);
    try {
      const supabase = createClient();
      const content = JSON.stringify({
        problem: form.problem,
        solution: form.solution,
        outcomes: form.outcomes,
        full_description: form.content,
      });

      const { error } = await (supabase.from("projects") as any).insert({
        title: form.title.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || null,
        content,
        industry_id: form.industry_id || null,
        service_id: form.service_id || null,
        technologies: form.technologies.length > 0 ? form.technologies : null,
        thumbnail_url: form.thumbnail_url.trim() || null,
        live_url: form.live_url.trim() || null,
        repo_url: form.repo_url.trim() || null,
        is_featured: form.is_featured,
        is_published: form.status === "published",
        published_at: form.status === "published" ? new Date().toISOString() : null,
      });

      if (error) throw error;
      router.push("/admin/projects");
    } catch (err) {
      alert(`Failed to create project: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
    setSaving(false);
  }

  const statusOptions = useMemo(
    () => [
      { value: "draft" as const, label: "Draft" },
      { value: "published" as const, label: "Published" },
      { value: "scheduled" as const, label: "Scheduled" },
    ],
    []
  );

  return (
    <div style={{ maxWidth: 800 }}>
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/admin/projects"
          className="flex items-center justify-center"
          style={{
            width: 32,
            height: 32,
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-gray-700)",
            color: "var(--color-muted)",
            textDecoration: "none",
            flexShrink: 0,
            transition: "border-color 150ms",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--color-gray-600)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-gray-700)"; }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--color-light)" }}>
            New Project
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-muted)", marginTop: "var(--space-1)" }}>
            Create a new case study
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Main content card */}
        <div
          className="mb-6 rounded-lg"
          style={{ backgroundColor: "var(--color-deep-navy)", border: "1px solid var(--color-gray-700)" }}
        >
          <div style={{ padding: "var(--space-5)", borderBottom: "1px solid var(--color-gray-700)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-base)", fontWeight: 600, color: "var(--color-light)" }}>
              Content
            </h2>
          </div>

          <div className="flex flex-col gap-5" style={{ padding: "var(--space-5)" }}>
            {/* Title */}
            <div>
              <label style={LABEL_STYLE}>Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="e.g. Order Management Platform"
                style={INPUT_STYLE}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-accent)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-gray-700)"; }}
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label style={LABEL_STYLE}>Slug *</label>
              <div className="flex items-center gap-2">
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--color-gray-500)", flexShrink: 0 }}>/projects/</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => update("slug", e.target.value)}
                  placeholder="auto-generated-from-title"
                  style={INPUT_STYLE}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-accent)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-gray-700)"; }}
                  required
                />
              </div>
            </div>

            {/* Short description */}
            <div>
              <label style={LABEL_STYLE}>Short Description</label>
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Brief summary for listings and previews..."
                rows={2}
                style={{ ...INPUT_STYLE, resize: "vertical", minHeight: 60 }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-accent)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-gray-700)"; }}
              />
            </div>

            {/* Problem */}
            <div>
              <label style={LABEL_STYLE}>Problem</label>
              <textarea
                value={form.problem}
                onChange={(e) => update("problem", e.target.value)}
                placeholder="What was the client's challenge or broken process?"
                rows={3}
                style={{ ...INPUT_STYLE, resize: "vertical", minHeight: 80 }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-accent)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-gray-700)"; }}
              />
            </div>

            {/* Solution */}
            <div>
              <label style={LABEL_STYLE}>Solution</label>
              <textarea
                value={form.solution}
                onChange={(e) => update("solution", e.target.value)}
                placeholder="What was built and how does it work?"
                rows={3}
                style={{ ...INPUT_STYLE, resize: "vertical", minHeight: 80 }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-accent)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-gray-700)"; }}
              />
            </div>

            {/* Outcomes */}
            <div>
              <label style={LABEL_STYLE}>Outcomes</label>
              <textarea
                value={form.outcomes}
                onChange={(e) => update("outcomes", e.target.value)}
                placeholder="Results, metrics, impact..."
                rows={3}
                style={{ ...INPUT_STYLE, resize: "vertical", minHeight: 80 }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-accent)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-gray-700)"; }}
              />
            </div>

            {/* Full description */}
            <div>
              <label style={LABEL_STYLE}>Full Description</label>
              <textarea
                value={form.content}
                onChange={(e) => update("content", e.target.value)}
                placeholder="Detailed project description..."
                rows={5}
                style={{ ...INPUT_STYLE, resize: "vertical", minHeight: 120 }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-accent)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-gray-700)"; }}
              />
            </div>
          </div>
        </div>

        {/* Classification card */}
        <div
          className="mb-6 rounded-lg"
          style={{ backgroundColor: "var(--color-deep-navy)", border: "1px solid var(--color-gray-700)" }}
        >
          <div style={{ padding: "var(--space-5)", borderBottom: "1px solid var(--color-gray-700)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-base)", fontWeight: 600, color: "var(--color-light)" }}>
              Classification
            </h2>
          </div>

          <div className="flex flex-col gap-5" style={{ padding: "var(--space-5)" }}>
            <div className="grid gap-5 sm:grid-cols-2">
              {/* Industry */}
              <div>
                <label style={LABEL_STYLE}>Industry</label>
                <select
                  value={form.industry_id}
                  onChange={(e) => update("industry_id", e.target.value)}
                  style={{ ...INPUT_STYLE, appearance: "none", cursor: "pointer" }}
                >
                  <option value="">None</option>
                  {industries.map((ind) => (
                    <option key={ind.id} value={ind.id}>{ind.name}</option>
                  ))}
                </select>
              </div>

              {/* Service / Solution */}
              <div>
                <label style={LABEL_STYLE}>Service / Solution</label>
                <select
                  value={form.service_id}
                  onChange={(e) => update("service_id", e.target.value)}
                  style={{ ...INPUT_STYLE, appearance: "none", cursor: "pointer" }}
                >
                  <option value="">None</option>
                  {solutions.map((sol) => (
                    <option key={sol.id} value={sol.id}>{sol.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Technologies */}
            <div>
              <label style={LABEL_STYLE}>Technologies</label>
              <div className="flex flex-wrap gap-2" style={{ marginBottom: form.technologies.length > 0 ? 8 : 0 }}>
                {form.technologies.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1.5"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      fontWeight: 500,
                      color: "var(--color-accent)",
                      backgroundColor: "var(--color-accent-dim)",
                      border: "1px solid rgba(46,74,249,0.3)",
                      borderRadius: "var(--radius-full)",
                      padding: "3px 10px",
                    }}
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTechnology(tag)}
                      style={{ background: "none", border: "none", color: "var(--color-accent)", cursor: "pointer", padding: 0, fontSize: "14px", lineHeight: 1 }}
                      aria-label={`Remove ${tag}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTechnology(); } }}
                  placeholder="Add technology tag..."
                  style={{ ...INPUT_STYLE, flex: 1 }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-accent)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-gray-700)"; }}
                />
                <button
                  type="button"
                  onClick={addTechnology}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    fontWeight: 500,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: "var(--color-muted)",
                    backgroundColor: "var(--color-dark)",
                    border: "1px solid var(--color-gray-700)",
                    borderRadius: "var(--radius-md)",
                    padding: "6px 12px",
                    cursor: "pointer",
                    transition: "border-color 150ms",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--color-gray-600)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-gray-700)"; }}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Media & Links card */}
        <div
          className="mb-6 rounded-lg"
          style={{ backgroundColor: "var(--color-deep-navy)", border: "1px solid var(--color-gray-700)" }}
        >
          <div style={{ padding: "var(--space-5)", borderBottom: "1px solid var(--color-gray-700)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-base)", fontWeight: 600, color: "var(--color-light)" }}>
              Media & Links
            </h2>
          </div>

          <div className="flex flex-col gap-5" style={{ padding: "var(--space-5)" }}>
            {/* Cover image */}
            <div>
              <label style={LABEL_STYLE}>Cover Image</label>
              <div
                style={{
                  border: "2px dashed var(--color-gray-700)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-8) var(--space-4)",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "border-color 150ms",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--color-gray-600)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-gray-700)"; }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-gray-500)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto var(--space-3)" }}>
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-muted)" }}>
                  Click to upload or drag and drop
                </p>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--color-gray-500)", marginTop: 4 }}>
                  PNG, JPG, WebP up to 5MB
                </p>
              </div>
              <input
                type="text"
                value={form.thumbnail_url}
                onChange={(e) => update("thumbnail_url", e.target.value)}
                placeholder="Or enter image URL..."
                style={{ ...INPUT_STYLE, marginTop: 8 }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-accent)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-gray-700)"; }}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Live URL */}
              <div>
                <label style={LABEL_STYLE}>Live URL</label>
                <input
                  type="url"
                  value={form.live_url}
                  onChange={(e) => update("live_url", e.target.value)}
                  placeholder="https://..."
                  style={INPUT_STYLE}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-accent)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-gray-700)"; }}
                />
              </div>

              {/* Repo URL */}
              <div>
                <label style={LABEL_STYLE}>Repository URL</label>
                <input
                  type="url"
                  value={form.repo_url}
                  onChange={(e) => update("repo_url", e.target.value)}
                  placeholder="https://github.com/..."
                  style={INPUT_STYLE}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-accent)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-gray-700)"; }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Settings card */}
        <div
          className="mb-6 rounded-lg"
          style={{ backgroundColor: "var(--color-deep-navy)", border: "1px solid var(--color-gray-700)" }}
        >
          <div style={{ padding: "var(--space-5)", borderBottom: "1px solid var(--color-gray-700)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-base)", fontWeight: 600, color: "var(--color-light)" }}>
              Settings
            </h2>
          </div>

          <div className="flex flex-col gap-5" style={{ padding: "var(--space-5)" }}>
            <div className="grid gap-5 sm:grid-cols-2">
              {/* Status */}
              <div>
                <label style={LABEL_STYLE}>Status</label>
                <select
                  value={form.status}
                  onChange={(e) => update("status", e.target.value as ProjectForm["status"])}
                  style={{ ...INPUT_STYLE, appearance: "none", cursor: "pointer" }}
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Featured toggle */}
              <div>
                <label style={LABEL_STYLE}>Featured</label>
                <button
                  type="button"
                  onClick={() => update("is_featured", !form.is_featured)}
                  className="flex items-center gap-3"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-sm)",
                    color: form.is_featured ? "var(--color-accent)" : "var(--color-muted)",
                    backgroundColor: "transparent",
                    border: "1px solid var(--color-gray-700)",
                    borderRadius: "var(--radius-md)",
                    padding: "8px 12px",
                    cursor: "pointer",
                    width: "100%",
                    textAlign: "left",
                    transition: "border-color 150ms",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--color-gray-600)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-gray-700)"; }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: form.is_featured ? "var(--color-accent)" : "var(--color-gray-600)",
                      position: "relative",
                      transition: "background-color 200ms",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        backgroundColor: "white",
                        position: "absolute",
                        top: 2,
                        left: form.is_featured ? 18 : 2,
                        transition: "left 200ms",
                      }}
                    />
                  </div>
                  {form.is_featured ? "Featured" : "Not featured"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SEO card (collapsible) */}
        <div
          className="mb-6 rounded-lg"
          style={{ backgroundColor: "var(--color-deep-navy)", border: "1px solid var(--color-gray-700)" }}
        >
          <button
            type="button"
            onClick={() => setSeoOpen(!seoOpen)}
            className="flex w-full items-center justify-between"
            style={{
              padding: "var(--space-5)",
              background: "none",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-base)", fontWeight: 600, color: "var(--color-light)" }}>
              SEO
            </h2>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-muted)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transform: seoOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 200ms" }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {seoOpen && (
            <div className="flex flex-col gap-5" style={{ padding: "0 var(--space-5) var(--space-5)" }}>
              <div>
                <label style={LABEL_STYLE}>Meta Title</label>
                <input
                  type="text"
                  value={form.meta_title}
                  onChange={(e) => update("meta_title", e.target.value)}
                  placeholder="Defaults to project title if empty"
                  style={INPUT_STYLE}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-accent)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-gray-700)"; }}
                />
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--color-gray-500)", marginTop: 4 }}>
                  {form.meta_title.length}/60 characters
                </div>
              </div>

              <div>
                <label style={LABEL_STYLE}>Meta Description</label>
                <textarea
                  value={form.meta_description}
                  onChange={(e) => update("meta_description", e.target.value)}
                  placeholder="Brief description for search engines..."
                  rows={3}
                  style={{ ...INPUT_STYLE, resize: "vertical", minHeight: 72 }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-accent)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-gray-700)"; }}
                />
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--color-gray-500)", marginTop: 4 }}>
                  {form.meta_description.length}/160 characters
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action bar */}
        <div
          className="flex items-center gap-3"
          style={{ paddingTop: "var(--space-4)" }}
        >
          <button
            type="submit"
            disabled={saving}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              fontWeight: 500,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "var(--color-white)",
              backgroundColor: "var(--color-accent)",
              border: "none",
              borderRadius: "var(--radius-md)",
              padding: "10px 24px",
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.6 : 1,
              transition: "background-color 150ms",
            }}
          >
            {saving ? "Creating..." : "Create Project"}
          </button>
          <Link
            href="/admin/projects"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              fontWeight: 500,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "var(--color-muted)",
              backgroundColor: "transparent",
              border: "1px solid var(--color-gray-700)",
              borderRadius: "var(--radius-md)",
              padding: "10px 24px",
              textDecoration: "none",
              transition: "border-color 150ms, color 150ms",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--color-gray-600)"; e.currentTarget.style.color = "var(--color-light)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-gray-700)"; e.currentTarget.style.color = "var(--color-muted)"; }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
