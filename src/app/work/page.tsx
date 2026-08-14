import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Project, Industry, Service } from "@/lib/supabase/types";

// ── Types ────────────────────────────────────────────────────────

type ProjectWithRelations = Project & {
  industry: Industry | null;
  service: Service | null;
};

// ── Metadata ─────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Work",
  description:
    "Software systems we've built for businesses that have outgrown manual work. Explore our case studies in automation, business systems, and intelligent software.",
  openGraph: {
    title: "Work | ByteBuildIT",
    description:
      "Software systems we've built for businesses that have outgrown manual work.",
  },
};

// ── Category Color Map ───────────────────────────────────────────

const ACCENT_COLORS: Record<string, string> = {
  commerce: "#2E4AF9",
  healthcare: "#22C55E",
  fleet: "#F59E0B",
  hr: "#A78BFA",
  fintech: "#EC4899",
  education: "#06B6D4",
  default: "#2E4AF9",
};

function getAccentForProject(project: ProjectWithRelations): string {
  const category = project.industry?.slug ?? project.service?.slug ?? "";
  for (const [key, color] of Object.entries(ACCENT_COLORS)) {
    if (category.includes(key)) return color;
  }
  return ACCENT_COLORS.default;
}

// ── Page Component ───────────────────────────────────────────────

export default async function WorkPage() {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("*, industry:industries(*), service:services(*)")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  const typedProjects = (projects ?? []) as ProjectWithRelations[];

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
        <div style={{ marginBottom: "var(--space-16)" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-sm)",
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-accent)",
              marginBottom: "var(--space-6)",
              display: "block",
            }}
          >
            01
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
            SYSTEMS
            <br />
            WE&apos;VE{" "}
            <span style={{ color: "var(--color-accent)" }}>BUILT</span>
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
            Each system begins with a broken process and ends with connected
            software that changes how a business operates.
          </p>
        </div>

        {/* ── Projects Grid ──────────────────────────────── */}
        {typedProjects.length > 0 ? (
          <div
            className="grid gap-8"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 560px), 1fr))" }}
          >
            {typedProjects.map((project) => {
              const accent = getAccentForProject(project);

              return (
                <Link
                  key={project.id}
                  href={`/work/${project.slug}`}
                  className="group block"
                  style={{ textDecoration: "none" }}
                >
                  <article
                    style={{
                      backgroundColor: "var(--color-deep-navy)",
                      border: "1px solid var(--color-gray-700)",
                      borderRadius: "var(--radius-lg)",
                      overflow: "hidden",
                      transition: "all var(--duration-normal) var(--ease-default)",
                    }}
                  >
                    {/* Visual placeholder */}
                    <div
                      className="relative overflow-hidden"
                      style={{
                        aspectRatio: "16 / 9",
                        background: `linear-gradient(135deg, var(--color-deep-navy) 0%, var(--color-deep-navy) 50%, ${accent}15 100%)`,
                      }}
                    >
                      {/* Grid pattern overlay */}
                      <div
                        className="absolute inset-0 opacity-[0.04]"
                        style={{
                          backgroundImage:
                            "linear-gradient(var(--color-light) 1px, transparent 1px), linear-gradient(90deg, var(--color-light) 1px, transparent 1px)",
                          backgroundSize: "48px 48px",
                        }}
                      />

                      {/* Corner accents */}
                      <div
                        className="absolute"
                        style={{
                          top: "16px",
                          left: "16px",
                          width: "32px",
                          height: "32px",
                          borderTop: `2px solid ${accent}40`,
                          borderLeft: `2px solid ${accent}40`,
                        }}
                      />
                      <div
                        className="absolute"
                        style={{
                          bottom: "16px",
                          right: "16px",
                          width: "32px",
                          height: "32px",
                          borderBottom: `2px solid ${accent}40`,
                          borderRight: `2px solid ${accent}40`,
                        }}
                      />

                      {/* Project name centered */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "var(--text-xs)",
                            fontWeight: 500,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: accent,
                            marginBottom: "var(--space-2)",
                            opacity: 0.85,
                          }}
                        >
                          {project.description?.slice(0, 60) ?? project.title}
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 700,
                            fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                            lineHeight: 1.1,
                            letterSpacing: "-0.02em",
                            color: "var(--color-light)",
                          }}
                        >
                          {project.title}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div style={{ padding: "var(--space-6)" }}>
                      {/* Category */}
                      <p
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "var(--text-xs)",
                          fontWeight: 500,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "var(--color-muted)",
                          marginBottom: "var(--space-2)",
                        }}
                      >
                        {[
                          project.industry?.name,
                          project.service?.name,
                        ]
                          .filter(Boolean)
                          .join(" / ") || "PROJECT"}
                      </p>

                      {/* Title */}
                      <h2
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 700,
                          fontSize: "var(--text-2xl)",
                          lineHeight: 1.15,
                          letterSpacing: "-0.02em",
                          color: "var(--color-light)",
                          marginBottom: "var(--space-3)",
                        }}
                      >
                        {project.title}
                      </h2>

                      {/* Description */}
                      {project.description && (
                        <p
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "var(--text-sm)",
                            lineHeight: 1.6,
                            color: "var(--color-muted)",
                            marginBottom: "var(--space-4)",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {project.description}
                        </p>
                      )}

                      {/* Tags */}
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "11px",
                                fontWeight: 500,
                                letterSpacing: "0.03em",
                                color: accent,
                                backgroundColor: `${accent}10`,
                                border: `1px solid ${accent}25`,
                                borderRadius: "var(--radius-full)",
                                padding: "4px 12px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        ) : (
          /* Empty state */
          <div
            style={{
              padding: "var(--space-16) var(--space-6)",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-2xl)",
                fontWeight: 600,
                color: "var(--color-muted)",
                marginBottom: "var(--space-4)",
              }}
            >
              Projects coming soon.
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-base)",
                color: "var(--color-gray-500)",
              }}
            >
              We&apos;re currently building case studies for our portfolio.
            </p>
          </div>
        )}

        {/* ── CTA ─────────────────────────────────────────── */}
        <div
          style={{
            marginTop: "var(--space-24)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
              lineHeight: 1.3,
              letterSpacing: "-0.02em",
              color: "var(--color-muted)",
              marginBottom: "var(--space-8)",
            }}
          >
            YOUR SYSTEM{" "}
            <span style={{ color: "var(--color-accent)" }}>COULD BE NEXT.</span>
          </p>

          <Link
            href="/contact"
            className="btn btn-primary"
            style={{
              padding: "var(--space-3) var(--space-8)",
              textDecoration: "none",
            }}
          >
            LET&apos;S BUILD YOURS &rarr;
          </Link>
        </div>
      </div>
    </main>
  );
}
