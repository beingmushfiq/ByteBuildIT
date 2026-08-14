"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/* ── Types ─────────────────────────────────────────────────── */
interface Stat {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
  sub: string;
}

interface RecentLead {
  name: string;
  company: string;
  problem: string;
  time: string;
  status: "new" | "contacted" | "qualified";
}

/* ── Mock data ─────────────────────────────────────────────── */
const STATS: Stat[] = [
  { label: "Total Leads",      value: "48",    delta: "+6",   positive: true,  sub: "This month" },
  { label: "Active Projects",  value: "7",     delta: "+2",   positive: true,  sub: "In progress" },
  { label: "Media Assets",     value: "214",   delta: "+18",  positive: true,  sub: "Total files" },
  { label: "Avg. Response",    value: "4.2h",  delta: "−1.1h",positive: true,  sub: "To first reply" },
];

const RECENT_LEADS: RecentLead[] = [
  { name: "James Okonkwo",  company: "Lagos Logistics",    problem: "Order management + driver tracking", time: "2h ago",  status: "new" },
  { name: "Sara Müller",    company: "Müller & Partner",   problem: "Invoice automation, AR cycle",       time: "5h ago",  status: "contacted" },
  { name: "David Chen",     company: "Apex Manufacturing", problem: "Production scheduling + reports",    time: "8h ago",  status: "qualified" },
  { name: "Priya Nair",     company: "ClearHealth",        problem: "Patient records + appointment flow", time: "1d ago",  status: "new" },
  { name: "Marco Bianchi",  company: "Bianchi Retail",     problem: "Multi-channel inventory sync",       time: "1d ago",  status: "contacted" },
];

const ACTIVE_PROJECTS = [
  { name: "OrderShield v2",    client: "Lagos Logistics",    status: "In dev",   progress: 72, accent: "#2E4AF9" },
  { name: "StaffSync Mobile",  client: "MediStaff",          status: "QA",       progress: 89, accent: "#7C3AED" },
  { name: "InvoiceFlow Pro",   client: "Atlas Finance",      status: "Design",   progress: 34, accent: "#059669" },
  { name: "DocuSense API",     client: "LexGroup",           status: "Scoping",  progress: 12, accent: "#D97706" },
];

const STATUS_COLORS: Record<RecentLead["status"], string> = {
  new:       "#2E4AF9",
  contacted: "#D97706",
  qualified: "#059669",
};

/* ── Greeting ──────────────────────────────────────────────── */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

/* ── Stat Card ─────────────────────────────────────────────── */
function StatCard({ stat, index }: { stat: Stat; index: number }) {
  return (
    <div
      data-stat-card
      style={{
        backgroundColor: "var(--color-admin-raised)",
        border: "1px solid var(--color-admin-border)",
        borderRadius: "var(--radius-xl)",
        padding: "var(--space-6)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-3)",
      }}
    >
      <div style={{
        fontFamily: "var(--font-mono)",
        fontSize: "9px",
        fontWeight: 500,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "var(--color-gray-500)",
      }}>
        {stat.label}
      </div>

      <div style={{
        fontFamily: "var(--font-display)",
        fontSize: "2.25rem",
        fontWeight: 700,
        letterSpacing: "-0.03em",
        color: "var(--color-light)",
        lineHeight: 1,
      }}>
        {stat.value}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: "10px",
          color: stat.positive ? "#4ADE80" : "#F87171",
          letterSpacing: "0.04em",
        }}>
          {stat.delta}
        </span>
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: "9px",
          color: "var(--color-gray-600)",
          letterSpacing: "0.04em",
        }}>
          {stat.sub}
        </span>
      </div>
    </div>
  );
}

/* ── Main Dashboard ────────────────────────────────────────── */
export default function AdminDashboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  useGSAP(() => {
    gsap.from("[data-greeting]", { opacity: 0, y: -12, duration: 0.6, ease: "power3.out" });
    gsap.from("[data-stat-card]", {
      opacity: 0, y: 16, duration: 0.55,
      stagger: 0.08, delay: 0.15,
      ease: "power3.out",
    });
    gsap.from("[data-panel]", {
      opacity: 0, y: 20, duration: 0.6,
      stagger: 0.1, delay: 0.35,
      ease: "power3.out",
    });
  }, { scope: containerRef });

  const formatted = time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  const dateStr   = time.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div
      ref={containerRef}
      style={{ padding: "var(--space-8)", display: "flex", flexDirection: "column", gap: "var(--space-8)" }}
    >
      {/* ── Greeting ──────────────────────────────────────── */}
      <div data-greeting>
        <div style={{
          display: "flex", alignItems: "flex-end", justifyContent: "space-between",
          flexWrap: "wrap", gap: "var(--space-4)",
        }}>
          <div>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              color: "var(--color-light)",
              lineHeight: 1.1,
            }}>
              {getGreeting()}.
            </h2>
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "var(--color-gray-600)",
              marginTop: "var(--space-1)",
              letterSpacing: "0.04em",
            }}>
              {dateStr} · {formatted}
            </p>
          </div>

          {/* Quick actions */}
          <div style={{ display: "flex", gap: "var(--space-2)" }}>
            <Link
              href="/admin/projects/new"
              style={{
                display: "inline-flex", alignItems: "center", gap: "var(--space-2)",
                fontFamily: "var(--font-mono)", fontSize: "10px",
                fontWeight: 500, letterSpacing: "0.07em", textTransform: "uppercase",
                color: "var(--color-white)",
                backgroundColor: "var(--color-accent)",
                padding: "0.5rem 0.875rem",
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
                transition: "background-color 200ms ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--color-accent-hover)")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "var(--color-accent)")}
            >
              + New project
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats grid ─────────────────────────────────────── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "var(--space-4)",
      }}>
        {STATS.map((stat, i) => <StatCard key={stat.label} stat={stat} index={i} />)}
      </div>

      {/* ── Two-column panels ──────────────────────────────── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "var(--space-6)",
      }}
        className="xl:!grid-cols-[1.2fr_1fr]"
      >
        {/* ── Recent Leads ─────────────────────────────────── */}
        <div
          data-panel
          style={{
            backgroundColor: "var(--color-admin-raised)",
            border: "1px solid var(--color-admin-border)",
            borderRadius: "var(--radius-xl)",
            overflow: "hidden",
          }}
        >
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "var(--space-5) var(--space-6)",
            borderBottom: "1px solid var(--color-admin-border)",
          }}>
            <h3 style={{
              fontFamily: "var(--font-display)", fontSize: "var(--text-base)",
              fontWeight: 600, letterSpacing: "-0.02em", color: "var(--color-light)",
            }}>
              Recent Leads
            </h3>
            <Link
              href="/admin/leads"
              style={{
                fontFamily: "var(--font-mono)", fontSize: "9px",
                letterSpacing: "0.08em", textTransform: "uppercase",
                color: "var(--color-muted)", textDecoration: "none",
                transition: "color 150ms ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--color-light)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--color-muted)")}
            >
              View all →
            </Link>
          </div>

          <div>
            {RECENT_LEADS.map((lead, i) => (
              <div
                key={lead.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: "var(--space-3)",
                  alignItems: "start",
                  padding: "var(--space-4) var(--space-6)",
                  borderBottom: i < RECENT_LEADS.length - 1 ? "1px solid var(--color-admin-border)" : "none",
                  transition: "background-color 150ms ease",
                  cursor: "pointer",
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "2px" }}>
                    <span style={{
                      fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
                      fontWeight: 500, color: "var(--color-light)",
                    }}>
                      {lead.name}
                    </span>
                    <span style={{ color: "var(--color-gray-700)", fontSize: "10px" }}>·</span>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", color: "var(--color-muted)" }}>
                      {lead.company}
                    </span>
                  </div>
                  <p style={{
                    fontFamily: "var(--font-body)", fontSize: "11px",
                    color: "var(--color-gray-500)", lineHeight: 1.4,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    maxWidth: "320px",
                  }}>
                    {lead.problem}
                  </p>
                </div>

                <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "var(--space-1)" }}>
                  <span style={{
                    fontFamily: "var(--font-mono)", fontSize: "9px",
                    letterSpacing: "0.08em", textTransform: "uppercase",
                    color: STATUS_COLORS[lead.status],
                    padding: "2px 6px",
                    backgroundColor: `${STATUS_COLORS[lead.status]}15`,
                    borderRadius: "var(--radius-xs)",
                    border: `1px solid ${STATUS_COLORS[lead.status]}30`,
                  }}>
                    {lead.status}
                  </span>
                  <span style={{
                    fontFamily: "var(--font-mono)", fontSize: "9px",
                    color: "var(--color-gray-700)", letterSpacing: "0.04em",
                  }}>
                    {lead.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Active Projects ───────────────────────────────── */}
        <div
          data-panel
          style={{
            backgroundColor: "var(--color-admin-raised)",
            border: "1px solid var(--color-admin-border)",
            borderRadius: "var(--radius-xl)",
            overflow: "hidden",
          }}
        >
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "var(--space-5) var(--space-6)",
            borderBottom: "1px solid var(--color-admin-border)",
          }}>
            <h3 style={{
              fontFamily: "var(--font-display)", fontSize: "var(--text-base)",
              fontWeight: 600, letterSpacing: "-0.02em", color: "var(--color-light)",
            }}>
              Active Projects
            </h3>
            <Link
              href="/admin/projects"
              style={{
                fontFamily: "var(--font-mono)", fontSize: "9px",
                letterSpacing: "0.08em", textTransform: "uppercase",
                color: "var(--color-muted)", textDecoration: "none",
                transition: "color 150ms ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--color-light)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--color-muted)")}
            >
              View all →
            </Link>
          </div>

          <div style={{ padding: "var(--space-4) var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
            {ACTIVE_PROJECTS.map(project => (
              <div key={project.name}>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  marginBottom: "var(--space-2)",
                }}>
                  <div>
                    <div style={{
                      fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
                      fontWeight: 500, color: "var(--color-light)", marginBottom: "2px",
                    }}>
                      {project.name}
                    </div>
                    <div style={{
                      fontFamily: "var(--font-mono)", fontSize: "9px",
                      color: "var(--color-gray-600)", letterSpacing: "0.04em",
                    }}>
                      {project.client}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{
                      fontFamily: "var(--font-mono)", fontSize: "9px",
                      letterSpacing: "0.08em", textTransform: "uppercase",
                      color: project.accent, marginBottom: "2px",
                    }}>
                      {project.status}
                    </div>
                    <div style={{
                      fontFamily: "var(--font-display)", fontSize: "0.875rem",
                      fontWeight: 600, color: "var(--color-light)",
                    }}>
                      {project.progress}%
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{
                  height: "3px",
                  backgroundColor: "rgba(255,255,255,0.06)",
                  borderRadius: "var(--radius-full)",
                  overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%",
                    width: `${project.progress}%`,
                    backgroundColor: project.accent,
                    borderRadius: "var(--radius-full)",
                    transition: "width 800ms var(--ease-expo-out)",
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Quick Nav ──────────────────────────────────────── */}
      <div
        data-panel
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "var(--space-3)",
        }}
      >
        {[
          { label: "Add Project",    href: "/admin/projects/new", icon: "◈" },
          { label: "View Leads",     href: "/admin/leads",        icon: "◎" },
          { label: "Upload Media",   href: "/admin/media",        icon: "⊞" },
          { label: "Settings",       href: "/admin/settings",     icon: "⊕" },
        ].map(action => (
          <Link
            key={action.label}
            href={action.href}
            style={{
              display: "flex", flexDirection: "column", gap: "var(--space-2)",
              padding: "var(--space-5)",
              backgroundColor: "var(--color-admin-raised)",
              border: "1px solid var(--color-admin-border)",
              borderRadius: "var(--radius-xl)",
              textDecoration: "none",
              transition: "border-color 150ms ease, background-color 150ms ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "var(--color-admin-border)";
              e.currentTarget.style.backgroundColor = "var(--color-admin-raised)";
            }}
          >
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "18px", color: "var(--color-accent)" }}>
              {action.icon}
            </span>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: "10px",
              fontWeight: 500, letterSpacing: "0.07em", textTransform: "uppercase",
              color: "var(--color-muted)",
            }}>
              {action.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
