import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { generateMetadata as buildMetadata } from "@/lib/seo";
import type { Project, Industry, Service } from "@/lib/supabase/types";

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
    .from("projects")
    .select("title, slug, description, thumbnail_url, updated_at, published_at")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!data) return {};

  const p = data as Pick<Project, "title" | "slug" | "description" | "thumbnail_url" | "updated_at" | "published_at">;

  return buildMetadata({
    title: p.title,
    slug: `work/${p.slug}`,
    description: p.description,
    thumbnail_url: p.thumbnail_url,
    updated_at: p.updated_at,
    published_at: p.published_at,
  });
}

// ── Page Component ───────────────────────────────────────────────

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*, industry:industries(*), service:services(*)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!project) {
    notFound();
  }

  const current = project as ProjectWithRelations;

  // Fetch adjacent projects for navigation
  const { data: allProjects } = await supabase
    .from("projects")
    .select("slug, title")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  const typedAll = (allProjects ?? []) as { slug: string; title: string }[];
  const currentIndex = typedAll.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex < typedAll.length - 1 ? typedAll[currentIndex + 1] : null;
  const nextProject = currentIndex > 0 ? typedAll[currentIndex - 1] : null;

  const accent = "#2E4AF9";
  const categoryLabel = [current.industry?.name, current.service?.name]
    .filter(Boolean)
    .join(" / ") || "PROJECT";

  // Parse content into sections if it exists
  const sections = current.content ? parseContentSections(current.content) : [];

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

      <article className="relative z-10">
        {/* ── Project Hero ────────────────────────────────── */}
        <div
          className="mx-auto"
          style={{
            maxWidth: "var(--container-max)",
            padding: "var(--space-32) var(--space-6) var(--space-16)",
          }}
        >
          {/* Back link */}
          <Link
            href="/work"
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
              marginBottom: "var(--space-8)",
              transition: "color var(--duration-normal) var(--ease-default)",
            }}
          >
            &larr; ALL PROJECTS
          </Link>

          {/* Category */}
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
            {categoryLabel}
          </span>

          {/* Title */}
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "var(--color-light)",
              marginBottom: "var(--space-6)",
              maxWidth: "800px",
            }}
          >
            {current.title}
          </h1>

          {/* Accent bar */}
          <div
            style={{
              width: "48px",
              height: "2px",
              backgroundColor: accent,
              marginBottom: "var(--space-8)",
            }}
          />

          {/* Description */}
          {current.description && (
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
                lineHeight: 1.7,
                color: "var(--color-muted)",
                maxWidth: "640px",
                marginBottom: "var(--space-8)",
              }}
            >
              {current.description}
            </p>
          )}

          {/* Meta info */}
          <div
            className="flex flex-wrap gap-6"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              letterSpacing: "0.04em",
              color: "var(--color-muted)",
            }}
          >
            {current.completed_at && (
              <div>
                <span style={{ display: "block", marginBottom: "var(--space-1)", color: "var(--color-gray-500)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Completed
                </span>
                <span style={{ color: "var(--color-light)" }}>
                  {new Date(current.completed_at).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
            {current.live_url && (
              <div>
                <span style={{ display: "block", marginBottom: "var(--space-1)", color: "var(--color-gray-500)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Live
                </span>
                <a
                  href={current.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: accent,
                    textDecoration: "none",
                    transition: "color var(--duration-normal) var(--ease-default)",
                  }}
                >
                  View Live &rarr;
                </a>
              </div>
            )}
          </div>
        </div>

        {/* ── Visual Placeholder ──────────────────────────── */}
        <div
          className="mx-auto overflow-hidden"
          style={{
            maxWidth: "var(--container-max)",
            padding: "0 var(--space-6)",
            marginBottom: "var(--space-24)",
          }}
        >
          <div
            className="relative overflow-hidden"
            style={{
              borderRadius: "var(--radius-xl)",
              aspectRatio: "16 / 9",
              background: `linear-gradient(135deg, var(--color-deep-navy) 0%, var(--color-deep-navy) 40%, ${accent}12 100%)`,
            }}
          >
            {/* Grid pattern */}
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
                top: "24px",
                left: "24px",
                width: "48px",
                height: "48px",
                borderTop: `2px solid ${accent}40`,
                borderLeft: `2px solid ${accent}40`,
              }}
            />
            <div
              className="absolute"
              style={{
                bottom: "24px",
                right: "24px",
                width: "48px",
                height: "48px",
                borderBottom: `2px solid ${accent}40`,
                borderRight: `2px solid ${accent}40`,
              }}
            />

            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: accent,
                  marginBottom: "var(--space-3)",
                  opacity: 0.85,
                }}
              >
                {categoryLabel}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "clamp(2rem, 4vw, 3.5rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  color: "var(--color-light)",
                }}
              >
                {current.title}
              </span>
            </div>
          </div>
        </div>

        {/* ── Content Sections ────────────────────────────── */}
        {sections.length > 0 && (
          <div
            className="mx-auto"
            style={{
              maxWidth: "var(--container-max)",
              padding: "0 var(--space-6) var(--space-24)",
            }}
          >
            <div style={{ maxWidth: "760px" }}>
              {sections.map((section, i) => (
                <section
                  key={i}
                  style={{ marginBottom: "var(--space-16)" }}
                >
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "clamp(1.25rem, 2vw, 1.75rem)",
                      lineHeight: 1.2,
                      letterSpacing: "-0.02em",
                      color: "var(--color-light)",
                      marginBottom: "var(--space-4)",
                    }}
                  >
                    {section.title}
                  </h2>
                  <div
                    style={{
                      width: "32px",
                      height: "2px",
                      backgroundColor: accent,
                      opacity: 0.5,
                      marginBottom: "var(--space-6)",
                    }}
                  />
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-base)",
                      lineHeight: 1.8,
                      color: "var(--color-neutral)",
                    }}
                    dangerouslySetInnerHTML={{ __html: section.body }}
                  />
                </section>
              ))}
            </div>
          </div>
        )}

        {/* ── Rich Content (if stored as single block) ──────── */}
        {sections.length === 0 && current.content && (
          <div
            className="mx-auto"
            style={{
              maxWidth: "var(--container-max)",
              padding: "0 var(--space-6) var(--space-24)",
            }}
          >
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

        {/* ── Technologies ────────────────────────────────── */}
        {current.technologies && current.technologies.length > 0 && (
          <div
            className="mx-auto"
            style={{
              maxWidth: "var(--container-max)",
              padding: "0 var(--space-6) var(--space-24)",
            }}
          >
            <div
              style={{
                borderTop: "1px solid var(--color-gray-700)",
                paddingTop: "var(--space-12)",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--color-muted)",
                  marginBottom: "var(--space-6)",
                }}
              >
                TECHNOLOGIES
              </h3>
              <div className="flex flex-wrap gap-3">
                {current.technologies.map((tech) => (
                  <span
                    key={tech}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-xs)",
                      fontWeight: 500,
                      letterSpacing: "0.03em",
                      color: accent,
                      backgroundColor: `${accent}10`,
                      border: `1px solid ${accent}25`,
                      borderRadius: "var(--radius-full)",
                      padding: "6px 16px",
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Navigation: Prev / Next ─────────────────────── */}
        {(prevProject || nextProject) && (
          <div
            className="mx-auto"
            style={{
              maxWidth: "var(--container-max)",
              padding: "0 var(--space-6) var(--space-16)",
            }}
          >
            <div
              style={{
                borderTop: "1px solid var(--color-gray-700)",
                paddingTop: "var(--space-12)",
              }}
            >
              <div className="grid gap-8 sm:grid-cols-2">
                {/* Previous */}
                {prevProject ? (
                  <Link
                    href={`/work/${prevProject.slug}`}
                    style={{
                      textDecoration: "none",
                      padding: "var(--space-6)",
                      backgroundColor: "var(--color-deep-navy)",
                      border: "1px solid var(--color-gray-700)",
                      borderRadius: "var(--radius-lg)",
                      transition: "all var(--duration-normal) var(--ease-default)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "var(--text-xs)",
                        fontWeight: 500,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "var(--color-muted)",
                        display: "block",
                        marginBottom: "var(--space-3)",
                      }}
                    >
                      &larr; Previous
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                        fontSize: "var(--text-lg)",
                        color: "var(--color-light)",
                      }}
                    >
                      {prevProject.title}
                    </span>
                  </Link>
                ) : (
                  <div />
                )}

                {/* Next */}
                {nextProject ? (
                  <Link
                    href={`/work/${nextProject.slug}`}
                    style={{
                      textDecoration: "none",
                      padding: "var(--space-6)",
                      backgroundColor: "var(--color-deep-navy)",
                      border: "1px solid var(--color-gray-700)",
                      borderRadius: "var(--radius-lg)",
                      textAlign: "right",
                      transition: "all var(--duration-normal) var(--ease-default)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "var(--text-xs)",
                        fontWeight: 500,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "var(--color-muted)",
                        display: "block",
                        marginBottom: "var(--space-3)",
                      }}
                    >
                      Next &rarr;
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                        fontSize: "var(--text-lg)",
                        color: "var(--color-light)",
                      }}
                    >
                      {nextProject.title}
                    </span>
                  </Link>
                ) : (
                  <div />
                )}
              </div>
            </div>
          </div>
        )}
      </article>
    </main>
  );
}

// ── Content Parsing ──────────────────────────────────────────────

interface ContentSection {
  title: string;
  body: string;
}

/**
 * Parse structured content from the project's content field.
 * Supports section headers marked with ## or h2 tags followed by content.
 */
function parseContentSections(content: string): ContentSection[] {
  if (!content) return [];

  // Try splitting by h2 tags first (HTML content)
  const h2Split = content.split(/<h2[^>]*>(.*?)<\/h2>/i);
  if (h2Split.length > 1) {
    const sections: ContentSection[] = [];
    for (let i = 1; i < h2Split.length; i += 2) {
      const title = h2Split[i].replace(/<[^>]*>/g, "").trim();
      const body = h2Split[i + 1]?.trim() ?? "";
      if (title) {
        sections.push({ title, body });
      }
    }
    if (sections.length > 0) return sections;
  }

  // Try splitting by markdown-style ## headers
  const mdSplit = content.split(/^##\s+(.+)$/m);
  if (mdSplit.length > 1) {
    const sections: ContentSection[] = [];
    for (let i = 1; i < mdSplit.length; i += 2) {
      const title = mdSplit[i]?.trim() ?? "";
      const body = mdSplit[i + 1]?.trim() ?? "";
      if (title) {
        sections.push({ title, body: `<p>${body.replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br/>")}</p>` });
      }
    }
    if (sections.length > 0) return sections;
  }

  // No structured sections found
  return [];
}
