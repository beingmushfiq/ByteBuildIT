"use client";

import { useState, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/* ── Types ──────────────────────────────────────────────────────── */

interface FormData {
  category: string;
  description: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  budget: string;
  timeline: string;
}

interface StepErrors {
  [key: string]: string;
}

/* ── CMS-editable data ─────────────────────────────────────────── */

interface ContactContent {
  sectionNumber: string;
  headline: string;
  body: string;
  cta: string;
  categories: string[];
}

const CONTENT: ContactContent = {
  sectionNumber: "05",
  headline: "WHAT'S WASTING YOUR TIME?",
  body: "Tell us where your process breaks. We'll figure out what it could become.",
  cta: "BRING US THE PROBLEM →",
  categories: [
    "Manual operations",
    "Business software",
    "Automation",
    "AI",
    "New product",
    "Modernization",
    "Other",
  ],
};

/* ── Component ──────────────────────────────────────────────────── */

export default function Contact() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<StepErrors>({});

  const [form, setForm] = useState<FormData>({
    category: "",
    description: "",
    name: "",
    email: "",
    phone: "",
    company: "",
    budget: "",
    timeline: "",
  });

  const sectionRef = useRef<HTMLElement>(null);
  const formStepRef = useRef<HTMLDivElement>(null);

  /* ── Field update ────────────────────────────────────────────── */

  const updateField = useCallback(
    (field: keyof FormData, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      // Clear error for this field on change
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    []
  );

  /* ── Validation ──────────────────────────────────────────────── */

  const validateStep = useCallback(
    (currentStep: number): boolean => {
      const newErrors: StepErrors = {};

      if (currentStep === 1) {
        if (!form.category) {
          newErrors.category = "Please select a problem category";
        }
      }

      if (currentStep === 2) {
        if (!form.description.trim()) {
          newErrors.description = "Please describe your problem";
        }
      }

      if (currentStep === 3) {
        if (!form.name.trim()) {
          newErrors.name = "Name is required";
        }
        if (!form.email.trim()) {
          newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
          newErrors.email = "Please enter a valid email";
        }
        if (!form.company.trim()) {
          newErrors.company = "Company is required";
        }
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [form]
  );

  /* ── Step navigation ─────────────────────────────────────────── */

  const animateStepTransition = useCallback(
    (direction: "next" | "prev") => {
      if (!formStepRef.current) return;

      const exitX = direction === "next" ? -30 : 30;

      gsap.to(formStepRef.current, {
        opacity: 0,
        x: exitX,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          setStep((prev) => (direction === "next" ? prev + 1 : prev - 1));
        },
      });
    },
    []
  );

  const handleNext = useCallback(() => {
    if (!validateStep(step)) return;
    animateStepTransition("next");
  }, [step, validateStep, animateStepTransition]);

  const handlePrev = useCallback(() => {
    animateStepTransition("prev");
  }, [animateStepTransition]);

  const handleSubmit = useCallback(() => {
    if (!validateStep(3)) return;
    setIsSubmitted(true);
  }, [validateStep]);

  /* ── GSAP animations ─────────────────────────────────────────── */

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
      const headline = section.querySelector("[data-contact-headline]");
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

      // --- Body and CTA fade-in ---
      const bodyElements = section.querySelectorAll("[data-contact-body]");
      if (bodyElements.length > 0) {
        gsap.fromTo(
          bodyElements,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: bodyElements[0],
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // --- Form card entrance ---
      const formCard = section.querySelector("[data-contact-form-card]");
      if (formCard) {
        gsap.fromTo(
          formCard,
          { opacity: 0, y: 24, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: formCard,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  /* ── Animate step enter ──────────────────────────────────────── */

  useGSAP(
    () => {
      if (!formStepRef.current) return;

      gsap.fromTo(
        formStepRef.current,
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.35, ease: "power3.out" }
      );
    },
    { scope: formStepRef, dependencies: [step] }
  );

  /* ── Render helpers ───────────────────────────────────────────── */

  const inputStyle = (hasError: boolean) =>
    ({
      width: "100%",
      fontFamily: "var(--font-body)",
      fontSize: "var(--text-sm)",
      lineHeight: 1.6,
      color: "var(--color-light)",
      backgroundColor: "rgba(255, 255, 255, 0.04)",
      border: `1px solid ${hasError ? "#EF4444" : "var(--color-gray-700)"}`,
      borderRadius: "var(--radius-md)",
      padding: "var(--space-3) var(--space-4)",
      outline: "none",
      transition: "border-color 300ms cubic-bezier(0.25, 0.1, 0.25, 1)",
    } as const);

  const labelStyle = {
    fontFamily: "var(--font-mono)",
    fontSize: "var(--text-xs)",
    fontWeight: 500,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: "var(--color-muted)",
    marginBottom: "var(--space-2)",
    display: "block",
  };

  const errorStyle = {
    fontFamily: "var(--font-mono)",
    fontSize: "11px",
    color: "#EF4444",
    marginTop: "var(--space-1)",
  };

  const stepIndicators = [1, 2, 3];

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="section relative overflow-hidden"
      style={{ backgroundColor: "var(--color-primary)" }}
      aria-label="Contact"
    >
      {/* Subtle grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-light) 1px, transparent 1px), linear-gradient(90deg, var(--color-light) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container relative z-10 mx-auto" style={{ maxWidth: "var(--container-max)" }}>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          {/* ── Left Column: Copy ─────────────────────────── */}
          <div className="flex flex-col gap-6">
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
                marginBottom: "var(--space-4)",
              }}
            >
              {CONTENT.sectionNumber}
            </div>

            {/* Headline */}
            <h2
              data-contact-headline
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(2rem, 5vw, 4rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: "var(--color-light)",
              }}
            >
              {CONTENT.headline}
            </h2>

            {/* Accent bar */}
            <div
              data-contact-body
              style={{
                width: "48px",
                height: "2px",
                backgroundColor: "var(--color-accent)",
                transformOrigin: "left center",
              }}
            />

            {/* Body */}
            <p
              data-contact-body
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(1rem, 1.3vw, 1.125rem)",
                lineHeight: 1.7,
                color: "var(--color-muted)",
                maxWidth: "440px",
              }}
            >
              {CONTENT.body}
            </p>

            {/* CTA text */}
            <div data-contact-body>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-sm)",
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--color-accent)",
                }}
              >
                {CONTENT.cta}
              </span>
            </div>
          </div>

          {/* ── Right Column: Multi-step Form ─────────────── */}
          <div
            data-contact-form-card
            style={{
              backgroundColor: "var(--color-deep-navy)",
              border: "1px solid var(--color-gray-700)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-8)",
              opacity: 0,
            }}
          >
            {isSubmitted ? (
              /* ── Success State ───────────────────────────── */
              <div
                className="flex flex-col items-center justify-center py-12 text-center"
                data-contact-success
              >
                <div
                  className="mb-6 flex h-16 w-16 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: "rgba(46, 74, 249, 0.12)",
                    border: "1px solid var(--color-accent)",
                  }}
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-2xl)",
                    fontWeight: 700,
                    color: "var(--color-light)",
                    marginBottom: "var(--space-3)",
                  }}
                >
                  MESSAGE SENT
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-sm)",
                    lineHeight: 1.6,
                    color: "var(--color-muted)",
                    maxWidth: "360px",
                  }}
                >
                  Thank you for reaching out. We&apos;ll review your inquiry and
                  get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <>
                {/* ── Step Indicators ───────────────────────── */}
                <div
                  className="mb-8 flex items-center gap-3"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-xs)",
                    fontWeight: 500,
                    letterSpacing: "0.06em",
                  }}
                >
                  {stepIndicators.map((s, i) => (
                    <div key={s} className="flex items-center gap-3">
                      <div
                        className="flex h-7 w-7 items-center justify-center rounded-full"
                        style={{
                          backgroundColor:
                            s <= step
                              ? "var(--color-accent)"
                              : "rgba(255, 255, 255, 0.05)",
                          color: s <= step ? "#fff" : "var(--color-muted)",
                          border: `1px solid ${
                            s <= step
                              ? "var(--color-accent)"
                              : "var(--color-gray-700)"
                          }`,
                          transition:
                            "all 300ms cubic-bezier(0.25, 0.1, 0.25, 1)",
                        }}
                      >
                        {s}
                      </div>
                      {i < stepIndicators.length - 1 && (
                        <div
                          style={{
                            width: "24px",
                            height: "1px",
                            backgroundColor:
                              s < step
                                ? "var(--color-accent)"
                                : "var(--color-gray-700)",
                            transition:
                              "background-color 300ms cubic-bezier(0.25, 0.1, 0.25, 1)",
                          }}
                        />
                      )}
                    </div>
                  ))}
                  <span
                    style={{
                      marginLeft: "auto",
                      color: "var(--color-muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    Step {step} of 3
                  </span>
                </div>

                {/* ── Step Content ──────────────────────────── */}
                <div ref={formStepRef} style={{ minHeight: "260px" }}>
                  {step === 1 && (
                    <div>
                      <p
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "var(--text-lg)",
                          fontWeight: 600,
                          color: "var(--color-light)",
                          marginBottom: "var(--space-6)",
                        }}
                      >
                        What best describes your problem?
                      </p>
                      <div className="flex flex-col gap-2">
                        {CONTENT.categories.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => updateField("category", cat)}
                            className="flex items-center gap-3 rounded-lg border p-3 text-left transition-all duration-200"
                            style={{
                              fontFamily: "var(--font-display)",
                              fontSize: "var(--text-sm)",
                              fontWeight: 500,
                              backgroundColor:
                                form.category === cat
                                  ? "rgba(46, 74, 249, 0.08)"
                                  : "transparent",
                              borderColor:
                                form.category === cat
                                  ? "var(--color-accent)"
                                  : "var(--color-gray-700)",
                              color:
                                form.category === cat
                                  ? "var(--color-light)"
                                  : "var(--color-muted)",
                              cursor: "pointer",
                            }}
                          >
                            <span
                              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border"
                              style={{
                                borderColor:
                                  form.category === cat
                                    ? "var(--color-accent)"
                                    : "var(--color-gray-600)",
                                backgroundColor:
                                  form.category === cat
                                    ? "var(--color-accent)"
                                    : "transparent",
                              }}
                            >
                              {form.category === cat && (
                                <span
                                  className="block h-2 w-2 rounded-full"
                                  style={{ backgroundColor: "#fff" }}
                                />
                              )}
                            </span>
                            {cat}
                          </button>
                        ))}
                      </div>
                      {errors.category && (
                        <p style={errorStyle}>{errors.category}</p>
                      )}
                    </div>
                  )}

                  {step === 2 && (
                    <div>
                      <p
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "var(--text-lg)",
                          fontWeight: 600,
                          color: "var(--color-light)",
                          marginBottom: "var(--space-2)",
                        }}
                      >
                        Tell us about it
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "var(--text-sm)",
                          color: "var(--color-muted)",
                          marginBottom: "var(--space-6)",
                        }}
                      >
                        {form.category && (
                          <>
                            Category:{" "}
                            <span style={{ color: "var(--color-accent)" }}>
                              {form.category}
                            </span>
                          </>
                        )}
                      </p>
                      <textarea
                        value={form.description}
                        onChange={(e) =>
                          updateField("description", e.target.value)
                        }
                        placeholder="Describe the problem, process, or bottleneck you're dealing with..."
                        rows={6}
                        style={{
                          ...inputStyle(!!errors.description),
                          resize: "vertical" as const,
                          minHeight: "140px",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor =
                            "var(--color-accent)";
                        }}
                        onBlur={(e) => {
                          if (!errors.description) {
                            e.currentTarget.style.borderColor =
                              "var(--color-gray-700)";
                          }
                        }}
                      />
                      {errors.description && (
                        <p style={errorStyle}>{errors.description}</p>
                      )}
                    </div>
                  )}

                  {step === 3 && (
                    <div className="flex flex-col gap-4">
                      <p
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "var(--text-lg)",
                          fontWeight: 600,
                          color: "var(--color-light)",
                          marginBottom: "var(--space-2)",
                        }}
                      >
                        How can we reach you?
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "var(--text-sm)",
                          color: "var(--color-muted)",
                          marginBottom: "var(--space-4)",
                        }}
                      >
                        We&apos;ll be in touch within 24 hours.
                      </p>

                      <div className="grid gap-4 sm:grid-cols-2">
                        {/* Name */}
                        <div>
                          <label style={labelStyle} htmlFor="contact-name">
                            Name *
                          </label>
                          <input
                            id="contact-name"
                            type="text"
                            value={form.name}
                            onChange={(e) =>
                              updateField("name", e.target.value)
                            }
                            placeholder="Your name"
                            style={inputStyle(!!errors.name)}
                            onFocus={(e) => {
                              e.currentTarget.style.borderColor =
                                "var(--color-accent)";
                            }}
                            onBlur={(e) => {
                              if (!errors.name) {
                                e.currentTarget.style.borderColor =
                                  "var(--color-gray-700)";
                              }
                            }}
                          />
                          {errors.name && (
                            <p style={errorStyle}>{errors.name}</p>
                          )}
                        </div>

                        {/* Email */}
                        <div>
                          <label style={labelStyle} htmlFor="contact-email">
                            Email *
                          </label>
                          <input
                            id="contact-email"
                            type="email"
                            value={form.email}
                            onChange={(e) =>
                              updateField("email", e.target.value)
                            }
                            placeholder="you@company.com"
                            style={inputStyle(!!errors.email)}
                            onFocus={(e) => {
                              e.currentTarget.style.borderColor =
                                "var(--color-accent)";
                            }}
                            onBlur={(e) => {
                              if (!errors.email) {
                                e.currentTarget.style.borderColor =
                                  "var(--color-gray-700)";
                              }
                            }}
                          />
                          {errors.email && (
                            <p style={errorStyle}>{errors.email}</p>
                          )}
                        </div>

                        {/* Phone */}
                        <div>
                          <label style={labelStyle} htmlFor="contact-phone">
                            Phone
                          </label>
                          <input
                            id="contact-phone"
                            type="tel"
                            value={form.phone}
                            onChange={(e) =>
                              updateField("phone", e.target.value)
                            }
                            placeholder="+1 (555) 000-0000"
                            style={inputStyle(false)}
                            onFocus={(e) => {
                              e.currentTarget.style.borderColor =
                                "var(--color-accent)";
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor =
                                "var(--color-gray-700)";
                            }}
                          />
                        </div>

                        {/* Company */}
                        <div>
                          <label style={labelStyle} htmlFor="contact-company">
                            Company *
                          </label>
                          <input
                            id="contact-company"
                            type="text"
                            value={form.company}
                            onChange={(e) =>
                              updateField("company", e.target.value)
                            }
                            placeholder="Your company"
                            style={inputStyle(!!errors.company)}
                            onFocus={(e) => {
                              e.currentTarget.style.borderColor =
                                "var(--color-accent)";
                            }}
                            onBlur={(e) => {
                              if (!errors.company) {
                                e.currentTarget.style.borderColor =
                                  "var(--color-gray-700)";
                              }
                            }}
                          />
                          {errors.company && (
                            <p style={errorStyle}>{errors.company}</p>
                          )}
                        </div>

                        {/* Budget (optional) */}
                        <div>
                          <label style={labelStyle} htmlFor="contact-budget">
                            Budget (optional)
                          </label>
                          <input
                            id="contact-budget"
                            type="text"
                            value={form.budget}
                            onChange={(e) =>
                              updateField("budget", e.target.value)
                            }
                            placeholder="e.g. $10k - $50k"
                            style={inputStyle(false)}
                            onFocus={(e) => {
                              e.currentTarget.style.borderColor =
                                "var(--color-accent)";
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor =
                                "var(--color-gray-700)";
                            }}
                          />
                        </div>

                        {/* Timeline (optional) */}
                        <div>
                          <label style={labelStyle} htmlFor="contact-timeline">
                            Timeline (optional)
                          </label>
                          <input
                            id="contact-timeline"
                            type="text"
                            value={form.timeline}
                            onChange={(e) =>
                              updateField("timeline", e.target.value)
                            }
                            placeholder="e.g. 3 months"
                            style={inputStyle(false)}
                            onFocus={(e) => {
                              e.currentTarget.style.borderColor =
                                "var(--color-accent)";
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor =
                                "var(--color-gray-700)";
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Navigation Buttons ────────────────────── */}
                <div
                  className="mt-8 flex items-center gap-3"
                  style={{
                    borderTop: "1px solid var(--color-gray-700)",
                    paddingTop: "var(--space-6)",
                  }}
                >
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="btn btn-ghost"
                    >
                      ← BACK
                    </button>
                  )}

                  <div style={{ marginLeft: "auto" }}>
                    {step < 3 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="btn btn-primary"
                      >
                        NEXT →
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="btn btn-primary"
                      >
                        SUBMIT INQUIRY →
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
