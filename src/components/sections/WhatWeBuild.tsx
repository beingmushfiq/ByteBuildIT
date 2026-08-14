"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const CATEGORIES = [
  {
    id: "systems",
    label: "Business Systems",
    abbr: "01",
    description:
      "End-to-end operational platforms that replace disconnected tools with a single, authoritative source of truth. Order management, inventory, customer ops, field operations.",
    capabilities: ["Order management", "Inventory control", "Customer portals", "Operational dashboards", "Process automation"],
    accent: "#2E4AF9",
    projects: ["OrderShield", "StaffSync"],
  },
  {
    id: "industry",
    label: "Industry Software",
    abbr: "02",
    description:
      "Domain-specific software for industries where generic SaaS doesn't fit: logistics, manufacturing, professional services, healthcare admin, construction.",
    capabilities: ["Logistics platforms", "Manufacturing ops", "Healthcare admin", "Field service", "Compliance systems"],
    accent: "#7C3AED",
    projects: ["RouteIQ", "ClinicOS"],
  },
  {
    id: "automation",
    label: "Automation",
    abbr: "03",
    description:
      "Eliminate the manual work that consumes your team. We design automation around your actual processes — not a tool's limitations.",
    capabilities: ["Process automation", "Document processing", "Data pipelines", "Integration middleware", "Scheduled workflows"],
    accent: "#059669",
    projects: ["InvoiceFlow", "DataBridge"],
  },
  {
    id: "ai",
    label: "AI & Intelligence",
    abbr: "04",
    description:
      "Applied AI where it creates real operational leverage: intelligent document extraction, decision support, anomaly detection, and prediction — not AI for the sake of it.",
    capabilities: ["Document AI", "Decision support", "Anomaly detection", "Predictive analytics", "LLM integrations"],
    accent: "#D97706",
    projects: ["DocuSense", "AuditMind"],
  },
  {
    id: "products",
    label: "Digital Products",
    abbr: "05",
    description:
      "When an internal system solves a problem well enough to become a product. We take operational systems and productize them for broader markets.",
    capabilities: ["SaaS productization", "B2B platforms", "API products", "Multi-tenant architecture", "Product strategy"],
    accent: "#DC2626",
    projects: ["ClearOps", "TrackFlow"],
  },
  {
    id: "infra",
    label: "Infrastructure",
    abbr: "06",
    description:
      "The foundation that everything else runs on. Cloud architecture, data infrastructure, API design, security, and the engineering foundations for scale.",
    capabilities: ["Cloud architecture", "Data engineering", "API design", "Security hardening", "DevOps"],
    accent: "#0F766E",
    projects: ["DataMesh", "SecureLayer"],
  },
] as const;

export default function WhatWeBuild() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef   = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const current = CATEGORIES[active];

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 70%",
      onEnter: () => {
        gsap.from("[data-wwb-tag]",      { opacity: 0, y: 16, duration: 0.6, ease: "power3.out" });
        gsap.from("[data-wwb-headline]", { opacity: 0, y: 32, duration: 0.7, delay: 0.1, ease: "power3.out" });
        gsap.from("[data-wwb-copy]",     { opacity: 0, y: 20, duration: 0.6, delay: 0.25, ease: "power3.out" });
        gsap.from("[data-wwb-cat]",      { opacity: 0, y: 12, duration: 0.5, stagger: 0.07, delay: 0.3, ease: "power3.out" });
      },
    });
  }, { scope: sectionRef });

  const handleCat = (i: number) => {
    if (!panelRef.current) { setActive(i); return; }
    gsap.to(panelRef.current, {
      opacity: 0, y: 10, duration: 0.18, ease: "power2.in",
      onComplete: () => {
        setActive(i);
        gsap.fromTo(panelRef.current,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.28, ease: "power3.out" }
        );
      },
    });
  };

  return (
    <section
      ref={sectionRef}
      id="what-we-build"
      className="section"
      style={{ backgroundColor: "var(--color-primary)", position: "relative" }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(to right, transparent, var(--color-border) 30%, var(--color-border) 70%, transparent)",
      }} />

      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: "600px", marginBottom: "var(--space-20)" }}>
          <span data-wwb-tag className="section-label" style={{ marginBottom: "var(--space-6)", display: "flex" }}>
            What we build
          </span>
          <h2
            data-wwb-headline
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "var(--color-light)",
              lineHeight: 1.05,
              marginBottom: "var(--space-6)",
            }}
          >
            Six categories.<br />
            One approach.
          </h2>
          <p
            data-wwb-copy
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(1rem, 1.3vw, 1.05rem)",
              lineHeight: 1.75,
              color: "var(--color-muted)",
            }}
          >
            Everything we build starts with the same question: what&apos;s the underlying
            process, and how should it actually work?
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "var(--space-12)",
          alignItems: "start",
        }}
          className="lg:!grid-cols-[240px_1fr]"
        >
          {/* Category list */}
          <nav style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat.id}
                data-wwb-cat
                onClick={() => handleCat(i)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-4)",
                  width: "100%",
                  padding: "var(--space-3) var(--space-4)",
                  border: "1px solid transparent",
                  borderRadius: "var(--radius-lg)",
                  backgroundColor: active === i ? `${cat.accent}10` : "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 200ms ease",
                  borderColor: active === i ? `${cat.accent}30` : "transparent",
                }}
                onMouseEnter={e => {
                  if (active !== i) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)";
                }}
                onMouseLeave={e => {
                  if (active !== i) e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  color: active === i ? cat.accent : "var(--color-gray-700)",
                  minWidth: "20px",
                  transition: "color 200ms ease",
                }}>
                  {cat.abbr}
                </span>
                <span style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-sm)",
                  fontWeight: active === i ? 500 : 400,
                  color: active === i ? "var(--color-light)" : "var(--color-muted)",
                  transition: "color 200ms ease, font-weight 200ms ease",
                }}>
                  {cat.label}
                </span>
              </button>
            ))}
          </nav>

          {/* Detail panel */}
          <div
            ref={panelRef}
            style={{
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-xl)",
              backgroundColor: "rgba(11,18,32,0.5)",
              padding: "var(--space-10)",
              minHeight: "380px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-6)" }}>
              <div style={{
                width: 10, height: 10, borderRadius: "50%",
                backgroundColor: current.accent,
                boxShadow: `0 0 10px ${current.accent}60`,
              }} />
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "10px",
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: "var(--color-muted)",
              }}>
                {current.abbr} — {current.label}
              </span>
            </div>

            <h3 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              color: "var(--color-light)",
              lineHeight: 1.15,
              marginBottom: "var(--space-6)",
            }}>
              {current.label}
            </h3>

            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sm)",
              lineHeight: 1.75,
              color: "var(--color-muted)",
              marginBottom: "var(--space-10)",
              maxWidth: "540px",
            }}>
              {current.description}
            </p>

            {/* Capabilities */}
            <div style={{ marginBottom: "var(--space-10)" }}>
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: "9px",
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: "var(--color-gray-600)",
                marginBottom: "var(--space-4)",
              }}>
                Capabilities
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                {current.capabilities.map(cap => (
                  <span
                    key={cap}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "10px",
                      fontWeight: 500,
                      letterSpacing: "0.04em",
                      color: current.accent,
                      backgroundColor: `${current.accent}10`,
                      border: `1px solid ${current.accent}25`,
                      borderRadius: "var(--radius-sm)",
                      padding: "3px 10px",
                    }}
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            <a
              href="#contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-2)",
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: current.accent,
                textDecoration: "none",
                transition: "opacity 200ms ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              Start a project in this area ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
