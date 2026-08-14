import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { generateMetadata as buildMetadata } from "@/lib/seo";
import type { Industry, Project, Service } from "@/lib/supabase/types";

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
    .from("industries")
    .select("name, slug, description, updated_at, published_at")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!data) return {};

  const ind = data as Pick<Industry, "name" | "slug" | "description" | "updated_at">;

  return buildMetadata({
    title: ind.name,
    slug: `industries/${ind.slug}`,
    description: ind.description,
    updated_at: ind.updated_at,
  });
}

// ── Accent Color ─────────────────────────────────────────────────

function getAccentForIndustry(slug: string): string {
  const s = slug.toLowerCase();
  if (s.includes("health")) return "#22C55E";
  if (s.includes("manufact")) return "#F59E0B";
  if (s.includes("logist") || s.includes("fleet")) return "#06B6D4";
  if (s.includes("financ")) return "#A78BFA";
  if (s.includes("retail") || s.includes("commerce")) return "#EC4899";
  if (s.includes("educat")) return "#2E4AF9";
  return "#2E4AF9";
}

// ── Page Component ───────────────────────────────────────────────

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: industry } = await supabase
    .from("industries")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!industry) {
    notFound();
  }

  const current = industry as Industry;
  const accent = getAccentForIndustry(slug);

  // Fetch related projects for this industry
  const { data: projectsData } = await supabase
    .from("projects")
    .select("*, industry:industries(*), service:services(*)")
    .eq("industry_id", current.id)
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(6);

  const relatedProjects = (projectsData ?? []) as ProjectWithRelations[];

  // Fetch all industries for navigation
  const { data: allIndustries } = await supabase
    .from("industries")
    .select("slug, name")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  const allInds = (allIndustries ?? []) as { slug: string; name: string }[];

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
          href="/industries"
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
          &larr; ALL INDUSTRIES
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
            INDUSTRY
          </span>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "var(--color-light)",
              marginBottom: "var(--space-6)",
              maxWidth: "700px",
            }}
          >
            {current.name}
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

        {/* ── Problems We Solve (generic based on industry) ── */}
        <div style={{ marginBottom: "var(--space-24)" }}>
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
            CHALLENGES WE ADDRESS
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Fragmented data across disconnected tools",
              "Manual processes that don't scale",
              "Lack of real-time visibility into operations",
              "Compliance and reporting overhead",
              "Poor communication between teams",
              "Systems that don't match how work actually happens",
            ].map((challenge, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "var(--color-deep-navy)",
                  border: "1px solid var(--color-gray-700)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-5)",
                }}
              >
                <div className="flex items-start gap-3">
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
                    {challenge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Related Projects ───────────────────────────── */}
        {relatedProjects.length > 0 && (
          <div style={{ marginBottom: "var(--space-24)" }}>
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
                PROJECTS IN THIS INDUSTRY
              </h2>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/work/${project.slug}`}
                    style={{ textDecoration: "none" }}
                  >
                    <article
                      style={{
                        backgroundColor: "var(--color-deep-navy)",
                        border: "1px solid var(--color-gray-700)",
                        borderRadius: "var(--radius-lg)",
                        overflow: "hidden",
                        height: "100%",
                        transition:
                          "all var(--duration-normal) var(--ease-default)",
                      }}
                    >
                      {/* Visual placeholder */}
                      <div
                        className="relative overflow-hidden"
                        style={{
                          aspectRatio: "16 / 9",
                          background: `linear-gradient(135deg, var(--color-deep-navy) 0%, ${accent}10 100%)`,
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span
                            style={{
                              fontFamily: "var(--font-display)",
                              fontWeight: 700,
                              fontSize: "var(--text-xl)",
                              color: "var(--color-light)",
                              letterSpacing: "-0.02em",
                            }}
                          >
                            {project.title}
                          </span>
                        </div>
                      </div>

                      <div style={{ padding: "var(--space-5)" }}>
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
                          {project.service?.name || "PROJECT"}
                        </p>
                        <h3
                          style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 600,
                            fontSize: "var(--text-base)",
                            color: "var(--color-light)",
                          }}
                        >
                          {project.title}
                        </h3>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Other Industries ───────────────────────────── */}
        {allInds.length > 1 && (
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
                OTHER INDUSTRIES
              </h2>

              <div className="flex flex-wrap gap-3">
                {allInds
                  .filter((ind) => ind.slug !== slug)
                  .map((ind) => (
                    <Link
                      key={ind.slug}
                      href={`/industries/${ind.slug}`}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "var(--text-xs)",
                        fontWeight: 500,
                        letterSpacing: "0.04em",
                        color: "var(--color-muted)",
                        backgroundColor: "var(--color-deep-navy)",
                        border: "1px solid var(--color-gray-700)",
                        borderRadius: "var(--radius-full)",
                        padding: "8px 20px",
                        textDecoration: "none",
                        transition:
                          "all var(--duration-normal) var(--ease-default)",
                      }}
                    >
                      {ind.name}
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
            BUILDING FOR {current.name.toUpperCase()}?
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-base)",
              color: "var(--color-muted)",
              maxWidth: "440px",
              margin: "0 auto var(--space-8)",
              lineHeight: 1.6,
            }}
          >
            We understand the unique challenges of your industry. Let&apos;s
            talk about what your software could look like.
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
