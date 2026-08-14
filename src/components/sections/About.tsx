"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const STAGES = [
  {
    num: "01",
    label: "Understand",
    headline: "We start with your operation, not a template.",
    body: "Before writing a line of code, we map your actual process — every step, every handoff, every failure point. Most problems are simpler than they appear, once you see the whole picture.",
    accent: "#2E4AF9",
  },
  {
    num: "02",
    label: "Design",
    headline: "Architecture before aesthetics.",
    body: "System design is the work. We design the data model, the workflows, the integration points, and the user experience — in that order. The interface emerges from the logic.",
    accent: "#7C3AED",
  },
  {
    num: "03",
    label: "Engineer",
    headline: "Built to last, not to demo.",
    body: "We build with the operational requirements in mind — reliability, performance, security, and maintainability. Software that works at 3am on a Monday.",
    accent: "#059669",
  },
  {
    num: "04",
    label: "Evolve",
    headline: "Systems improve as they're used.",
    body: "The first version is never the final version. We design for extensibility and stay engaged with clients as their operations change. Software that grows with you.",
    accent: "#D97706",
  },
] as const;

export default function About() {
  const sectionRef  = useRef<HTMLElement>(null);
  const [activeStage, setActiveStage] = useState(0);
  const stageBodyRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: "[data-ab-approach]",
      start: "top 70%",
      onEnter: () => {
        gsap.from("[data-ab-approach-tag]",  { opacity: 0, y: 16, duration: 0.6, ease: "power3.out" });
        gsap.from("[data-ab-approach-h]",    { opacity: 0, y: 32, duration: 0.7, delay: 0.1, ease: "power3.out" });
        gsap.from("[data-ab-stage-btn]",     { opacity: 0, y: 16, duration: 0.5, stagger: 0.1, delay: 0.25, ease: "power3.out" });
        gsap.from("[data-ab-stage-panel]",   { opacity: 0, x: 20, duration: 0.6, delay: 0.4, ease: "power3.out" });
      },
    });

    ScrollTrigger.create({
      trigger: "[data-ab-about]",
      start: "top 75%",
      onEnter: () => {
        gsap.from("[data-ab-about-tag]",  { opacity: 0, y: 16, duration: 0.6, ease: "power3.out" });
        gsap.from("[data-ab-about-h]",    { opacity: 0, y: 40, duration: 0.8, delay: 0.1, ease: "power3.out" });
        gsap.from("[data-ab-about-copy]", { opacity: 0, y: 20, duration: 0.6, delay: 0.3, ease: "power3.out" });
        gsap.from("[data-ab-about-cta]",  { opacity: 0, y: 12, duration: 0.5, delay: 0.5, ease: "power3.out" });
      },
    });
  }, { scope: sectionRef });

  const handleStage = (i: number) => {
    const body = stageBodyRef.current;
    if (!body) { setActiveStage(i); return; }
    gsap.to(body, {
      opacity: 0, y: 8, duration: 0.15, ease: "power2.in",
      onComplete: () => {
        setActiveStage(i);
        gsap.fromTo(body, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.25, ease: "power3.out" });
      },
    });
  };

  const stage = STAGES[activeStage];

  return (
    <section
      ref={sectionRef}
      style={{ backgroundColor: "var(--color-primary)", position: "relative" }}
    >
      {/* ── APPROACH ──────────────────────────────────────── */}
      <div
        data-ab-approach
        id="approach-detail"
        className="section"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        <div className="container">
          <span data-ab-approach-tag className="section-label" style={{ marginBottom: "var(--space-6)", display: "flex" }}>
            Our approach
          </span>
          <h2
            data-ab-approach-h
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "var(--color-light)",
              lineHeight: 1.05,
              marginBottom: "var(--space-16)",
            }}
          >
            Four stages.<br />
            No shortcuts.
          </h2>

          <div style={{
            display: "grid", gap: "var(--space-8)",
            gridTemplateColumns: "1fr",
          }}
            className="lg:!grid-cols-[auto_1fr]"
          >
            {/* Stage selector */}
            <div style={{
              display: "flex",
              flexDirection: "row",
              gap: "var(--space-2)",
              overflowX: "auto",
            }}
              className="lg:!flex-col"
            >
              {STAGES.map((s, i) => (
                <button
                  key={s.num}
                  data-ab-stage-btn
                  onClick={() => handleStage(i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-3)",
                    padding: "var(--space-3) var(--space-4)",
                    border: "1px solid transparent",
                    borderRadius: "var(--radius-lg)",
                    backgroundColor: activeStage === i ? `${s.accent}10` : "transparent",
                    borderColor: activeStage === i ? `${s.accent}35` : "transparent",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 200ms ease",
                  }}
                  onMouseEnter={e => { if (activeStage !== i) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)"; }}
                  onMouseLeave={e => { if (activeStage !== i) e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  <span style={{
                    fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 600,
                    letterSpacing: "0.08em", color: activeStage === i ? s.accent : "var(--color-gray-700)",
                    transition: "color 200ms ease",
                  }}>
                    {s.num}
                  </span>
                  <span style={{
                    fontFamily: "var(--font-body)", fontSize: "var(--text-sm)",
                    fontWeight: activeStage === i ? 500 : 400,
                    color: activeStage === i ? "var(--color-light)" : "var(--color-muted)",
                    transition: "color 200ms ease",
                  }}>
                    {s.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Stage content */}
            <div
              data-ab-stage-panel
              ref={stageBodyRef}
              style={{
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-xl)",
                backgroundColor: "rgba(11,18,32,0.5)",
                padding: "var(--space-10)",
                minHeight: "240px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-5)" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: stage.accent }} />
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: "10px",
                  letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-muted)",
                }}>
                  Stage {stage.num}
                </span>
              </div>
              <h3 style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.3rem, 2.5vw, 2rem)",
                fontWeight: 700,
                letterSpacing: "-0.025em",
                color: "var(--color-light)",
                lineHeight: 1.2,
                marginBottom: "var(--space-5)",
              }}>
                {stage.headline}
              </h3>
              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-sm)",
                lineHeight: 1.75,
                color: "var(--color-muted)",
                maxWidth: "520px",
              }}>
                {stage.body}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── ABOUT ─────────────────────────────────────────── */}
      <div
        data-ab-about
        id="about"
        className="section"
        style={{
          borderTop: "1px solid var(--color-border)",
          backgroundColor: "var(--color-dark)",
        }}
      >
        <div className="container">
          <div style={{ maxWidth: "800px" }}>
            <span data-ab-about-tag className="section-label" style={{ marginBottom: "var(--space-8)", display: "flex" }}>
              About ByteBuildIT
            </span>

            <h2
              data-ab-about-h
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(3rem, 8vw, 7rem)",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                lineHeight: 0.95,
                marginBottom: "var(--space-10)",
              }}
            >
              <span style={{ color: "var(--color-light)" }}>We like</span>
              <br />
              <span style={{ color: "var(--color-accent)" }}>difficult</span>
              <br />
              <span style={{ color: "var(--color-light)" }}>problems.</span>
            </h2>

            <div
              data-ab-about-copy
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-5)",
                maxWidth: "540px",
                marginBottom: "var(--space-12)",
              }}
            >
              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(1rem, 1.4vw, 1.1rem)",
                lineHeight: 1.75,
                color: "var(--color-muted)",
              }}>
                ByteBuildIT is a software product studio. We build the systems that
                let businesses operate at a level their current tools can&apos;t support.
              </p>
              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(1rem, 1.4vw, 1.1rem)",
                lineHeight: 1.75,
                color: "var(--color-muted)",
              }}>
                The work we take on tends to be operationally complex — processes that
                don&apos;t fit neatly into an existing SaaS product, or organizations that
                have outgrown the tools they started with.
              </p>
            </div>

            <a
              data-ab-about-cta
              href="#contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-2)",
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                fontWeight: 500,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: "var(--color-white)",
                backgroundColor: "var(--color-accent)",
                padding: "0.75rem 1.5rem",
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
                transition: "background-color 200ms ease, box-shadow 200ms ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = "var(--color-accent-hover)";
                e.currentTarget.style.boxShadow = "var(--shadow-glow)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = "var(--color-accent)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Bring us the problem ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
