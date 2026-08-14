"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const SCOPES = [
  "Order & Inventory Automation",
  "ERP & Data Unification",
  "Field Workforce Dispatch",
  "Document AI & OCR",
  "SaaS Digital Product",
  "Other Custom System",
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedScopes, setSelectedScopes] = useState<string[]>(["Order & Inventory Automation"]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", company: "", problem: "" });

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.fromTo(
      "[data-ct-tag]",
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", clearProps: "all" }
    );
    gsap.fromTo(
      "[data-ct-headline]",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.1, ease: "power3.out", clearProps: "all" }
    );
    gsap.fromTo(
      "[data-ct-form]",
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.15, ease: "power3.out", clearProps: "all" }
    );
  }, { scope: sectionRef });

  const toggleScope = (scope: string) => {
    setSelectedScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, scopes: selectedScopes }),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", company: "", problem: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="section"
      style={{
        backgroundColor: "var(--color-bg-surface)",
        position: "relative",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "var(--space-16)",
            alignItems: "start",
          }}
          className="lg:!grid-cols-[1fr_1.2fr]"
        >
          {/* Left Column: Direct Outreach & SLA */}
          <div>
            <div data-ct-tag style={{ marginBottom: "var(--space-4)" }}>
              <span className="section-label">
                Start an Engineering Sprint
              </span>
            </div>

            <h2
              data-ct-headline
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.25rem, 5vw, 4rem)",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.035em",
                color: "var(--color-light)",
                marginBottom: "var(--space-6)",
              }}
            >
              Let&apos;s eliminate your operational bottlenecks.
            </h2>

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(1.05rem, 1.3vw, 1.15rem)",
                lineHeight: 1.75,
                color: "var(--color-muted)",
                marginBottom: "var(--space-8)",
              }}
            >
              Whether you need to replace fragile spreadsheets, connect isolated SaaS tools,
              or build an end-to-end custom operational platform, we architect and deploy fast.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-4)",
                padding: "var(--space-6)",
                borderRadius: "var(--radius-xl)",
                backgroundColor: "var(--color-bg-card)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10B981", boxShadow: "0 0 10px #10B981" }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", fontWeight: 700, color: "var(--color-light)", textTransform: "uppercase" }}>
                  Engineering Intake: Active
                </span>
              </div>

              <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-muted)", margin: 0, lineHeight: 1.6 }}>
                Average response time is under 4 business hours. We schedule discovery calls within 24 hours.
              </p>
            </div>
          </div>

          {/* Right Column: Executive Initiation Form */}
          <div
            data-ct-form
            className="glass-card"
            style={{
              padding: "clamp(24px, 4vw, 40px)",
              borderRadius: "var(--radius-2xl)",
              backgroundColor: "var(--color-bg-card)",
              border: "1px solid var(--color-border)",
              boxShadow: "var(--shadow-xl)",
            }}
          >
            {status === "success" ? (
              <div
                style={{
                  padding: "var(--space-12) var(--space-6)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(16, 185, 129, 0.15)",
                    border: "2px solid #10B981",
                    color: "#10B981",
                    fontSize: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto var(--space-4)",
                  }}
                >
                  ✓
                </div>

                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.6rem",
                    fontWeight: 800,
                    color: "var(--color-light)",
                    marginBottom: "var(--space-2)",
                  }}
                >
                  Inquiry Received
                </h3>

                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    color: "var(--color-muted)",
                    maxWidth: "400px",
                    margin: "0 auto",
                    lineHeight: 1.6,
                  }}
                >
                  Our system architects are reviewing your operational context. We will reach out within 4 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
                {/* Project Scope Selection */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--color-light)",
                      marginBottom: "var(--space-3)",
                    }}
                  >
                    1. Select Operational Scope
                  </label>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {SCOPES.map((scope) => {
                      const isSelected = selectedScopes.includes(scope);

                      return (
                        <button
                          key={scope}
                          type="button"
                          onClick={() => toggleScope(scope)}
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "11px",
                            fontWeight: 600,
                            padding: "8px 14px",
                            borderRadius: "var(--radius-full)",
                            backgroundColor: isSelected ? "var(--color-accent)" : "var(--color-bg-subtle)",
                            color: isSelected ? "#FFFFFF" : "var(--color-light)",
                            border: isSelected ? "1px solid var(--color-accent)" : "1px solid var(--color-border)",
                            boxShadow: isSelected ? "0 0 16px rgba(46, 74, 249, 0.4)" : "none",
                            cursor: "pointer",
                            transition: "all 150ms ease",
                          }}
                        >
                          {scope}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Name & Email Row */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: "var(--space-4)",
                  }}
                  className="sm:!grid-cols-2"
                >
                  <div>
                    <label
                      htmlFor="contact-name"
                      style={{
                        display: "block",
                        fontFamily: "var(--font-mono)",
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        color: "var(--color-muted)",
                        marginBottom: "6px",
                      }}
                    >
                      Your Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Jane Smith"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: "var(--radius-lg)",
                        backgroundColor: "var(--color-bg-subtle)",
                        border: "1px solid var(--color-border)",
                        color: "var(--color-light)",
                        fontFamily: "var(--font-body)",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      style={{
                        display: "block",
                        fontFamily: "var(--font-mono)",
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        color: "var(--color-muted)",
                        marginBottom: "6px",
                      }}
                    >
                      Work Email *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="jane@company.com"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: "var(--radius-lg)",
                        backgroundColor: "var(--color-bg-subtle)",
                        border: "1px solid var(--color-border)",
                        color: "var(--color-light)",
                        fontFamily: "var(--font-body)",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>

                {/* Company */}
                <div>
                  <label
                    htmlFor="contact-company"
                    style={{
                      display: "block",
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: "var(--color-muted)",
                      marginBottom: "6px",
                    }}
                  >
                    Organization / Company
                  </label>
                  <input
                    id="contact-company"
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="Acme Operations Inc."
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "var(--radius-lg)",
                      backgroundColor: "var(--color-bg-subtle)",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-light)",
                      fontFamily: "var(--font-body)",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                </div>

                {/* Problem Description */}
                <div>
                  <label
                    htmlFor="contact-problem"
                    style={{
                      display: "block",
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: "var(--color-muted)",
                      marginBottom: "6px",
                    }}
                  >
                    What process is costing you time, money, or manual errors? *
                  </label>
                  <textarea
                    id="contact-problem"
                    required
                    rows={4}
                    value={form.problem}
                    onChange={(e) => setForm({ ...form, problem: e.target.value })}
                    placeholder="Describe your current bottleneck, tools used, and what an ideal automated system should do..."
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "var(--radius-lg)",
                      backgroundColor: "var(--color-bg-subtle)",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-light)",
                      fontFamily: "var(--font-body)",
                      fontSize: "14px",
                      outline: "none",
                      resize: "vertical",
                    }}
                  />
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn btn-primary"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    padding: "16px",
                    fontSize: "13px",
                    borderRadius: "var(--radius-lg)",
                  }}
                >
                  <span>{status === "loading" ? "Submitting Inquiry..." : "Submit Project Intake →"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
