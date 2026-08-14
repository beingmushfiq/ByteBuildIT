"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/* Simulated nodes for the chaos/order visualization */
const CHAOS_NODES = [
  { id: "a", label: "Email thread",       x: 8,  y: 15 },
  { id: "b", label: "Spreadsheet #4",     x: 65, y: 8  },
  { id: "c", label: "WhatsApp approval",  x: 30, y: 35 },
  { id: "d", label: "Manual entry",       x: 75, y: 40 },
  { id: "e", label: "Paper invoice",      x: 12, y: 60 },
  { id: "f", label: "Separate system",    x: 50, y: 70 },
  { id: "g", label: "Lost request",       x: 82, y: 70 },
  { id: "h", label: "Duplicate data",     x: 35, y: 85 },
];

const ORDER_NODES = [
  { id: "a", label: "Communication",  x: 5,  y: 20 },
  { id: "b", label: "Data layer",     x: 60, y: 10 },
  { id: "c", label: "Workflows",      x: 30, y: 30 },
  { id: "d", label: "Automation",     x: 70, y: 35 },
  { id: "e", label: "Finance",        x: 10, y: 60 },
  { id: "f", label: "Operations",     x: 50, y: 65 },
  { id: "g", label: "Reporting",      x: 78, y: 65 },
  { id: "h", label: "Single source",  x: 32, y: 82 },
];

export default function ComplexitySystem() {
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref   = useRef<HTMLDivElement>(null);
  const line2Ref   = useRef<HTMLDivElement>(null);
  const vizRef     = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Headline entrance
    ScrollTrigger.create({
      trigger: section,
      start: "top 75%",
      onEnter: () => {
        gsap.from("[data-cs-line1]", { opacity: 0, y: 40, duration: 0.8, ease: "power3.out" });
        gsap.from("[data-cs-line2]", { opacity: 0, y: 40, duration: 0.8, delay: 0.25, ease: "power3.out" });
        gsap.from("[data-cs-tag]",   { opacity: 0, y: 16, duration: 0.6, delay: 0.1,  ease: "power3.out" });
        gsap.from("[data-cs-copy]",  { opacity: 0, y: 20, duration: 0.7, delay: 0.45, ease: "power3.out" });
      },
    });

    // Viz scrub: chaos → order
    const nodes = section.querySelectorAll<HTMLElement>("[data-cs-node]");
    const connectors = section.querySelectorAll<SVGLineElement>("[data-cs-connector]");
    const centerHub = section.querySelector<HTMLElement>("[data-cs-hub]");

    ScrollTrigger.create({
      trigger: vizRef.current,
      start: "top 60%",
      end: "bottom 30%",
      scrub: 1.5,
      onUpdate: (self) => {
        const p = self.progress;
        nodes.forEach((node, i) => {
          const chaos = CHAOS_NODES[i];
          const order = ORDER_NODES[i];
          if (!chaos || !order) return;
          node.style.left = `${chaos.x + (order.x - chaos.x) * p}%`;
          node.style.top  = `${chaos.y + (order.y - chaos.y) * p}%`;
          // Become more "clean" visually
          const rot = (i % 2 === 0 ? 1 : -1) * 6 * (1 - p);
          node.style.transform = `rotate(${rot}deg)`;
          node.style.opacity = `${0.5 + p * 0.5}`;
        });
        connectors.forEach(c => {
          c.style.opacity = `${p * 0.6}`;
        });
        if (centerHub) {
          centerHub.style.opacity = `${p}`;
          centerHub.style.transform = `translate(-50%, -50%) scale(${0.7 + p * 0.3})`;
        }
      },
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="section"
      id="approach"
      style={{ backgroundColor: "var(--color-dark)", position: "relative", overflow: "hidden" }}
    >
      {/* Top rule */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(to right, transparent, var(--color-border) 30%, var(--color-border) 70%, transparent)",
      }} />

      <div className="container">
        {/* ── Copy block ──────────────────────────────── */}
        <div style={{ maxWidth: "720px", marginBottom: "var(--space-20)" }}>
          <span data-cs-tag className="section-label" style={{ marginBottom: "var(--space-6)", display: "flex" }}>
            The real problem
          </span>

          <h2
            data-cs-line1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.25rem, 5vw, 4rem)",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "var(--color-light)",
              marginBottom: "var(--space-4)",
            }}
          >
            Most businesses don&apos;t need
            more software.
          </h2>

          <h2
            data-cs-line2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.25rem, 5vw, 4rem)",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "var(--color-accent)",
              marginBottom: "var(--space-8)",
            }}
          >
            They need better systems.
          </h2>

          <p
            data-cs-copy
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(1rem, 1.3vw, 1.1rem)",
              lineHeight: 1.75,
              color: "var(--color-muted)",
              maxWidth: "560px",
            }}
          >
            Complexity isn&apos;t caused by too many tasks — it&apos;s caused by disconnected tools,
            manual handoffs, and processes that were never designed to scale.
            We redesign the system underneath.
          </p>
        </div>

        {/* ── Visualization ───────────────────────────── */}
        <div
          ref={vizRef}
          style={{
            position: "relative",
            height: "440px",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-xl)",
            backgroundColor: "rgba(11,18,32,0.5)",
            overflow: "hidden",
          }}
          aria-hidden="true"
        >
          {/* Grid pattern */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            pointerEvents: "none",
          }} />

          {/* Connector lines */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
            {CHAOS_NODES.map((n, i) => (
              <line
                key={i}
                data-cs-connector
                x1={`${n.x + 5}%`} y1={`${n.y + 2}%`}
                x2="50%" y2="47%"
                stroke="var(--color-accent)"
                strokeWidth="1"
                strokeDasharray="3 4"
                opacity="0"
              />
            ))}
          </svg>

          {/* Central hub */}
          <div
            data-cs-hub
            style={{
              position: "absolute", left: "50%", top: "47%",
              transform: "translate(-50%, -50%) scale(0.7)",
              opacity: 0,
              zIndex: 3,
              textAlign: "center",
            }}
          >
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              border: "1px solid rgba(46,74,249,0.5)",
              backgroundColor: "rgba(46,74,249,0.1)",
              margin: "0 auto 8px",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 24px rgba(46,74,249,0.2)",
            }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "8px", fontWeight: 600, letterSpacing: "0.1em", color: "var(--color-accent)" }}>
                SYSTEM
              </span>
            </div>
          </div>

          {/* Nodes */}
          {CHAOS_NODES.map((node, i) => (
            <div
              key={node.id}
              data-cs-node
              style={{
                position: "absolute",
                left: `${node.x}%`,
                top:  `${node.y}%`,
                opacity: 0.5,
                transition: "none",
                willChange: "transform, left, top, opacity",
                zIndex: 2,
              }}
            >
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "0.03em",
                color: "var(--color-muted)",
                backgroundColor: "rgba(7,11,18,0.88)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                padding: "5px 10px",
                whiteSpace: "nowrap",
                backdropFilter: "blur(8px)",
              }}>
                {node.label}
              </div>
            </div>
          ))}

          {/* Labels */}
          <div style={{
            position: "absolute", bottom: "var(--space-4)", left: "var(--space-5)",
            display: "flex", gap: "var(--space-6)", alignItems: "center",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "var(--color-gray-600)" }} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-gray-500)" }}>
                Chaos
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "var(--color-accent)" }} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-gray-500)" }}>
                System
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
