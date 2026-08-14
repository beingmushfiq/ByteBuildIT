import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { generateMetadata as buildMetadata } from "@/lib/seo";
import type { Solution, Project, Industry, Service } from "@/lib/supabase/types";

// ── Types ────────────────────────────────────────────────────────

type ProjectWithRelations = Project & {
  industry: Industry | null;
  service: Service | null;
};

// ── Metadata ─────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("solutions")
    .select("title, slug, description, updated_at, published_at")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!data) return {};

  const s = data as Pick<Solution, "title" | "slug" | "description" | "updated_at">;

  return buildMetadata({
    title: s.title,
    slug: `solutions/${s.slug}`,
    description: s.description,
    updated_at: s.updated_at,
  });
}

// ── Category Accent Map ──────────────────────────────────────────

function getAccentForSolution(solution: Solution): string {
  const combined = `${solution.title} ${solution.description ?? ""}`.toLowerCase();
  if (combined.includes("business") || combined.includes("system")) return "#2E4AF9";
  if (combined.includes("industry")) return "#22C55E";
  if (combined.includes("automat")) return "#F59E0B";
  if (combined.includes("ai") || combined.includes("intellig")) return "#A78BFA";
  if (combined.includes("digital") || combined.includes("product")) return "#EC4899";
  if (combined.includes("infra")) return "#06B6D4";
  return "#2E4AF9";
}

// ── Page Component ───────────────────────────────────────────────

export default async function SolutionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: solution } = await supabase
    .from("solutions")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!solution) {
    notFound();
  }

  const current = solution as Solution;
  const accent = getAccentForSolution(current);

  // Fetch related projects (via service matching)
  const { data: services } = await supabase
    .from("services")
    .select("id")
    .eq("slug", slug)
    .limit(1);

  let relatedProjects: ProjectWithRelations[] = [];
  if (services && services.length > 0) {
    const serviceId = (services[0] as { id: string }).id;
    const { data: projectsData } = await supabase
      .from("projects")
      .select("*, industry:industries(*), service:services(*)")
      .eq("service_id", serviceId)
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(4);

    relatedProjects = (projectsData ?? []) as ProjectWithRelations[];
  }

  return (
    <main style={{ backgroundColor: "var(--color-primary)", minHeight: "100vh" }}>
      {/* Background grid */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.02]"
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
        {/* ── Back Link ──────────────────────────────────── */}
        <Link
          href="/solutions"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            fontWeight: 500,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-2)",
            marginBottom: "var(--space-12)",
          }}
        >
          &larr; ALL SOLUTIONS
        </Link>

        {/* ── Hero ───────────────────────────────────────── */}
        <div style={{ marginBottom: "var(--space-20)" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: accent,
              display: "block",
              marginBottom: "var(--space-4)",
            }}
          >
            SOLUTION
          </span>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "var(--color-light)",
              marginBottom: "var(--space-6)",
              maxWidth: "700px",
            }}
          >
            {current.title}
          </h1>

          <div
            style={{
              width: "48px",
              height: "2px",
              backgroundColor: accent,
              marginBottom: "var(--space-8)",
            }}
          />

          {current.description && (
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
                lineHeight: 1.7,
                color: "var(--color-muted)",
                maxWidth: "640px",
              }}
            >
              {current.description}
            </p>
          )}
        </div>

        {/* ── Capabilities / Features ─────────────────────── */}
        {current.features && current.features.length > 0 && (
          <div style={{ marginBottom: "var(--space-20)" }}>
            <h2
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                fontWeight: 500,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-muted)",
                marginBottom: "var(--space-8)",
              }}
            >
              CAPABILITIES
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {current.features.map((feature, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: "var(--color-deep-navy)",
                    border: "1px solid var(--color-gray-700)",
                    borderRadius: "var(--radius-lg)",
                    padding: "var(--space-5)",
                  }}
                >
                  <div
                    className="flex items-start gap-3"
                  >
                    <div
                      className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center"
                      style={{
                        backgroundColor: `${accent}12`,
                        border: `1px solid ${accent}30`,
                        borderRadius: "var(--radius-sm)",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "10px",
                          fontWeight: 600,
                          color: accent,
                        }}
                      >
                        {i + 1}
                      </span>
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "var(--text-sm)",
                        lineHeight: 1.6,
                        color: "var(--color-neutral)",
                      }}
                    >
                      {feature}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Content ────────────────────────────────────── */}
        {current.content && (
          <div style={{ marginBottom: "var(--space-24)" }}>
            <div
              style={{
                maxWidth: "760px",
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-base)",
                lineHeight: 1.8,
                color: "var(--color-neutral)",
              }}
              dangerouslySetInnerHTML={{ __html: current.content }}
            />
          </div>
        )}

        {/* ── Related Projects ───────────────────────────── */}
        {relatedProjects.length > 0 && (
          <div>
            <div
              style={{
                borderTop: "1px solid var(--color-gray-700)",
                paddingTop: "var(--space-16)",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--color-muted)",
                  marginBottom: "var(--space-8)",
                }}
              >
                RELATED PROJECTS
              </h2>

              <div className="grid gap-6 sm:grid-cols-2">
                {relatedProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/work/${project.slug}`}
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
                      <p
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "var(--text-xs)",
                          fontWeight: 500,
                          letterSpacing: "0.06em",
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
                      <h3
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 600,
                          fontSize: "var(--text-lg)",
                          color: "var(--color-light)",
                          marginBottom: "var(--space-2)",
                        }}
                      >
                        {project.title}
                      </h3>
                      {project.description && (
                        <p
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "var(--text-sm)",
                            lineHeight: 1.6,
                            color: "var(--color-muted)",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {project.description}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── CTA ────────────────────────────────────────── */}
        <div
          style={{
            marginTop: "var(--space-24)",
            padding: "var(--space-12)",
            backgroundColor: "var(--color-deep-navy)",
            borderRadius: "var(--radius-xl)",
            border: "1px solid var(--color-gray-700)",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              color: "var(--color-light)",
              marginBottom: "var(--space-4)",
            }}
          >
            NEED THIS FOR YOUR BUSINESS?
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-base)",
              color: "var(--color-muted)",
              marginBottom: "var(--space-8)",
              maxWidth: "440px",
              margin: "0 auto var(--space-8)",
              lineHeight: 1.6,
            }}
          >
            Tell us about your process and we&apos;ll figure out what it could become.
          </p>
          <Link
            href="/contact"
            className="btn btn-primary"
            style={{
              padding: "var(--space-3) var(--space-8)",
              textDecoration: "none",
            }}
          >
            START A PROJECT &rarr;
          </Link>
        </div>
      </div>
    </main>
  );
}
