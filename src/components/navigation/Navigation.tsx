"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ThemeToggle from "@/components/ui/ThemeToggle";

const NAV_LINKS = [
  { label: "Work", href: "#work" },
  { label: "Solutions", href: "#solutions" },
  { label: "Approach", href: "#approach" },
  { label: "About", href: "#about" },
] as const;

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navRef       = useRef<HTMLElement>(null);
  const logoRef      = useRef<HTMLAnchorElement>(null);
  const linksRef     = useRef<HTMLDivElement>(null);
  const ctaRef       = useRef<HTMLAnchorElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuItemsRef  = useRef<HTMLLIElement[]>([]);

  /* ── Entrance animation ─────────────────────────────── */
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(logoRef.current, { y: -16, opacity: 0, duration: 0.7 })
      .from(linksRef.current?.querySelectorAll("a") ?? [], {
        y: -10, opacity: 0, duration: 0.45, stagger: 0.07,
      }, "-=0.4")
      .from(ctaRef.current, { y: -10, opacity: 0, duration: 0.45 }, "-=0.3");
  }, { scope: navRef });

  /* ── Scroll-compact ─────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Mobile menu animation ──────────────────────────── */
  useEffect(() => {
    const menu = mobileMenuRef.current;
    if (!menu) return;
    const items = menuItemsRef.current.filter(Boolean);

    if (menuOpen) {
      document.body.style.overflow = "hidden";
      gsap.set(menu, { display: "flex" });
      const tl = gsap.timeline();
      tl.to(menu, { opacity: 1, duration: 0.28, ease: "power2.out" })
        .from(items, {
          x: -20, opacity: 0, duration: 0.4, stagger: 0.06, ease: "power3.out",
        }, "-=0.1");
    } else {
      document.body.style.overflow = "";
      const tl = gsap.timeline({ onComplete: () => gsap.set(menu, { display: "none" }) });
      tl.to(menu, { opacity: 0, duration: 0.22, ease: "power2.in" });
    }
  }, [menuOpen]);

  const addItemRef = (el: HTMLLIElement | null) => {
    if (el && !menuItemsRef.current.includes(el)) menuItemsRef.current.push(el);
  };

  return (
    <>
      {/* ── Desktop / Mobile Header ─────────────────────── */}
      <header
        ref={navRef as React.RefObject<HTMLElement>}
        className="fixed left-0 right-0 top-0 z-[100]"
        style={{
          transition: `background-color 300ms cubic-bezier(0.25,0.1,0.25,1),
                       border-color 300ms cubic-bezier(0.25,0.1,0.25,1),
                       backdrop-filter 300ms cubic-bezier(0.25,0.1,0.25,1)`,
          backgroundColor: scrolled ? "var(--nav-bg)" : "transparent",
          backdropFilter: scrolled ? "blur(20px) saturate(1.4)" : "none",
          borderBottom: scrolled ? "1px solid var(--nav-border)" : "1px solid transparent",
        }}
        role="banner"
      >
        <div
          className="relative mx-auto flex max-w-[1320px] items-center justify-between px-6 md:px-8 xl:px-12"
          style={{
            height: scrolled ? "52px" : "68px",
            transition: `height 300ms cubic-bezier(0.25,0.1,0.25,1)`,
          }}
        >
          {/* Wordmark */}
          <Link
            ref={logoRef}
            href="/"
            aria-label="ByteBuildIT home"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "1.05rem",
              letterSpacing: "-0.02em",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "0",
              zIndex: 2,
            }}
          >
            <span style={{ color: "var(--color-light)" }}>BYTE</span>
            <span style={{ color: "var(--color-light)" }}>BUILD</span>
            <span style={{ color: "var(--color-accent)" }}>IT</span>
          </Link>

          {/* Desktop links (Geometrically centered) */}
          <div
            ref={linksRef}
            className="hidden items-center gap-8 md:flex md:absolute md:left-1/2 md:-translate-x-1/2"
            style={{ zIndex: 1 }}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 500,
                  letterSpacing: "0.09em",
                  textTransform: "uppercase",
                  color: "var(--color-muted)",
                  textDecoration: "none",
                  transition: "color 200ms ease",
                  position: "relative",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--color-light)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--color-muted)")}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Right Actions (CTA + Theme Toggle aligned) */}
          <div className="hidden items-center gap-3 md:flex" style={{ zIndex: 2 }}>
            <Link
              ref={ctaRef}
              href="#contact"
              className="group inline-flex"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                fontWeight: 500,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                textDecoration: "none",
                color: "var(--color-white)",
                backgroundColor: "var(--color-accent)",
                border: "1px solid var(--color-accent)",
                padding: "0.55rem 1.1rem",
                borderRadius: "var(--radius-md)",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                height: "36px",
                transition: "background-color 200ms ease, box-shadow 200ms ease, transform 200ms ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = "var(--color-accent-hover)";
                e.currentTarget.style.boxShadow = "var(--shadow-glow)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = "var(--color-accent)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Start a project
              <span
                style={{
                  display: "inline-block",
                  transition: "transform 200ms var(--ease-spring)",
                }}
                className="group-hover:[transform:translate(2px,-2px)]"
              >
                ↗
              </span>
            </Link>

            <ThemeToggle variant="compact" />
          </div>

          {/* Mobile Right Bar (Theme Toggle + Hamburger) */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle variant="compact" />
            <button
              className="flex flex-col items-center justify-center gap-[5px]"
              style={{ width: 40, height: 40, background: "none", border: "none", cursor: "pointer" }}
              onClick={() => setMenuOpen(v => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              <span style={{
                display: "block", height: "1px", width: "22px",
                backgroundColor: "var(--color-light)",
                transition: "transform 300ms, opacity 200ms",
                transformOrigin: "center",
                transform: menuOpen ? "translateY(6px) rotate(45deg)" : "none",
              }} />
              <span style={{
                display: "block", height: "1px", width: "22px",
                backgroundColor: "var(--color-light)",
                transition: "opacity 200ms",
                opacity: menuOpen ? 0 : 1,
              }} />
              <span style={{
                display: "block", height: "1px", width: "22px",
                backgroundColor: "var(--color-light)",
                transition: "transform 300ms",
                transformOrigin: "center",
                transform: menuOpen ? "translateY(-6px) rotate(-45deg)" : "none",
              }} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Full-Screen Mobile Menu ──────────────────────── */}
      <div
        ref={mobileMenuRef}
        id="mobile-menu"
        style={{
          display: "none",
          opacity: 0,
          position: "fixed",
          inset: 0,
          zIndex: 90,
          backgroundColor: "var(--color-bg-base)",
          flexDirection: "column",
          justifyContent: "center",
          paddingLeft: "var(--space-8)",
          paddingRight: "var(--space-8)",
        }}
        aria-hidden={!menuOpen}
      >
        {/* Subtle grid backdrop */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(var(--color-grid-dots) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            pointerEvents: "none",
          }}
        />
        {/* Accent glow */}
        <div style={{
          position: "absolute",
          bottom: "10%",
          right: "-10%",
          width: "50vw",
          height: "50vw",
          background: "radial-gradient(circle, var(--color-glow-backdrop) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <nav style={{ position: "relative", zIndex: 1 }} aria-label="Mobile navigation">
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            {NAV_LINKS.map((link) => (
              <li key={link.label} ref={addItemRef}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "block",
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(2rem, 8vw, 3rem)",
                    fontWeight: 700,
                    letterSpacing: "-0.025em",
                    color: "var(--color-muted)",
                    textDecoration: "none",
                    padding: "var(--space-3) 0",
                    borderBottom: "1px solid var(--color-border)",
                    transition: "color 200ms ease",
                    lineHeight: 1.2,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--color-light)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--color-muted)")}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div style={{ marginTop: "var(--space-8)", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "var(--space-4)" }}>
            <Link
              href="#contact"
              onClick={() => setMenuOpen(false)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-2)",
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-sm)",
                fontWeight: 500,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: "var(--color-white)",
                backgroundColor: "var(--color-accent)",
                padding: "0.875rem 1.5rem",
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
              }}
            >
              Start a project ↗
            </Link>

            <ThemeToggle variant="expanded" showLabel />
          </div>
        </nav>
      </div>
    </>
  );
}
