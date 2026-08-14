"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const PROBLEMS = [
  {
    id: "manual",
    label: "Manual work",
    headline: "Still doing it by hand?",
    body: "When your team spends hours on repetitive data entry, reconciliation, and copy-paste operations, you're paying for friction. We automate the bottleneck.",
    visual: { from: "8 steps, 4 people, 3 hours", to: "1 automated workflow" },
    accent: "#2E4AF9",
  },
  {
    id: "disconnected",
    label: "Disconnected systems",
    headline: "Your tools don't talk.",
    body: "Sales is in one system. Operations in another. Finance in a spreadsheet. The glue is humans — and humans make errors. We connect the systems.",
    visual: { from: "CRM → export → paste → ERP", to: "Live sync, always consistent" },
    accent: "#5B21B6",
  },
  {
    id: "spreadsheets",
    label: "Too many spreadsheets",
    headline: "Spreadsheets at scale break.",
    body: "Version control. Merge conflicts. No audit trail. Concurrency issues. The spreadsheet was never designed to be your operational database.",
    visual: { from: "v12_final_FINAL_use_this.xlsx", to: "Centralized system of record" },
    accent: "#0F766E",
  },
  {
    id: "orders",
    label: "Order complexity",
    headline: "Orders shouldn't be this hard.",
    body: "Multi-channel orders, variants, custom configurations, partial fulfillments, returns — when your process can't keep up, customers feel it.",
    visual: { from: "WhatsApp → Spreadsheet → Manual pack", to: "Unified order management" },
    accent: "#B45309",
  },
  {
    id: "visibility",
    label: "Poor visibility",
    headline: "You can't manage what you can't see.",
    body: "Without real-time operational data, decisions are made on gut feel and yesterday's numbers. We build dashboards that tell the truth.",
    visual: { from: "Monthly reports, always late", to: "Live operational intelligence" },
    accent: "#065F46",
  },
  {
    id: "legacy",
    label: "Legacy software",
    headline: "Built for a different era.",
    body: "Old systems that nobody wants to touch. Integrations held together with duct tape. Migration feels impossible — until it isn't.",
    visual: { from: "Unmaintainable, unextendable", to: "Modern, maintainable architecture" },
    accent: "#831843",
  },
  {
    id: "ai",
    label: "AI opportunity",
    headline: "Intelligence where it matters.",
    body: "Not AI for the sake of AI. We identify where machine intelligence creates real leverage — document processing, decision support, prediction.",
    visual: { from: "Manual review, inconsistent", to: "Intelligent automation + human oversight" },
    accent: "#1D4ED8",
  },
  {
    id: "other",
    label: "Something else",
    headline: "Tell us what's broken.",
    body: "Every operation has its own specific friction points. We start with discovery — understanding your process before recommending any technology.",
    visual: { from: "Your unique problem", to: "A system designed around it" },
    accent: "#374151",
  },
] as const;

export default function ProblemFinder() {
  const sectionRef   = useRef<HTMLElement>(null);
  const vizRef       = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const current = PROBLEMS[active];

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 70%",
      onEnter: () => {
        gsap.from("[data-pf-tag]",      { opacity: 0, y: 16, duration: 0.6, ease: "power3.out" });
        gsap.from("[data-pf-headline]", { opacity: 0, y: 32, duration: 0.7, delay: 0.1, ease: "power3.out" });
        gsap.from("[data-pf-chip]",     { opacity: 0, y: 16, duration: 0.5, stagger: 0.055, delay: 0.25, ease: "power3.out" });
        gsap.from("[data-pf-panel]",    { opacity: 0, x: 24, duration: 0.7, delay: 0.4, ease: "power3.out" });
      },
    });
  }, { scope: sectionRef });

  const handleSelect = (i: number) => {
    if (!vizRef.current) { setActive(i); return; }
    gsap.to(vizRef.current, {
      opacity: 0, y: 8, duration: 0.18, ease: "power2.in",
      onComplete: () => {
        setActive(i);
        gsap.fromTo(vizRef.current,
          { opacity: 0, y: -8 },
          { opacity: 1, y: 0, duration: 0.28, ease: "power3.out" }
        );
      },
    });
  };

  return (
    <section
      ref={sectionRef}
      id="solutions"
      className="section"
      style={{ backgroundColor: "var(--color-primary)", position: "relative" }}
    >
      {/* top rule */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(to right, transparent, var(--color-border) 30%, var(--color-border) 70%, transparent)",
      }} />

      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: "var(--space-16)" }}>
          <span data-pf-tag className="section-label" style={{ marginBottom: "var(--space-6)", display: "flex" }}>
            Problem finder
          </span>
          <h2
            data-pf-headline
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "var(--color-light)",
              maxWidth: "600px",
            }}
          >
            What&apos;s breaking your flow?
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "var(--space-8)",
          alignItems: "start",
        }}
          className="lg:!grid-cols-[1fr_1.1fr]"
        >
          {/* ── Problem chips ─────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            {PROBLEMS.map((p, i) => (
              <button
                key={p.id}
                data-pf-chip
                onClick={() => handleSelect(i)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "var(--space-4) var(--space-5)",
                  border: active === i
                    ? `1px solid ${current.accent}40`
                    : "1px solid var(--color-border)",
                  borderRadius: "var(--radius-lg)",
                  backgroundColor: active === i
                    ? `${current.accent}10`
                    : "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 250ms ease",
                }}
                onMouseEnter={e => {
                  if (active !== i) {
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.borderColor = "var(--color-border-md)";
                  }
                }}
                onMouseLeave={e => {
                  if (active !== i) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.borderColor = "var(--color-border)";
                  }
                }}
              >
                <span style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-sm)",
                  fontWeight: active === i ? 500 : 400,
                  color: active === i ? "var(--color-light)" : "var(--color-muted)",
                  transition: "color 200ms ease",
                }}>
                  {p.label}
                </span>
                {active === i && (
                  <span style={{
                    width: 6, height: 6, borderRadius: "50%",
                    backgroundColor: current.accent,
                    flexShrink: 0,
                  }} />
                )}
              </button>
            ))}
          </div>

          {/* ── Visualization panel ───────────────────────── */}
          <div
            data-pf-panel
            ref={vizRef}
            style={{
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-xl)",
              backgroundColor: "rgba(11,18,32,0.6)",
              overflow: "hidden",
              minHeight: "340px",
            }}
          >
            {/* Panel header */}
            <div style={{
              borderBottom: "1px solid var(--color-border)",
              padding: "var(--space-5) var(--space-6)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  backgroundColor: current.accent,
                  boxShadow: `0 0 8px ${current.accent}`,
                }} />
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: "10px",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  color: "var(--color-muted)",
                }}>
                  {current.label}
                </span>
              </div>
              <h3 style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
                fontWeight: 700,
                letterSpacing: "-0.025em",
                color: "var(--color-light)",
                lineHeight: 1.2,
              }}>
                {current.headline}
              </h3>
            </div>

            {/* Body */}
            <div style={{ padding: "var(--space-6)" }}>
              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-sm)",
                lineHeight: 1.75,
                color: "var(--color-muted)",
                marginBottom: "var(--space-8)",
              }}>
                {current.body}
              </p>

              {/* Before → After */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr auto 1fr",
                gap: "var(--space-4)",
                alignItems: "center",
              }}>
                <div style={{
                  padding: "var(--space-4)",
                  backgroundColor: "rgba(255,255,255,0.03)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-lg)",
                }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-gray-600)", marginBottom: "var(--space-2)" }}>
                    Before
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--color-muted)", lineHeight: 1.5 }}>
                    {current.visual.from}
                  </div>
                </div>

                <div style={{ color: "var(--color-gray-700)", fontSize: "1.25rem" }}>→</div>

                <div style={{
                  padding: "var(--space-4)",
                  backgroundColor: `${current.accent}08`,
                  border: `1px solid ${current.accent}25`,
                  borderRadius: "var(--radius-lg)",
                }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: current.accent, opacity: 0.8, marginBottom: "var(--space-2)" }}>
                    After
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--color-neutral)", lineHeight: 1.5 }}>
                    {current.visual.to}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div style={{ marginTop: "var(--space-8)" }}>
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
                  Bring us this problem ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
