"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/* ── CMS-Editable Structured Data ─────────────────────────────────── */

interface FlowStepData {
  id: string;
  label: string;
  description: string;
}

interface ProductStudioData {
  sectionNumber: string;
  headline: string;
  description: string;
  steps: FlowStepData[];
}

const PRODUCT_STUDIO_DATA: ProductStudioData = {
  sectionNumber: "04",
  headline: "THE BEST SYSTEMS BECOME PRODUCTS.",
  description:
    "We identify recurring operational problems, build solutions around them and turn proven systems into scalable software products.",
  steps: [
    {
      id: "client-problem",
      label: "CLIENT PROBLEM",
      description: "We find what's broken",
    },
    {
      id: "custom-system",
      label: "CUSTOM SYSTEM",
      description: "We build a solution",
    },
    {
      id: "repeated-pattern",
      label: "REPEATED PATTERN",
      description: "It proves itself",
    },
    {
      id: "product",
      label: "PRODUCT",
      description: "It becomes a platform",
    },
    {
      id: "saas",
      label: "SaaS",
      description: "It scales to many",
    },
  ],
};

/* ── Diagram Layout Constants ─────────────────────────────────────── */

const NODE_WIDTH = 160;
const NODE_HEIGHT = 68;
const NODE_SPACING = 100;
const LINE_X = NODE_WIDTH / 2;
const LINE_Y_START = NODE_HEIGHT / 2;
const LINE_Y_END =
  (PRODUCT_STUDIO_DATA.steps.length - 1) * NODE_SPACING + NODE_HEIGHT / 2;

/* ── Component ────────────────────────────────────────────────────── */

export default function ProductStudio() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      // ── Section Number ──
      const sectionNumber = section.querySelector("[data-ps-section-number]");
      if (sectionNumber) {
        gsap.fromTo(
          sectionNumber,
          { opacity: 0, x: -12 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // ── Text Reveal ──
      const textElements = section.querySelectorAll("[data-ps-text-reveal]");
      gsap.set(textElements, { opacity: 0, y: 30 });

      gsap.to(textElements, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "top 40%",
          toggleActions: "play none none reverse",
        },
      });

      // ── Desktop Vertical Flow ──
      const desktopFlow = section.querySelector<HTMLElement>(
        "[data-ps-desktop-flow]"
      );

      if (desktopFlow) {
        const nodes = desktopFlow.querySelectorAll<HTMLElement>(
          "[data-ps-node]"
        );
        const svgLine = desktopFlow.querySelector<SVGLineElement>(
          "[data-ps-svg-line]"
        );
        const svgContainer = desktopFlow.querySelector<SVGSVGElement>(
          "[data-ps-svg-container]"
        );

        // Measure actual node positions from DOM
        const nodePositions: number[] = [];
        if (nodes.length > 0) {
          const containerTop = desktopFlow.getBoundingClientRect().top;
          nodes.forEach((node) => {
            const nodeCenterY =
              node.getBoundingClientRect().top -
              containerTop +
              NODE_HEIGHT / 2;
            nodePositions.push(nodeCenterY);
          });
        }

        // Set initial states for nodes
        gsap.set(nodes, { opacity: 0, y: 20, scale: 0.95 });

        // Set up SVG line path with correct coordinates
        if (svgLine && nodePositions.length >= 2) {
          const y1 = nodePositions[0];
          const y2 = nodePositions[nodePositions.length - 1];
          svgLine.setAttribute("y1", String(y1));
          svgLine.setAttribute("y2", String(y2));

          // Set clip-path for line-drawing animation (fully hidden)
          if (svgContainer) {
            svgContainer.style.clipPath = `polygon(0 0, 100% 0, 100% 0%, 0 0%)`;
          }

          // Create animation timeline for flow diagram
          const flowTl = gsap.timeline({
            scrollTrigger: {
              trigger: desktopFlow,
              start: "top 72%",
              end: "bottom 30%",
              toggleActions: "play none none reverse",
            },
          });

          // Animate SVG line drawing
          if (svgContainer) {
            flowTl.to(
              svgContainer,
              {
                clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)`,
                duration: 1.8,
                ease: "power2.inOut",
              },
              0
            );
          }

          // Stagger nodes appearing sequentially
          nodes.forEach((node, i) => {
            flowTl.to(
              node,
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.5,
                ease: "power3.out",
              },
              i * 0.18
            );
          });
        }
      }

      // ── Mobile Horizontal Flow ──
      const mobileSteps = section.querySelectorAll("[data-ps-mobile-step]");
      const mobileConnectors = section.querySelectorAll(
        "[data-ps-mobile-connector]"
      );

      if (mobileSteps.length > 0) {
        gsap.set(mobileSteps, { opacity: 0, y: 16, scale: 0.95 });
        gsap.set(mobileConnectors, { opacity: 0, scaleX: 0 });

        const mobileTl = gsap.timeline({
          scrollTrigger: {
            trigger: mobileSteps[0]?.closest("[data-ps-mobile-flow]"),
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });

        mobileSteps.forEach((step, i) => {
          mobileTl.to(
            step,
            { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power3.out" },
            i * 0.12
          );
          if (mobileConnectors[i]) {
            mobileTl.to(
              mobileConnectors[i],
              { opacity: 1, scaleX: 1, duration: 0.3, ease: "power2.out" },
              i * 0.12 + 0.1
            );
          }
        });
      }
    },
    { scope: sectionRef }
  );

  const { sectionNumber, headline, description, steps } = PRODUCT_STUDIO_DATA;

  return (
    <section
      ref={sectionRef}
      className="section"
      style={{ backgroundColor: "var(--color-primary)" }}
      aria-label="Product Studio"
    >
      <div className="container" style={{ maxWidth: "var(--container-max)" }}>
        {/* ── Section Number ──────────────────────────────────────── */}
        <div
          data-ps-section-number
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-sm)",
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase" as const,
            color: "var(--color-accent)",
            marginBottom: "var(--space-8)",
          }}
        >
          {sectionNumber}
        </div>

        {/* ── Two-Column Layout ───────────────────────────────────── */}
        <div
          data-ps-grid
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--space-16)",
            alignItems: "start",
          }}
        >
          {/* Left Column: Copy */}
          <div>
            {/* Headline */}
            <h2
              data-ps-text-reveal
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(2rem, 5vw, 4.5rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: "var(--color-light)",
                marginBottom: "var(--space-6)",
              }}
            >
              {headline}
            </h2>

            {/* Description */}
            <p
              data-ps-text-reveal
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(1rem, 1.3vw, 1.125rem)",
                lineHeight: 1.7,
                color: "var(--color-muted)",
                maxWidth: "480px",
              }}
            >
              {description}
            </p>
          </div>

          {/* Right Column: Vertical Flow Diagram */}
          <div
            data-ps-desktop-flow
            style={{
              position: "relative",
              height: `${(steps.length - 1) * NODE_SPACING + NODE_HEIGHT}px`,
            }}
          >
            {/* Radial glow backdrop */}
            <div
              style={{
                position: "absolute",
                inset: "-40px",
                background:
                  "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(46,74,249,0.04) 0%, transparent 100%)",
                pointerEvents: "none",
              }}
            />

            {/* SVG connecting line and arrow indicators */}
            <svg
              data-ps-svg-container
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
              }}
              aria-hidden="true"
            >
              {/* Connecting line */}
              <line
                data-ps-svg-line
                x1={LINE_X}
                y1={LINE_Y_START}
                x2={LINE_X}
                y2={LINE_Y_END}
                stroke="var(--color-gray-600)"
                strokeWidth="1"
              />

              {/* Small arrow indicators below each node (except last) */}
              {steps.slice(0, -1).map((_, i) => {
                const arrowY = i * NODE_SPACING + NODE_HEIGHT / 2 + 18;
                return (
                  <polygon
                    key={i}
                    points={`${LINE_X - 3},${arrowY} ${LINE_X + 3},${arrowY} ${LINE_X},${arrowY + 4}`}
                    fill="var(--color-gray-600)"
                    opacity="0.5"
                  />
                );
              })}
            </svg>

            {/* Flow step nodes */}
            {steps.map((step, i) => {
              const isLast = i === steps.length - 1;
              const topOffset = i * NODE_SPACING;

              return (
                <div
                  key={step.id}
                  data-ps-node
                  style={{
                    position: "absolute",
                    top: `${topOffset}px`,
                    left: 0,
                    width: `${NODE_WIDTH}px`,
                    height: `${NODE_HEIGHT}px`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "2px",
                    padding: "10px 12px",
                    borderRadius: "var(--radius-lg)",
                    border: `1px solid ${
                      isLast ? "var(--color-accent)" : "var(--color-gray-700)"
                    }`,
                    backgroundColor: isLast
                      ? "rgba(46, 74, 249, 0.08)"
                      : "var(--color-deep-navy)",
                    boxShadow: isLast ? "var(--shadow-glow)" : "none",
                  }}
                >
                  {/* Step number */}
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "10px",
                      fontWeight: 500,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase" as const,
                      color: isLast
                        ? "var(--color-accent)"
                        : "var(--color-gray-500)",
                      lineHeight: 1.3,
                    }}
                  >
                    STEP {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Step label */}
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase" as const,
                      color: isLast
                        ? "var(--color-accent)"
                        : "var(--color-light)",
                      textAlign: "center" as const,
                      lineHeight: 1.3,
                    }}
                  >
                    {step.label}
                  </span>

                  {/* Step description */}
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "10px",
                      color: "var(--color-muted)",
                      textAlign: "center" as const,
                      lineHeight: 1.3,
                    }}
                  >
                    {step.description}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Mobile Flow (hidden on desktop) ─────────────────────── */}
        <div
          data-ps-mobile-flow
          style={{
            display: "none",
            marginTop: "var(--space-8)",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 0,
              minWidth: "min-content",
              padding: "var(--space-4) 0",
            }}
          >
            {steps.map((step, i) => {
              const isLast = i === steps.length - 1;
              return (
                <div
                  key={step.id}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  {/* Mobile step card */}
                  <div
                    data-ps-mobile-step
                    style={{
                      flexShrink: 0,
                      width: "130px",
                      padding: "12px 10px",
                      borderRadius: "var(--radius-lg)",
                      border: `1px solid ${
                        isLast ? "var(--color-accent)" : "var(--color-gray-700)"
                      }`,
                      backgroundColor: isLast
                        ? "rgba(46, 74, 249, 0.08)"
                        : "var(--color-deep-navy)",
                      boxShadow: isLast ? "var(--shadow-glow)" : "none",
                      textAlign: "center" as const,
                    }}
                  >
                    {/* Step number */}
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "9px",
                        fontWeight: 500,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase" as const,
                        color: isLast
                          ? "var(--color-accent)"
                          : "var(--color-gray-500)",
                        marginBottom: "4px",
                      }}
                    >
                      STEP {String(i + 1).padStart(2, "0")}
                    </div>
                    {/* Label */}
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "10px",
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase" as const,
                        color: isLast
                          ? "var(--color-accent)"
                          : "var(--color-light)",
                        lineHeight: 1.3,
                      }}
                    >
                      {step.label}
                    </div>
                    {/* Description */}
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "9px",
                        color: "var(--color-muted)",
                        marginTop: "4px",
                        lineHeight: 1.3,
                      }}
                    >
                      {step.description}
                    </div>
                  </div>

                  {/* Connector arrow between cards */}
                  {i < steps.length - 1 && (
                    <div
                      data-ps-mobile-connector
                      style={{
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "28px",
                      }}
                    >
                      <svg
                        width="16"
                        height="8"
                        viewBox="0 0 16 8"
                        fill="none"
                        style={{ display: "block" }}
                      >
                        <path
                          d="M0 4H12M12 4L9 1M12 4L9 7"
                          stroke="var(--color-gray-500)"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Responsive Styles ────────────────────────────────────── */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 1023px) {
              [data-ps-desktop-flow] {
                display: none !important;
              }
              [data-ps-mobile-flow] {
                display: block !important;
              }
            }

            @media (min-width: 1024px) {
              [data-ps-mobile-flow] {
                display: none !important;
              }
            }

            @media (max-width: 767px) {
              [data-ps-grid] {
                grid-template-columns: 1fr !important;
                gap: var(--space-10) !important;
              }
            }
          `,
        }}
      />
    </section>
  );
}
