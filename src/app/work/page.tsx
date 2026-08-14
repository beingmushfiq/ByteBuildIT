import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/sections/Footer";
import type { Metadata } from "next";
import WorkList from "@/app/work/WorkList";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected projects from ByteBuildIT. Business systems, automation platforms, and intelligent software built for real operations.",
};

export default function WorkPage() {
  return (
    <>
      <Navigation />
      <main style={{ backgroundColor: "var(--color-dark)", minHeight: "100vh" }}>

        {/* ── Header ─────────────────────────────────────── */}
        <section
          style={{
            paddingTop: "var(--space-40)",
            paddingBottom: "var(--space-20)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <div className="container">
            <span className="section-label" style={{ marginBottom: "var(--space-6)", display: "flex" }}>
              Selected work
            </span>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(3rem, 8vw, 7rem)",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                lineHeight: 0.95,
                color: "var(--color-light)",
                maxWidth: "700px",
              }}
            >
              Systems<br />
              we&apos;ve<br />
              <span style={{ color: "var(--color-accent)" }}>shipped.</span>
            </h1>
          </div>
        </section>

        {/* Client component handles the interactive list */}
        <WorkList />

        {/* ── CTA ─────────────────────────────────────────── */}
        <section style={{ padding: "var(--space-32) 0" }}>
          <div className="container" style={{ textAlign: "center" }}>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "var(--color-light)",
              marginBottom: "var(--space-4)",
            }}>
              Have a problem like this?
            </h2>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-base)",
              color: "var(--color-muted)",
              marginBottom: "var(--space-8)",
            }}>
              We&apos;d like to hear about it.
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
