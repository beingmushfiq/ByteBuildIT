"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface OperationalNode {
  id: string;
  chaosLabel: string;
  chaosSub: string;
  orderLabel: string;
  orderSub: string;
  chaosX: number;
  chaosY: number;
  orderX: number;
  orderY: number;
  chaosColor: string;
  orderColor: string;
}

const NODES: OperationalNode[] = [
  { id: "1", chaosLabel: "Spreadsheet #7",  chaosSub: "Version conflicts", orderLabel: "Single Data Model",  orderSub: "PostgreSQL ACID core", chaosX: 8,  chaosY: 15, orderX: 10, orderY: 20, chaosColor: "#EF4444", orderColor: "#10B981" },
  { id: "2", chaosLabel: "Email Threads",   chaosSub: "Lost approvals",     orderLabel: "Automated Triggers", orderSub: "Zero manual delay",   chaosX: 70, chaosY: 12, orderX: 65, orderY: 20, chaosColor: "#F59E0B", orderColor: "#2E4AF9" },
  { id: "3", chaosLabel: "Manual Data Copy",chaosSub: "12% human error",    orderLabel: "Real-time Pipeline", orderSub: "Sub-second sync",      chaosX: 15, chaosY: 52, orderX: 10, orderY: 65, chaosColor: "#EF4444", orderColor: "#7C3AED" },
  { id: "4", chaosLabel: "WhatsApp Chats",  chaosSub: "Untracked dispatch", orderLabel: "Live Agent Dispatch",orderSub: "GPS & task queue",    chaosX: 68, chaosY: 55, orderX: 65, orderY: 65, chaosColor: "#F59E0B", orderColor: "#0284C7" },
  { id: "5", chaosLabel: "Paper Invoices",  chaosSub: "5-day clearance",    orderLabel: "Automated Billing",  orderSub: "Instant reconciliation",chaosX: 42, chaosY: 82, orderX: 38, orderY: 82, chaosColor: "#EF4444", orderColor: "#10B981" },
];

export default function ComplexitySystem() {
  const sectionRef = useRef<HTMLElement>(null);
  const vizRef     = useRef<HTMLDivElement>(null);
  const [activeMode, setActiveMode] = useState<"chaos" | "order">("order");
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  /* Resilient Entrance Animation */
  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.from("[data-cs-tag]", {
      scrollTrigger: { trigger: section, start: "top 80%", once: true },
      opacity: 0, y: 16, duration: 0.6, ease: "power3.out"
    });
    gsap.from("[data-cs-line1]", {
      scrollTrigger: { trigger: section, start: "top 80%", once: true },
      opacity: 0, y: 28, duration: 0.7, delay: 0.1, ease: "power3.out"
    });
    gsap.from("[data-cs-line2]", {
      scrollTrigger: { trigger: section, start: "top 80%", once: true },
      opacity: 0, y: 28, duration: 0.7, delay: 0.2, ease: "power3.out"
    });
    gsap.from("[data-cs-copy]", {
      scrollTrigger: { trigger: section, start: "top 80%", once: true },
      opacity: 0, y: 20, duration: 0.7, delay: 0.3, ease: "power3.out"
    });
    gsap.from("[data-cs-viz]", {
      scrollTrigger: { trigger: section, start: "top 75%", once: true },
      opacity: 0, scale: 0.96, duration: 0.8, delay: 0.35, ease: "power3.out"
    });
  }, { scope: sectionRef });

  const isChaos = activeMode === "chaos";

  return (
    <section
      ref={sectionRef}
      id="approach"
      className="section"
      style={{
        backgroundColor: "var(--color-bg-surface)",
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      {/* Subtle Background Glow */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "700px",
          height: "400px",
          borderRadius: "50%",
          background: isChaos
            ? "radial-gradient(circle, rgba(239, 68, 68, 0.08) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(46, 74, 249, 0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          transition: "background 500ms ease",
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        {/* Header Block with 100% Guaranteed High Contrast */}
        <div style={{ maxWidth: "780px", marginBottom: "var(--space-12)" }}>
          <div data-cs-tag style={{ marginBottom: "var(--space-4)" }}>
            <span className="section-label">
              System Architecture &amp; Methodology
            </span>
          </div>

          <h2
            data-cs-line1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.25rem, 5vw, 4rem)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.035em",
              color: "var(--color-light)",
              marginBottom: "var(--space-2)",
            }}
          >
            Most businesses don&apos;t need more software.
          </h2>

          <h2
            data-cs-line2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.25rem, 5vw, 4rem)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.035em",
              color: "var(--color-accent)",
              marginBottom: "var(--space-6)",
              textShadow: "0 0 35px rgba(46, 74, 249, 0.35)",
            }}
          >
            They need better systems.
          </h2>

          <p
            data-cs-copy
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(1.05rem, 1.35vw, 1.2rem)",
              lineHeight: 1.75,
              color: "var(--color-muted)",
              maxWidth: "640px",
            }}
          >
            Complexity isn&apos;t created by workload — it is bred by disconnected tools, manual copy-pasting,
            and fragile ad-hoc fixes. We re-engineer the foundation into a unified, high-throughput operating engine.
          </p>
        </div>

        {/* Interactive Dual-Mode Visualizer Container */}
        <div
          data-cs-viz
          ref={vizRef}
          className="glass-card"
          style={{
            position: "relative",
            minHeight: "500px",
            padding: "var(--space-6)",
            borderRadius: "var(--radius-2xl)",
            backgroundColor: "var(--color-bg-card)",
            border: isChaos ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid var(--color-border)",
            boxShadow: isChaos ? "0 0 30px rgba(239, 68, 68, 0.15)" : "var(--shadow-xl)",
            transition: "border-color 400ms ease, box-shadow 400ms ease",
            overflow: "hidden",
          }}
        >
          {/* Visualizer Header Bar with Interactive Mode Switch */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "var(--space-4)",
              paddingBottom: "var(--space-4)",
              borderBottom: "1px solid var(--color-border)",
              position: "relative",
              zIndex: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: isChaos ? "#EF4444" : "#10B981",
                  boxShadow: isChaos ? "0 0 12px #EF4444" : "0 0 12px #10B981",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--color-light)",
                }}
              >
                {isChaos ? "Status: Fragmented & Bottlenecked" : "Status: ByteBuildIT Unified Architecture"}
              </span>
            </div>

            {/* Mode Switcher Pills */}
            <div
              style={{
                display: "inline-flex",
                padding: "3px",
                borderRadius: "var(--radius-full)",
                backgroundColor: "var(--color-bg-subtle)",
                border: "1px solid var(--color-border)",
              }}
            >
              <button
                type="button"
                onClick={() => setActiveMode("chaos")}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  padding: "6px 14px",
                  borderRadius: "var(--radius-full)",
                  backgroundColor: isChaos ? "rgba(239, 68, 68, 0.2)" : "transparent",
                  color: isChaos ? "#EF4444" : "var(--color-muted)",
                  border: isChaos ? "1px solid rgba(239, 68, 68, 0.4)" : "1px solid transparent",
                  cursor: "pointer",
                  transition: "all 200ms ease",
                }}
              >
                1. Fragmented Chaos
              </button>

              <button
                type="button"
                onClick={() => setActiveMode("order")}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  padding: "6px 14px",
                  borderRadius: "var(--radius-full)",
                  backgroundColor: !isChaos ? "var(--color-accent)" : "transparent",
                  color: !isChaos ? "#FFFFFF" : "var(--color-muted)",
                  border: !isChaos ? "1px solid var(--color-accent)" : "1px solid transparent",
                  boxShadow: !isChaos ? "0 0 16px rgba(46, 74, 249, 0.4)" : "none",
                  cursor: "pointer",
                  transition: "all 200ms ease",
                }}
              >
                2. Unified Core
              </button>
            </div>
          </div>

          {/* Matrix Visualizer Canvas */}
          <div
            style={{
              position: "relative",
              height: "400px",
              marginTop: "var(--space-4)",
            }}
          >
            {/* Grid Pattern */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "radial-gradient(var(--color-grid-dots) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
                opacity: 0.6,
                pointerEvents: "none",
              }}
            />

            {/* Connecting SVG Lines */}
            <svg
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
              }}
            >
              {NODES.map((node) => {
                const targetX = isChaos ? node.chaosX + 10 : node.orderX + 12;
                const targetY = isChaos ? node.chaosY + 6 : node.orderY + 6;

                return (
                  <line
                    key={node.id}
                    x1={`${targetX}%`}
                    y1={`${targetY}%`}
                    x2="50%"
                    y2="50%"
                    stroke={isChaos ? "rgba(239, 68, 68, 0.4)" : "var(--color-accent)"}
                    strokeWidth={isChaos ? "1" : "2"}
                    strokeDasharray={isChaos ? "4 6" : "none"}
                    opacity={isChaos ? "0.4" : "0.75"}
                    style={{ transition: "all 500ms ease" }}
                  />
                );
              })}
            </svg>

            {/* Central System Hub (Visible in Order mode or warning core in Chaos mode) */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 10,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  border: isChaos ? "2px dashed #EF4444" : "2px solid var(--color-accent)",
                  backgroundColor: isChaos ? "rgba(239, 68, 68, 0.12)" : "rgba(46, 74, 249, 0.16)",
                  backdropFilter: "blur(14px)",
                  boxShadow: isChaos ? "0 0 25px rgba(239, 68, 68, 0.3)" : "0 0 35px rgba(46, 74, 249, 0.4)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 8px",
                  transition: "all 400ms ease",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    color: isChaos ? "#EF4444" : "#FFFFFF",
                  }}
                >
                  {isChaos ? "DISRUPTED" : "UNIFIED"}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "8px",
                    letterSpacing: "0.08em",
                    color: isChaos ? "#EF4444" : "var(--color-accent-hover)",
                    textTransform: "uppercase",
                    marginTop: "2px",
                  }}
                >
                  {isChaos ? "Bottlenecks" : "Data Bus"}
                </span>
              </div>
            </div>

            {/* Dynamic Interactive Node Elements */}
            {NODES.map((node) => {
              const currentX = isChaos ? node.chaosX : node.orderX;
              const currentY = isChaos ? node.chaosY : node.orderY;
              const label = isChaos ? node.chaosLabel : node.orderLabel;
              const sub = isChaos ? node.chaosSub : node.orderSub;
              const badgeColor = isChaos ? node.chaosColor : node.orderColor;
              const isHovered = hoveredNode === node.id;

              return (
                <div
                  key={node.id}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{
                    position: "absolute",
                    left: `${currentX}%`,
                    top: `${currentY}%`,
                    transform: `rotate(${isChaos ? (parseInt(node.id) % 2 === 0 ? 4 : -4) : 0}deg) scale(${isHovered ? 1.05 : 1})`,
                    transition: "left 500ms cubic-bezier(0.34, 1.56, 0.64, 1), top 500ms cubic-bezier(0.34, 1.56, 0.64, 1), transform 300ms ease",
                    zIndex: isHovered ? 25 : 15,
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "var(--color-bg-surface)",
                      border: `1px solid ${isHovered ? badgeColor : "var(--color-border)"}`,
                      borderRadius: "var(--radius-xl)",
                      padding: "8px 14px",
                      boxShadow: isHovered ? `0 0 20px ${badgeColor}40` : "var(--shadow-md)",
                      backdropFilter: "blur(12px)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                      <span
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          backgroundColor: badgeColor,
                          boxShadow: `0 0 8px ${badgeColor}`,
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "12px",
                          fontWeight: 700,
                          color: "var(--color-light)",
                        }}
                      >
                        {label}
                      </span>
                    </div>

                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "10px",
                        color: "var(--color-muted)",
                      }}
                    >
                      {sub}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Telemetry Highlights Ribbon at the Bottom of Card */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "var(--space-4)",
              paddingTop: "var(--space-4)",
              borderTop: "1px solid var(--color-border)",
            }}
          >
            <div style={{ padding: "8px 12px", borderRadius: "var(--radius-md)", backgroundColor: "var(--color-bg-subtle)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", textTransform: "uppercase", color: "var(--color-muted)" }}>
                Operational Friction
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, color: isChaos ? "#EF4444" : "#10B981", marginTop: "2px" }}>
                {isChaos ? "High (4.8 hrs/day)" : "Near Zero (Automated)"}
              </div>
            </div>

            <div style={{ padding: "8px 12px", borderRadius: "var(--radius-md)", backgroundColor: "var(--color-bg-subtle)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", textTransform: "uppercase", color: "var(--color-muted)" }}>
                Data Integrity
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, color: isChaos ? "#F59E0B" : "#2E4AF9", marginTop: "2px" }}>
                {isChaos ? "Fragmented Copies" : "Single Source of Truth"}
              </div>
            </div>

            <div style={{ padding: "8px 12px", borderRadius: "var(--radius-md)", backgroundColor: "var(--color-bg-subtle)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", textTransform: "uppercase", color: "var(--color-muted)" }}>
                Handoff Latency
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, color: isChaos ? "#EF4444" : "#10B981", marginTop: "2px" }}>
                {isChaos ? "3 to 5 business days" : "Real-time Event Stream"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
