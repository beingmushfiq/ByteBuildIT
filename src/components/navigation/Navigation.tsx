"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const NAV_LINKS = [
  { label: "Work", href: "#work" },
  { label: "Solutions", href: "#solutions" },
  { label: "Approach", href: "#approach" },
  { label: "About", href: "#about" },
] as const;

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLAnchorElement>(null);
  const navLinksRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // GSAP entrance animations
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(wordmarkRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.8,
      })
        .from(
          navLinksRef.current?.querySelectorAll("a") ?? [],
          {
            y: -12,
            opacity: 0,
            duration: 0.5,
            stagger: 0.08,
          },
          "-=0.4"
        )
        .from(
          ctaRef.current,
          {
            y: -12,
            opacity: 0,
            duration: 0.5,
          },
          "-=0.3"
        );
    },
    { scope: navRef }
  );

  // Scroll-based background toggle
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mobile menu animation
  useEffect(() => {
    if (!mobileMenuRef.current) return;

    if (isMobileMenuOpen) {
      gsap.to(mobileMenuRef.current, {
        height: "auto",
        opacity: 1,
        duration: 0.35,
        ease: "power2.out",
      });
    } else {
      gsap.to(mobileMenuRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
      });
    }
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-colors duration-300 ${
        isScrolled
          ? "bg-primary shadow-lg shadow-black/30"
          : "bg-transparent"
      }`}
    >
      <nav
        ref={navRef}
        className="mx-auto flex max-w-[1320px] items-center justify-between px-6 py-4 md:px-8 lg:px-12"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Wordmark */}
        <Link
          ref={wordmarkRef}
          href="/"
          className="flex-shrink-0 text-xl tracking-tight"
          aria-label="ByteBuildIT home"
        >
          <span className="font-display text-light">Byte</span>
          <span className="font-display font-bold text-light">Build</span>
          <span className="font-display font-bold text-accent">IT</span>
        </Link>

        {/* Desktop Nav Links */}
        <div ref={navLinksRef} className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-mono text-xs font-medium tracking-[0.08em] uppercase text-muted transition-colors duration-200 hover:text-light"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <Link
          ref={ctaRef}
          href="#contact"
          className="hidden rounded bg-accent px-5 py-2.5 font-mono text-xs font-medium tracking-[0.04em] uppercase text-white transition-all duration-200 hover:bg-accent-hover hover:shadow-[0_0_24px_rgba(46,74,249,0.3)] md:inline-flex"
        >
          Start a project
          <span className="ml-1.5" aria-hidden="true">
            →
          </span>
        </Link>

        {/* Mobile Hamburger */}
        <button
          className="relative z-50 flex flex-col items-center justify-center gap-[5px] md:hidden"
          onClick={toggleMobileMenu}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <span
            className={`block h-[1.5px] w-6 origin-center bg-light transition-all duration-300 ${
              isMobileMenuOpen
                ? "translate-y-[6.5px] rotate-45"
                : ""
            }`}
          />
          <span
            className={`block h-[1.5px] w-6 bg-light transition-all duration-300 ${
              isMobileMenuOpen ? "scale-x-0 opacity-0" : ""
            }`}
          />
          <span
            className={`block h-[1.5px] w-6 origin-center bg-light transition-all duration-300 ${
              isMobileMenuOpen
                ? "-translate-y-[6.5px] -rotate-45"
                : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        id="mobile-menu"
        className="overflow-hidden opacity-0 md:hidden"
        style={{ height: 0 }}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="mx-auto flex max-w-[1320px] flex-col gap-1 border-t border-gray-700 px-6 pb-6 pt-4 md:px-8 lg:px-12">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded px-3 py-3 font-mono text-sm font-medium tracking-[0.08em] uppercase text-muted transition-colors duration-200 hover:bg-white/5 hover:text-light"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 border-t border-gray-700 pt-4">
            <Link
              href="#contact"
              className="inline-flex w-full items-center justify-center gap-2 rounded bg-accent px-5 py-3 font-mono text-sm font-medium tracking-[0.04em] uppercase text-white transition-all duration-200 hover:bg-accent-hover"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Start a project
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
