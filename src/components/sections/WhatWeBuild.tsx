"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const CAPABILITIES = [
  {
    abbr: "01",
    title: "Operational Engines & ERP",
    desc: "End-to-end operational software that eliminates fragmented spreadsheets. Order routing, automated stock reconciliation, and central data models.",
    chips: ["Order Routing", "Live Inventory", "ACID Data Models", "Audit Logs"],
    accent: "#2E4AF9",
    metric: "100% Data Cohesion",
  },
  {
    abbr: "02",
    title: "Domain & Industry Software",
    desc: "Specialized platforms for logistics, manufacturing, clinical workflows, and field operations where off-the-shelf SaaS fails to fit.",
    chips: ["Logistics Dispatch", "Manufacturing Ops", "Clinical Portals", "Field Service"],
    accent: "#7C3AED",
    metric: "Zero Generic Friction",
  },
  {
    abbr: "03",
    title: "Event-Driven Automation",
    desc: "Remove human copy-pasting from operational handoffs. We build high-throughput integration middleware and webhook pipelines.",
    chips: ["Event Webhooks", "Pipeline Orchestration", "Async Workers", "Error Retries"],
    accent: "#059669",
    metric: "Sub-Second Latency",
  },
  {
    abbr: "04",
    title: "Applied AI & Intelligence",
    desc: "Machine intelligence applied strictly where it drives business leverage: document extraction, decision validation, and predictive scheduling.",
    chips: ["Document OCR", "LLM Reasoning", "Anomaly Detection", "Automated Triage"],
    accent: "#D97706",
    metric: "10x Document Speed",
  },
  {
    abbr: "05",
    title: "Digital Productization (SaaS)",
    desc: "Transform internal operational software into multi-tenant SaaS products ready for commercial enterprise deployment.",
    chips: ["Multi-Tenant DB", "Stripe Billing", "Tenant Isolation", "Role Auth"],
    accent: "#DC2626",
    metric: "Commercial Scalability",
  },
  {
    abbr: "06",
    title: "Cloud & Infrastructure Systems",
    desc: "Rock-solid engineering foundation. High-availability databases, serverless edge compute, zero-trust security, and automated CI/CD.",
    chips: ["PostgreSQL", "Next.js 16", "Supabase", "Edge Compute"],
    accent: "#0F766E",
    metric: "99.9% Production SLA",
  },
];

export default function WhatWeBuild() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.fromTo(
      "[data-wwb-tag]",
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", clearProps: "all" }
    );
    gsap.fromTo(
      "[data-wwb-headline]",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.1, ease: "power3.out", clearProps: "all" }
    );
    gsap.fromTo(
      "[data-wwb-card]",
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.06,
        delay: 0.15,
        ease: "power3.out",
        clearProps: "all",
      }
    );
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="what-we-build"
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
          <div data-wwb-tag style={{ marginBottom: "var(--space-4)" }}>
            <span className="section-label">
              Capabilities &amp; Engineering Scope
            </span>
          </div>

          <h2
            data-wwb-headline
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.25rem, 5vw, 4rem)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.035em",
              color: "var(--color-light)",
            }}
          >
            Engineering specialized software for complex operations.
          </h2>
        </div>

        {/* 6-Card Bento Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "var(--space-6)",
          }}
          className="md:!grid-cols-2 lg:!grid-cols-3"
        >
          {CAPABILITIES.map((cap, i) => {
            const isHovered = hoveredIdx === i;

            return (
              <div
                key={cap.abbr}
                data-wwb-card
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="glass-card"
                style={{
                  padding: "var(--space-8)",
                  borderRadius: "var(--radius-2xl)",
                  backgroundColor: "var(--color-bg-card)",
                  border: isHovered ? `1.5px solid ${cap.accent}` : "1px solid var(--color-border)",
                  boxShadow: isHovered ? `0 0 35px ${cap.accent}25, var(--shadow-lg)` : "var(--shadow-sm)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "all 250ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                  transform: isHovered ? "translateY(-4px)" : "none",
                }}
              >
                <div>
                  {/* Top Index & Metric */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "var(--space-6)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "14px",
                        fontWeight: 800,
                        color: cap.accent,
                      }}
                    >
                      {cap.abbr}
                    </span>

                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: cap.accent,
                        padding: "3px 8px",
                        borderRadius: "var(--radius-full)",
                        backgroundColor: `${cap.accent}18`,
                        border: `1px solid ${cap.accent}40`,
                      }}
                    >
                      {cap.metric}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.35rem",
                      fontWeight: 800,
                      color: "var(--color-light)",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.25,
                      marginBottom: "var(--space-3)",
                    }}
                  >
                    {cap.title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "clamp(0.95rem, 1.1vw, 1.05rem)",
                      lineHeight: 1.65,
                      color: "var(--color-muted)",
                      marginBottom: "var(--space-6)",
                    }}
                  >
                    {cap.desc}
                  </p>
                </div>

                {/* Capability Chips */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", paddingTop: "var(--space-4)", borderTop: "1px solid var(--color-border)" }}>
                  {cap.chips.map((chip) => (
                    <span
                      key={chip}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "10px",
                        fontWeight: 500,
                        padding: "4px 8px",
                        borderRadius: "var(--radius-xs)",
                        backgroundColor: "var(--color-bg-subtle)",
                        border: "1px solid var(--color-border)",
                        color: "var(--color-light)",
                      }}
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
