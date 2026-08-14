"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/* ── Data ───────────────────────────────────────────────────── */
interface DataNode {
  label: string;
  sub?: string;
  initX: number; // % from left — chaotic initial
  initY: number; // % from top — chaotic initial
  finalX: number; // % — organized final
  finalY: number;
  size: "lg" | "sm";
  float: "a" | "b" | "c";
  delay: number;
}

const NODES: DataNode[] = [
  { label: "Orders",    sub: "pending",   initX: 5,  initY: 10, finalX: 3,  finalY: 12, size: "lg", float: "a", delay: 0 },
  { label: "Customers", sub: "1,240",     initX: 72, initY: 5,  finalX: 3,  finalY: 32, size: "lg", float: "b", delay: 0.1 },
  { label: "Inventory", sub: "low stock", initX: 42, initY: 2,  finalX: 3,  finalY: 52, size: "sm", float: "c", delay: 0.2 },
  { label: "Invoices",  sub: "overdue",   initX: 15, initY: 55, finalX: 3,  finalY: 68, size: "sm", float: "a", delay: 0.3 },
  { label: "Staff",     sub: "8 active",  initX: 62, initY: 60, finalX: 3,  finalY: 82, size: "sm", float: "b", delay: 0.15 },
  { label: "Reports",   sub: "weekly",    initX: 80, initY: 35, finalX: 55, finalY: 12, size: "sm", float: "c", delay: 0.25 },
  { label: "Payments",  sub: "reconcile", initX: 30, initY: 80, finalX: 55, finalY: 32, size: "lg", float: "a", delay: 0.05 },
  { label: "Documents", sub: "unsigned",  initX: 55, initY: 85, finalX: 55, finalY: 52, size: "sm", float: "b", delay: 0.35 },
  { label: "Messages",  sub: "unread",    initX: 20, initY: 30, finalX: 55, finalY: 68, size: "sm", float: "c", delay: 0.2 },
  { label: "Approvals", sub: "3 pending", initX: 85, initY: 72, finalX: 55, finalY: 82, size: "sm", float: "a", delay: 0.1 },
];

const FLOAT_KEYFRAMES = `
  @keyframes float-a {
    0%,100%{transform:translateY(0)}
    50%{transform:translateY(-10px)}
  }
  @keyframes float-b {
    0%,100%{transform:translateY(0)}
    35%{transform:translateY(-7px)}
    70%{transform:translateY(5px)}
  }
  @keyframes float-c {
    0%,100%{transform:translateY(2px)}
    40%{transform:translateY(-9px)}
    80%{transform:translateY(-3px)}
  }
`;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const vizRef     = useRef<HTMLDivElement>(null);

  /* ── Entrance + Scroll animation ──────────────────────── */
  useGSAP(() => {
    const section = sectionRef.current;
    const viz = vizRef.current;
    if (!section || !viz) return;

    /* Entrance */
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from("[data-h-tag]",       { opacity: 0, y: 14, duration: 0.6 })
      .from("[data-h-word]",      { opacity: 0, y: 32, duration: 0.55, stagger: 0.08 }, "-=0.35")
      .from("[data-h-accent]",    { scaleX: 0, duration: 0.5, ease: "power2.inOut" }, "-=0.45")
      .from("[data-h-copy]",      { opacity: 0, y: 16, duration: 0.55 }, "-=0.25")
      .from("[data-h-cta]",       { opacity: 0, y: 12, duration: 0.45, stagger: 0.1 }, "-=0.3")
      .from("[data-h-node]",      { opacity: 0, scale: 0.7, duration: 0.6, stagger: { amount: 1, from: "random" } }, "-=0.7")
      .from("[data-h-line]",      { opacity: 0, duration: 0.8, stagger: 0.04 }, "-=0.6")
      .from("[data-h-center]",    { opacity: 0, scale: 0.85, duration: 0.7 }, "-=0.8");

    /* Scroll: CHAOS → ORDER */
    const nodes = viz.querySelectorAll<HTMLElement>("[data-h-node]");
    const centerEl = viz.querySelector<HTMLElement>("[data-h-center]");
    const lines = viz.querySelectorAll<SVGLineElement>("[data-h-line]");

    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom top",
      scrub: 1.2,
      onUpdate: (self) => {
        const p = self.progress;
        nodes.forEach((node, i) => {
          const d = NODES[i];
          // Lerp from chaotic position toward organized
          const x = d.initX + (d.finalX - d.initX) * p;
          const y = d.initY + (d.finalY - d.initY) * p;
          node.style.left = `${x}%`;
          node.style.top  = `${y}%`;
          // Reduce rotation as organized
          const rot = (d.label.length % 3 - 1) * 8 * (1 - p);
          node.style.transform = `rotate(${rot}deg)`;
        });
        // Lines consolidate
        lines.forEach(line => {
          line.style.opacity = `${0.15 + p * 0.7}`;
        });
        // Center hub appears
        if (centerEl) {
          centerEl.style.opacity = `${p}`;
          const s = 0.6 + p * 0.4;
          centerEl.style.transform = `translate(-50%, -50%) scale(${s})`;
        }
      },
    });
  }, { scope: sectionRef });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: FLOAT_KEYFRAMES }} />

      <section
        ref={sectionRef}
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          backgroundColor: "var(--color-dark)",
          overflow: "hidden",
        }}
        aria-label="Hero"
      >
        {/* Subtle dot grid */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }} />

        {/* Single controlled accent glow */}
        <div style={{
          position: "absolute", pointerEvents: "none",
          right: "5%", top: "20%",
          width: "40vw", height: "40vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(46,74,249,0.055) 0%, transparent 70%)",
        }} />

        <div
          className="container"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "var(--space-16)",
            paddingTop: "var(--space-32)",
            paddingBottom: "var(--space-24)",
            alignItems: "center",
          }}
        >
          {/* ── Desktop 2-col ─────────────────────────────── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "var(--space-16)",
            alignItems: "center",
          }}
            className="lg:!grid-cols-[1.1fr_1fr]"
          >
            {/* LEFT — Copy */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>

              {/* Tag */}
              <div data-h-tag>
                <span className="section-label">
                  Business automation · Custom software · Intelligent systems
                </span>
              </div>

              {/* Headline */}
              <h1 style={{ fontFamily: "var(--font-display)" }}>
                {[
                  { word: "WE", dim: false },
                  { word: "TURN", dim: false },
                  { word: "INEFFICIENT", dim: false },
                  { word: "BUSINESS", dim: true },
                  { word: "PROCESSES", dim: true },
                  { word: "INTO", dim: false },
                  { word: "SOFTWARE.", dim: false, accent: true },
                ].map(({ word, dim, accent }, i) => (
                  <span
                    key={i}
                    data-h-word
                    style={{
                      display: "inline-block",
                      fontWeight: 700,
                      lineHeight: 1.0,
                      letterSpacing: "-0.035em",
                      fontSize: "clamp(2.75rem, 6.5vw, 5.5rem)",
                      color: accent
                        ? "var(--color-accent)"
                        : dim
                        ? "var(--color-gray-500)"
                        : "var(--color-light)",
                      marginRight: "0.28em",
                    }}
                  >
                    {word}
                  </span>
                ))}
              </h1>

              {/* Accent bar */}
              <div
                data-h-accent
                style={{
                  width: 40,
                  height: 2,
                  backgroundColor: "var(--color-accent)",
                  transformOrigin: "left center",
                  marginTop: "calc(-1 * var(--space-4))",
                }}
              />

              {/* Copy */}
              <p
                data-h-copy
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(1rem, 1.4vw, 1.1rem)",
                  lineHeight: 1.75,
                  color: "var(--color-muted)",
                  maxWidth: "480px",
                }}
              >
                We identify repetitive, fragmented processes and turn them into
                connected software systems — built around how your organization
                actually works.
              </p>

              {/* CTAs */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)", alignItems: "center" }}>
                <a
                  data-h-cta
                  href="#contact"
                  className="group"
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
                    padding: "0.75rem 1.4rem",
                    borderRadius: "var(--radius-md)",
                    textDecoration: "none",
                    transition: "background-color 220ms ease, box-shadow 220ms ease",
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
                  Start a project
                  <span style={{ display: "inline-block", transition: "transform 220ms var(--ease-spring)" }}
                    className="group-hover:[transform:translate(2px,-2px)]"
                  >↗</span>
                </a>

                <a
                  data-h-cta
                  href="#work"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-xs)",
                    fontWeight: 500,
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    color: "var(--color-muted)",
                    padding: "0.75rem 1.4rem",
                    borderRadius: "var(--radius-md)",
                    textDecoration: "none",
                    border: "1px solid var(--color-border-md)",
                    transition: "color 220ms ease, border-color 220ms ease",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = "var(--color-light)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = "var(--color-muted)";
                    e.currentTarget.style.borderColor = "var(--color-border-md)";
                  }}
                >
                  Explore our work →
                </a>
              </div>
            </div>

            {/* RIGHT — Visualization */}
            <div
              ref={vizRef}
              className="hidden lg:block"
              style={{
                position: "relative",
                height: "520px",
                minWidth: 0,
              }}
              aria-hidden="true"
            >
              {/* SVG connecting lines */}
              <svg
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
              >
                {/* Central hub connectors */}
                {NODES.map((node, i) => (
                  <line
                    key={i}
                    data-h-line
                    x1={`${node.initX + 4}%`}
                    y1={`${node.initY + 1}%`}
                    x2="30%"
                    y2="47%"
                    stroke="var(--color-gray-700)"
                    strokeWidth="1"
                    strokeDasharray="3 5"
                    opacity="0.25"
                  />
                ))}
              </svg>

              {/* Central SYSTEM hub */}
              <div
                data-h-center
                style={{
                  position: "absolute",
                  left: "30%",
                  top: "47%",
                  transform: "translate(-50%, -50%) scale(0.6)",
                  opacity: 0,
                  zIndex: 2,
                  textAlign: "center",
                }}
              >
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  border: "1px solid rgba(46,74,249,0.4)",
                  backgroundColor: "rgba(46,74,249,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto var(--space-2)",
                  boxShadow: "0 0 32px rgba(46,74,249,0.15)",
                }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    border: "1px solid rgba(46,74,249,0.6)",
                    backgroundColor: "rgba(46,74,249,0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <span style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "9px",
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      color: "var(--color-accent)",
                    }}>SYS</span>
                  </div>
                </div>
                <p style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "9px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--color-muted)",
                }}>ByteBuildIT System</p>
              </div>

              {/* Scattered data nodes */}
              {NODES.map((node, i) => (
                <div
                  key={node.label}
                  data-h-node
                  style={{
                    position: "absolute",
                    left: `${node.initX}%`,
                    top:  `${node.initY}%`,
                    transform: `rotate(${(node.label.length % 3 - 1) * 8}deg)`,
                    zIndex: 1,
                    willChange: "transform, left, top",
                  }}
                >
                  <div style={{
                    animation: `float-${node.float} ${4.5 + i * 0.4}s ease-in-out infinite`,
                    animationDelay: `${-i * 0.9}s`,
                  }}>
                    <div style={{
                      backgroundColor: "rgba(11, 18, 32, 0.92)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "var(--radius-lg)",
                      padding: node.size === "lg" ? "8px 14px" : "6px 10px",
                      backdropFilter: "blur(10px)",
                      whiteSpace: "nowrap",
                    }}>
                      <div style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: node.size === "lg" ? "11px" : "10px",
                        fontWeight: 500,
                        letterSpacing: "0.03em",
                        color: "var(--color-neutral)",
                      }}>
                        {node.label}
                      </div>
                      {node.sub && (
                        <div style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "9px",
                          color: "var(--color-muted)",
                          marginTop: "2px",
                          letterSpacing: "0.03em",
                        }}>
                          {node.sub}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Scroll cue */}
              <div style={{
                position: "absolute",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "var(--space-2)",
              }}>
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "9px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--color-muted)",
                  opacity: 0.5,
                }}>Scroll</div>
                <div style={{
                  width: 1,
                  height: 40,
                  background: "linear-gradient(to bottom, rgba(255,255,255,0.15), transparent)",
                }} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom rule */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: "1px",
          background: "linear-gradient(to right, transparent, var(--color-border) 30%, var(--color-border) 70%, transparent)",
        }} />
      </section>
    </>
  );
}
