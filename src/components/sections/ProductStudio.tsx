"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const PIPELINE = [
  {
    step: "01",
    label: "Problem",
    desc: "A real operational inefficiency in an existing business.",
    color: "var(--color-muted)",
  },
  {
    step: "02",
    label: "System",
    desc: "We design and build the software system that solves it.",
    color: "#4A62FF",
  },
  {
    step: "03",
    label: "Pattern",
    desc: "The solution reveals a reusable structural pattern.",
    color: "#7C3AED",
  },
  {
    step: "04",
    label: "Product",
    desc: "The pattern becomes a standalone product offering.",
    color: "#059669",
  },
  {
    step: "05",
    label: "SaaS",
    desc: "The product scales to serve an entire market segment.",
    color: "#D97706",
  },
] as const;

export default function ProductStudio() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 70%",
      onEnter: () => {
        gsap.from("[data-ps-tag]",      { opacity: 0, y: 16, duration: 0.6, ease: "power3.out" });
        gsap.from("[data-ps-headline]", { opacity: 0, y: 36, duration: 0.8, delay: 0.1, ease: "power3.out" });
        gsap.from("[data-ps-copy]",     { opacity: 0, y: 20, duration: 0.6, delay: 0.3, ease: "power3.out" });
        gsap.from("[data-ps-step]",     { opacity: 0, x: -24, duration: 0.6, stagger: 0.12, delay: 0.4, ease: "power3.out" });
        gsap.from("[data-ps-connector]",{ scaleY: 0, duration: 0.5, stagger: 0.12, delay: 0.5, ease: "power2.inOut", transformOrigin: "top center" });
      },
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="section"
      style={{ backgroundColor: "var(--color-dark)", position: "relative" }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(to right, transparent, var(--color-border) 30%, var(--color-border) 70%, transparent)",
      }} />

      <div className="container">
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "var(--space-20)",
          alignItems: "center",
        }}
          className="lg:!grid-cols-[1fr_1fr]"
        >
          {/* Left — copy */}
          <div>
            <span data-ps-tag className="section-label" style={{ marginBottom: "var(--space-6)", display: "flex" }}>
              Product studio
            </span>

            <h2
              data-ps-headline
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "var(--color-light)",
                lineHeight: 1.05,
                marginBottom: "var(--space-8)",
              }}
            >
              The best systems<br />
              become products.
            </h2>

            <p
              data-ps-copy
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(1rem, 1.3vw, 1.05rem)",
                lineHeight: 1.75,
                color: "var(--color-muted)",
                maxWidth: "460px",
              }}
            >
              We don&apos;t just build software for clients. When a system we design solves
              a problem well enough, we build it into a product that can serve an entire industry.
              That&apos;s the pipeline.
            </p>
          </div>

          {/* Right — animated pipeline */}
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {PIPELINE.map((item, i) => (
                <div key={item.step}>
                  {/* Step */}
                  <div
                    data-ps-step
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "var(--space-5)",
                      padding: "var(--space-5) 0",
                    }}
                  >
                    {/* Number + connector column */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        border: `1px solid ${item.color}40`,
                        backgroundColor: `${item.color}10`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        <span style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "9px",
                          fontWeight: 600,
                          letterSpacing: "0.06em",
                          color: item.color,
                        }}>
                          {item.step}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div style={{ paddingTop: "var(--space-1)" }}>
                      <div style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "var(--text-xl)",
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        color: item.color === "var(--color-muted)" ? "var(--color-light)" : item.color,
                        marginBottom: "var(--space-1)",
                      }}>
                        {item.label}
                      </div>
                      <p style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "var(--text-sm)",
                        lineHeight: 1.65,
                        color: "var(--color-muted)",
                      }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {/* Connector line (between steps) */}
                  {i < PIPELINE.length - 1 && (
                    <div
                      data-ps-connector
                      style={{
                        marginLeft: "17px",
                        width: "1px",
                        height: "var(--space-6)",
                        background: `linear-gradient(to bottom, ${item.color}40, ${PIPELINE[i + 1].color}40)`,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
