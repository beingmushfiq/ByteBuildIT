import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist or has been moved.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center"
      style={{ backgroundColor: "var(--color-primary)" }}
    >
      {/* Background grid */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--color-light) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 px-6 text-center">
        {/* 404 number */}
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(6rem, 20vw, 14rem)",
            lineHeight: 1,
            letterSpacing: "-0.04em",
            color: "var(--color-accent)",
            opacity: 0.15,
            userSelect: "none",
            marginBottom: "-3rem",
          }}
          aria-hidden="true"
        >
          404
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(1.75rem, 4vw, 3rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            color: "var(--color-light)",
            marginBottom: "var(--space-4)",
          }}
        >
          PAGE NOT FOUND
        </h1>

        {/* Accent bar */}
        <div
          style={{
            width: "48px",
            height: "2px",
            backgroundColor: "var(--color-accent)",
            margin: "0 auto var(--space-8)",
          }}
        />

        {/* Description */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-base)",
            lineHeight: 1.7,
            color: "var(--color-muted)",
            maxWidth: "440px",
            margin: "0 auto var(--space-10)",
          }}
        >
          The page you&apos;re looking for doesn&apos;t exist, has been moved, or is
          temporarily unavailable.
        </p>

        {/* CTA */}
        <Link
          href="/"
          className="btn btn-primary"
          style={{
            padding: "var(--space-3) var(--space-8)",
            textDecoration: "none",
          }}
        >
          BACK TO HOME &rarr;
        </Link>
      </div>
    </main>
  );
}
