"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Media } from "@/lib/supabase/types";

// ── Helpers ──────────────────────────────────────────────────────

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatMimeType(mime: string | null): string {
  if (!mime) return "Unknown";
  if (mime.startsWith("image/")) return "Image";
  if (mime.startsWith("video/")) return "Video";
  if (mime.startsWith("application/pdf")) return "PDF";
  if (mime.includes("word") || mime.includes("document")) return "Document";
  if (mime.includes("sheet") || mime.includes("excel")) return "Spreadsheet";
  return "File";
}

function isImage(mime: string | null): boolean {
  return !!mime && mime.startsWith("image/");
}

type FilterType = "all" | "image" | "video" | "document";

// ── Component ────────────────────────────────────────────────────

export default function MediaLibraryPage() {
  const [media, setMedia] = useState<Media[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [selected, setSelected] = useState<Media | null>(null);
  const [editingAlt, setEditingAlt] = useState<string | null>(null);
  const [editingCaption, setEditingCaption] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load media
  const loadMedia = useCallback(async () => {
    try {
      const supabase = createClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase.from("media") as any)
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      setMedia((data ?? []) as Media[]);
    } catch {
      // Silently fail
    }
    setLoaded(true);
  }, []);

  if (!loaded) {
    loadMedia();
  }

  // Filtered media
  const filtered = useMemo(() => {
    let result = media;

    if (filterType !== "all") {
      result = result.filter((m) => {
        if (filterType === "image") return isImage(m.mime_type);
        if (filterType === "video") return !!m.mime_type?.startsWith("video/");
        // document
        return (
          !!m.mime_type &&
          !m.mime_type.startsWith("image/") &&
          !m.mime_type.startsWith("video/")
        );
      });
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.filename.toLowerCase().includes(q) ||
          (m.alt_text ?? "").toLowerCase().includes(q) ||
          (m.caption ?? "").toLowerCase().includes(q)
      );
    }

    return result;
  }, [media, filterType, search]);

  // Upload handler
  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/media", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const body = await res.json();
          if (body.data) {
            setMedia((prev) => [body.data as Media, ...prev]);
          }
        }
      } catch {
        // Continue with next file
      }
    }

    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  // Drag & drop handlers
  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files);
  }

  // Save metadata
  async function saveMetadata(id: string) {
    setSaving(true);
    try {
      const res = await fetch(`/api/media/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alt_text: editingAlt,
          caption: editingCaption,
        }),
      });

      if (res.ok) {
        const body = await res.json();
        if (body.data) {
          setMedia((prev) =>
            prev.map((m) => (m.id === id ? (body.data as Media) : m))
          );
          if (selected?.id === id) {
            setSelected(body.data as Media);
          }
        }
      }
    } catch {
      // Silently fail
    }
    setEditingAlt(null);
    setEditingCaption(null);
    setSaving(false);
  }

  // Delete media
  async function deleteMedia(id: string) {
    try {
      const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMedia((prev) => prev.filter((m) => m.id !== id));
        if (selected?.id === id) {
          setSelected(null);
        }
      }
    } catch {
      // Silently fail
    }
    setDeleteConfirm(null);
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--color-light)" }}>
            Media Library
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-muted)", marginTop: "var(--space-1)" }}>
            {media.length} files
          </p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            fontWeight: 500,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "var(--color-white)",
            backgroundColor: uploading ? "var(--color-gray-600)" : "var(--color-accent)",
            borderRadius: "var(--radius-md)",
            padding: "8px 16px",
            border: "none",
            cursor: uploading ? "not-allowed" : "pointer",
          }}
        >
          {uploading ? "Uploading..." : "+ Upload"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"
          onChange={(e) => handleUpload(e.target.files)}
          style={{ display: "none" }}
        />
      </div>

      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="mb-4"
        style={{
          padding: "var(--space-8)",
          border: `2px dashed ${dragOver ? "var(--color-accent)" : "var(--color-gray-700)"}`,
          borderRadius: "var(--radius-lg)",
          backgroundColor: dragOver ? "rgba(46,74,249,0.06)" : "var(--color-deep-navy)",
          textAlign: "center",
          transition: "all 150ms",
          cursor: "pointer",
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke={dragOver ? "var(--color-accent)" : "var(--color-muted)"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ margin: "0 auto var(--space-2)" }}
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: dragOver ? "var(--color-light)" : "var(--color-muted)" }}>
          {dragOver ? "Drop files here" : "Drag & drop files or click to browse"}
        </p>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--color-gray-500)", marginTop: "var(--space-1)" }}>
          Max 20MB — Images, videos, documents
        </p>
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
            placeholder="Search media..."
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

        {/* Type filter tabs */}
        <div className="flex gap-1">
          {(["all", "image", "video", "document"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: filterType === t ? "var(--color-light)" : "var(--color-muted)",
                backgroundColor: filterType === t ? "var(--color-accent-dim)" : "transparent",
                border: filterType === t ? "1px solid rgba(46,74,249,0.3)" : "1px solid transparent",
                borderRadius: "var(--radius-md)",
                padding: "4px 10px",
                cursor: "pointer",
                transition: "all 150ms",
              }}
            >
              {t === "all" ? "All" : t === "image" ? "Images" : t === "video" ? "Videos" : "Docs"}
            </button>
          ))}
        </div>
      </div>

      {/* Content area: grid + detail panel */}
      <div className="flex gap-4">
        {/* Grid */}
        <div className="flex-1 min-w-0">
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
            {filtered.length === 0 && loaded && (
              <div style={{ gridColumn: "1 / -1", padding: "var(--space-12) var(--space-4)", textAlign: "center" }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-muted)" }}>
                  {media.length === 0 ? "No media uploaded yet." : "No files match your filters."}
                </p>
              </div>
            )}

            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelected(item);
                  setEditingAlt(item.alt_text);
                  setEditingCaption(item.caption);
                }}
                style={{
                  backgroundColor: "var(--color-deep-navy)",
                  border: selected?.id === item.id ? "2px solid var(--color-accent)" : "1px solid var(--color-gray-700)",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "border-color 150ms",
                }}
              >
                {/* Thumbnail */}
                <div
                  style={{
                    height: 140,
                    backgroundColor: "var(--color-dark)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  {isImage(item.mime_type) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.original_url}
                      alt={item.alt_text || item.filename}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-gray-500)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: "8px 10px" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-xs)",
                      fontWeight: 500,
                      color: "var(--color-light)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.filename}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "10px",
                      color: "var(--color-gray-500)",
                      marginTop: 2,
                    }}
                  >
                    {formatMimeType(item.mime_type)} · {formatFileSize(item.file_size)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div
            style={{
              width: 320,
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
            {/* Preview */}
            <div style={{ marginBottom: "var(--space-4)", borderRadius: "var(--radius-md)", overflow: "hidden", backgroundColor: "var(--color-dark)" }}>
              {isImage(selected.mime_type) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selected.original_url}
                  alt={selected.alt_text || selected.filename}
                  style={{ width: "100%", maxHeight: 200, objectFit: "contain" }}
                />
              ) : (
                <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-gray-500)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
              )}
            </div>

            {/* Filename */}
            <h3 style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-light)", marginBottom: "var(--space-3)", wordBreak: "break-all" }}>
              {selected.filename}
            </h3>

            {/* Metadata */}
            <div style={{ marginBottom: "var(--space-4)" }}>
              {[
                ["Type", formatMimeType(selected.mime_type)],
                ["Size", formatFileSize(selected.file_size)],
                ["MIME", selected.mime_type || "—"],
                ["Uploaded", new Date(selected.created_at).toLocaleDateString()],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between" style={{ padding: "4px 0", borderBottom: "1px solid var(--color-gray-700)" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--color-muted)" }}>
                    {label}
                  </span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", color: "var(--color-light)", textAlign: "right", maxWidth: "60%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Editable fields */}
            <div style={{ marginBottom: "var(--space-3)" }}>
              <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--color-muted)", marginBottom: 4 }}>
                Alt Text
              </label>
              <input
                type="text"
                value={editingAlt ?? ""}
                onChange={(e) => setEditingAlt(e.target.value)}
                placeholder="Describe this image..."
                className="w-full"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-xs)",
                  color: "var(--color-light)",
                  backgroundColor: "var(--color-dark)",
                  border: "1px solid var(--color-gray-700)",
                  borderRadius: "var(--radius-md)",
                  padding: "6px 10px",
                  outline: "none",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-accent)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-gray-700)"; }}
              />
            </div>

            <div style={{ marginBottom: "var(--space-4)" }}>
              <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--color-muted)", marginBottom: 4 }}>
                Caption
              </label>
              <textarea
                value={editingCaption ?? ""}
                onChange={(e) => setEditingCaption(e.target.value)}
                placeholder="Optional caption..."
                rows={2}
                className="w-full"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-xs)",
                  color: "var(--color-light)",
                  backgroundColor: "var(--color-dark)",
                  border: "1px solid var(--color-gray-700)",
                  borderRadius: "var(--radius-md)",
                  padding: "6px 10px",
                  outline: "none",
                  resize: "vertical",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-accent)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-gray-700)"; }}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => saveMetadata(selected.id)}
                disabled={saving}
                style={{
                  flex: 1,
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: "var(--color-white)",
                  backgroundColor: saving ? "var(--color-gray-600)" : "var(--color-accent)",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  padding: "6px 12px",
                  cursor: saving ? "not-allowed" : "pointer",
                }}
              >
                {saving ? "Saving..." : "Save"}
              </button>

              {deleteConfirm === selected.id ? (
                <div className="flex gap-1">
                  <button
                    onClick={() => deleteMedia(selected.id)}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      fontWeight: 500,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      color: "var(--color-white)",
                      backgroundColor: "#EF4444",
                      border: "none",
                      borderRadius: "var(--radius-md)",
                      padding: "6px 12px",
                      cursor: "pointer",
                    }}
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(null)}
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
                      padding: "6px 12px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setDeleteConfirm(selected.id)}
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
                    padding: "6px 12px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              )}
            </div>

            {/* Close */}
            <button
              onClick={() => setSelected(null)}
              style={{
                width: "100%",
                marginTop: "var(--space-3)",
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--color-muted)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
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
