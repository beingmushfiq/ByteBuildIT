"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface ProblemItem {
  id: string;
  icon: string;
  category: string;
  tag: string;
  headline: string;
  body: string;
  impactScore: string;
  beforeLabel: string;
  beforeDesc: string;
  afterLabel: string;
  afterDesc: string;
  accent: string;
}

const PROBLEMS: ProblemItem[] = [
  {
    id: "manual",
    icon: "⚡",
    category: "Manual Bottlenecks",
    tag: "Labor Sink",
    headline: "Still copying data by hand across tabs?",
    body: "When your team spends hours each day on manual re-entry, spreadsheet copy-pasting, and invoice reconciliation, you are paying for friction. We automate the entire pipeline.",
    impactScore: "−74% Labor Friction",
    beforeLabel: "8 manual steps · 4 staff · 3 hours",
    beforeDesc: "Prone to typos, missed orders, and burnout",
    afterLabel: "Automated event-driven execution",
    afterDesc: "Sub-second validation and instant sync",
    accent: "#2E4AF9",
  },
  {
    id: "disconnected",
    icon: "🔗",
    category: "Disconnected Tools",
    tag: "Data Desync",
    headline: "Your CRM, ERP, and operations don't communicate.",
    body: "Sales operates in one app. Inventory in another. Finance in a spreadsheet. Humans become the fragile glue between systems, creating errors and delays.",
    impactScore: "100% Data Cohesion",
    beforeLabel: "Export CSV → Email → Re-import",
    beforeDesc: "Data becomes outdated the moment it is exported",
    afterLabel: "Live Bidirectional Sync Webhooks",
    afterDesc: "Instant unified source of truth across all tools",
    accent: "#7C3AED",
  },
  {
    id: "spreadsheets",
    icon: "📊",
    category: "Spreadsheets at Scale",
    tag: "Integrity Risk",
    headline: "Spreadsheets were never designed to be your database.",
    body: "Broken formulas, merge conflicts, lack of audit trails, and concurrent edit crashes — when operations outgrow Excel, business integrity suffers.",
    impactScore: "0% Data Corruption",
    beforeLabel: "v12_final_FINAL_use_this.xlsx",
    beforeDesc: "Overwritten rows, corrupted formulas, zero logs",
    afterLabel: "PostgreSQL Database + Modern UI",
    afterDesc: "Role-based permissions, automated audit logs, ACID security",
    accent: "#059669",
  },
  {
    id: "orders",
    icon: "📦",
    category: "Order Management",
    tag: "Customer Friction",
    headline: "Order routing shouldn't take hours.",
    body: "Multi-channel sales, inventory holds, custom SKU configurations, and partial fulfillment bottlenecks hurt customer retention and dispatch velocity.",
    impactScore: "98.2% Auto-Fulfillment",
    beforeLabel: "WhatsApp → Notes → Manual Pack",
    beforeDesc: "Missed orders, dispatch confusion, slow turnaround",
    afterLabel: "Unified Order Hub + Automation",
    afterDesc: "Instant barcode scan, courier API dispatch, real-time alerts",
    accent: "#D97706",
  },
  {
    id: "visibility",
    icon: "👁️",
    category: "Executive Visibility",
    tag: "Blindspot",
    headline: "You cannot optimize what you cannot measure.",
    body: "Making high-stakes decisions based on last week's stale reports is a liability. We construct real-time operational control rooms with transparent metrics.",
    impactScore: "Live Real-Time Telemetry",
    beforeLabel: "End-of-month delayed reports",
    beforeDesc: "Reactive decisions based on outdated metrics",
    afterLabel: "Live Executive Telemetry Room",
    afterDesc: "Live margins, throughput alerts, instant bottleneck detection",
    accent: "#0284C7",
  },
  {
    id: "ai",
    icon: "🧠",
    category: "Applied AI & Intelligence",
    tag: "High Leverage",
    headline: "Automate cognition, not just clicks.",
    body: "Document extraction, dynamic routing, fraud detection, and predictive demand modeling. We implement AI where it delivers measurable enterprise leverage.",
    impactScore: "10x Document Throughput",
    beforeLabel: "Manual document reading & auditing",
    beforeDesc: "Slow turnaround, cognitive fatigue, high overhead",
    afterLabel: "LLM + Vision Intelligent Extraction",
    afterDesc: "Instant PDF parser, structured JSON output, human oversight",
    accent: "#EC4899",
  },
];

export default function ProblemFinder() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const current = PROBLEMS[activeIdx];

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.fromTo(
      "[data-pf-tag]",
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", clearProps: "all" }
    );
    gsap.fromTo(
      "[data-pf-headline]",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.1, ease: "power3.out", clearProps: "all" }
    );
    gsap.fromTo(
      "[data-pf-matrix]",
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.15, ease: "power3.out", clearProps: "all" }
    );
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="solutions"
      className="section"
      style={{
        backgroundColor: "var(--color-bg-base)",
        position: "relative",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        {/* Section Header */}
        <div style={{ maxWidth: "700px", marginBottom: "var(--space-12)" }}>
          <div data-pf-tag style={{ marginBottom: "var(--space-4)" }}>
            <span className="section-label">
              Interactive Friction Matrix
            </span>
          </div>

          <h2
            data-pf-headline
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.035em",
              color: "var(--color-light)",
            }}
          >
            What is currently breaking your operational flow?
          </h2>
        </div>

        {/* Dual Column Layout: Matrix Selector (Left) & Blueprint Console (Right) */}
        <div
          data-pf-matrix
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "var(--space-8)",
            alignItems: "start",
          }}
          className="lg:!grid-cols-[1fr_1.15fr]"
        >
          {/* LEFT: Problem Selectors */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {PROBLEMS.map((prob, i) => {
              const isActive = activeIdx === i;

              return (
                <button
                  key={prob.id}
                  type="button"
                  onClick={() => setActiveIdx(i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "16px 20px",
                    borderRadius: "var(--radius-xl)",
                    backgroundColor: isActive ? "var(--color-bg-card)" : "var(--color-bg-subtle)",
                    border: isActive ? `1.5px solid ${prob.accent}` : "1px solid var(--color-border)",
                    boxShadow: isActive ? `0 0 24px ${prob.accent}25, var(--shadow-md)` : "none",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 200ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                    transform: isActive ? "translateX(6px)" : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <span style={{ fontSize: "1.3rem" }}>{prob.icon}</span>
                    <div>
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "15px",
                          fontWeight: 700,
                          color: isActive ? "var(--color-light)" : "var(--color-light)",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {prob.category}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "11px",
                          color: isActive ? prob.accent : "var(--color-muted)",
                          marginTop: "2px",
                        }}
                      >
                        {prob.tag}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {isActive ? (
                      <span
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: prob.accent,
                          boxShadow: `0 0 10px ${prob.accent}`,
                        }}
                      />
                    ) : (
                      <span
                        style={{
                          color: "var(--color-muted)",
                          fontSize: "14px",
                        }}
                      >
                        →
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* RIGHT: Architecture Transformation Blueprint Console */}
          <div
            className="glass-card"
            style={{
              padding: "var(--space-8)",
              borderRadius: "var(--radius-2xl)",
              backgroundColor: "var(--color-bg-card)",
              border: `1px solid ${current.accent}40`,
              boxShadow: `0 0 35px ${current.accent}15, var(--shadow-xl)`,
              transition: "border-color 300ms ease, box-shadow 300ms ease",
            }}
          >
            {/* Header with Category & Impact Metric */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "var(--space-4)",
                paddingBottom: "var(--space-6)",
                borderBottom: "1px solid var(--color-border)",
                marginBottom: "var(--space-6)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "1.6rem" }}>{current.icon}</span>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: current.accent,
                    }}
                  >
                    System Diagnosis
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.35rem",
                      fontWeight: 800,
                      color: "var(--color-light)",
                    }}
                  >
                    {current.category}
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: "6px 14px",
                  borderRadius: "var(--radius-full)",
                  backgroundColor: `${current.accent}18`,
                  border: `1px solid ${current.accent}40`,
                  fontFamily: "var(--font-mono)",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: current.accent,
                }}
              >
                {current.impactScore}
              </div>
            </div>

            {/* Headline Question & Core Problem Analysis */}
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.25rem, 2vw, 1.6rem)",
                fontWeight: 700,
                color: "var(--color-light)",
                lineHeight: 1.25,
                letterSpacing: "-0.02em",
                marginBottom: "var(--space-4)",
              }}
            >
              {current.headline}
            </h3>

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(1rem, 1.2vw, 1.1rem)",
                lineHeight: 1.7,
                color: "var(--color-muted)",
                marginBottom: "var(--space-8)",
              }}
            >
              {current.body}
            </p>

            {/* Before vs. After System Comparison Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "var(--space-4)",
                marginBottom: "var(--space-8)",
              }}
              className="sm:!grid-cols-2"
            >
              {/* BEFORE */}
              <div
                style={{
                  padding: "var(--space-5)",
                  borderRadius: "var(--radius-xl)",
                  backgroundColor: "var(--color-bg-subtle)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#EF4444",
                    marginBottom: "var(--space-2)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#EF4444" }} />
                  Current Friction (Before)
                </div>

                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--color-light)",
                    lineHeight: 1.4,
                  }}
                >
                  {current.beforeLabel}
                </div>

                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "12px",
                    color: "var(--color-muted)",
                    marginTop: "4px",
                  }}
                >
                  {current.beforeDesc}
                </div>
              </div>

              {/* AFTER */}
              <div
                style={{
                  padding: "var(--space-5)",
                  borderRadius: "var(--radius-xl)",
                  backgroundColor: `${current.accent}14`,
                  border: `1px solid ${current.accent}50`,
                  boxShadow: `0 0 20px ${current.accent}15`,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: current.accent,
                    marginBottom: "var(--space-2)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: current.accent, boxShadow: `0 0 8px ${current.accent}` }} />
                  Engineered System (After)
                </div>

                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--color-light)",
                    lineHeight: 1.4,
                  }}
                >
                  {current.afterLabel}
                </div>

                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "12px",
                    color: "var(--color-light)",
                    opacity: 0.85,
                    marginTop: "4px",
                  }}
                >
                  {current.afterDesc}
                </div>
              </div>
            </div>

            {/* Direct Action Link */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <a
                href="#contact"
                className="btn btn-primary"
                style={{
                  fontSize: "12px",
                  padding: "12px 24px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: current.accent,
                  borderColor: current.accent,
                  boxShadow: `0 0 20px ${current.accent}40`,
                }}
              >
                <span>Automate this bottleneck</span>
                <span>↗</span>
              </a>

              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  color: "var(--color-muted)",
                }}
              >
                Fast-track 2-week sprint
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
