"use client";

import React, { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "./ThemeProvider";

export default function FloatingThemeToggle() {
  const { theme, isMounted } = useTheme();
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    // Reveal floating toggle once user scrolls past initial hero height or after slight delay
    const handleScroll = () => {
      if (window.scrollY > 180) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isMounted) return null;

  return (
    <div
      aria-label="Floating theme controller"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "fixed",
        bottom: "var(--space-6)",
        right: "var(--space-6)",
        zIndex: "var(--z-nav)" as unknown as number,
        display: "flex",
        alignItems: "center",
        gap: "var(--space-2)",
        padding: "4px 6px 4px 6px",
        borderRadius: "var(--radius-full)",
        backgroundColor: "var(--nav-bg)",
        border: "1px solid var(--color-border)",
        backdropFilter: "blur(16px) saturate(1.4)",
        boxShadow: "var(--shadow-lg)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transform: visible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.9)",
        transition:
          "opacity 300ms cubic-bezier(0.25, 0.1, 0.25, 1), transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      <ThemeToggle variant="compact" />

      {/* Keyboard Shortcut Hint */}
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "9px",
          fontWeight: 600,
          letterSpacing: "0.08em",
          color: "var(--color-muted)",
          paddingRight: "6px",
          opacity: hovered ? 1 : 0.7,
          transition: "opacity 200ms ease",
          userSelect: "none",
        }}
      >
        ⇧D
      </span>
    </div>
  );
}
