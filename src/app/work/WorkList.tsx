"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    num: "01",
    slug: "ordershield",
    title: "OrderShield",
    subtitle: "Order Management System",
    tags: ["Commerce", "Operations", "Automation"],
    metrics: [
      { label: "Processing time", value: "−74%" },
      { label: "Error rate",      value: "−91%" },
    ],
    year: "2024",
    accent: "#2E4AF9",
  },
  {
    num: "02",
    slug: "staffsync",
    title: "StaffSync",
    subtitle: "Field Operations Platform",
    tags: ["Workforce", "Scheduling", "Mobile"],
    metrics: [
      { label: "Coordinator time", value: "−60%" },
      { label: "No-shows",         value: "−83%" },
    ],
    year: "2024",
    accent: "#7C3AED",
  },
  {
    num: "03",
    slug: "invoiceflow",
    title: "InvoiceFlow",
    subtitle: "Accounts Receivable Automation",
    tags: ["Finance", "AI", "Workflow"],
    metrics: [
      { label: "Cycle time",    value: "−96%" },
      { label: "Manual review", value: "−78%" },
    ],
    year: "2023",
    accent: "#059669",
  },
  {
    num: "04",
    slug: "routeiq",
    title: "RouteIQ",
    subtitle: "Logistics Route Intelligence",
    tags: ["Logistics", "AI", "Maps"],
    metrics: [
      { label: "Fuel cost",       value: "−22%" },
      { label: "Missed windows",  value: "−68%" },
    ],
    year: "2023",
    accent: "#D97706",
  },
  {
    num: "05",
    slug: "databridge",
    title: "DataBridge",
    subtitle: "System Integration Platform",
    tags: ["Integration", "API", "Middleware"],
    metrics: [
      { label: "Manual transfer",  value: "−100%" },
      { label: "Data latency",     value: "−98%" },
    ],
    year: "2023",
    accent: "#0F766E",
  },
] as const;

export default function WorkList() {
  const listRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from("[data-wl-row]", {
      opacity: 0,
      y: 16,
      duration: 0.5,
      stagger: 0.08,
      ease: "power3.out",
      scrollTrigger: {
        trigger: listRef.current,
        start: "top 80%",
      },
    });
  }, { scope: listRef });

  return (
    <section ref={listRef}>
      <div className="container">
        {PROJECTS.map((project) => (
          <div
            key={project.slug}
            data-wl-row
            style={{ borderBottom: "1px solid var(--color-border)" }}
          >
            <Link
              href={`/work/${project.slug}`}
              data-cursor-type="project"
              className="work-row-link"
              style={{
                display: "grid",
                gridTemplateColumns: "28px 1fr auto",
                gap: "var(--space-8)",
                alignItems: "center",
                padding: "var(--space-8) 0",
                textDecoration: "none",
              }}
            >
              {/* Number */}
              <span
                className="work-row-num"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  color: "var(--color-muted)",
                  transition: `color 200ms ease`,
                }}
              >
                {project.num}
              </span>

              {/* Content */}
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", flexWrap: "wrap" }}>
                  <h2 style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.25rem, 2.5vw, 2rem)",
                    fontWeight: 700,
                    letterSpacing: "-0.025em",
                    color: "var(--color-light)",
                    lineHeight: 1,
                  }}>
                    {project.title}
                  </h2>
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    color: "var(--color-muted)",
                  }}>
                    {project.subtitle}
                  </span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                  {project.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>

              {/* Metrics + Year */}
              <div
                className="hidden md:flex"
                style={{
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "var(--space-3)",
                  textAlign: "right",
                }}
              >
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "9px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--color-muted)",
                }}>
                  {project.year}
                </span>
                <div style={{ display: "flex", gap: "var(--space-5)" }}>
                  {project.metrics.map(m => (
                    <div key={m.label} style={{ textAlign: "right" }}>
                      <div style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.25rem",
                        fontWeight: 700,
                        letterSpacing: "-0.03em",
                        color: project.accent,
                        lineHeight: 1,
                      }}>
                        {m.value}
                      </div>
                      <div style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "9px",
                        letterSpacing: "0.06em",
                        color: "var(--color-muted)",
                      }}>
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* CSS hover styles injected cleanly */}
      <style>{`
        .work-row-link:hover .work-row-num {
          color: var(--color-accent);
        }
        .work-row-link:hover {
          opacity: 0.88;
        }
      `}</style>
    </section>
  );
}
