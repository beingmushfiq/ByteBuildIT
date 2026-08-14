"use client";

import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface NodeData {
  id: string;
  label: string;
  sub: string;
  status: "live" | "synced" | "automated";
  badgeColor: string;
  x: number; // percentage
  y: number; // percentage
  delay: number;
}

const NODES: NodeData[] = [
  { id: "orders",    label: "Orders Matrix",      sub: "1,420 routed/hr",   status: "live",      badgeColor: "#2E4AF9", x: 8,  y: 12, delay: 0 },
  { id: "erp",       label: "ERP Data Conduit",   sub: "0ms drift",         status: "synced",    badgeColor: "#7C3AED", x: 62, y: 8,  delay: 0.1 },
  { id: "inventory", label: "Inventory Engine",   sub: "Auto-reconciled",   status: "automated", badgeColor: "#059669", x: 12, y: 48, delay: 0.2 },
  { id: "finance",   label: "Ledger & Invoicing", sub: "99.8% auto-cleared",status: "live",      badgeColor: "#D97706", x: 65, y: 45, delay: 0.15 },
  { id: "dispatch",  label: "Field Dispatch",     sub: "240 agents synced", status: "synced",    badgeColor: "#0284C7", x: 8,  y: 80, delay: 0.25 },
  { id: "ai",        label: "Decision Intelligence", sub: "Sub-second inference", status: "automated", badgeColor: "#EC4899", x: 58, y: 78, delay: 0.3 },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const vizRef     = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  /* Entrance animation */
  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from("[data-h-tag]",     { opacity: 0, y: 16, duration: 0.6 })
      .from("[data-h-word]",    { opacity: 0, y: 24, duration: 0.5, stagger: 0.05 }, "-=0.35")
      .from("[data-h-accent]",  { scaleX: 0, duration: 0.5, ease: "power2.inOut" }, "-=0.3")
      .from("[data-h-copy]",    { opacity: 0, y: 16, duration: 0.55 }, "-=0.2")
      .from("[data-h-cta]",     { opacity: 0, y: 12, duration: 0.45, stagger: 0.08 }, "-=0.25")
      .from("[data-h-metrics]", { opacity: 0, y: 16, duration: 0.5 }, "-=0.2")
      .from("[data-h-node]",    { opacity: 0, scale: 0.85, duration: 0.6, stagger: 0.08 }, "-=0.6")
      .from("[data-h-center]",  { opacity: 0, scale: 0.7, duration: 0.8 }, "-=0.7");
  }, { scope: sectionRef });

  /* Subtle mouse interactive parallax on nodes */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!vizRef.current) return;
    const rect = vizRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        backgroundColor: "var(--color-bg-base)",
        overflow: "hidden",
      }}
      aria-label="Hero"
    >
      {/* Background Ambient Glow & Dot Matrix */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: "radial-gradient(var(--color-grid-dots) 1.5px, transparent 1.5px)",
          backgroundSize: "32px 32px",
          opacity: 0.8,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "15%",
          right: "10%",
          width: "550px",
          height: "550px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(46, 74, 249, 0.16) 0%, rgba(124, 58, 237, 0.06) 50%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "5%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(46, 74, 249, 0.08) 0%, transparent 70%)",
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />

      <div
        className="container"
        style={{
          paddingTop: "calc(var(--space-32) + 20px)",
          paddingBottom: "var(--space-24)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "var(--space-16)",
            alignItems: "center",
          }}
          className="lg:!grid-cols-[1.1fr_1fr]"
        >
          {/* LEFT: Copy & CTAs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
            
            {/* Live Badge */}
            <div data-h-tag style={{ display: "inline-flex" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 14px",
                  borderRadius: "var(--radius-full)",
                  backgroundColor: "var(--color-bg-subtle)",
                  border: "1px solid var(--color-border)",
                  boxShadow: "0 2px 12px rgba(46, 74, 249, 0.12)",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#10B981",
                    boxShadow: "0 0 10px #10B981",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--color-light)",
                  }}
                >
                  Enterprise Automation &amp; Intelligent Systems
                </span>
              </div>
            </div>

            {/* Massive Display Headline */}
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(2.75rem, 6vw, 5.25rem)",
                lineHeight: 1.02,
                letterSpacing: "-0.04em",
                color: "var(--color-light)",
                margin: 0,
              }}
            >
              {[
                { text: "WE", accent: false },
                { text: "TURN", accent: false },
                { text: "INEFFICIENT", accent: false },
                { text: "BUSINESS", accent: false },
                { text: "PROCESSES", accent: false },
                { text: "INTO", accent: false },
                { text: "SOFTWARE.", accent: true },
              ].map((item, idx) => (
                <span
                  key={idx}
                  data-h-word
                  style={{
                    display: "inline-block",
                    marginRight: "0.22em",
                    color: item.accent ? "var(--color-accent)" : "var(--color-light)",
                    textShadow: item.accent ? "0 0 40px rgba(46, 74, 249, 0.4)" : "none",
                  }}
                >
                  {item.text}
                </span>
              ))}
            </h1>

            {/* Accent Highlight Bar */}
            <div
              data-h-accent
              style={{
                width: "60px",
                height: "4px",
                borderRadius: "2px",
                background: "linear-gradient(90deg, var(--color-accent), #7C3AED)",
                boxShadow: "0 0 16px var(--color-accent-glow)",
              }}
            />

            {/* Editorial Body Text */}
            <p
              data-h-copy
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(1.05rem, 1.35vw, 1.2rem)",
                lineHeight: 1.75,
                color: "var(--color-muted)",
                maxWidth: "520px",
                margin: 0,
              }}
            >
              We eliminate manual bottlenecks, spreadsheets, and fragmented tools by engineering
              cohesive, high-leverage software systems architected precisely for your operational workflow.
            </p>

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "var(--space-4)",
                alignItems: "center",
                marginTop: "var(--space-2)",
              }}
            >
              <a
                data-h-cta
                href="#contact"
                className="btn btn-primary group"
                style={{
                  fontSize: "13px",
                  padding: "14px 28px",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <span>Initiate a project</span>
                <span
                  style={{
                    display: "inline-block",
                    transition: "transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                  className="group-hover:translate-x-1 group-hover:-translate-y-1"
                >
                  ↗
                </span>
              </a>

              <a
                data-h-cta
                href="#work"
                className="btn btn-ghost"
                style={{
                  fontSize: "13px",
                  padding: "14px 24px",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <span>Explore Case Studies</span>
                <span>→</span>
              </a>
            </div>

            {/* Live Operational Metrics Ribbon */}
            <div
              data-h-metrics
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "var(--space-4)",
                paddingTop: "var(--space-6)",
                borderTop: "1px solid var(--color-border)",
                marginTop: "var(--space-4)",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    color: "var(--color-light)",
                  }}
                >
                  99.9%
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    color: "var(--color-muted)",
                    marginTop: "2px",
                  }}
                >
                  System Reliability
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    color: "var(--color-accent)",
                  }}
                >
                  8.4x
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    color: "var(--color-muted)",
                    marginTop: "2px",
                  }}
                >
                  Execution Speed
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    color: "var(--color-light)",
                  }}
                >
                  100%
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    color: "var(--color-muted)",
                    marginTop: "2px",
                  }}
                >
                  Type-Safe Architecture
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: High-Tech Interactive Architecture Matrix */}
          <div
            ref={vizRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative hidden lg:block"
            style={{
              height: "560px",
              position: "relative",
              borderRadius: "var(--radius-2xl)",
              border: "1px solid var(--color-border)",
              backgroundColor: "var(--color-bg-card)",
              boxShadow: "var(--shadow-xl)",
              overflow: "hidden",
            }}
            aria-hidden="true"
          >
            {/* Background Grid Lines within Container */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
                opacity: 0.35,
                pointerEvents: "none",
              }}
            />

            {/* SVG Connecting Conduits */}
            <svg
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
              }}
            >
              <defs>
                <linearGradient id="laser-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {NODES.map((node) => (
                <g key={node.id}>
                  {/* Base circuit line */}
                  <line
                    x1={`${node.x + 16}%`}
                    y1={`${node.y + 6}%`}
                    x2="50%"
                    y2="50%"
                    stroke="var(--color-border)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  {/* Glowing active laser overlay */}
                  <line
                    x1={`${node.x + 16}%`}
                    y1={`${node.y + 6}%`}
                    x2="50%"
                    y2="50%"
                    stroke="url(#laser-grad)"
                    strokeWidth="2"
                    opacity="0.75"
                  />
                </g>
              ))}
            </svg>

            {/* Central ByteBuildIT Neural Hub */}
            <div
              data-h-center
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate(calc(-50% + ${mousePos.x * 0.4}px), calc(-50% + ${mousePos.y * 0.4}px))`,
                zIndex: 10,
                textAlign: "center",
                transition: "transform 200ms ease-out",
              }}
            >
              {/* Outer Ripple Auras */}
              <div
                style={{
                  position: "absolute",
                  inset: -20,
                  borderRadius: "50%",
                  border: "1px solid rgba(46, 74, 249, 0.3)",
                  animation: "ping 3s cubic-bezier(0, 0, 0.2, 1) infinite",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  width: "110px",
                  height: "110px",
                  borderRadius: "50%",
                  border: "2px solid var(--color-accent)",
                  background: "radial-gradient(circle at 30% 30%, rgba(74, 98, 255, 0.35) 0%, rgba(14, 26, 48, 0.95) 75%)",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 0 45px rgba(46, 74, 249, 0.4), inset 0 0 20px rgba(46, 74, 249, 0.3)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    fontWeight: 800,
                    letterSpacing: "0.15em",
                    color: "#FFFFFF",
                    textShadow: "0 0 10px #2E4AF9",
                  }}
                >
                  CORE
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "9px",
                    letterSpacing: "0.08em",
                    color: "var(--color-accent-hover)",
                    textTransform: "uppercase",
                    marginTop: "2px",
                  }}
                >
                  SYSTEM
                </div>
              </div>
            </div>

            {/* Floating Architecture Node Cards */}
            {NODES.map((node) => (
              <div
                key={node.id}
                data-h-node
                style={{
                  position: "absolute",
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: `translate(${mousePos.x * (node.delay + 0.3)}px, ${mousePos.y * (node.delay + 0.3)}px)`,
                  transition: "transform 250ms ease-out, border-color 200ms ease, box-shadow 200ms ease",
                  zIndex: 15,
                }}
              >
                <div
                  style={{
                    backgroundColor: "var(--color-bg-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-xl)",
                    padding: "10px 16px",
                    boxShadow: "var(--shadow-md), 0 0 15px rgba(0,0,0,0.2)",
                    backdropFilter: "blur(12px)",
                    minWidth: "160px",
                  }}
                >
                  {/* Status Indicator & Badge */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "8px",
                      marginBottom: "4px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "9px",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: node.badgeColor,
                        padding: "2px 6px",
                        borderRadius: "var(--radius-xs)",
                        backgroundColor: `${node.badgeColor}18`,
                        border: `1px solid ${node.badgeColor}35`,
                      }}
                    >
                      {node.status}
                    </span>
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: node.badgeColor,
                        boxShadow: `0 0 8px ${node.badgeColor}`,
                      }}
                    />
                  </div>

                  {/* Main Title */}
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "var(--color-light)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {node.label}
                  </div>

                  {/* Subtitle / Live Metric */}
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "10px",
                      color: "var(--color-muted)",
                      marginTop: "2px",
                    }}
                  >
                    {node.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subtle Bottom Separator Rule */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: "linear-gradient(to right, transparent, var(--color-border) 25%, var(--color-border) 75%, transparent)",
        }}
      />
    </section>
  );
}
