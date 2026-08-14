"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type SettingsTab = "general" | "seo" | "analytics" | "social" | "appearance" | "maintenance";

const TABS: { value: SettingsTab; label: string }[] = [
  { value: "general", label: "General" },
  { value: "seo", label: "SEO" },
  { value: "analytics", label: "Analytics" },
  { value: "social", label: "Social" },
  { value: "appearance", label: "Appearance" },
  { value: "maintenance", label: "Maintenance" },
];

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

const DESCRIPTION_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "12px",
  color: "var(--color-gray-500)",
  marginTop: 4,
};

// Default setting keys organized by tab
const SETTING_KEYS: Record<SettingsTab, string[]> = {
  general: ["company_name", "company_tagline", "company_logo_url", "contact_email", "contact_phone", "contact_address"],
  seo: ["seo_default_title", "seo_default_description", "seo_og_image"],
  analytics: ["analytics_ga_id", "analytics_gtm_id", "analytics_meta_pixel"],
  social: ["social_twitter", "social_linkedin", "social_github", "social_facebook", "social_instagram"],
  appearance: ["appearance_accent_color", "appearance_favicon_url"],
  maintenance: ["maintenance_mode"],
};

const KEY_LABELS: Record<string, string> = {
  company_name: "Company Name",
  company_tagline: "Tagline",
  company_logo_url: "Logo URL",
  contact_email: "Contact Email",
  contact_phone: "Phone Number",
  contact_address: "Address",
  seo_default_title: "Default Meta Title",
  seo_default_description: "Default Meta Description",
  seo_og_image: "OG Image URL",
  analytics_ga_id: "Google Analytics ID",
  analytics_gtm_id: "Google Tag Manager ID",
  analytics_meta_pixel: "Meta Pixel ID",
  social_twitter: "Twitter / X",
  social_linkedin: "LinkedIn",
  social_github: "GitHub",
  social_facebook: "Facebook",
  social_instagram: "Instagram",
  appearance_accent_color: "Accent Color",
  appearance_favicon_url: "Favicon URL",
  maintenance_mode: "Enable Maintenance Mode",
};

function focusHandler(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
  e.currentTarget.style.borderColor = "var(--color-accent)";
}

function blurHandler(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
  e.currentTarget.style.borderColor = "var(--color-gray-700)";
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const loadSettings = useCallback(async () => {
    if (loaded) return;
    try {
      const supabase = createClient();
      const { data } = await (supabase.from("settings") as any).select("key, value");
      if (data) {
        const map: Record<string, string> = {};
        for (const s of data as { key: string; value: string | null }[]) {
          map[s.key] = s.value ?? "";
        }
        setSettings(map);
      }
    } catch {
      // Silently fail
    }
    setLoaded(true);
  }, [loaded]);

  if (!loaded) {
    loadSettings();
  }

  function updateSetting(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const supabase = createClient();
      const keys = SETTING_KEYS[activeTab];

      for (const key of keys) {
        const value = settings[key] ?? "";
        // Upsert: try update first, insert if not found
        const { data: existing } = await (supabase.from("settings") as any).select("id").eq("key", key).single();

        if (existing) {
          await (supabase.from("settings") as any).update({ value, updated_at: new Date().toISOString() }).eq("key", key);
        } else {
          await (supabase.from("settings") as any).insert({ key, value, type: "string" });
        }
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert("Failed to save settings.");
    }
    setSaving(false);
  }

  function renderInput(key: string, placeholder: string, type: "text" | "url" | "email" | "color" = "text") {
    return (
      <div key={key}>
        <label style={LABEL_STYLE}>{KEY_LABELS[key] ?? key}</label>
        <input
          type={type}
          value={settings[key] ?? ""}
          onChange={(e) => updateSetting(key, e.target.value)}
          placeholder={placeholder}
          style={type === "color" ? { ...INPUT_STYLE, height: 40, padding: "4px 8px", cursor: "pointer" } : INPUT_STYLE}
          onFocus={focusHandler}
          onBlur={blurHandler}
        />
      </div>
    );
  }

  function renderTextarea(key: string, placeholder: string) {
    return (
      <div key={key}>
        <label style={LABEL_STYLE}>{KEY_LABELS[key] ?? key}</label>
        <textarea
          value={settings[key] ?? ""}
          onChange={(e) => updateSetting(key, e.target.value)}
          placeholder={placeholder}
          rows={3}
          style={{ ...INPUT_STYLE, resize: "vertical", minHeight: 72 }}
          onFocus={focusHandler}
          onBlur={blurHandler}
        />
      </div>
    );
  }

  function renderToggle(key: string) {
    const enabled = settings[key] === "true";
    return (
      <div key={key} className="flex items-center justify-between">
        <div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-light)" }}>
            {KEY_LABELS[key] ?? key}
          </div>
          <div style={DESCRIPTION_STYLE}>
            When enabled, the site shows a maintenance page to visitors
          </div>
        </div>
        <button
          type="button"
          onClick={() => updateSetting(key, enabled ? "false" : "true")}
          style={{
            width: 44,
            height: 24,
            borderRadius: 12,
            backgroundColor: enabled ? "var(--color-accent)" : "var(--color-gray-600)",
            border: "none",
            padding: 2,
            cursor: "pointer",
            position: "relative",
            transition: "background-color 200ms",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              backgroundColor: "white",
              position: "absolute",
              top: 2,
              left: enabled ? 22 : 2,
              transition: "left 200ms",
            }}
          />
        </button>
      </div>
    );
  }

  function renderTabContent() {
    switch (activeTab) {
      case "general":
        return (
          <div className="flex flex-col gap-5">
            {renderInput("company_name", "ByteBuildIT")}
            {renderInput("company_tagline", "We turn inefficient business processes into software")}
            {renderInput("company_logo_url", "https://...", "url")}
            <div className="grid gap-5 sm:grid-cols-2">
              {renderInput("contact_email", "hello@bytebuildit.com", "email")}
              {renderInput("contact_phone", "+1 (555) 000-0000")}
            </div>
            {renderInput("contact_address", "123 Main St, City, Country")}
          </div>
        );
      case "seo":
        return (
          <div className="flex flex-col gap-5">
            {renderInput("seo_default_title", "ByteBuildIT — Custom Software & Automation")}
            {renderTextarea("seo_default_description", "Default meta description for all pages...")}
            {renderInput("seo_og_image", "https://.../og-image.png", "url")}
            <div style={DESCRIPTION_STYLE}>
              These defaults are used when individual pages don&apos;t specify their own SEO settings.
            </div>
          </div>
        );
      case "analytics":
        return (
          <div className="flex flex-col gap-5">
            {renderInput("analytics_ga_id", "G-XXXXXXXXXX")}
            <div style={DESCRIPTION_STYLE}>Google Analytics 4 measurement ID</div>
            {renderInput("analytics_gtm_id", "GTM-XXXXXXX")}
            <div style={DESCRIPTION_STYLE}>Google Tag Manager container ID</div>
            {renderInput("analytics_meta_pixel", "000000000000000")}
            <div style={DESCRIPTION_STYLE}>Meta (Facebook) Pixel ID</div>
          </div>
        );
      case "social":
        return (
          <div className="flex flex-col gap-5">
            {renderInput("social_twitter", "https://x.com/yourhandle", "url")}
            {renderInput("social_linkedin", "https://linkedin.com/company/yourcompany", "url")}
            {renderInput("social_github", "https://github.com/yourorg", "url")}
            {renderInput("social_facebook", "https://facebook.com/yourpage", "url")}
            {renderInput("social_instagram", "https://instagram.com/yourhandle", "url")}
          </div>
        );
      case "appearance":
        return (
          <div className="flex flex-col gap-5">
            {renderInput("appearance_accent_color", "#2E4AF9", "color")}
            <div style={DESCRIPTION_STYLE}>Used for buttons, links, and accent elements</div>
            {renderInput("appearance_favicon_url", "https://.../favicon.ico", "url")}
          </div>
        );
      case "maintenance":
        return (
          <div className="flex flex-col gap-5">
            {renderToggle("maintenance_mode")}
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div style={{ maxWidth: 800 }}>
      {/* Header */}
      <div className="mb-6">
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--color-light)" }}>
          Settings
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-muted)", marginTop: "var(--space-1)" }}>
          Manage global site configuration
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Tab nav */}
        <nav className="flex gap-1 lg:flex-col" style={{ minWidth: 160 }}>
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className="text-left"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-sm)",
                fontWeight: activeTab === tab.value ? 500 : 400,
                color: activeTab === tab.value ? "var(--color-light)" : "var(--color-muted)",
                backgroundColor: activeTab === tab.value ? "var(--color-accent-dim)" : "transparent",
                border: "none",
                borderRadius: "var(--radius-md)",
                padding: "8px 12px",
                cursor: "pointer",
                transition: "all 150ms",
                whiteSpace: "nowrap",
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Tab content */}
        <div
          className="flex-1 rounded-lg"
          style={{ backgroundColor: "var(--color-deep-navy)", border: "1px solid var(--color-gray-700)" }}
        >
          <div style={{ padding: "var(--space-5)", borderBottom: "1px solid var(--color-gray-700)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-base)", fontWeight: 600, color: "var(--color-light)" }}>
              {TABS.find((t) => t.value === activeTab)?.label} Settings
            </h2>
          </div>

          <div style={{ padding: "var(--space-5)" }}>
            {renderTabContent()}
          </div>

          {/* Save bar */}
          <div
            className="flex items-center gap-3"
            style={{ padding: "var(--space-4) var(--space-5)", borderTop: "1px solid var(--color-gray-700)" }}
          >
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
      </div>
    </div>
  );
}
