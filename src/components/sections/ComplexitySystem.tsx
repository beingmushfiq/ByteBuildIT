"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const WORD_PAIRS: [string, string][] = [
  ["MANUAL", "CONNECTED"],
  ["FRAGMENTED", "AUTOMATED"],
  ["REPETITIVE", "VISIBLE"],
  ["SLOW", "SCALABLE"],
];

export default function ComplexitySystem() {
  const sectionRef = useRef<HTMLElement>(null);
  const wordsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      // --- Section number slide-in ---
      const sectionNumber = section.querySelector("[data-section-number]");
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

      // --- Headlines reveal ---
      const revealElements = section.querySelectorAll("[data-animate]");
      gsap.set(revealElements, { opacity: 0, y: 30 });

      gsap.to(revealElements, {
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

      // --- Divider line grow ---
      const dividerLine = section.querySelector("[data-divider]");
      if (dividerLine) {
        gsap.fromTo(
          dividerLine,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: dividerLine,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // --- Word transformation pairs ---
      const container = wordsRef.current;
      if (!container) return;

      const pairs = container.querySelectorAll("[data-word-pair]");
      if (pairs.length === 0) return;

      // Set initial states for all word pairs
      pairs.forEach((pair) => {
        const beforeWord = pair.querySelector("[data-before]");
        const afterWord = pair.querySelector("[data-after]");
        const arrow = pair.querySelector("[data-arrow]");
        const connector = pair.querySelector("[data-connector]");
        const card = pair.querySelector("[data-card]");

        if (beforeWord) gsap.set(beforeWord, { opacity: 1, y: 0 });
        if (afterWord) gsap.set(afterWord, { opacity: 0, y: 20 });
        if (arrow) gsap.set(arrow, { opacity: 0, scale: 0.5 });
        if (connector) gsap.set(connector, { scaleX: 0 });
        if (card)
          gsap.set(card, {
            opacity: 0,
            y: 24,
            scale: 0.97,
          });
      });

      // Staggered card entrance + word transformation
      const wordTl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 72%",
          end: "bottom 30%",
          toggleActions: "play none none reverse",
        },
      });

      pairs.forEach((pair, index) => {
        const beforeWord = pair.querySelector("[data-before]");
        const afterWord = pair.querySelector("[data-after]");
        const arrow = pair.querySelector("[data-arrow]");
        const connector = pair.querySelector("[data-connector]");
        const card = pair.querySelector("[data-card]");

        const staggerDelay = index * 0.12;

        // Card entrance
        if (card) {
          wordTl.to(
            card,
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.5,
              ease: "power3.out",
            },
            staggerDelay
          );
        }

        // Connector line draws
        if (connector) {
          wordTl.to(
            connector,
            {
              scaleX: 1,
              duration: 0.3,
              ease: "power2.out",
            },
            staggerDelay + 0.25
          );
        }

        // Arrow appears
        if (arrow) {
          wordTl.to(
            arrow,
            {
              opacity: 1,
              scale: 1,
              duration: 0.3,
              ease: "back.out(1.7)",
            },
            staggerDelay + 0.35
          );
        }

        // Before word fades out and shifts up
        if (beforeWord) {
          wordTl.to(
            beforeWord,
            {
              opacity: 0,
              y: -12,
              duration: 0.3,
              ease: "power2.in",
            },
            staggerDelay + 0.45
          );
        }

        // After word fades in and shifts up into place
        if (afterWord) {
          wordTl.to(
            afterWord,
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              ease: "power3.out",
            },
            staggerDelay + 0.55
          );
        }
      });

      // --- Supporting copy fade-in ---
      const supportingCopy = section.querySelector("[data-supporting]");
      if (supportingCopy) {
        gsap.fromTo(
          supportingCopy,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: supportingCopy,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="section"
      style={{ backgroundColor: "var(--color-primary)" }}
      aria-label="Complexity to System"
    >
      <div className="container" style={{ maxWidth: "var(--container-max)" }}>
        {/* Section number */}
        <div
          data-section-number
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
          02
        </div>

        {/* Headline — first statement */}
        <h2
          data-animate
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(2rem, 5vw, 4.5rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "var(--color-light)",
            marginBottom: "var(--space-4)",
          }}
        >
          MOST BUSINESSES DON&apos;T
          <br />
          NEED MORE SOFTWARE.
        </h2>

        {/* Headline — second statement */}
        <h2
          data-animate
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(2rem, 5vw, 4.5rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "var(--color-accent)",
            marginBottom: "var(--space-16)",
          }}
        >
          THEY NEED BETTER SYSTEMS.
        </h2>

        {/* Divider line */}
        <div
          data-divider
          style={{
            width: "100%",
            height: "1px",
            backgroundColor: "var(--color-gray-700)",
            transformOrigin: "left center",
            marginBottom: "var(--space-12)",
          }}
        />

        {/* Word transformation grid */}
        <div
          ref={wordsRef}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "var(--space-6)",
            marginBottom: "var(--space-16)",
          }}
        >
          {WORD_PAIRS.map(([before, after], index) => (
            <div
              key={index}
              data-word-pair
              data-card
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "var(--space-6) var(--space-6)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--color-gray-700)",
                backgroundColor: "var(--color-deep-navy)",
                overflow: "hidden",
              }}
            >
              {/* BEFORE label */}
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  color: "var(--color-gray-500)",
                  marginBottom: "var(--space-4)",
                }}
              >
                BEFORE
              </div>

              {/* Word slot — holds both before & after overlapping */}
              <div
                style={{
                  position: "relative",
                  height: "clamp(2.5rem, 4vw, 3.5rem)",
                  width: "100%",
                }}
              >
                {/* Before word */}
                <div
                  data-before
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    fontFamily: "var(--font-mono)",
                    fontSize: "clamp(1.125rem, 2.5vw, 1.75rem)",
                    fontWeight: 500,
                    letterSpacing: "0.06em",
                    color: "var(--color-muted)",
                    lineHeight: "clamp(2.5rem, 4vw, 3.5rem)",
                  }}
                >
                  {before}
                </div>

                {/* After word */}
                <div
                  data-after
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.125rem, 2.5vw, 1.75rem)",
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    color: "var(--color-accent)",
                    lineHeight: "clamp(2.5rem, 4vw, 3.5rem)",
                  }}
                >
                  {after}
                </div>
              </div>

              {/* Connector row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                  marginTop: "var(--space-4)",
                  width: "100%",
                }}
              >
                {/* Connector line */}
                <div
                  data-connector
                  style={{
                    flex: 1,
                    height: "1px",
                    backgroundColor: "var(--color-gray-600)",
                    transformOrigin: "left center",
                  }}
                />

                {/* Arrow */}
                <div
                  data-arrow
                  aria-hidden="true"
                  style={{
                    color: "var(--color-accent)",
                    fontSize: "1.125rem",
                    lineHeight: 1,
                    flexShrink: 0,
                  }}
                >
                  →
                </div>

                {/* AFTER label */}
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-xs)",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase" as const,
                    color: "var(--color-gray-500)",
                  }}
                >
                  AFTER
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Supporting copy */}
        <p
          data-supporting
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
            lineHeight: 1.7,
            color: "var(--color-muted)",
            maxWidth: "640px",
          }}
        >
          Spreadsheets, disconnected applications, manual approvals,
          repetitive communication and fragmented data create invisible
          operational costs. We find those gaps and turn them into connected
          software.
        </p>
      </div>
    </section>
  );
}
