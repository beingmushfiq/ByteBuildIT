import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Solution } from "@/lib/supabase/types";

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
}

const CATEGORIES: SolutionCategory[] = [
  {
    id: "business-systems",
    title: "Business Systems",
    description:
      "Dashboards, ERPs, and operational platforms that centralize your business data and surface what matters.",
    accent: "#2E4AF9",
  },
  {
    id: "industry-software",
    title: "Industry Software",
    description:
      "Domain-specific tools built around the workflows, regulations, and language of your industry.",
    accent: "#22C55E",
  },
  {
    id: "automation",
    title: "Automation",
    description:
      "End-to-end workflows that eliminate manual handoffs, reduce errors, and run without supervision.",
    accent: "#F59E0B",
  },
  {
    id: "ai-intelligence",
    title: "AI & Intelligence",
    description:
      "Data pipelines, classification engines, and intelligent systems that learn from your operations.",
    accent: "#A78BFA",
  },
  {
    id: "digital-products",
    title: "Digital Products",
    description:
      "Customer-facing applications designed for scale, usability, and seamless multi-platform delivery.",
    accent: "#EC4899",
  },
  {
    id: "infrastructure",
    title: "Infrastructure",
    description:
      "Cloud-native architectures, CI/CD pipelines, and monitoring systems that keep everything running.",
    accent: "#06B6D4",
  },
];

// ── Group solutions by matching category keywords ────────────────

function groupSolutions(solutions: Solution[]): Map<string, Solution[]> {
  const grouped = new Map<string, Solution[]>();

  // Initialize all categories
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

    // Default to first category if no match
    if (!matched) {
      grouped.get(CATEGORIES[0].id)!.push(solution);
    }
  }

  return grouped;
}

// ── Page Component ───────────────────────────────────────────────

export default async function SolutionsPage() {
  const supabase = await createClient();

  const { data: solutionsData } = await supabase
    .from("solutions")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  const solutions = (solutionsData ?? []) as Solution[];
  const grouped = groupSolutions(solutions);

  return (
    <main style={{ backgroundColor: "var(--color-primary)", minHeight: "100vh" }}>
      {/* Background dot grid */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.025]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--color-light) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div
        className="relative z-10 mx-auto"
        style={{
          maxWidth: "var(--container-max)",
          padding: "var(--space-32) var(--space-6) var(--space-24)",
        }}
      >
        {/* ── Page Header ─────────────────────────────────── */}
        <div style={{ marginBottom: "var(--space-20)" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-sm)",
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-accent)",
              display: "block",
              marginBottom: "var(--space-6)",
            }}
          >
            02
          </span>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "var(--color-light)",
              marginBottom: "var(--space-4)",
            }}
          >
            WHAT WE{" "}
            <span style={{ color: "var(--color-accent)" }}>BUILD</span>
          </h1>

          <div
            style={{
              width: "48px",
              height: "2px",
              backgroundColor: "var(--color-accent)",
              marginBottom: "var(--space-8)",
            }}
          />

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(1rem, 1.3vw, 1.125rem)",
              lineHeight: 1.7,
              color: "var(--color-muted)",
              maxWidth: "560px",
            }}
          >
            From workflow to software. We build across six solution categories,
            each designed around how your business actually operates.
          </p>
        </div>

        {/* ── Categories ──────────────────────────────────── */}
        <div className="grid gap-12 lg:gap-16">
          {CATEGORIES.map((category) => {
            const categorySolutions = grouped.get(category.id) ?? [];

            return (
              <section key={category.id}>
                {/* Category Header */}
                <div style={{ marginBottom: "var(--space-8)" }}>
                  <div
                    className="flex items-center gap-3"
                    style={{ marginBottom: "var(--space-3)" }}
                  >
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "var(--radius-full)",
                        backgroundColor: category.accent,
                      }}
                    />
                    <h2
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
                        lineHeight: 1.2,
                        letterSpacing: "-0.02em",
                        color: "var(--color-light)",
                      }}
                    >
                      {category.title}
                    </h2>
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-sm)",
                      lineHeight: 1.7,
                      color: "var(--color-muted)",
                      maxWidth: "480px",
                    }}
                  >
                    {category.description}
                  </p>
                </div>

                {/* Solutions in this category */}
                {categorySolutions.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {categorySolutions.map((solution) => (
                      <Link
                        key={solution.id}
                        href={`/solutions/${solution.slug}`}
                        style={{ textDecoration: "none" }}
                      >
                        <div
                          style={{
                            backgroundColor: "var(--color-deep-navy)",
                            border: "1px solid var(--color-gray-700)",
                            borderRadius: "var(--radius-lg)",
                            padding: "var(--space-6)",
                            height: "100%",
                            transition:
                              "all var(--duration-normal) var(--ease-default)",
                          }}
                        >
                          {/* Icon placeholder */}
                          {solution.icon_name && (
                            <div
                              className="mb-3 flex h-10 w-10 items-center justify-center"
                              style={{
                                backgroundColor: `${category.accent}12`,
                                border: `1px solid ${category.accent}30`,
                                borderRadius: "var(--radius-md)",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "var(--text-lg)",
                                  color: category.accent,
                                }}
                              >
                                ●
                              </span>
                            </div>
                          )}

                          <h3
                            style={{
                              fontFamily: "var(--font-display)",
                              fontWeight: 600,
                              fontSize: "var(--text-lg)",
                              lineHeight: 1.3,
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
                                fontSize: "var(--text-sm)",
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

                          {/* Features preview */}
                          {solution.features &&
                            solution.features.length > 0 && (
                              <div
                                className="mt-4 flex flex-wrap gap-2"
                              >
                                {solution.features.slice(0, 3).map((feature) => (
                                  <span
                                    key={feature}
                                    style={{
                                      fontFamily: "var(--font-mono)",
                                      fontSize: "10px",
                                      fontWeight: 500,
                                      letterSpacing: "0.03em",
                                      color: category.accent,
                                      backgroundColor: `${category.accent}10`,
                                      border: `1px solid ${category.accent}20`,
                                      borderRadius: "var(--radius-full)",
                                      padding: "3px 10px",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            )}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-sm)",
                      color: "var(--color-gray-500)",
                      fontStyle: "italic",
                    }}
                  >
                    Solutions in this category coming soon.
                  </p>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
