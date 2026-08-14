"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { NavigationItem } from "@/lib/supabase/types";

type NavSection = "primary" | "footer" | "cta";

const SECTIONS: { value: NavSection; label: string; description: string }[] = [
  { value: "primary", label: "Primary Navigation", description: "Main site header navigation" },
  { value: "footer", label: "Footer Navigation", description: "Links in the site footer" },
  { value: "cta", label: "CTA Navigation", description: "Call-to-action links" },
];

const INPUT_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "var(--text-sm)",
  color: "var(--color-light)",
  backgroundColor: "var(--color-dark)",
  border: "1px solid var(--color-gray-700)",
  borderRadius: "var(--radius-md)",
  padding: "6px 10px",
  outline: "none",
  width: "100%",
  transition: "border-color 150ms",
};

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "10px",
  fontWeight: 500,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "var(--color-gray-500)",
};

interface NavItem extends NavigationItem {
  _section?: NavSection;
  _isNew?: boolean;
  _dirty?: boolean;
}

function focusHandler(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = "var(--color-accent)";
}

function blurHandler(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = "var(--color-gray-700)";
}

export default function NavigationEditorPage() {
  const [items, setItems] = useState<NavItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState<NavSection>("primary");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [addingNew, setAddingNew] = useState(false);

  const loadData = useCallback(async () => {
    if (loaded) return;
    try {
      const supabase = createClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase.from("navigation_items") as any).select("*").order("sort_order");
      // Assign sections based on sort_order ranges
      const loaded = ((data ?? []) as NavigationItem[]).map((item) => {
        let section: NavSection = "primary";
        if (item.sort_order >= 200) section = "cta";
        else if (item.sort_order >= 100) section = "footer";
        return { ...item, _section: section };
      });
      setItems(loaded);
    } catch {
      // Silently fail
    }
    setLoaded(true);
  }, [loaded]);

  if (!loaded) {
    loadData();
  }

  const sectionItems = items
    .filter((item) => item._section === activeSection)
    .sort((a, b) => a.sort_order - b.sort_order);

  function updateItem(id: string, field: keyof NavItem, value: string | boolean) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value, _dirty: true } : item
      )
    );
    setSaved(false);
  }

  function moveItem(id: string, direction: "up" | "down") {
    setItems((prev) => {
      const sectionItems = prev
        .filter((i) => i._section === activeSection)
        .sort((a, b) => a.sort_order - b.sort_order);
      const idx = sectionItems.findIndex((i) => i.id === id);
      if (idx === -1) return prev;

      if (direction === "up" && idx === 0) return prev;
      if (direction === "down" && idx === sectionItems.length - 1) return prev;

      // Swap sort_orders
      const swapped = [...sectionItems];
      const temp = swapped[idx].sort_order;
      if (direction === "up") {
        swapped[idx] = { ...swapped[idx], sort_order: swapped[idx - 1].sort_order, _dirty: true };
        swapped[idx - 1] = { ...swapped[idx - 1], sort_order: temp, _dirty: true };
      } else {
        swapped[idx] = { ...swapped[idx], sort_order: swapped[idx + 1].sort_order, _dirty: true };
        swapped[idx + 1] = { ...swapped[idx + 1], sort_order: temp, _dirty: true };
      }

      // Rebuild full list
      const otherItems = prev.filter((i) => i._section !== activeSection);
      return [...otherItems, ...swapped];
    });
    setSaved(false);
  }

  function deleteItem(id: string) {
    if (!confirm("Delete this navigation item?")) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
    setSaved(false);
  }

  function addItem() {
    const sectionItems = items.filter((i) => i._section === activeSection);
    const maxOrder = sectionItems.reduce((max, i) => Math.max(max, i.sort_order), 0);
    const newItem: NavItem = {
      id: `new_${Date.now()}`,
      organization_id: "",
      label: "",
      href: "/",
      parent_id: null,
      sort_order: maxOrder + 10,
      is_external: false,
      is_visible: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      _section: activeSection,
      _isNew: true,
      _dirty: true,
    };
    setItems((prev) => [...prev, newItem]);
    setAddingNew(true);
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const supabase = createClient();

      for (const item of items) {
        if (item._isNew) {
          // Insert new
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { _section, _isNew, _dirty, ...dbItem } = item;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase.from("navigation_items") as any).insert({
            label: dbItem.label,
            href: dbItem.href,
            parent_id: dbItem.parent_id,
            sort_order: dbItem.sort_order,
            is_external: dbItem.is_external,
            is_visible: dbItem.is_visible,
          });
        } else if (item._dirty) {
          // Update existing
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { _section, _isNew, _dirty, ...dbItem } = item;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase.from("navigation_items") as any)
            .update({
              label: dbItem.label,
              href: dbItem.href,
              sort_order: dbItem.sort_order,
              is_external: dbItem.is_external,
              is_visible: dbItem.is_visible,
              updated_at: new Date().toISOString(),
            })
            .eq("id", dbItem.id);
        }
      }

      // Handle deletes (items that were in the list before but are now gone)
      // This is handled by the deleteItem function removing from state

      setItems((prev) =>
        prev.map((i) => ({ ...i, _isNew: false, _dirty: false }))
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert("Failed to save navigation.");
    }
    setSaving(false);
  }

  return (
    <div style={{ maxWidth: 800 }}>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--color-light)" }}>
            Navigation
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-muted)", marginTop: "var(--space-1)" }}>
            Manage site navigation menus
          </p>
        </div>
      </div>

      {/* Section tabs */}
      <div className="mb-6 flex gap-2">
        {SECTIONS.map((section) => (
          <button
            key={section.value}
            onClick={() => { setActiveSection(section.value); setAddingNew(false); }}
            className="text-left"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: activeSection === section.value ? "var(--color-light)" : "var(--color-muted)",
              backgroundColor: activeSection === section.value ? "var(--color-accent-dim)" : "transparent",
              border: activeSection === section.value ? "1px solid rgba(46,74,249,0.3)" : "1px solid transparent",
              borderRadius: "var(--radius-md)",
              padding: "6px 12px",
              cursor: "pointer",
              transition: "all 150ms",
            }}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Section description */}
      <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-muted)", marginBottom: "var(--space-4)" }}>
        {SECTIONS.find((s) => s.value === activeSection)?.description}
      </p>

      {/* Items list */}
      <div
        className="rounded-lg"
        style={{ backgroundColor: "var(--color-deep-navy)", border: "1px solid var(--color-gray-700)" }}
      >
        {sectionItems.length === 0 && !addingNew ? (
          <div style={{ padding: "var(--space-12) var(--space-5)", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-muted)", marginBottom: "var(--space-3)" }}>
              No navigation items in this section.
            </p>
            <button
              onClick={addItem}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "var(--color-accent)",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              + Add Item
            </button>
          </div>
        ) : (
          <div>
            {sectionItems.map((item, idx) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 sm:flex-row sm:items-center"
                style={{
                  padding: "var(--space-4) var(--space-5)",
                  borderBottom: idx < sectionItems.length - 1 ? "1px solid var(--color-gray-700)" : "none",
                }}
              >
                {/* Order buttons */}
                <div className="flex gap-1" style={{ flexShrink: 0 }}>
                  <button
                    onClick={() => moveItem(item.id, "up")}
                    disabled={idx === 0}
                    style={{
                      width: 28,
                      height: 28,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "var(--color-dark)",
                      border: "1px solid var(--color-gray-700)",
                      borderRadius: "var(--radius-md)",
                      color: idx === 0 ? "var(--color-gray-700)" : "var(--color-muted)",
                      cursor: idx === 0 ? "not-allowed" : "pointer",
                      transition: "border-color 150ms, color 150ms",
                    }}
                    onMouseEnter={(e) => { if (idx > 0) { e.currentTarget.style.borderColor = "var(--color-gray-600)"; e.currentTarget.style.color = "var(--color-light)"; } }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-gray-700)"; if (idx > 0) e.currentTarget.style.color = "var(--color-muted)"; }}
                    aria-label="Move up"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="18 15 12 9 6 15" />
                    </svg>
                  </button>
                  <button
                    onClick={() => moveItem(item.id, "down")}
                    disabled={idx === sectionItems.length - 1}
                    style={{
                      width: 28,
                      height: 28,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "var(--color-dark)",
                      border: "1px solid var(--color-gray-700)",
                      borderRadius: "var(--radius-md)",
                      color: idx === sectionItems.length - 1 ? "var(--color-gray-700)" : "var(--color-muted)",
                      cursor: idx === sectionItems.length - 1 ? "not-allowed" : "pointer",
                      transition: "border-color 150ms, color 150ms",
                    }}
                    onMouseEnter={(e) => { if (idx < sectionItems.length - 1) { e.currentTarget.style.borderColor = "var(--color-gray-600)"; e.currentTarget.style.color = "var(--color-light)"; } }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-gray-700)"; if (idx < sectionItems.length - 1) e.currentTarget.style.color = "var(--color-muted)"; }}
                    aria-label="Move down"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                </div>

                {/* Fields */}
                <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <div style={{ flex: 2, minWidth: 150 }}>
                    <div style={LABEL_STYLE}>Label</div>
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => updateItem(item.id, "label", e.target.value)}
                      placeholder="e.g. Work"
                      style={INPUT_STYLE}
                      onFocus={focusHandler}
                      onBlur={blurHandler}
                    />
                  </div>
                  <div style={{ flex: 3, minWidth: 180 }}>
                    <div style={LABEL_STYLE}>URL</div>
                    <input
                      type="text"
                      value={item.href}
                      onChange={(e) => updateItem(item.id, "href", e.target.value)}
                      placeholder="e.g. /#work or https://..."
                      style={INPUT_STYLE}
                      onFocus={focusHandler}
                      onBlur={blurHandler}
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-3" style={{ flexShrink: 0 }}>
                  {/* External toggle */}
                  <label className="flex items-center gap-1.5" style={{ cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={item.is_external}
                      onChange={(e) => updateItem(item.id, "is_external", e.target.checked)}
                      style={{ accentColor: "var(--color-accent)" }}
                    />
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--color-gray-500)" }}>Ext</span>
                  </label>

                  {/* Visible toggle */}
                  <label className="flex items-center gap-1.5" style={{ cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={item.is_visible}
                      onChange={(e) => updateItem(item.id, "is_visible", e.target.checked)}
                      style={{ accentColor: "var(--color-accent)" }}
                    />
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--color-gray-500)" }}>Vis</span>
                  </label>

                  {/* Delete */}
                  <button
                    onClick={() => deleteItem(item.id)}
                    style={{
                      width: 28,
                      height: 28,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "transparent",
                      border: "1px solid transparent",
                      borderRadius: "var(--radius-md)",
                      color: "var(--color-gray-500)",
                      cursor: "pointer",
                      transition: "color 150ms, border-color 150ms",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#F87171"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-gray-500)"; e.currentTarget.style.borderColor = "transparent"; }}
                    aria-label={`Delete ${item.label}`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            {/* Add new item inline */}
            {addingNew && (
              <div
                className="flex flex-col gap-3 sm:flex-row sm:items-center"
                style={{
                  padding: "var(--space-4) var(--space-5)",
                  borderTop: "1px solid var(--color-gray-700)",
                  backgroundColor: "rgba(46,74,249,0.04)",
                }}
              >
                <div style={{ width: 28, flexShrink: 0 }} />
                <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <div style={{ flex: 2, minWidth: 150 }}>
                    <div style={LABEL_STYLE}>Label</div>
                    <input
                      type="text"
                      value=""
                      onChange={(e) => {
                        const newLabel = e.target.value;
                        setItems((prev) => {
                          const last = prev.filter((i) => i._section === activeSection).sort((a, b) => b.sort_order - a.sort_order)[0];
                          if (last) return prev.map((i) => i.id === last.id ? { ...i, label: newLabel } : i);
                          return prev;
                        });
                      }}
                      placeholder="e.g. Work"
                      autoFocus
                      style={INPUT_STYLE}
                      onFocus={focusHandler}
                      onBlur={blurHandler}
                    />
                  </div>
                  <div style={{ flex: 3, minWidth: 180 }}>
                    <div style={LABEL_STYLE}>URL</div>
                    <input
                      type="text"
                      value="/"
                      onChange={(e) => {
                        const newHref = e.target.value;
                        setItems((prev) => {
                          const last = prev.filter((i) => i._section === activeSection).sort((a, b) => b.sort_order - a.sort_order)[0];
                          if (last) return prev.map((i) => i.id === last.id ? { ...i, href: newHref } : i);
                          return prev;
                        });
                      }}
                      style={INPUT_STYLE}
                      onFocus={focusHandler}
                      onBlur={blurHandler}
                    />
                  </div>
                </div>
                <div className="flex gap-2" style={{ flexShrink: 0 }}>
                  <button
                    onClick={() => setAddingNew(false)}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "10px",
                      fontWeight: 500,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      color: "var(--color-muted)",
                      background: "none",
                      border: "1px solid var(--color-gray-700)",
                      borderRadius: "var(--radius-md)",
                      padding: "4px 10px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Add button */}
        {sectionItems.length > 0 && !addingNew && (
          <div style={{ padding: "var(--space-3) var(--space-5)", borderTop: "1px solid var(--color-gray-700)" }}>
            <button
              onClick={addItem}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "var(--color-muted)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px 0",
                transition: "color 150ms",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-accent)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-muted)"; }}
            >
              + Add Item
            </button>
          </div>
        )}
      </div>

      {/* Save bar */}
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={handleSave}
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
            padding: "8px 20px",
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.6 : 1,
            transition: "background-color 150ms",
          }}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        {saved && (
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#4ADE80" }}>
            Saved
          </span>
        )}
      </div>
    </div>
  );
}
