"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/* ── CMS-editable data ─────────────────────────────────────────── */

interface AboutContent {
  sectionNumber: string;
  headline: string;
  description: string;
  pillars: string[];
}

const CONTENT: AboutContent = {
  sectionNumber: "04",
  headline: "WE LIKE DIFFICULT PROBLEMS.",
  description:
    "ByteBuildIT works at the intersection of business operations, product design and software engineering.",
  pillars: ["CURIOUS.", "PRECISE.", "ACCOUNTABLE."],
};

/* ── Component ──────────────────────────────────────────────────── */

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

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

      // --- Headline reveal ---
      const headline = section.querySelector("[data-about-headline]");
      if (headline) {
        gsap.fromTo(
          headline,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // --- Accent bar grow ---
      const accentBar = section.querySelector("[data-about-accent]");
      if (accentBar) {
        gsap.fromTo(
          accentBar,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.6,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: accentBar,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // --- Description fade-in ---
      const description = section.querySelector("[data-about-description]");
      if (description) {
        gsap.fromTo(
          description,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: description,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // --- Pillar words staggered reveal ---
      const pillars = section.querySelectorAll("[data-about-pillar]");
      if (pillars.length > 0) {
        gsap.fromTo(
          pillars,
          { opacity: 0, y: 24, x: -12 },
          {
            opacity: 1,
            y: 0,
            x: 0,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.15,
            scrollTrigger: {
              trigger: pillars[0],
              start: "top 85%",
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
      id="about"
      className="section"
      style={{ backgroundColor: "var(--color-primary)" }}
      aria-label="About"
    >
      <div className="container mx-auto" style={{ maxWidth: "var(--container-max)" }}>
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
          {CONTENT.sectionNumber}
        </div>

        <div className="grid items-start gap-12 lg:grid-cols-[1fr_auto] lg:gap-16">
          {/* Left: Copy */}
          <div className="flex flex-col gap-6 lg:gap-8">
            {/* Headline */}
            <h2
              data-about-headline
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(2rem, 5vw, 4.5rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: "var(--color-light)",
                marginBottom: "var(--space-2)",
              }}
            >
              {CONTENT.headline}
            </h2>

            {/* Accent bar */}
            <div
              data-about-accent
              style={{
                width: "48px",
                height: "2px",
                backgroundColor: "var(--color-accent)",
                transformOrigin: "left center",
              }}
            />

            {/* Description */}
            <p
              data-about-description
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
                lineHeight: 1.7,
                color: "var(--color-muted)",
                maxWidth: "560px",
              }}
            >
              {CONTENT.description}
            </p>
          </div>

          {/* Right: Stacked Pillar Words */}
          <div className="flex flex-col gap-4 pt-2 lg:pt-0">
            {CONTENT.pillars.map((pillar) => (
              <div
                key={pillar}
                data-about-pillar
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(2rem, 4vw, 3.5rem)",
                  fontWeight: 500,
                  letterSpacing: "0.12em",
                  lineHeight: 1.1,
                  color: "var(--color-light)",
                  opacity: 0,
                }}
              >
                {pillar}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
