"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

/* ── Scattered Element Data ───────────────────────────────────────── */

interface ScatteredElement {
  label: string;
  x: number;
  y: number;
  rotation: number;
  float: "a" | "b" | "c";
  duration: number;
  delay: number;
}

const SCATTERED_ELEMENTS: ScatteredElement[] = [
  { label: "Orders", x: 6, y: 8, rotation: -3, float: "a", duration: 5.2, delay: 0 },
  { label: "Excel", x: 50, y: 4, rotation: 4, float: "b", duration: 6.1, delay: -1.5 },
  { label: "WhatsApp", x: 26, y: 26, rotation: -2, float: "c", duration: 5.8, delay: -3.2 },
  { label: "Invoices", x: 66, y: 20, rotation: 5, float: "a", duration: 6.5, delay: -0.8 },
  { label: "Customers", x: 10, y: 50, rotation: -4, float: "b", duration: 5.4, delay: -2.1 },
  { label: "Staff", x: 46, y: 46, rotation: 2, float: "c", duration: 6.8, delay: -4.0 },
  { label: "Reports", x: 76, y: 50, rotation: -1, float: "a", duration: 5.6, delay: -1.2 },
  { label: "Approvals", x: 20, y: 72, rotation: 3, float: "b", duration: 6.3, delay: -2.8 },
  { label: "Inventory", x: 56, y: 70, rotation: -5, float: "c", duration: 5.9, delay: -0.5 },
  { label: "Payments", x: 36, y: 88, rotation: 1, float: "a", duration: 6.6, delay: -3.5 },
  { label: "Documents", x: 72, y: 86, rotation: -3, float: "b", duration: 5.3, delay: -1.8 },
];

const CONNECTIONS: [number, number][] = [
  [0, 2],
  [1, 3],
  [2, 4],
  [3, 5],
  [4, 6],
  [5, 7],
  [6, 8],
  [7, 9],
  [8, 10],
  [0, 5],
  [1, 8],
  [3, 9],
];

const HEADLINE_WORDS = [
  "WE",
  "TURN",
  "INEFFICIENT",
  "BUSINESS",
  "PROCESSES",
  "INTO",
  "SOFTWARE.",
];

/* ── Component ────────────────────────────────────────────────────── */

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Brand descriptor
      tl.from(section.querySelector("[data-hero-descriptor]"), {
        opacity: 0,
        y: 16,
        duration: 0.6,
      });

      // Headline — staggered word reveal
      const headlineWords = section.querySelectorAll(
        "[data-hero-headline-word]"
      );
      tl.from(
        headlineWords,
        {
          opacity: 0,
          y: 24,
          duration: 0.5,
          stagger: 0.06,
        },
        "-=0.3"
      );

      // Accent bar
      tl.from(
        section.querySelector("[data-hero-accent]"),
        { scaleX: 0, duration: 0.5, ease: "power2.inOut" },
        "-=0.4"
      );

      // Supporting copy
      tl.from(
        section.querySelector("[data-hero-copy]"),
        {
          opacity: 0,
          y: 16,
          duration: 0.6,
        },
        "-=0.2"
      );

      // CTAs
      const ctas = section.querySelectorAll("[data-hero-cta]");
      tl.from(
        ctas,
        {
          opacity: 0,
          y: 12,
          duration: 0.5,
          stagger: 0.1,
        },
        "-=0.3"
      );

      // Scattered elements — random stagger
      const elements = section.querySelectorAll("[data-hero-element]");
      tl.from(
        elements,
        {
          opacity: 0,
          scale: 0.85,
          duration: 0.5,
          stagger: { amount: 0.8, from: "random" },
        },
        "-=0.8"
      );

      // SVG connecting lines
      const lines = section.querySelectorAll("[data-hero-line]");
      tl.from(
        lines,
        {
          opacity: 0,
          duration: 0.8,
          stagger: 0.04,
        },
        "-=0.6"
      );
    },
    { scope: sectionRef }
  );

  return (
    <>
      {/* Floating animation keyframes (CSS-only for GPU compositing) */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes hero-float-a {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-12px); }
            }
            @keyframes hero-float-b {
              0%, 100% { transform: translateY(0); }
              33% { transform: translateY(-8px); }
              66% { transform: translateY(4px); }
            }
            @keyframes hero-float-c {
              0%, 100% { transform: translateY(2px); }
              40% { transform: translateY(-10px); }
              80% { transform: translateY(-2px); }
            }
          `,
        }}
      />

      <section
        ref={sectionRef}
        className="relative flex min-h-screen items-center overflow-hidden"
        style={{ backgroundColor: "var(--color-primary)" }}
        aria-label="Hero"
      >
        {/* Radial glow behind visualization */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 72% 50%, rgba(46,74,249,0.06) 0%, transparent 100%)",
          }}
        />

        {/* Faint dot grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--color-light) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="container relative z-10 mx-auto grid max-w-[var(--container-max)] items-center gap-12 px-6 py-28 lg:grid-cols-[1.15fr_1fr] lg:gap-8 lg:px-8 xl:gap-16 xl:px-12">
          {/* ── Left Column: Copy ─────────────────────────────── */}
          <div className="flex flex-col gap-6 lg:gap-8">
            {/* Brand descriptor */}
            <div data-hero-descriptor>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--color-muted)",
                }}
              >
                Business automation&nbsp;&middot;&nbsp;Custom
                software&nbsp;&middot;&nbsp;Intelligent systems
              </p>

              {/* Accent bar */}
              <div
                data-hero-accent
                style={{
                  width: "48px",
                  height: "2px",
                  backgroundColor: "var(--color-accent)",
                  marginTop: "var(--space-4)",
                  transformOrigin: "left center",
                }}
              />
            </div>

            {/* Headline */}
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(2.25rem, 5vw, 4.5rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: "var(--color-light)",
              }}
            >
              {HEADLINE_WORDS.map((word, i) => (
                <span
                  key={i}
                  data-hero-headline-word
                  style={{ display: "inline-block", marginRight: "0.3em" }}
                >
                  {word}
                </span>
              ))}
            </h1>

            {/* Supporting copy */}
            <p
              data-hero-copy
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(1rem, 1.3vw, 1.125rem)",
                lineHeight: 1.7,
                color: "var(--color-muted)",
                maxWidth: "520px",
              }}
            >
              We identify repetitive, fragmented and expensive processes and
              turn them into connected software systems built around how your
              organization actually works.
            </p>

            {/* CTAs */}
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <a
                data-hero-cta
                href="#work"
                className="btn btn-ghost"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-sm)",
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  padding: "var(--space-3) var(--space-6)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-gray-600)",
                  backgroundColor: "transparent",
                  color: "var(--color-light)",
                  cursor: "pointer",
                  textDecoration: "none",
                  transition: "all 300ms cubic-bezier(0.25, 0.1, 0.25, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-light)";
                  e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-gray-600)";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                EXPLORE OUR WORK &rarr;
              </a>
              <a
                data-hero-cta
                href="#contact"
                className="btn btn-primary"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-sm)",
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  padding: "var(--space-3) var(--space-6)",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--color-accent)",
                  color: "#fff",
                  border: "1px solid var(--color-accent)",
                  cursor: "pointer",
                  textDecoration: "none",
                  transition: "all 300ms cubic-bezier(0.25, 0.1, 0.25, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--color-accent-hover)";
                  e.currentTarget.style.boxShadow = "var(--shadow-glow)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--color-accent)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                TELL US WHAT&apos;S NOT WORKING &rarr;
              </a>
            </div>
          </div>

          {/* ── Right Column: ByteBuild System Visualization ──── */}
          <div
            className="relative hidden lg:block"
            style={{ minHeight: "460px" }}
          >
            {/* SVG Connecting Lines */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              {CONNECTIONS.map(([from, to], i) => (
                <line
                  key={i}
                  data-hero-line
                  x1={`${SCATTERED_ELEMENTS[from].x + 4}%`}
                  y1={`${SCATTERED_ELEMENTS[from].y + 2}%`}
                  x2={`${SCATTERED_ELEMENTS[to].x + 4}%`}
                  y2={`${SCATTERED_ELEMENTS[to].y + 2}%`}
                  stroke="var(--color-gray-700)"
                  strokeWidth="1"
                  strokeDasharray="4 6"
                  opacity="0.45"
                />
              ))}
            </svg>

            {/* Scattered Element Chips */}
            {SCATTERED_ELEMENTS.map((el) => (
              <div
                key={el.label}
                data-hero-element
                className="absolute"
                style={{
                  left: `${el.x}%`,
                  top: `${el.y}%`,
                  transform: `rotate(${el.rotation}deg)`,
                }}
              >
                {/* Float wrapper — animation is translate-only, outer handles rotation */}
                <div
                  style={{
                    animation: `hero-float-${el.float} ${el.duration}s ease-in-out infinite`,
                    animationDelay: `${el.delay}s`,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      fontWeight: 500,
                      letterSpacing: "0.03em",
                      color: "var(--color-neutral)",
                      backgroundColor: "rgba(11, 20, 36, 0.85)",
                      border: "1px solid var(--color-gray-700)",
                      borderRadius: "var(--radius-lg)",
                      padding: "6px 12px",
                      whiteSpace: "nowrap",
                      backdropFilter: "blur(8px)",
                      boxShadow: "var(--shadow-sm)",
                    }}
                  >
                    {el.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
