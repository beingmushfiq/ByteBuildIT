import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Industry } from "@/lib/supabase/types";
import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/sections/Footer";

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

// ── Fallback Industries ──────────────────────────────────────────

const DEFAULT_INDUSTRIES = [
  {
    slug: "logistics-supply-chain",
    name: "Logistics & Supply Chain",
    icon: "🚛",
    accent: "#2E4AF9",
    description:
      "Fleet coordination, automated barcode dispatch, carrier rate APIs, and multi-hub freight tracking systems.",
  },
  {
    slug: "manufacturing-operations",
    name: "Manufacturing & Assembly",
    icon: "⚙",
    accent: "#7C3AED",
    description:
      "Shop floor telemetry, bill-of-materials traceability, production queue scheduling, and QA exception workflows.",
  },
  {
    slug: "healthcare-clinical",
    name: "Healthcare & Clinical Ops",
    icon: "⚕",
    accent: "#059669",
    description:
      "HIPAA-compliant patient portals, practitioner shift scheduling, medical record sync, and lab test pipelines.",
  },
  {
    slug: "fintech-accounts",
    name: "Fintech & Corporate Finance",
    icon: "💳",
    accent: "#D97706",
    description:
      "Automated accounts payable pipelines, OCR invoice extraction, bank reconciliation webhooks, and audit-proof ledgers.",
  },
  {
    slug: "field-services",
    name: "Field Services & Workforce",
    icon: "🏗",
    accent: "#EC4899",
    description:
      "GPS geofenced clock-in, mobile job dispatch, offline-first technician reports, and instant client sign-off.",
  },
  {
    slug: "commerce-retail",
    name: "Enterprise Commerce",
    icon: "🛒",
    accent: "#0F766E",
    description:
      "Multi-channel inventory sync, automated order routing, ERP connectors, and warehouse fulfillment platforms.",
  },
];

export default async function IndustriesPage() {
  let industries: Industry[] = [];
  try {
    const supabase = await createClient();
    const { data: industriesData } = await supabase
      .from("industries")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    industries = (industriesData ?? []) as Industry[];
  } catch {
    industries = [];
  }

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
          {/* Header */}
          <div style={{ maxWidth: "700px", marginBottom: "var(--space-16)" }}>
            <span className="section-label" style={{ marginBottom: "var(--space-4)", display: "inline-block" }}>
              Domain Specialization
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
              INDUSTRIES WE <span style={{ color: "var(--color-accent)" }}>SERVE</span>
            </h1>

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(1rem, 1.3vw, 1.15rem)",
                lineHeight: 1.7,
                color: "var(--color-muted)",
              }}
            >
              Generic templates fail when operational complexity rises. We build software around
              the strict compliance, edge cases, and terminology of your specific industry.
            </p>
          </div>

          {/* Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "var(--space-6)",
            }}
            className="sm:!grid-cols-2 lg:!grid-cols-3"
          >
            {(industries.length > 0
              ? industries.map((ind, i) => ({
                  slug: ind.slug,
                  name: ind.name,
                  icon: ind.icon_name ?? "◆",
                  accent: DEFAULT_INDUSTRIES[i % DEFAULT_INDUSTRIES.length].accent,
                  description: ind.description ?? "",
                }))
              : DEFAULT_INDUSTRIES
            ).map((item) => (
              <Link
                key={item.slug}
                href={`/industries/${item.slug}`}
                style={{ textDecoration: "none" }}
              >
                <article
                  className="glass-card"
                  style={{
                    backgroundColor: "var(--color-bg-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-2xl)",
                    padding: "var(--space-8)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "all 200ms ease",
                  }}
                >
                  <div>
                    {/* Icon badge */}
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "48px",
                        height: "48px",
                        borderRadius: "var(--radius-xl)",
                        backgroundColor: `${item.accent}15`,
                        border: `1px solid ${item.accent}35`,
                        fontSize: "20px",
                        marginBottom: "var(--space-5)",
                      }}
                    >
                      {item.icon}
                    </div>

                    <h2
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: "1.25rem",
                        lineHeight: 1.25,
                        letterSpacing: "-0.015em",
                        color: "var(--color-light)",
                        marginBottom: "var(--space-3)",
                      }}
                    >
                      {item.name}
                    </h2>

                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "13px",
                        lineHeight: 1.65,
                        color: "var(--color-muted)",
                      }}
                    >
                      {item.description}
                    </p>
                  </div>

                  <div
                    style={{
                      marginTop: "var(--space-6)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: item.accent,
                    }}
                  >
                    Explore Industry Systems →
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
