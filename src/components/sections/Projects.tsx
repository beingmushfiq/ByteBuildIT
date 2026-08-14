"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/* ── Project data ───────────────────────────────────────────── */
const PROJECTS = [
  {
    num: "01",
    slug: "ordershield",
    title: "OrderShield",
    subtitle: "Order Management System",
    tags: ["Commerce", "Operations", "Automation"],
    description:
      "A unified order intelligence platform that replaced a 7-spreadsheet operation with real-time visibility, automated routing, and exception management.",
    metrics: [
      { label: "Processing time", value: "−74%" },
      { label: "Error rate", value: "−91%" },
    ],
    accent: "#2E4AF9",
    bgShade: "#060D1F",
    ui: [
      { label: "Orders today",    value: "1,240", tag: "live" },
      { label: "Fulfillment",     value: "98.2%", tag: "rate" },
      { label: "Exceptions",      value: "3",     tag: "active" },
      { label: "Revenue",         value: "$84k",  tag: "today" },
    ],
  },
  {
    num: "02",
    slug: "staffsync",
    title: "StaffSync",
    subtitle: "Field Operations Platform",
    tags: ["Workforce", "Scheduling", "Mobile"],
    description:
      "A mobile-first scheduling and dispatch platform for 200+ field staff across 12 sites — replacing manual rosters, WhatsApp coordination, and paper timesheets.",
    metrics: [
      { label: "Coordinator time", value: "−60%" },
      { label: "No-shows",         value: "−83%" },
    ],
    accent: "#7C3AED",
    bgShade: "#0C0A1A",
    ui: [
      { label: "Staff active",   value: "214",   tag: "now" },
      { label: "Sites covered",  value: "12",    tag: "live" },
      { label: "Open shifts",    value: "4",     tag: "today" },
      { label: "Attendance",     value: "96.7%", tag: "week" },
    ],
  },
  {
    num: "03",
    slug: "invoiceflow",
    title: "InvoiceFlow",
    subtitle: "Accounts Receivable Automation",
    tags: ["Finance", "AI", "Workflow"],
    description:
      "An AI-powered accounts receivable system that processes, validates, and routes supplier invoices automatically — cutting a 5-day manual cycle to under 4 hours.",
    metrics: [
      { label: "Cycle time",    value: "−96%" },
      { label: "Manual review", value: "−78%" },
    ],
    accent: "#059669",
    bgShade: "#051510",
    ui: [
      { label: "Processed",     value: "2,841", tag: "month" },
      { label: "Auto-approved", value: "89%",   tag: "rate" },
      { label: "Queue",         value: "7",     tag: "pending" },
      { label: "Avg. cycle",    value: "3.8h",  tag: "time" },
    ],
  },
] as const;

/* ── Project Visual (mock dashboard) ────────────────────────── */
function ProjectUI({ project }: { project: typeof PROJECTS[number] }) {
  return (
    <div
      style={{
        backgroundColor: project.bgShade,
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "var(--radius-xl)",
        overflow: "hidden",
        fontFamily: "var(--font-mono)",
      }}
    >
      {/* Titlebar */}
      <div style={{
        display: "flex", alignItems: "center", gap: "var(--space-2)",
        padding: "10px var(--space-4)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        backgroundColor: "rgba(0,0,0,0.2)",
      }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#FF5F57" }} />
        <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#FEBC2E" }} />
        <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#28C840" }} />
        <span style={{ marginLeft: "var(--space-3)", fontSize: "9px", letterSpacing: "0.06em", color: "rgba(255,255,255,0.25)" }}>
          {project.title} — {project.subtitle}
        </span>
      </div>

      {/* Stats grid */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: "1px", backgroundColor: "rgba(255,255,255,0.04)",
      }}>
        {project.ui.map(({ label, value, tag }) => (
          <div key={label} style={{
            padding: "var(--space-5)",
            backgroundColor: project.bgShade,
          }}>
            <div style={{ fontSize: "8px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "var(--space-2)" }}>
              {label}
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 600, letterSpacing: "-0.03em", color: "var(--color-light)", lineHeight: 1 }}>
              {value}
            </div>
            <div style={{
              marginTop: "var(--space-2)", display: "inline-block",
              fontSize: "8px", letterSpacing: "0.08em", textTransform: "uppercase",
              padding: "2px 6px", borderRadius: "2px",
              backgroundColor: `${project.accent}18`,
              color: project.accent,
              border: `1px solid ${project.accent}30`,
            }}>
              {tag}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div style={{
        padding: "var(--space-3) var(--space-4)",
        borderTop: "1px solid rgba(255,255,255,0.04)",
        display: "flex", alignItems: "center", gap: "var(--space-2)",
      }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: project.accent, flexShrink: 0 }} />
        <span style={{ fontSize: "9px", letterSpacing: "0.06em", color: "rgba(255,255,255,0.25)" }}>
          Live · {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────── */
export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 75%",
      onEnter: () => {
        gsap.from("[data-proj-header]", { opacity: 0, y: 24, duration: 0.7, ease: "power3.out" });
      },
    });

    // Each project card scrolls in
    document.querySelectorAll("[data-proj-item]").forEach((el, i) => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 78%",
        onEnter: () => {
          gsap.from(el.querySelector("[data-proj-copy]"), {
            opacity: 0, x: -32, duration: 0.8, ease: "power3.out",
          });
          gsap.from(el.querySelector("[data-proj-visual]"), {
            opacity: 0, x: 32, duration: 0.8, ease: "power3.out", delay: 0.1,
          });
        },
      });
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="work"
      style={{ backgroundColor: "var(--color-dark)", position: "relative" }}
    >
      {/* top rule */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(to right, transparent, var(--color-border) 30%, var(--color-border) 70%, transparent)",
      }} />

      <div className="container" style={{ paddingTop: "var(--space-24)", paddingBottom: "var(--space-24)" }}>
        {/* Section header */}
        <div
          data-proj-header
          style={{
            display: "flex", alignItems: "flex-end", justifyContent: "space-between",
            marginBottom: "var(--space-20)",
            flexWrap: "wrap", gap: "var(--space-4)",
          }}
        >
          <div>
            <span className="section-label" style={{ marginBottom: "var(--space-4)", display: "flex" }}>
              Selected work
            </span>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "var(--color-light)",
              lineHeight: 1.05,
            }}>
              Systems we&apos;ve shipped.
            </h2>
          </div>
          <Link
            href="/work"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              fontWeight: 500,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              color: "var(--color-muted)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
              transition: "color 200ms ease",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--color-light)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--color-muted)")}
          >
            All projects →
          </Link>
        </div>

        {/* Project list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-32)" }}>
          {PROJECTS.map((project, i) => (
            <div
              key={project.slug}
              data-proj-item
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "var(--space-12)",
                alignItems: "center",
              }}
              className={`lg:!grid-cols-[1fr_1fr] ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}
            >
              {/* Copy */}
              <div data-proj-copy>
                <div style={{
                  display: "flex", alignItems: "center", gap: "var(--space-4)",
                  marginBottom: "var(--space-6)",
                }}>
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-xs)",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    color: project.accent,
                  }}>
                    {project.num}
                  </span>
                  <div style={{ height: "1px", flex: 1, backgroundColor: "var(--color-border)" }} />
                </div>

                <h3 style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: "var(--color-light)",
                  lineHeight: 1.1,
                  marginBottom: "var(--space-2)",
                }}>
                  {project.title}
                </h3>

                <p style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--color-muted)",
                  marginBottom: "var(--space-5)",
                }}>
                  {project.subtitle}
                </p>

                {/* Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", marginBottom: "var(--space-6)" }}>
                  {project.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>

                <p style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-sm)",
                  lineHeight: 1.75,
                  color: "var(--color-muted)",
                  marginBottom: "var(--space-8)",
                  maxWidth: "480px",
                }}>
                  {project.description}
                </p>

                {/* Metrics */}
                <div style={{ display: "flex", gap: "var(--space-8)", marginBottom: "var(--space-8)" }}>
                  {project.metrics.map(m => (
                    <div key={m.label}>
                      <div style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.75rem",
                        fontWeight: 700,
                        letterSpacing: "-0.03em",
                        color: project.accent,
                        lineHeight: 1,
                        marginBottom: "var(--space-1)",
                      }}>
                        {m.value}
                      </div>
                      <div style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "10px",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "var(--color-muted)",
                      }}>
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href={`/work/${project.slug}`}
                  data-cursor-type="project"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-xs)",
                    fontWeight: 500,
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    color: project.accent,
                    textDecoration: "none",
                    transition: "opacity 200ms ease",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  View case study ↗
                </Link>
              </div>

              {/* Visual */}
              <div data-proj-visual>
                <ProjectUI project={project} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
