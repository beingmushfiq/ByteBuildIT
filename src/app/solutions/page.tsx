import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Solution } from "@/lib/supabase/types";
import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/sections/Footer";

// ── Metadata ─────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Software solutions for business systems, industry-specific tools, automation, AI & intelligence, digital products, and infrastructure.",
  openGraph: {
    title: "Solutions | ByteBuildIT",
    description:
      "Software solutions across business systems, automation, AI, digital products, and infrastructure.",
  },
};

// ── Category Definitions ─────────────────────────────────────────

interface SolutionCategory {
  id: string;
  title: string;
  description: string;
  accent: string;
  defaultCapabilities: string[];
}

const CATEGORIES: SolutionCategory[] = [
  {
    id: "business-systems",
    title: "Business Systems & Operations",
    description:
      "Dashboards, ERPs, and operational platforms that centralize your business data and surface what matters.",
    accent: "#2E4AF9",
    defaultCapabilities: ["Custom ERP", "Centralized Data Hub", "Permission Matrices", "Audit Trails"],
  },
  {
    id: "industry-software",
    title: "Industry & Domain Software",
    description:
      "Domain-specific tools built around the workflows, regulations, and language of your vertical.",
    accent: "#7C3AED",
    defaultCapabilities: ["Field Logistics", "Manufacturing Execution", "Clinical Portals", "Custom Inventory"],
  },
  {
    id: "automation",
    title: "Workflow & Event Automation",
    description:
      "End-to-end workflows that eliminate manual handoffs, reduce errors, and run without supervision.",
    accent: "#059669",
    defaultCapabilities: ["Webhook Integrations", "Async Workers", "Data Sync", "Error Reconciliation"],
  },
  {
    id: "ai-intelligence",
    title: "Applied AI & Intelligence",
    description:
      "Data pipelines, document extraction, and intelligent systems that automate cognitive tasks.",
    accent: "#D97706",
    defaultCapabilities: ["Document OCR", "LLM Reasoning", "Anomaly Detection", "Automated Triage"],
  },
  {
    id: "digital-products",
    title: "SaaS & Digital Products",
    description:
      "Customer-facing applications designed for scale, usability, and seamless multi-platform delivery.",
    accent: "#EC4899",
    defaultCapabilities: ["Multi-Tenant DB", "Stripe Billing", "User Auth", "Customer Portals"],
  },
  {
    id: "infrastructure",
    title: "Cloud & Infrastructure Systems",
    description:
      "Cloud-native architectures, CI/CD pipelines, and monitoring systems that keep everything reliable.",
    accent: "#0F766E",
    defaultCapabilities: ["PostgreSQL", "Edge Workers", "99.9% Uptime", "Zero-Downtime Deploy"],
  },
];

// ── Group solutions by matching category keywords ────────────────

function groupSolutions(solutions: Solution[]): Map<string, Solution[]> {
  const grouped = new Map<string, Solution[]>();

  for (const cat of CATEGORIES) {
    grouped.set(cat.id, []);
  }

  for (const solution of solutions) {
    const title = solution.title.toLowerCase();
    const desc = (solution.description ?? "").toLowerCase();
    const combined = `${title} ${desc}`;

    let matched = false;
    for (const cat of CATEGORIES) {
      const keywords = cat.id.split("-");
      if (keywords.some((kw) => combined.includes(kw))) {
        grouped.get(cat.id)!.push(solution);
        matched = true;
        break;
      }
    }

    if (!matched) {
      grouped.get(CATEGORIES[0].id)!.push(solution);
    }
  }

  return grouped;
}

// ── Page Component ───────────────────────────────────────────────

export default async function SolutionsPage() {
  let solutions: Solution[] = [];
  try {
    const supabase = await createClient();
    const { data: solutionsData } = await supabase
      .from("solutions")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("title", { ascending: true });

    solutions = (solutionsData ?? []) as Solution[];
  } catch {
    solutions = [];
  }

  const grouped = groupSolutions(solutions);

  return (
    <>
      <Navigation />
      <main style={{ backgroundColor: "var(--color-bg-base)", minHeight: "100vh" }}>
        <div
          className="container"
          style={{
            paddingTop: "var(--space-32)",
            paddingBottom: "var(--space-24)",
          }}
        >
          {/* Page Header */}
          <div style={{ maxWidth: "700px", marginBottom: "var(--space-16)" }}>
            <span className="section-label" style={{ marginBottom: "var(--space-4)", display: "inline-block" }}>
              Engineering Capabilities
            </span>

            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.035em",
                color: "var(--color-light)",
                marginBottom: "var(--space-4)",
              }}
            >
              WHAT WE <span style={{ color: "var(--color-accent)" }}>BUILD</span>
            </h1>

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(1rem, 1.3vw, 1.15rem)",
                lineHeight: 1.7,
                color: "var(--color-muted)",
              }}
            >
              From raw business friction to production software. We engineer systems across six core
              capability domains, purpose-built around your exact operational realities.
            </p>
          </div>

          {/* Categories */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-16)" }}>
            {CATEGORIES.map((category) => {
              const categorySolutions = grouped.get(category.id) ?? [];

              return (
                <section
                  key={category.id}
                  className="glass-card"
                  style={{
                    padding: "var(--space-8)",
                    borderRadius: "var(--radius-2xl)",
                    backgroundColor: "var(--color-bg-card)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  {/* Category Header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "var(--space-4)",
                      marginBottom: "var(--space-6)",
                      paddingBottom: "var(--space-4)",
                      borderBottom: "1px solid var(--color-border)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span
                        style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          backgroundColor: category.accent,
                          boxShadow: `0 0 10px ${category.accent}`,
                        }}
                      />
                      <h2
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 800,
                          fontSize: "clamp(1.35rem, 2.5vw, 1.85rem)",
                          letterSpacing: "-0.02em",
                          color: "var(--color-light)",
                        }}
                      >
                        {category.title}
                      </h2>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {category.defaultCapabilities.map((cap) => (
                        <span
                          key={cap}
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "10px",
                            padding: "3px 8px",
                            borderRadius: "var(--radius-xs)",
                            backgroundColor: "var(--color-bg-subtle)",
                            border: "1px solid var(--color-border)",
                            color: "var(--color-muted)",
                          }}
                        >
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "1rem",
                      lineHeight: 1.65,
                      color: "var(--color-muted)",
                      marginBottom: "var(--space-6)",
                      maxWidth: "680px",
                    }}
                  >
                    {category.description}
                  </p>

                  {/* Solutions in this category if available */}
                  {categorySolutions.length > 0 && (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr",
                        gap: "var(--space-4)",
                      }}
                      className="sm:!grid-cols-2 lg:!grid-cols-3"
                    >
                      {categorySolutions.map((solution) => (
                        <Link
                          key={solution.id}
                          href={`/solutions/${solution.slug}`}
                          style={{ textDecoration: "none" }}
                        >
                          <div
                            style={{
                              backgroundColor: "var(--color-bg-subtle)",
                              border: "1px solid var(--color-border)",
                              borderRadius: "var(--radius-xl)",
                              padding: "var(--space-6)",
                              height: "100%",
                              transition: "all 200ms ease",
                            }}
                          >
                            <h3
                              style={{
                                fontFamily: "var(--font-display)",
                                fontWeight: 700,
                                fontSize: "1.1rem",
                                color: "var(--color-light)",
                                marginBottom: "var(--space-2)",
                              }}
                            >
                              {solution.title}
                            </h3>

                            {solution.description && (
                              <p
                                style={{
                                  fontFamily: "var(--font-body)",
                                  fontSize: "13px",
                                  lineHeight: 1.6,
                                  color: "var(--color-muted)",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 3,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                }}
                              >
                                {solution.description}
                              </p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
