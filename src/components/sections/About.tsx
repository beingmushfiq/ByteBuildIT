"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const STAGES = [
  {
    num: "01",
    label: "Process Diagnostics",
    headline: "We audit your operation, not a generic template.",
    body: "Before writing a single line of code, our engineers shadow your operational workflow. We map every handoff, identify every failure point, and eliminate redundancies in the raw logic before digitizing it.",
    deliverables: ["Process Bottleneck Map", "Data Flow Audit", "ROI & Velocity Estimate"],
    accent: "#2E4AF9",
    metric: "0 Assumptions",
  },
  {
    num: "02",
    label: "System Design",
    headline: "Architecture and data modeling before aesthetics.",
    body: "System design is the real work. We construct the database schemas, API contracts, event streams, and security models first. The user interface is the intuitive, polished skin on top of a rock-solid core.",
    deliverables: ["PostgreSQL Schema", "API Route Contracts", "Security & RBAC Matrix"],
    accent: "#7C3AED",
    metric: "100% Type-Safe",
  },
  {
    num: "03",
    label: "Precision Engineering",
    headline: "Engineered for 3:00 AM production reliability.",
    body: "We build with mission-critical operational standards: end-to-end type safety, automated error retries, ACID transactions, and sub-100ms response times across all endpoints.",
    deliverables: ["Next.js 16 App Router", "Serverless Edge Workers", "Zero-Downtime CI/CD"],
    accent: "#059669",
    metric: "99.9% Uptime SLA",
  },
  {
    num: "04",
    label: "Telemetry & Evolution",
    headline: "Software that grows with your organization.",
    body: "The deployment is just day zero. We configure real-time telemetry dashboards, track user adoption, and iterate systematically as your operational throughput scales.",
    deliverables: ["Live Telemetry Room", "Continuous Optimization", "Dedicated SLA Support"],
    accent: "#D97706",
    metric: "Continuous Scaling",
  },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStage, setActiveStage] = useState(0);
  const current = STAGES[activeStage];

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.fromTo(
      "[data-ab-tag]",
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", clearProps: "all" }
    );
    gsap.fromTo(
      "[data-ab-headline]",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.1, ease: "power3.out", clearProps: "all" }
    );
    gsap.fromTo(
      "[data-ab-console]",
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.15, ease: "power3.out", clearProps: "all" }
    );
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section"
      style={{
        backgroundColor: "var(--color-bg-base)",
        position: "relative",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        {/* Header Block */}
        <div style={{ maxWidth: "700px", marginBottom: "var(--space-16)" }}>
          <div data-ab-tag style={{ marginBottom: "var(--space-4)" }}>
            <span className="section-label">
              Engineering Methodology
            </span>
          </div>

          <h2
            data-ab-headline
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.25rem, 5vw, 4rem)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.035em",
              color: "var(--color-light)",
            }}
          >
            Four structured phases. Zero shortcuts.
          </h2>
        </div>

        {/* 4-Phase Interactive Blueprint Console */}
        <div
          data-ab-console
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "var(--space-8)",
            alignItems: "start",
          }}
          className="lg:!grid-cols-[1fr_1.3fr]"
        >
          {/* LEFT: Phase Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {STAGES.map((s, idx) => {
              const isActive = activeStage === idx;

              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => setActiveStage(idx)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "20px 24px",
                    borderRadius: "var(--radius-xl)",
                    backgroundColor: isActive ? "var(--color-bg-card)" : "var(--color-bg-subtle)",
                    border: isActive ? `1.5px solid ${s.accent}` : "1px solid var(--color-border)",
                    boxShadow: isActive ? `0 0 30px ${s.accent}25, var(--shadow-md)` : "none",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 200ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                    transform: isActive ? "translateX(6px)" : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "14px",
                        fontWeight: 800,
                        color: s.accent,
                      }}
                    >
                      {s.num}
                    </span>

                    <div>
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "16px",
                          fontWeight: 700,
                          color: "var(--color-light)",
                        }}
                      >
                        {s.label}
                      </div>

                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "10px",
                          fontWeight: 600,
                          color: s.accent,
                          textTransform: "uppercase",
                          marginTop: "2px",
                        }}
                      >
                        {s.metric}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: isActive ? s.accent : "transparent",
                      boxShadow: isActive ? `0 0 10px ${s.accent}` : "none",
                    }}
                  />
                </button>
              );
            })}
          </div>

          {/* RIGHT: Active Phase Detail Card */}
          <div
            className="glass-card"
            style={{
              padding: "var(--space-8)",
              borderRadius: "var(--radius-2xl)",
              backgroundColor: "var(--color-bg-card)",
              border: `1px solid ${current.accent}40`,
              boxShadow: `0 0 35px ${current.accent}15, var(--shadow-xl)`,
            }}
          >
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
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "12px",
                  fontWeight: 800,
                  color: current.accent,
                  textTransform: "uppercase",
                }}
              >
                Phase {current.num} Execution
              </span>

              <span
                style={{
                  padding: "4px 10px",
                  borderRadius: "var(--radius-full)",
                  backgroundColor: `${current.accent}18`,
                  border: `1px solid ${current.accent}40`,
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: current.accent,
                }}
              >
                {current.metric}
              </span>
            </div>

            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.35rem, 2.2vw, 1.8rem)",
                fontWeight: 800,
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

            {/* Deliverables List */}
            <div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--color-light)",
                  marginBottom: "var(--space-3)",
                }}
              >
                Key Architecture Deliverables:
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                {current.deliverables.map((item) => (
                  <div
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 14px",
                      borderRadius: "var(--radius-lg)",
                      backgroundColor: "var(--color-bg-subtle)",
                      border: "1px solid var(--color-border)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "12px",
                      color: "var(--color-light)",
                    }}
                  >
                    <span style={{ color: current.accent, fontWeight: 800 }}>✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
