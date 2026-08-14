"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

/* ── CMS-editable data ─────────────────────────────────────────── */

interface FooterLink {
  label: string;
  href: string;
}

interface SocialLink {
  label: string;
  href: string;
  icon: "linkedin" | "twitter" | "github";
}

interface FooterContent {
  copyright: string;
  tagline: string;
  navLinks: FooterLink[];
  socialLinks: SocialLink[];
}

const CONTENT: FooterContent = {
  copyright: "© 2024 ByteBuildIT. All rights reserved.",
  tagline: "Software systems for businesses that have outgrown manual work.",
  navLinks: [
    { label: "Work", href: "#work" },
    { label: "Solutions", href: "#solutions" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
  socialLinks: [
    { label: "LinkedIn", href: "#", icon: "linkedin" },
    { label: "Twitter/X", href: "#", icon: "twitter" },
    { label: "GitHub", href: "#", icon: "github" },
  ],
};

/* ── Social icon SVGs ──────────────────────────────────────────── */

function SocialIcon({ icon }: { icon: SocialLink["icon"] }) {
  switch (icon) {
    case "linkedin":
      return (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      );
    case "twitter":
      return (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
        </svg>
      );
    case "github":
      return (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
      );
  }
}

/* ── Component ──────────────────────────────────────────────────── */

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const footer = footerRef.current;
      if (!footer) return;

      // --- Divider line grow ---
      const divider = footer.querySelector("[data-footer-divider]");
      if (divider) {
        gsap.fromTo(
          divider,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.8,
            ease: "power3.inOut",
          }
        );
      }

      // --- Content fade-in ---
      const contentElements = footer.querySelectorAll("[data-footer-content]");
      if (contentElements.length > 0) {
        gsap.fromTo(
          contentElements,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.08,
          }
        );
      }
    },
    { scope: footerRef }
  );

  return (
    <footer
      ref={footerRef}
      className="relative"
      style={{ backgroundColor: "var(--color-dark)" }}
      role="contentinfo"
    >
      {/* Top divider */}
      <div
        data-footer-divider
        className="mx-auto"
        style={{
          maxWidth: "var(--container-max)",
          height: "1px",
          backgroundColor: "var(--color-gray-700)",
          transformOrigin: "left center",
        }}
      />

      <div
        className="mx-auto"
        style={{
          maxWidth: "var(--container-max)",
          padding: "var(--space-12) var(--space-6) var(--space-8)",
        }}
      >
        {/* ── Main Footer Row ──────────────────────────── */}
        <div
          data-footer-content
          className="mb-10 flex flex-col gap-8 md:flex-row md:items-start md:justify-between"
        >
          {/* Left: Wordmark + Copyright */}
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="flex-shrink-0 text-xl tracking-tight"
              aria-label="ByteBuildIT home"
            >
              <span className="font-display" style={{ color: "var(--color-light)" }}>
                Byte
              </span>
              <span className="font-display font-bold" style={{ color: "var(--color-light)" }}>
                Build
              </span>
              <span className="font-display font-bold" style={{ color: "var(--color-accent)" }}>
                IT
              </span>
            </Link>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                color: "var(--color-muted)",
                letterSpacing: "0.02em",
              }}
            >
              {CONTENT.copyright}
            </p>
          </div>

          {/* Center: Nav Links */}
          <div data-footer-content className="flex flex-wrap gap-x-6 gap-y-2">
            {CONTENT.navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="transition-colors duration-200"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase" as const,
                  color: "var(--color-muted)",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--color-light)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--color-muted)";
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: Social Links */}
          <div data-footer-content className="flex items-center gap-4">
            {CONTENT.socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex h-8 w-8 items-center justify-center rounded-md transition-all duration-200"
                style={{
                  color: "var(--color-muted)",
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid var(--color-gray-700)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--color-light)";
                  e.currentTarget.style.borderColor = "var(--color-gray-600)";
                  e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--color-muted)";
                  e.currentTarget.style.borderColor = "var(--color-gray-700)";
                  e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 0.04)";
                }}
              >
                <SocialIcon icon={social.icon} />
              </a>
            ))}
          </div>
        </div>

        {/* ── Bottom Bar ───────────────────────────────── */}
        <div
          data-footer-content
          style={{
            borderTop: "1px solid var(--color-gray-700)",
            paddingTop: "var(--space-6)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              letterSpacing: "0.04em",
              color: "var(--color-gray-500)",
            }}
          >
            {CONTENT.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
