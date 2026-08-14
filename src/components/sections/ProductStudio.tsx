"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const PIPELINE = [
  {
    step: "01",
    label: "Friction Discovery",
    desc: "We diagnose a tangible operational bottleneck that drains labor hours, induces human error, or caps organizational growth.",
    badge: "Operational Audit",
    color: "#2E4AF9",
  },
  {
    step: "02",
    label: "Custom Architecture",
    desc: "We architect and engineer a purpose-built software system tailored specifically to your exact workflow constraints.",
    badge: "Production Engine",
    color: "#4A62FF",
  },
  {
    step: "03",
    label: "Pattern Extraction",
    desc: "The proven solution reveals an underlying architectural blueprint that generalizes across an entire vertical industry.",
    badge: "Structural Framework",
    color: "#7C3AED",
  },
  {
    step: "04",
    label: "Productization",
    desc: "We engineer a multi-tenant, cloud-native digital product complete with enterprise authentication, billing, and API endpoints.",
    badge: "Commercial Software",
    color: "#059669",
  },
  {
    step: "05",
    label: "Market Scaling",
    desc: "The digital product scales autonomously, generating recurring software value and transforming internal systems into industry benchmarks.",
    badge: "SaaS Enterprise",
    color: "#D97706",
  },
];

export default function ProductStudio() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(1);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.fromTo(
      "[data-ps-tag]",
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", clearProps: "all" }
    );
    gsap.fromTo(
      "[data-ps-headline]",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.1, ease: "power3.out", clearProps: "all" }
    );
    gsap.fromTo(
      "[data-ps-pipeline]",
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.15, ease: "power3.out", clearProps: "all" }
    );
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="section"
      style={{
        backgroundColor: "var(--color-bg-surface)",
        position: "relative",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "var(--space-16)",
            alignItems: "center",
          }}
          className="lg:!grid-cols-[1fr_1.1fr]"
        >
          {/* Left Column: Narrative */}
          <div>
            <div data-ps-tag style={{ marginBottom: "var(--space-4)" }}>
              <span className="section-label">
                Product Studio Model
              </span>
            </div>

            <h2
              data-ps-headline
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
                fontWeight: 800,
                letterSpacing: "-0.035em",
                color: "var(--color-light)",
                lineHeight: 1.08,
                marginBottom: "var(--space-6)",
              }}
            >
              The best internal systems become market-leading products.
            </h2>

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(1.05rem, 1.3vw, 1.15rem)",
                lineHeight: 1.75,
                color: "var(--color-muted)",
                marginBottom: "var(--space-8)",
              }}
            >
              We don&apos;t just build one-off software. When an operational system solves a core
              business problem with exceptional efficiency, we extract the underlying pattern and productize
              it into standalone software built for industry scale.
            </p>

            <div
              style={{
                padding: "var(--space-6)",
                borderRadius: "var(--radius-xl)",
                backgroundColor: "var(--color-bg-card)",
                border: "1px solid var(--color-border)",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--color-accent)",
                  marginBottom: "var(--space-2)",
                }}
              >
                The Studio Advantage
              </div>

              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.15rem",
                  fontWeight: 700,
                  color: "var(--color-light)",
                  lineHeight: 1.4,
                }}
              >
                Battle-tested in real operations before writing a single line of SaaS marketing copy.
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 5-Step Pipeline Circuit */}
          <div
            data-ps-pipeline
            className="glass-card"
            style={{
              padding: "var(--space-8)",
              borderRadius: "var(--radius-2xl)",
              backgroundColor: "var(--color-bg-card)",
              border: "1px solid var(--color-border)",
              boxShadow: "var(--shadow-xl)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              {PIPELINE.map((item, idx) => {
                const isActive = activeStep === idx;

                return (
                  <div
                    key={item.step}
                    onClick={() => setActiveStep(idx)}
                    style={{
                      padding: "16px 20px",
                      borderRadius: "var(--radius-xl)",
                      backgroundColor: isActive ? `${item.color}14` : "var(--color-bg-subtle)",
                      border: isActive ? `1.5px solid ${item.color}` : "1px solid var(--color-border)",
                      boxShadow: isActive ? `0 0 25px ${item.color}20` : "none",
                      cursor: "pointer",
                      transition: "all 250ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                      transform: isActive ? "translateX(6px)" : "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "6px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "12px",
                            fontWeight: 800,
                            color: item.color,
                            padding: "2px 8px",
                            borderRadius: "var(--radius-xs)",
                            backgroundColor: `${item.color}20`,
                          }}
                        >
                          {item.step}
                        </span>

                        <span
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "1.1rem",
                            fontWeight: 700,
                            color: "var(--color-light)",
                          }}
                        >
                          {item.label}
                        </span>
                      </div>

                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "10px",
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          color: item.color,
                        }}
                      >
                        {item.badge}
                      </span>
                    </div>

                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "13px",
                        lineHeight: 1.6,
                        color: isActive ? "var(--color-light)" : "var(--color-muted)",
                        margin: 0,
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
