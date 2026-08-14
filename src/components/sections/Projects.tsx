"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/* ── Project Data ────────────────────────────────────────────────── */

interface Project {
  id: string;
  number: string;
  name: string;
  subtitle: string;
  category: string;
  tags: string[];
  narrative: {
    before: string;
    after: string;
  };
  gradient: {
    from: string;
    via: string;
    to: string;
  };
  accent: string;
}

const PROJECTS: Project[] = [
  {
    id: "ordershield",
    number: "01",
    name: "OrderShield",
    subtitle: "Order Management Platform",
    category: "Commerce / Operations / SaaS",
    tags: ["Order Processing", "Real-time Tracking", "Multi-channel", "Analytics"],
    narrative: {
      before:
        "From fragmented order operations across spreadsheets, WhatsApp threads, and disconnected tools — orders slipping through the cracks.",
      after:
        "To one connected system where every order flows through a single pipeline with real-time visibility and automated routing.",
    },
    gradient: {
      from: "#0B1424",
      via: "#1A2744",
      to: "#2E4AF9",
    },
    accent: "#2E4AF9",
  },
  {
    id: "clinic-queue",
    number: "02",
    name: "Clinic Queue Management",
    subtitle: "Healthcare Platform",
    category: "Healthcare / Workflow / Realtime",
    tags: ["Patient Flow", "Queue Optimization", "Real-time Updates", "Staff Management"],
    narrative: {
      before:
        "From manual patient flow management with paper queues, crowded waiting rooms, and zero visibility into clinic operations.",
      after:
        "To real-time healthcare operations where patients are tracked digitally, queues are optimized automatically, and staff have full visibility.",
    },
    gradient: {
      from: "#0B1424",
      via: "#142233",
      to: "#1B6B4A",
    },
    accent: "#22C55E",
  },
  {
    id: "sherazi-gps",
    number: "03",
    name: "Sherazi GPS Tracker",
    subtitle: "Fleet Management System",
    category: "Fleet / Logistics / Tracking",
    tags: ["GPS Tracking", "Route Optimization", "Driver Monitoring", "Fuel Analytics"],
    narrative: {
      before:
        "From scattered fleet data across GPS devices, driver reports, and manual logs — no single view of vehicle operations.",
      after:
        "To one operational view with real-time GPS tracking, automated route optimization, and comprehensive fleet analytics.",
    },
    gradient: {
      from: "#0B1424",
      via: "#1A1E33",
      to: "#D97706",
    },
    accent: "#F59E0B",
  },
  {
    id: "qttenzy",
    number: "04",
    name: "Qttenzy",
    subtitle: "Workforce Management",
    category: "HR / Attendance / Automation",
    tags: ["Attendance", "Shift Scheduling", "Payroll Integration", "Biometric"],
    narrative: {
      before:
        "From manual attendance tracking with sign-in sheets, biometric confusion, and payroll reconciliation nightmares.",
      after:
        "To automated workforce tracking with biometric attendance, smart scheduling, and seamless payroll integration.",
    },
    gradient: {
      from: "#0B1424",
      via: "#1E1433",
      to: "#8B5CF6",
    },
    accent: "#A78BFA",
  },
];

/* ── Component ────────────────────────────────────────────────────── */

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      /* ── Section Header Animation ─── */
      const sectionNumber = section.querySelector("[data-projects-number]");
      const sectionHeadline = section.querySelector("[data-projects-headline]");
      const sectionAccent = section.querySelector("[data-projects-accent]");
      const sectionSubline = section.querySelector("[data-projects-subline]");

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

      if (sectionHeadline) {
        gsap.fromTo(
          sectionHeadline,
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

      if (sectionAccent) {
        gsap.fromTo(
          sectionAccent,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.7,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: sectionAccent,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      if (sectionSubline) {
        gsap.fromTo(
          sectionSubline,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionSubline,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      /* ── Per-Project Scene Animations ─── */
      const scenes = section.querySelectorAll("[data-project-scene]");

      scenes.forEach((scene) => {
        const idx = scene.getAttribute("data-project-scene");

        // Visual placeholder: scale up + fade in with clip-path reveal
        const visual = scene.querySelector(`[data-project-visual="${idx}"]`);
        if (visual) {
          gsap.fromTo(
            visual,
            {
              opacity: 0,
              scale: 0.92,
              clipPath: "inset(8% 8% 8% 8% round 12px)",
            },
            {
              opacity: 1,
              scale: 1,
              clipPath: "inset(0% 0% 0% 0% round 12px)",
              duration: 1.0,
              ease: "power3.out",
              scrollTrigger: {
                trigger: visual,
                start: "top 82%",
                end: "top 30%",
                toggleActions: "play none none reverse",
              },
            }
          );

          // Inner parallax movement on the gradient overlay
          const innerGlow = scene.querySelector(
            `[data-project-glow="${idx}"]`
          );
          if (innerGlow) {
            gsap.fromTo(
              innerGlow,
              { yPercent: 15 },
              {
                yPercent: -15,
                ease: "none",
                scrollTrigger: {
                  trigger: visual,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1.2,
                },
              }
            );
          }
        }

        // Project number
        const number = scene.querySelector(`[data-project-number="${idx}"]`);
        if (number) {
          gsap.fromTo(
            number,
            { opacity: 0, x: -20 },
            {
              opacity: 1,
              x: 0,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: {
                trigger: scene,
                start: "top 75%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        // Project name — large display heading with mask/slide reveal
        const name = scene.querySelector(`[data-project-name="${idx}"]`);
        if (name) {
          gsap.fromTo(
            name,
            {
              opacity: 0,
              y: 40,
              clipPath: "inset(0 0 100% 0)",
            },
            {
              opacity: 1,
              y: 0,
              clipPath: "inset(0 0 0% 0)",
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: {
                trigger: scene,
                start: "top 70%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        // Subtitle
        const subtitle = scene.querySelector(
          `[data-project-subtitle="${idx}"]`
        );
        if (subtitle) {
          gsap.fromTo(
            subtitle,
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
              scrollTrigger: {
                trigger: scene,
                start: "top 68%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        // Category label
        const category = scene.querySelector(
          `[data-project-category="${idx}"]`
        );
        if (category) {
          gsap.fromTo(
            category,
            { opacity: 0, y: 12 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power3.out",
              scrollTrigger: {
                trigger: scene,
                start: "top 66%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        // Tags — staggered entrance
        const tags = scene.querySelectorAll(
          `[data-project-tag="${idx}"]`
        );
        if (tags.length > 0) {
          gsap.fromTo(
            tags,
            { opacity: 0, y: 10, scale: 0.9 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.4,
              stagger: 0.08,
              ease: "power3.out",
              scrollTrigger: {
                trigger: scene,
                start: "top 62%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        // Divider line
        const divider = scene.querySelector(
          `[data-project-divider="${idx}"]`
        );
        if (divider) {
          gsap.fromTo(
            divider,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 0.8,
              ease: "power3.inOut",
              scrollTrigger: {
                trigger: divider,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        // Before narrative
        const before = scene.querySelector(
          `[data-project-before="${idx}"]`
        );
        if (before) {
          gsap.fromTo(
            before,
            { opacity: 0, x: -20 },
            {
              opacity: 1,
              x: 0,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: {
                trigger: before,
                start: "top 88%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        // After narrative
        const after = scene.querySelector(
          `[data-project-after="${idx}"]`
        );
        if (after) {
          gsap.fromTo(
            after,
            { opacity: 0, x: -20 },
            {
              opacity: 1,
              x: 0,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: {
                trigger: after,
                start: "top 88%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });

      /* ── Section Footer CTA ─── */
      const footerCta = section.querySelector("[data-projects-footer]");
      if (footerCta) {
        gsap.fromTo(
          footerCta,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: footerCta,
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
      id="work"
      className="relative"
      style={{ backgroundColor: "var(--color-primary)" }}
      aria-label="Projects — Systems We've Built"
    >
      {/* ── Background dot grid ───────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--color-light) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* ── Section Header ─────────────────────────────────────── */}
      <div
        className="relative z-10 mx-auto"
        style={{
          maxWidth: "var(--container-max)",
          padding: "var(--space-24) var(--space-6) var(--space-12)",
        }}
      >
        <div
          className="mx-auto"
          style={{ maxWidth: "var(--container-max)" }}
        >
          {/* Section number */}
          <div
            data-projects-number
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-sm)",
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase" as const,
              color: "var(--color-accent)",
              marginBottom: "var(--space-6)",
            }}
          >
            04
          </div>

          {/* Headline */}
          <h2
            data-projects-headline
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
            SYSTEMS WE&apos;VE
            <br />
            <span style={{ color: "var(--color-accent)" }}>BUILT</span>
          </h2>

          {/* Accent bar */}
          <div
            data-projects-accent
            style={{
              width: "48px",
              height: "2px",
              backgroundColor: "var(--color-accent)",
              marginTop: "var(--space-4)",
              marginBottom: "var(--space-8)",
              transformOrigin: "left center",
            }}
          />

          {/* Subline */}
          <p
            data-projects-subline
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(1rem, 1.3vw, 1.125rem)",
              lineHeight: 1.7,
              color: "var(--color-muted)",
              maxWidth: "560px",
            }}
          >
            Each system begins with a broken process and ends with connected
            software that changes how a business operates.
          </p>
        </div>
      </div>

      {/* ── Project Scenes ─────────────────────────────────────── */}
      {PROJECTS.map((project) => (
        <article
          key={project.id}
          data-project-scene={project.number}
          className="relative mx-auto overflow-hidden"
          style={{
            maxWidth: "var(--container-max)",
            padding: "0 var(--space-6)",
            marginBottom: "var(--space-24)",
          }}
        >
          {/* Desktop: 2-column layout | Mobile: stacked */}
          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-12 xl:gap-16">
            {/* ── Left Column: Visual Placeholder ────────────── */}
            <div
              data-project-visual={project.number}
              className="relative overflow-hidden"
              style={{
                borderRadius: "var(--radius-xl)",
                aspectRatio: "16 / 10",
                minHeight: "280px",
              }}
            >
              {/* Base gradient */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${project.gradient.from} 0%, ${project.gradient.via} 50%, ${project.gradient.to} 100%)`,
                }}
              />

              {/* Animated glow overlay for parallax */}
              <div
                data-project-glow={project.number}
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(ellipse 70% 60% at 60% 50%, ${project.accent}22 0%, transparent 100%)`,
                }}
              />

              {/* Grid pattern overlay */}
              <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage:
                    "linear-gradient(var(--color-light) 1px, transparent 1px), linear-gradient(90deg, var(--color-light) 1px, transparent 1px)",
                  backgroundSize: "48px 48px",
                }}
              />

              {/* Corner accent lines */}
              <div
                className="absolute"
                style={{
                  top: "16px",
                  left: "16px",
                  width: "40px",
                  height: "40px",
                  borderTop: `2px solid ${project.accent}55`,
                  borderLeft: `2px solid ${project.accent}55`,
                }}
              />
              <div
                className="absolute"
                style={{
                  bottom: "16px",
                  right: "16px",
                  width: "40px",
                  height: "40px",
                  borderBottom: `2px solid ${project.accent}55`,
                  borderRight: `2px solid ${project.accent}55`,
                }}
              />

              {/* Project number watermark */}
              <div
                className="absolute select-none"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "clamp(6rem, 14vw, 12rem)",
                  lineHeight: 1,
                  color: `${project.accent}0A`,
                  letterSpacing: "-0.04em",
                }}
                aria-hidden="true"
              >
                {project.number}
              </div>

              {/* Project name centered */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
                style={{ zIndex: 1 }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-xs)",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase" as const,
                    color: project.accent,
                    marginBottom: "var(--space-3)",
                    opacity: 0.85,
                  }}
                >
                  {project.subtitle}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                    color: "var(--color-light)",
                  }}
                >
                  {project.name}
                </span>
              </div>
            </div>

            {/* ── Right Column: Project Details ──────────────── */}
            <div
              className="flex flex-col"
              style={{ padding: "var(--space-4) 0" }}
            >
              {/* Project number + name */}
              <div className="mb-2 flex items-baseline gap-3">
                <span
                  data-project-number={project.number}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-sm)",
                    fontWeight: 500,
                    letterSpacing: "0.06em",
                    color: project.accent,
                    flexShrink: 0,
                  }}
                >
                  {project.number}
                </span>

                <span
                  style={{
                    width: "24px",
                    height: "1px",
                    backgroundColor: "var(--color-gray-600)",
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                />
              </div>

              {/* Project name — large display */}
              <h3
                data-project-name={project.number}
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "clamp(1.75rem, 3.5vw, 3rem)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                  color: "var(--color-light)",
                  marginBottom: "var(--space-3)",
                }}
              >
                {project.name}
              </h3>

              {/* Subtitle */}
              <p
                data-project-subtitle={project.number}
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "var(--text-lg)",
                  lineHeight: 1.3,
                  color: "var(--color-neutral)",
                  marginBottom: "var(--space-2)",
                }}
              >
                {project.subtitle}
              </p>

              {/* Category */}
              <p
                data-project-category={project.number}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase" as const,
                  color: "var(--color-muted)",
                  marginBottom: "var(--space-5)",
                }}
              >
                {project.category}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2" style={{ marginBottom: "var(--space-6)" }}>
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    data-project-tag={project.number}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      fontWeight: 500,
                      letterSpacing: "0.03em",
                      color: project.accent,
                      backgroundColor: `${project.accent}10`,
                      border: `1px solid ${project.accent}25`,
                      borderRadius: "var(--radius-full)",
                      padding: "4px 12px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Divider */}
              <div
                data-project-divider={project.number}
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "var(--color-gray-700)",
                  transformOrigin: "left center",
                  marginBottom: "var(--space-6)",
                }}
              />

              {/* Before → After narrative */}
              <div className="flex flex-col gap-4">
                {/* Before */}
                <div
                  data-project-before={project.number}
                  style={{
                    display: "flex",
                    gap: "var(--space-3)",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "10px",
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase" as const,
                      color: "var(--color-gray-500)",
                      flexShrink: 0,
                      marginTop: "3px",
                      padding: "2px 8px",
                      border: "1px solid var(--color-gray-700)",
                      borderRadius: "var(--radius-sm)",
                    }}
                  >
                    BEFORE
                  </span>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-sm)",
                      lineHeight: 1.65,
                      color: "var(--color-muted)",
                    }}
                  >
                    {project.narrative.before}
                  </p>
                </div>

                {/* Arrow */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-3)",
                    paddingLeft: "var(--space-1)",
                  }}
                >
                  <div
                    style={{
                      width: "1px",
                      height: "16px",
                      backgroundColor: "var(--color-gray-700)",
                    }}
                  />
                  <span
                    aria-hidden="true"
                    style={{
                      color: project.accent,
                      fontSize: "var(--text-sm)",
                      lineHeight: 1,
                    }}
                  >
                    ↓
                  </span>
                </div>

                {/* After */}
                <div
                  data-project-after={project.number}
                  style={{
                    display: "flex",
                    gap: "var(--space-3)",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "10px",
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase" as const,
                      color: project.accent,
                      flexShrink: 0,
                      marginTop: "3px",
                      padding: "2px 8px",
                      backgroundColor: `${project.accent}12`,
                      border: `1px solid ${project.accent}30`,
                      borderRadius: "var(--radius-sm)",
                    }}
                  >
                    AFTER
                  </span>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-sm)",
                      lineHeight: 1.65,
                      color: "var(--color-neutral)",
                    }}
                  >
                    {project.narrative.after}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Scene divider — subtle gradient line */}
          <div
            className="mx-auto mt-12"
            style={{
              width: "60%",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent 0%, var(--color-gray-700) 50%, transparent 100%)",
            }}
            aria-hidden="true"
          />
        </article>
      ))}

      {/* ── Section Footer CTA ────────────────────────────────── */}
      <div
        data-projects-footer
        className="relative z-10 mx-auto text-center"
        style={{
          maxWidth: "var(--container-max)",
          padding: "var(--space-8) var(--space-6) var(--space-32)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
            lineHeight: 1.3,
            letterSpacing: "-0.02em",
            color: "var(--color-muted)",
            marginBottom: "var(--space-8)",
          }}
        >
          YOUR SYSTEM
          <span style={{ color: "var(--color-accent)" }}> COULD BE NEXT.</span>
        </p>

        <a
          href="#contact"
          className="btn btn-primary"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-sm)",
            fontWeight: 500,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            padding: "var(--space-3) var(--space-8)",
            borderRadius: "var(--radius-md)",
            backgroundColor: "var(--color-accent)",
            color: "#fff",
            border: "1px solid var(--color-accent)",
            cursor: "pointer",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-2)",
            transition: "all 300ms cubic-bezier(0.25, 0.1, 0.25, 1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--color-accent-hover)";
            e.currentTarget.style.boxShadow = "var(--shadow-glow)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--color-accent)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          LET&apos;S BUILD YOURS &rarr;
        </a>
      </div>
    </section>
  );
}
