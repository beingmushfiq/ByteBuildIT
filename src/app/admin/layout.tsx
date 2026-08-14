"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";

/* ── Nav structure ──────────────────────────────────────────── */
const NAV_GROUPS = [
  {
    label: "Content",
    items: [
      { label: "Dashboard",  href: "/admin",           icon: "⊡" },
      { label: "Projects",   href: "/admin/projects",  icon: "◈" },
      { label: "Leads",      href: "/admin/leads",     icon: "◎" },
      { label: "Media",      href: "/admin/media",     icon: "⊞" },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Users",      href: "/admin/users",     icon: "◷" },
      { label: "Audit Log",  href: "/admin/audit-log", icon: "≡" },
      { label: "SEO",        href: "/admin/seo",       icon: "◌" },
      { label: "Settings",   href: "/admin/settings",  icon: "⊕" },
    ],
  },
] as const;

/* ── Sidebar ─────────────────────────────────────────────────── */
function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sidebarRef.current) return;
    gsap.to(sidebarRef.current, {
      width: collapsed ? 56 : 220,
      duration: 0.3,
      ease: "power2.inOut",
    });
  }, [collapsed]);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === href : pathname.startsWith(href);

  return (
    <aside
      ref={sidebarRef}
      style={{
        width: 220,
        flexShrink: 0,
        height: "100vh",
        position: "sticky",
        top: 0,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--color-admin-panel)",
        borderRight: "1px solid var(--color-admin-border)",
        overflow: "hidden",
        zIndex: 10,
      }}
    >
      {/* Wordmark */}
      <div style={{
        height: 52,
        display: "flex",
        alignItems: "center",
        paddingLeft: collapsed ? 16 : 20,
        paddingRight: collapsed ? 16 : 20,
        borderBottom: "1px solid var(--color-admin-border)",
        flexShrink: 0,
        gap: "var(--space-3)",
      }}>
        <span style={{
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: "0.9rem", letterSpacing: "-0.02em",
          color: "var(--color-light)", whiteSpace: "nowrap",
          opacity: collapsed ? 0 : 1,
          transition: "opacity 200ms ease",
        }}>
          BYTE<span style={{ color: "var(--color-accent)" }}>CMS</span>
        </span>
        {collapsed && (
          <span style={{
            fontFamily: "var(--font-display)", fontWeight: 700,
            fontSize: "0.9rem", letterSpacing: "-0.02em",
            color: "var(--color-accent)", whiteSpace: "nowrap",
            position: "absolute", left: 16,
          }}>
            B
          </span>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "var(--space-3) var(--space-2)" }}>
        {NAV_GROUPS.map(group => (
          <div key={group.label} style={{ marginBottom: "var(--space-6)" }}>
            {!collapsed && (
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: "9px",
                fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase",
                color: "var(--color-gray-700)", padding: "0 var(--space-2)",
                marginBottom: "var(--space-1)",
              }}>
                {group.label}
              </div>
            )}
            {group.items.map(item => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-3)",
                    padding: "var(--space-2) var(--space-3)",
                    borderRadius: "var(--radius-lg)",
                    textDecoration: "none",
                    transition: "background-color 150ms ease",
                    backgroundColor: active ? "rgba(46,74,249,0.12)" : "transparent",
                    marginBottom: "2px",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)"; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "14px",
                    color: active ? "var(--color-accent)" : "var(--color-gray-500)",
                    flexShrink: 0,
                    width: 18,
                    textAlign: "center",
                    transition: "color 150ms ease",
                  }}>
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-sm)",
                      fontWeight: active ? 500 : 400,
                      color: active ? "var(--color-light)" : "var(--color-muted)",
                      transition: "color 150ms ease",
                    }}>
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom — collapse toggle */}
      <div style={{
        padding: "var(--space-3) var(--space-2)",
        borderTop: "1px solid var(--color-admin-border)",
        flexShrink: 0,
      }}>
        <button
          onClick={onToggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{
            display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start",
            gap: "var(--space-3)",
            width: "100%",
            padding: "var(--space-2) var(--space-3)",
            border: "none",
            backgroundColor: "transparent",
            cursor: "pointer",
            borderRadius: "var(--radius-lg)",
            transition: "background-color 150ms ease",
            fontFamily: "var(--font-mono)", fontSize: "11px",
            color: "var(--color-gray-600)",
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)")}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <span>{collapsed ? "→" : "←"}</span>
          {!collapsed && <span>Collapse</span>}
        </button>

        {/* User avatar */}
        {!collapsed && (
          <div style={{
            display: "flex", alignItems: "center", gap: "var(--space-3)",
            padding: "var(--space-3)",
            marginTop: "var(--space-2)",
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              backgroundColor: "var(--color-accent)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 600,
              color: "var(--color-white)", flexShrink: 0,
            }}>
              A
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-neutral)", fontWeight: 500 }}>
                Admin
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--color-gray-600)" }}>
                admin@bytebuildit.com
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

import ThemeToggle from "@/components/ui/ThemeToggle";
import { useTheme } from "@/components/ui/ThemeProvider";

/* ── Top bar ─────────────────────────────────────────────────── */
function TopBar({ onCommandPalette }: { onCommandPalette: () => void }) {
  const pathname = usePathname();

  // Derive page title from path
  const pageTitle = pathname === "/admin"
    ? "Dashboard"
    : pathname.split("/").filter(Boolean).pop()
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, c => c.toUpperCase())
    ?? "CMS";

  return (
    <header style={{
      height: 52,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      paddingLeft: "var(--space-6)",
      paddingRight: "var(--space-6)",
      borderBottom: "1px solid var(--color-admin-border)",
      backgroundColor: "var(--color-admin-bg)",
      position: "sticky",
      top: 0,
      zIndex: 5,
      flexShrink: 0,
    }}>
      <h1 style={{
        fontFamily: "var(--font-display)",
        fontSize: "var(--text-lg)",
        fontWeight: 600,
        letterSpacing: "-0.02em",
        color: "var(--color-light)",
      }}>
        {pageTitle}
      </h1>

      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
        {/* Theme Toggle */}
        <ThemeToggle variant="compact" />

        {/* Command palette trigger */}
        <button
          onClick={onCommandPalette}
          title="Command palette (⌘K)"
          style={{
            display: "flex", alignItems: "center", gap: "var(--space-2)",
            padding: "5px var(--space-3)",
            backgroundColor: "var(--color-bg-subtle)",
            border: "1px solid var(--color-admin-border)",
            borderRadius: "var(--radius-lg)",
            cursor: "pointer",
            fontFamily: "var(--font-mono)", fontSize: "11px",
            color: "var(--color-muted)",
            transition: "all 150ms ease",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = "var(--color-admin-hover)";
            e.currentTarget.style.color = "var(--color-light)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = "var(--color-bg-subtle)";
            e.currentTarget.style.color = "var(--color-muted)";
          }}
        >
          <span>⌘</span>
          <span>Search...</span>
          <kbd style={{
            fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--color-gray-600)",
            border: "1px solid var(--color-admin-border)", borderRadius: "var(--radius-xs)",
            padding: "1px 4px",
          }}>K</kbd>
        </button>

        {/* View site */}
        <Link
          href="/"
          target="_blank"
          rel="noopener"
          style={{
            display: "flex", alignItems: "center", gap: "var(--space-1)",
            fontFamily: "var(--font-mono)", fontSize: "10px",
            letterSpacing: "0.06em", textTransform: "uppercase",
            color: "var(--color-muted)", textDecoration: "none",
            transition: "color 150ms ease",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--color-light)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--color-muted)")}
        >
          View site ↗
        </Link>
      </div>
    </header>
  );
}

/* ── Command Palette ─────────────────────────────────────────── */
const PALETTE_COMMANDS = [
  { label: "Toggle Dark / Light Mode (Shift+D)", href: "#theme-toggle", category: "Action", isAction: true },
  { label: "Go to Dashboard",    href: "/admin",            category: "Navigate" },
  { label: "Go to Projects",     href: "/admin/projects",   category: "Navigate" },
  { label: "Go to Leads",        href: "/admin/leads",      category: "Navigate" },
  { label: "Go to Media",        href: "/admin/media",      category: "Navigate" },
  { label: "Go to Users",        href: "/admin/users",      category: "Navigate" },
  { label: "Go to Settings",     href: "/admin/settings",   category: "Navigate" },
  { label: "New Project",        href: "/admin/projects/new", category: "Create" },
  { label: "View public site",   href: "/",                 category: "External" },
];

function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery]     = useState("");
  const [cursor, setCursor]   = useState(0);
  const { toggleTheme }       = useTheme();
  const router                = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef   = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);

  const results = PALETTE_COMMANDS.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  const executeCommand = (cmd: (typeof PALETTE_COMMANDS)[number]) => {
    if (cmd.isAction && cmd.href === "#theme-toggle") {
      toggleTheme();
      onClose();
    } else {
      router.push(cmd.href);
      onClose();
    }
  };

  useEffect(() => {
    if (!overlayRef.current || !panelRef.current) return;
    if (open) {
      gsap.set(overlayRef.current, { display: "flex" });
      gsap.from(panelRef.current, { y: -16, opacity: 0, duration: 0.22, ease: "power3.out" });
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      gsap.to(panelRef.current, {
        y: -10, opacity: 0, duration: 0.18, ease: "power2.in",
        onComplete: () => gsap.set(overlayRef.current, { display: "none" }),
      });
    }
  }, [open]);




  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") setCursor(c => Math.min(c + 1, results.length - 1));
    if (e.key === "ArrowUp")   setCursor(c => Math.max(c - 1, 0));
    if (e.key === "Escape")    onClose();
    if (e.key === "Enter" && results[cursor]) {
      executeCommand(results[cursor]);
    }
  };

  if (!open && typeof window !== "undefined") return null;

  return (
    <div
      ref={overlayRef}
      onClick={onClose}
      style={{
        display: "none",
        position: "fixed", inset: 0,
        backgroundColor: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(4px)",
        zIndex: "var(--z-modal)" as unknown as number,
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "15vh",
      }}
    >
      <div
        ref={panelRef}
        onClick={e => e.stopPropagation()}
        style={{
          width: "min(560px, 90vw)",
          backgroundColor: "var(--color-admin-raised)",
          border: "1px solid var(--color-admin-border)",
          borderRadius: "var(--radius-xl)",
          overflow: "hidden",
          boxShadow: "var(--shadow-xl)",
        }}
        onKeyDown={handleKey}
      >
        {/* Search bar */}
        <div style={{
          display: "flex", alignItems: "center", gap: "var(--space-3)",
          padding: "var(--space-4) var(--space-5)",
          borderBottom: "1px solid var(--color-admin-border)",
        }}>
          <span style={{ color: "var(--color-muted)", flexShrink: 0 }}>⌘</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search commands..."
            value={query}
            autoComplete="off"
            suppressHydrationWarning
            onChange={e => { setQuery(e.target.value); setCursor(0); }}
            style={{
              flex: 1, background: "none", border: "none", outline: "none",
              fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
              color: "var(--color-light)",
            }}
          />
          <kbd style={{
            fontFamily: "var(--font-mono)", fontSize: "9px",
            color: "var(--color-muted)",
            border: "1px solid var(--color-admin-border)",
            borderRadius: "var(--radius-xs)", padding: "2px 6px",
          }}>Esc</kbd>
        </div>

        {/* Results */}
        <div style={{ maxHeight: "320px", overflowY: "auto", padding: "var(--space-2)" }}>
          {results.length === 0 ? (
            <div style={{
              padding: "var(--space-6)", textAlign: "center",
              fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--color-muted)",
            }}>
              No commands found
            </div>
          ) : (
            results.map((cmd, i) => (
              <div
                key={cmd.href + cmd.label}
                onClick={() => executeCommand(cmd)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "var(--space-2) var(--space-3)",
                  borderRadius: "var(--radius-lg)",
                  cursor: "pointer",
                  backgroundColor: cursor === i ? "var(--color-accent-dim)" : "transparent",
                  transition: "background-color 100ms ease",
                }}
                onMouseEnter={() => setCursor(i)}
              >
                <span style={{
                  fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
                  color: cursor === i ? "var(--color-light)" : "var(--color-muted)",
                  transition: "color 100ms ease",
                }}>
                  {cmd.label}
                </span>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: "9px",
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  color: "var(--color-muted)",
                  padding: "2px 6px",
                  backgroundColor: "var(--color-bg-subtle)",
                  borderRadius: "var(--radius-xs)",
                }}>
                  {cmd.category}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{
          display: "flex", alignItems: "center", gap: "var(--space-4)",
          padding: "var(--space-2) var(--space-4)",
          borderTop: "1px solid var(--color-admin-border)",
          fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--color-gray-700)",
        }}>
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>esc dismiss</span>
        </div>
      </div>
    </div>
  );
}

/* ── Admin Layout ────────────────────────────────────────────── */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed]   = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  // ⌘K global shortcut
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen(v => !v);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      backgroundColor: "var(--color-admin-bg)",
      fontFamily: "var(--font-body)",
    }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflowX: "hidden" }}>
        <TopBar onCommandPalette={() => setPaletteOpen(true)} />
        <main style={{ flex: 1, overflowY: "auto" }}>
          {children}
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
