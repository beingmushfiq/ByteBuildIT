import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "About",
  description:
    "ByteBuildIT works at the intersection of business operations, product design and software engineering. We like difficult problems.",
  openGraph: {
    title: "About | ByteBuildIT",
    description:
      "ByteBuildIT works at the intersection of business operations, product design and software engineering.",
  },
};

// ── Principles ───────────────────────────────────────────────────

const PRINCIPLES = [
  {
    name: "CURIOSITY.",
    description:
      "We start every engagement by asking why. Why does this process exist? Why is it manual? Why hasn't it been solved yet? The best software comes from deep understanding, not surface-level assumptions.",
  },
  {
    name: "PRECISION.",
    description:
      "Every system we build is designed around how your business actually works — not how a template thinks it should work. We pay attention to the edge cases, the exceptions, and the unwritten rules.",
  },
  {
    name: "OWNERSHIP.",
    description:
      "We don't hand off code and disappear. We build systems we believe in, and we stand behind them. From first conversation to post-launch support, we're accountable for outcomes.",
  },
];

// ── Team Section ─────────────────────────────────────────────────

interface TeamMember {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  team: { name: string; slug: string } | null;
}

// ── Page Component ───────────────────────────────────────────────

export default async function AboutPage() {
  const supabase = await createClient();

  // Fetch team members
  const { data: membersData } = await supabase
    .from("users")
    .select(
      `
      id, full_name, avatar_url,
      team_members!inner(
        team_id,
        teams(name, slug)
      )
    `
    )
    .eq("is_active", true)
    .order("full_name", { ascending: true });

  type TeamMemberRow = {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    team_members: Array<{
      team_id: string;
      teams: { name: string; slug: string } | null;
    }>;
  };

  const members: TeamMember[] = ((membersData ?? []) as TeamMemberRow[]).map(
    (m) => ({
      id: m.id,
      full_name: m.full_name,
      avatar_url: m.avatar_url,
      team: m.team_members?.[0]?.teams ?? null,
    })
  );

  return (
    <>
      <Navigation />
      <main style={{ backgroundColor: "var(--color-bg-base)", minHeight: "100vh" }}>
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
          {/* ── Hero ──────────────────────────────────────── */}
          <div style={{ marginBottom: "var(--space-24)" }}>
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
              ABOUT
            </span>

            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(2.5rem, 7vw, 6rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: "var(--color-light)",
                marginBottom: "var(--space-6)",
              }}
            >
              WE LIKE
              <br />
              DIFFICULT{" "}
              <span style={{ color: "var(--color-accent)" }}>PROBLEMS.</span>
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
                fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
                lineHeight: 1.7,
                color: "var(--color-muted)",
                maxWidth: "640px",
              }}
            >
              ByteBuildIT works at the intersection of business operations,
              product design and software engineering. We identify processes
              that are expensive, fragmented, or manual — and turn them into
              connected software systems.
            </p>
          </div>

          {/* ── Principles ─────────────────────────────────── */}
          <div style={{ marginBottom: "var(--space-32)" }}>
            <h2
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                fontWeight: 500,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-muted)",
                marginBottom: "var(--space-10)",
              }}
            >
              OUR PRINCIPLES
            </h2>

            <div className="grid gap-10 md:grid-cols-3">
              {PRINCIPLES.map((principle) => (
                <div key={principle.name}>
                  <h3
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                      fontWeight: 500,
                      letterSpacing: "0.1em",
                      lineHeight: 1.1,
                      color: "var(--color-light)",
                      marginBottom: "var(--space-4)",
                    }}
                  >
                    {principle.name}
                  </h3>
                  <div
                    style={{
                      width: "32px",
                      height: "2px",
                      backgroundColor: "var(--color-accent)",
                      marginBottom: "var(--space-4)",
                    }}
                  />
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-sm)",
                      lineHeight: 1.7,
                      color: "var(--color-muted)",
                    }}
                  >
                    {principle.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Divider ────────────────────────────────────── */}
          <div
            style={{
              width: "100%",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent 0%, var(--color-gray-700) 50%, transparent 100%)",
              marginBottom: "var(--space-32)",
            }}
          />

          {/* ── Team ──────────────────────────────────────── */}
          <div style={{ marginBottom: "var(--space-32)" }}>
            <h2
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                fontWeight: 500,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-muted)",
                marginBottom: "var(--space-10)",
              }}
            >
              THE TEAM
            </h2>

            {members.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {members.map((member) => (
                  <div
                    key={member.id}
                    style={{
                      backgroundColor: "var(--color-deep-navy)",
                      border: "1px solid var(--color-gray-700)",
                      borderRadius: "var(--radius-lg)",
                      padding: "var(--space-6)",
                    }}
                  >
                    {/* Avatar placeholder */}
                    <div
                      className="mb-4 flex items-center justify-center overflow-hidden"
                      style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "var(--radius-full)",
                        backgroundColor: "var(--color-gray-700)",
                      }}
                    >
                      {member.avatar_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={member.avatar_url}
                          alt={member.full_name ?? "Team member"}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 700,
                            fontSize: "var(--text-xl)",
                            color: "var(--color-muted)",
                          }}
                        >
                          {(member.full_name ?? "U").charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                        fontSize: "var(--text-base)",
                        color: "var(--color-light)",
                        marginBottom: "var(--space-1)",
                      }}
                    >
                      {member.full_name ?? "Team Member"}
                    </h3>

                    {member.team && (
                      <p
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "var(--text-xs)",
                          letterSpacing: "0.04em",
                          color: "var(--color-muted)",
                        }}
                      >
                        {member.team.name}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-base)",
                  color: "var(--color-muted)",
                  lineHeight: 1.6,
                }}
              >
                Our team is growing. Check back soon to meet the people behind ByteBuildIT.
              </p>
            )}
          </div>

          {/* ── CTA ────────────────────────────────────────── */}
          <div
            style={{
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
                fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                color: "var(--color-light)",
                marginBottom: "var(--space-4)",
              }}
            >
              HAVE A HARD PROBLEM?
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-base)",
                color: "var(--color-muted)",
                marginBottom: "var(--space-8)",
                maxWidth: "480px",
                margin: "0 auto var(--space-8)",
                lineHeight: 1.6,
              }}
            >
              We&apos;re always looking for challenging projects that push what
              software can do for a business.
            </p>
            <Link
              href="/contact"
              className="btn btn-primary"
              style={{
                padding: "var(--space-3) var(--space-8)",
                textDecoration: "none",
              }}
            >
              LET&apos;S TALK &rarr;
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
