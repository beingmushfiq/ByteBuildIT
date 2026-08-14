"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    num: "01",
    slug: "ordershield",
    title: "OrderShield",
    subtitle: "Enterprise Order Intelligence & Exception Management",
    category: "Commerce & Operations",
    description:
      "A unified multi-channel order intelligence platform that replaced a 7-spreadsheet manual operation with real-time automated routing, inventory safeguards, and instant exception triage.",
    metrics: [
      { label: "Processing Speed", value: "−74%", desc: "Cut from 3.5 hrs to 5 mins" },
      { label: "Error Rate", value: "−91%", desc: "Near-zero dispatch typos" },
      { label: "Throughput", value: "4.8x", desc: "Scale without hiring" },
    ],
    accent: "#2E4AF9",
    tags: ["Order Engine", "Real-Time Sync", "PostgreSQL", "Courier API"],
    telemetry: [
      { label: "Live Orders / hr", value: "1,240", status: "Active" },
      { label: "Auto-Fulfillment", value: "98.4%", status: "Nominal" },
      { label: "Active Exceptions", value: "2", status: "Auto-Routing" },
      { label: "Daily Revenue Stream", value: "$94.2k", status: "Live" },
    ],
  },
  {
    num: "02",
    slug: "staffsync",
    title: "StaffSync",
    subtitle: "Real-Time Field Operations & Workforce Dispatch",
    category: "Workforce & Logistics",
    description:
      "Mobile-first operational scheduling and dispatch engine for 200+ field technicians across 12 metropolitan sites — replacing WhatsApp chats, paper rosters, and untracked timesheets.",
    metrics: [
      { label: "Coordination Delay", value: "−60%", desc: "Instant automated dispatch" },
      { label: "No-Show Incidents", value: "−83%", desc: "Automated SMS confirmations" },
      { label: "Attendance Rate", value: "97.2%", desc: "Verified GPS clock-in" },
    ],
    accent: "#7C3AED",
    tags: ["GPS Geofencing", "Live Dispatch", "Next.js Mobile", "WebSockets"],
    telemetry: [
      { label: "Active Field Units", value: "214", status: "On-Duty" },
      { label: "Sites Covered", value: "12 Sites", status: "Live" },
      { label: "Pending Shifts", value: "0", status: "Optimized" },
      { label: "Dispatch Response", value: "1.4s", status: "Instant" },
    ],
  },
  {
    num: "03",
    slug: "invoiceflow",
    title: "InvoiceFlow",
    subtitle: "Autonomous Accounts Receivable & Document AI",
    category: "Finance & Applied AI",
    description:
      "An intelligent accounts receivable platform that parses, validates, and routes thousands of supplier invoices automatically using computer vision and enterprise rules — reducing a 5-day cycle to under 4 hours.",
    metrics: [
      { label: "Settlement Cycle", value: "−96%", desc: "5 days down to 3.8 hours" },
      { label: "Manual Review", value: "−78%", desc: "89% zero-touch approval" },
      { label: "Audit Accuracy", value: "99.9%", desc: "Automated bank reconciliation" },
    ],
    accent: "#059669",
    tags: ["Document AI", "OCR Parsing", "Banking Webhooks", "Automated Ledger"],
    telemetry: [
      { label: "Invoices Processed", value: "3,120", status: "This Month" },
      { label: "Auto-Approved", value: "91.2%", status: "Verified" },
      { label: "Approval Queue", value: "4", status: "Processing" },
      { label: "Mean Cycle Latency", value: "3.2 hrs", status: "Fast-Track" },
    ],
  },
];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.fromTo(
      "[data-proj-header]",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", clearProps: "all" }
    );

    gsap.fromTo(
      "[data-proj-item]",
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, delay: 0.15, ease: "power3.out", clearProps: "all" }
    );
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="work"
      className="section"
      style={{
        backgroundColor: "var(--color-bg-surface)",
        position: "relative",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        {/* Section Header */}
        <div
          data-proj-header
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "var(--space-6)",
            marginBottom: "var(--space-16)",
          }}
        >
          <div style={{ maxWidth: "680px" }}>
            <div style={{ marginBottom: "var(--space-4)" }}>
              <span className="section-label">
                Selected Case Studies
              </span>
            </div>

            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.25rem, 5vw, 4rem)",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.035em",
                color: "var(--color-light)",
              }}
            >
              Proven operational systems in production.
            </h2>
          </div>

          <Link
            href="/work"
            className="btn btn-ghost"
            style={{
              fontSize: "12px",
              padding: "12px 24px",
              borderRadius: "var(--radius-md)",
            }}
          >
            <span>View All Engineering Archives</span>
            <span>→</span>
          </Link>
        </div>

        {/* Project Cards Stack */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-16)" }}>
          {PROJECTS.map((proj, idx) => {
            const isHovered = hoveredIdx === idx;

            return (
              <div
                key={proj.slug}
                data-proj-item
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="glass-card"
                style={{
                  padding: "clamp(24px, 4vw, 48px)",
                  borderRadius: "var(--radius-2xl)",
                  backgroundColor: "var(--color-bg-card)",
                  border: isHovered ? `1.5px solid ${proj.accent}` : "1px solid var(--color-border)",
                  boxShadow: isHovered ? `0 0 40px ${proj.accent}20, var(--shadow-xl)` : "var(--shadow-lg)",
                  transition: "all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: "var(--space-10)",
                    alignItems: "center",
                  }}
                  className="lg:!grid-cols-[1.15fr_1fr]"
                >
                  {/* LEFT: Project Narrative & Metrics */}
                  <div>
                    {/* Top Category Badge & Index */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "var(--space-4)",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "14px",
                          fontWeight: 800,
                          color: proj.accent,
                        }}
                      >
                        {proj.num}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "11px",
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "var(--color-muted)",
                          padding: "3px 10px",
                          borderRadius: "var(--radius-full)",
                          backgroundColor: "var(--color-bg-subtle)",
                          border: "1px solid var(--color-border)",
                        }}
                      >
                        {proj.category}
                      </span>
                    </div>

                    {/* Project Title */}
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                        fontWeight: 800,
                        color: "var(--color-light)",
                        letterSpacing: "-0.03em",
                        lineHeight: 1.15,
                        marginBottom: "var(--space-3)",
                      }}
                    >
                      {proj.title}
                    </h3>

                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "13px",
                        color: proj.accent,
                        fontWeight: 600,
                        marginBottom: "var(--space-4)",
                      }}
                    >
                      {proj.subtitle}
                    </div>

                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "clamp(1rem, 1.2vw, 1.1rem)",
                        lineHeight: 1.7,
                        color: "var(--color-muted)",
                        marginBottom: "var(--space-8)",
                      }}
                    >
                      {proj.description}
                    </p>

                    {/* Metric Badges Ribbon */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "var(--space-3)",
                        marginBottom: "var(--space-8)",
                      }}
                    >
                      {proj.metrics.map((m) => (
                        <div
                          key={m.label}
                          style={{
                            padding: "12px",
                            borderRadius: "var(--radius-lg)",
                            backgroundColor: "var(--color-bg-subtle)",
                            border: "1px solid var(--color-border)",
                          }}
                        >
                          <div
                            style={{
                              fontFamily: "var(--font-display)",
                              fontSize: "clamp(1.3rem, 2.2vw, 1.75rem)",
                              fontWeight: 800,
                              color: proj.accent,
                              letterSpacing: "-0.02em",
                            }}
                          >
                            {m.value}
                          </div>
                          <div
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "10px",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              color: "var(--color-light)",
                              marginTop: "2px",
                            }}
                          >
                            {m.label}
                          </div>
                          <div
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: "10px",
                              color: "var(--color-muted)",
                              marginTop: "2px",
                            }}
                          >
                            {m.desc}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tags & Action Button */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "var(--space-4)",
                      }}
                    >
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {proj.tags.map((t) => (
                          <span
                            key={t}
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "10px",
                              padding: "4px 8px",
                              borderRadius: "var(--radius-xs)",
                              backgroundColor: "var(--color-bg-subtle)",
                              border: "1px solid var(--color-border)",
                              color: "var(--color-muted)",
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <Link
                        href={`/work/${proj.slug}`}
                        className="btn btn-primary"
                        style={{
                          fontSize: "11px",
                          padding: "10px 18px",
                          backgroundColor: proj.accent,
                          borderColor: proj.accent,
                          boxShadow: `0 0 16px ${proj.accent}35`,
                        }}
                      >
                        <span>Deep Dive Case Study</span>
                        <span>↗</span>
                      </Link>
                    </div>
                  </div>

                  {/* RIGHT: Live Telemetry & System Control Room Mockup */}
                  <div
                    style={{
                      borderRadius: "var(--radius-xl)",
                      backgroundColor: "var(--color-bg-base)",
                      border: "1px solid var(--color-border)",
                      padding: "var(--space-6)",
                      boxShadow: "inset 0 0 25px rgba(0,0,0,0.3)",
                    }}
                  >
                    {/* Console Header Bar */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingBottom: "var(--space-4)",
                        borderBottom: "1px solid var(--color-border)",
                        marginBottom: "var(--space-6)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10B981", boxShadow: "0 0 8px #10B981" }} />
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-light)" }}>
                          {proj.title} Production Telemetry
                        </span>
                      </div>

                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "10px",
                          padding: "2px 8px",
                          borderRadius: "var(--radius-full)",
                          backgroundColor: `${proj.accent}18`,
                          border: `1px solid ${proj.accent}40`,
                          color: proj.accent,
                        }}
                      >
                        100% HEALTHY
                      </span>
                    </div>

                    {/* 4x Grid Telemetry Cells */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "var(--space-4)",
                      }}
                    >
                      {proj.telemetry.map((cell) => (
                        <div
                          key={cell.label}
                          style={{
                            padding: "var(--space-4)",
                            borderRadius: "var(--radius-lg)",
                            backgroundColor: "var(--color-bg-card)",
                            border: "1px solid var(--color-border)",
                          }}
                        >
                          <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-muted)", marginBottom: "4px" }}>
                            {cell.label}
                          </div>
                          <div style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 800, color: "var(--color-light)" }}>
                            {cell.value}
                          </div>
                          <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: proj.accent, marginTop: "4px" }}>
                            ● {cell.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
