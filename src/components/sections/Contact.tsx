"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const FIELDS = [
  { id: "name",    label: "Your name",    type: "text",  placeholder: "Jane Smith",                required: true  },
  { id: "email",   label: "Work email",   type: "email", placeholder: "jane@company.com",           required: true  },
  { id: "company", label: "Company",      type: "text",  placeholder: "Acme Corp",                  required: false },
  { id: "problem", label: "What's not working?", type: "textarea", placeholder: "Describe the process that's costing you time, money, or errors...", required: true },
] as const;

export default function Contact() {
  const sectionRef  = useRef<HTMLElement>(null);
  const panelRef    = useRef<HTMLDivElement>(null);
  const overlayRef  = useRef<HTMLDivElement>(null);
  const [open, setOpen]   = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", company: "", problem: "" });

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 75%",
      onEnter: () => {
        gsap.from("[data-ct-tag]",  { opacity: 0, y: 16, duration: 0.6, ease: "power3.out" });
        gsap.from("[data-ct-h1]",   { opacity: 0, y: 40, duration: 0.8, delay: 0.1, ease: "power3.out" });
        gsap.from("[data-ct-sub]",  { opacity: 0, y: 20, duration: 0.6, delay: 0.3, ease: "power3.out" });
        gsap.from("[data-ct-cta]",  { opacity: 0, y: 12, duration: 0.5, delay: 0.5, ease: "power3.out" });
      },
    });
  }, { scope: sectionRef });

  const openPanel = () => {
    setOpen(true);
    const panel   = panelRef.current;
    const overlay = overlayRef.current;
    if (!panel || !overlay) return;
    gsap.set(panel,   { x: "100%" });
    gsap.set(overlay, { opacity: 0, display: "block" });
    gsap.to(overlay, { opacity: 1, duration: 0.25, ease: "power2.out" });
    gsap.to(panel,   { x: "0%", duration: 0.45, ease: "power3.out" });
    document.body.style.overflow = "hidden";
  };

  const closePanel = () => {
    const panel   = panelRef.current;
    const overlay = overlayRef.current;
    if (!panel || !overlay) return;
    gsap.to(panel,   { x: "100%", duration: 0.35, ease: "power3.in" });
    gsap.to(overlay, {
      opacity: 0, duration: 0.3, ease: "power2.in",
      onComplete: () => {
        gsap.set(overlay, { display: "none" });
        setOpen(false);
        document.body.style.overflow = "";
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
    <>
      {/* ── Section ───────────────────────────────────────── */}
      <section
        ref={sectionRef}
        id="contact"
        className="section"
        style={{ backgroundColor: "var(--color-dark)", position: "relative" }}
      >
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "1px",
          background: "linear-gradient(to right, transparent, var(--color-border) 30%, var(--color-border) 70%, transparent)",
        }} />

        <div className="container">
          <div style={{ maxWidth: "700px" }}>
            <span data-ct-tag className="section-label" style={{ marginBottom: "var(--space-8)", display: "flex" }}>
              Work with us
            </span>

            <h2
              data-ct-h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(3rem, 8vw, 7rem)",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                lineHeight: 0.95,
                marginBottom: "var(--space-8)",
              }}
            >
              <span style={{ color: "var(--color-light)" }}>What&apos;s</span>
              <br />
              <span style={{ color: "var(--color-light)" }}>wasting</span>
              <br />
              <span style={{ color: "var(--color-accent)" }}>your time?</span>
            </h2>

            <p
              data-ct-sub
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(1rem, 1.4vw, 1.1rem)",
                lineHeight: 1.75,
                color: "var(--color-muted)",
                maxWidth: "460px",
                marginBottom: "var(--space-10)",
              }}
            >
              Tell us about the process that&apos;s costing you time, money, or errors.
              No sales pitch. No templates. Just a real conversation about your operation.
            </p>

            <button
              data-ct-cta
              onClick={openPanel}
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
                padding: "0.875rem 1.75rem",
                borderRadius: "var(--radius-md)",
                border: "none",
                cursor: "pointer",
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
              Bring us the problem
              <span style={{ display: "inline-block", transition: "transform 220ms var(--ease-spring)" }}
                className="group-hover:[transform:translate(2px,-2px)]"
              >↗</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Overlay ────────────────────────────────────────── */}
      <div
        ref={overlayRef}
        onClick={closePanel}
        style={{
          display: "none",
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.65)",
          zIndex: "var(--z-overlay)" as unknown as number,
          backdropFilter: "blur(4px)",
        }}
        aria-hidden="true"
      />

      {/* ── Slide-in Panel ─────────────────────────────────── */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Start a project"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(560px, 100vw)",
          zIndex: "var(--z-modal)" as unknown as number,
          backgroundColor: "var(--color-deep-navy)",
          borderLeft: "1px solid var(--color-border)",
          display: "flex",
          flexDirection: "column",
          transform: "translateX(100%)",
          willChange: "transform",
        }}
      >
        {/* Panel header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "var(--space-6) var(--space-8)",
          borderBottom: "1px solid var(--color-border)",
          flexShrink: 0,
        }}>
          <div>
            <div style={{
              fontFamily: "var(--font-mono)", fontSize: "10px",
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: "var(--color-muted)", marginBottom: "var(--space-1)",
            }}>
              New inquiry
            </div>
            <div style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-xl)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--color-light)",
            }}>
              Tell us the problem
            </div>
          </div>

          <button
            onClick={closePanel}
            aria-label="Close panel"
            style={{
              width: 36, height: 36,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              backgroundColor: "transparent",
              color: "var(--color-muted)",
              cursor: "pointer",
              fontSize: "1.25rem",
              lineHeight: 1,
              transition: "color 150ms ease, border-color 150ms ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--color-light)"; e.currentTarget.style.borderColor = "var(--color-border-md)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--color-muted)"; e.currentTarget.style.borderColor = "var(--color-border)"; }}
          >
            ×
          </button>
        </div>

        {/* Form */}
        <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-8)" }}>
          {status === "success" ? (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", height: "100%", textAlign: "center",
              gap: "var(--space-4)",
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: "50%",
                border: "1px solid rgba(5,150,105,0.5)",
                backgroundColor: "rgba(5,150,105,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.25rem",
              }}>
                ✓
              </div>
              <h3 style={{
                fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)",
                fontWeight: 700, letterSpacing: "-0.025em", color: "var(--color-light)",
              }}>
                Received.
              </h3>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-muted)", maxWidth: "320px", lineHeight: 1.7 }}>
                We&apos;ll review your message and follow up within one business day.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
              {FIELDS.map(field => (
                <div key={field.id} style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                  <label
                    htmlFor={field.id}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "10px",
                      fontWeight: 500,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--color-muted)",
                    }}
                  >
                    {field.label}
                    {field.required && <span style={{ color: "var(--color-accent)", marginLeft: "2px" }}>*</span>}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      id={field.id}
                      name={field.id}
                      required={field.required}
                      placeholder={field.placeholder}
                      rows={5}
                      autoComplete="off"
                      suppressHydrationWarning
                      value={form[field.id as keyof typeof form]}
                      onChange={e => setForm(f => ({ ...f, [field.id]: e.target.value }))}
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "var(--text-sm)",
                        color: "var(--color-light)",
                        backgroundColor: "rgba(255,255,255,0.04)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "var(--radius-lg)",
                        padding: "var(--space-4)",
                        resize: "vertical",
                        outline: "none",
                        transition: "border-color 200ms ease",
                        lineHeight: 1.6,
                      }}
                      onFocus={e => (e.target.style.borderColor = "var(--color-accent)")}
                      onBlur={e => (e.target.style.borderColor = "var(--color-border)")}
                    />
                  ) : (
                    <input
                      id={field.id}
                      name={field.id}
                      type={field.type}
                      required={field.required}
                      placeholder={field.placeholder}
                      autoComplete={field.id === "email" ? "email" : field.id === "name" ? "name" : field.id === "company" ? "organization" : "on"}
                      suppressHydrationWarning
                      value={form[field.id as keyof typeof form]}
                      onChange={e => setForm(f => ({ ...f, [field.id]: e.target.value }))}
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "var(--text-sm)",
                        color: "var(--color-light)",
                        backgroundColor: "rgba(255,255,255,0.04)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "var(--radius-lg)",
                        padding: "var(--space-3) var(--space-4)",
                        outline: "none",
                        transition: "border-color 200ms ease",
                        width: "100%",
                      }}
                      onFocus={e => (e.target.style.borderColor = "var(--color-accent)")}
                      onBlur={e => (e.target.style.borderColor = "var(--color-border)")}
                    />
                  )}
                </div>
              ))}

              {status === "error" && (
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#F87171" }}>
                  Something went wrong. Please try again.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "var(--space-2)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 500,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  color: "var(--color-white)",
                  backgroundColor: status === "loading" ? "var(--color-gray-700)" : "var(--color-accent)",
                  padding: "0.875rem var(--space-6)",
                  borderRadius: "var(--radius-md)",
                  border: "none",
                  cursor: status === "loading" ? "not-allowed" : "pointer",
                  transition: "background-color 200ms ease",
                  marginTop: "var(--space-2)",
                }}
              >
                {status === "loading" ? "Sending..." : "Send →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
