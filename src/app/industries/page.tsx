import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Industry } from "@/lib/supabase/types";

// ── Metadata ─────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Industries",
  description:
    "We build software for specific industries, understanding their unique workflows, regulations, and challenges.",
  openGraph: {
    title: "Industries | ByteBuildIT",
    description:
      "We build software for specific industries, understanding their unique workflows, regulations, and challenges.",
  },
};

// ── Industry Icon Map ────────────────────────────────────────────

const INDUSTRY_ICONS: Record<string, string> = {
  healthcare: "⚕",
  manufacturing: "⚙",
  logistics: "🚛",
  finance: "💳",
  education: "📚",
  retail: "🛒",
  agriculture: "🌱",
  construction: "🏗",
  energy: "⚡",
  technology: "💻",
};

function getIndustryIcon(industry: Industry): string {
  const slug = industry.slug.toLowerCase();
  for (const [key, icon] of Object.entries(INDUSTRY_ICONS)) {
    if (slug.includes(key)) return icon;
  }
  return industry.icon_name ?? "◆";
}

// ── Accent Colors ────────────────────────────────────────────────

const INDUSTRY_ACCENTS = [
  "#2E4AF9",
  "#22C55E",
  "#F59E0B",
  "#A78BFA",
  "#EC4899",
  "#06B6D4",
  "#EF4444",
  "#14B8A6",
];

function getAccentForIndex(index: number): string {
  return INDUSTRY_ACCENTS[index % INDUSTRY_ACCENTS.length];
}

// ── Page Component ───────────────────────────────────────────────

export default async function IndustriesPage() {
  const supabase = await createClient();

  const { data: industriesData } = await supabase
    .from("industries")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  const industries = (industriesData ?? []) as Industry[];

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
            03
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
            INDUSTRIES
            <br />
            WE{" "}
            <span style={{ color: "var(--color-accent)" }}>SERVE</span>
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
            We build domain-specific software that understands the unique
            workflows, regulations, and language of your industry.
          </p>
        </div>

        {/* ── Industries Grid ─────────────────────────────── */}
        {industries.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry, i) => {
              const accent = getAccentForIndex(i);
              const icon = getIndustryIcon(industry);

              return (
                <Link
                  key={industry.id}
                  href={`/industries/${industry.slug}`}
                  style={{ textDecoration: "none" }}
                >
                  <article
                    style={{
                      backgroundColor: "var(--color-deep-navy)",
                      border: "1px solid var(--color-gray-700)",
                      borderRadius: "var(--radius-lg)",
                      padding: "var(--space-8)",
                      height: "100%",
                      transition:
                        "all var(--duration-normal) var(--ease-default)",
                    }}
                  >
                    {/* Icon */}
                    <div
                      className="mb-5 flex h-12 w-12 items-center justify-center"
                      style={{
                        backgroundColor: `${accent}12`,
                        border: `1px solid ${accent}25`,
                        borderRadius: "var(--radius-lg)",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "var(--text-xl)",
                          lineHeight: 1,
                        }}
                        aria-hidden="true"
                      >
                        {icon}
                      </span>
                    </div>

                    {/* Name */}
                    <h2
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: "var(--text-xl)",
                        lineHeight: 1.2,
                        letterSpacing: "-0.01em",
                        color: "var(--color-light)",
                        marginBottom: "var(--space-3)",
                      }}
                    >
                      {industry.name}
                    </h2>

                    {/* Description */}
                    {industry.description && (
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
                        {industry.description}
                      </p>
                    )}

                    {/* View link */}
                    <div
                      style={{
                        marginTop: "var(--space-5)",
                        fontFamily: "var(--font-mono)",
                        fontSize: "var(--text-xs)",
                        fontWeight: 500,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: accent,
                      }}
                    >
                      Learn more &rarr;
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
              Industries coming soon.
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-base)",
                color: "var(--color-gray-500)",
              }}
            >
              We&apos;re documenting the industries we serve.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
