"use client";

import React, { useState } from "react";
import { useTheme } from "./ThemeProvider";

interface ThemeToggleProps {
  variant?: "compact" | "expanded" | "minimal";
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({
  variant = "compact",
  className = "",
  showLabel = false,
}: ThemeToggleProps) {
  const { theme, toggleTheme, isMounted } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const isDark = theme === "dark";

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 300);
    toggleTheme(e);
  };

  if (!isMounted) {
    return (
      <div
        style={{
          width: variant === "expanded" ? 92 : 36,
          height: 36,
          borderRadius: "var(--radius-full)",
          backgroundColor: "var(--color-bg-subtle)",
          border: "1px solid var(--color-border)",
        }}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      className={`group relative inline-flex items-center justify-center transition-all ${className}`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode (Shift+D)`}
      title={`Switch to ${isDark ? "light" : "dark"} mode (Shift+D)`}
      style={{
        width: variant === "expanded" ? "auto" : 36,
        height: 36,
        padding: variant === "expanded" ? "0 12px" : "0",
        gap: "8px",
        borderRadius: "var(--radius-full)",
        backgroundColor: isHovered
          ? "var(--color-bg-card-hover)"
          : "var(--color-bg-subtle)",
        border: `1px solid ${isHovered ? "var(--color-border-hover)" : "var(--color-border)"}`,
        cursor: "pointer",
        outline: "none",
        boxShadow: isHovered
          ? "0 0 20px var(--color-accent-glow), var(--shadow-sm)"
          : "var(--shadow-sm)",
        transform: isPressed ? "scale(0.92)" : isHovered ? "scale(1.04)" : "scale(1)",
        transition:
          "transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1), background-color 200ms ease, border-color 200ms ease, box-shadow 250ms ease",
      }}
    >
      {/* Ambient background glow ring */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: -1,
          borderRadius: "inherit",
          background: isDark
            ? "radial-gradient(circle at center, rgba(46,74,249,0.15) 0%, transparent 70%)"
            : "radial-gradient(circle at center, rgba(245,158,11,0.2) 0%, transparent 70%)",
          opacity: isHovered ? 1 : 0,
          transition: "opacity 300ms ease",
          pointerEvents: "none",
        }}
      />

      {/* Kinetic Icon Morph Engine */}
      <div
        style={{
          width: 20,
          height: 20,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: isDark ? "rotate(0deg)" : "rotate(90deg)",
          transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {/* SUN (shown when light mode or rotating in) */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            position: "absolute",
            width: 18,
            height: 18,
            color: isDark ? "var(--color-muted)" : "#F59E0B",
            opacity: isDark ? 0 : 1,
            transform: isDark ? "scale(0.4) rotate(-90deg)" : "scale(1) rotate(0deg)",
            transition: "all 400ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            filter: isDark ? "none" : "drop-shadow(0 0 4px rgba(245,158,11,0.5))",
          }}
        >
          <circle cx="12" cy="12" r="4.5" fill={isDark ? "none" : "currentColor"} fillOpacity="0.2" />
          <line x1="12" y1="1" x2="12" y2="3.5" />
          <line x1="12" y1="20.5" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.99" y2="5.99" />
          <line x1="18.01" y1="18.01" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3.5" y2="12" />
          <line x1="20.5" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.99" y2="18.01" />
          <line x1="18.01" y1="5.99" x2="19.78" y2="4.22" />
        </svg>

        {/* MOON (shown when dark mode) */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            position: "absolute",
            width: 18,
            height: 18,
            color: isDark ? "var(--color-accent)" : "var(--color-muted)",
            opacity: isDark ? 1 : 0,
            transform: isDark ? "scale(1) rotate(0deg)" : "scale(0.4) rotate(90deg)",
            transition: "all 400ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            filter: isDark ? "drop-shadow(0 0 6px rgba(46,74,249,0.5))" : "none",
          }}
        >
          <path
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            fill={isDark ? "currentColor" : "none"}
            fillOpacity="0.25"
          />
          {/* Subtle star sparks */}
          <circle cx="18" cy="5" r="0.8" fill="currentColor" opacity="0.8" />
          <circle cx="21" cy="9" r="0.6" fill="currentColor" opacity="0.6" />
        </svg>
      </div>

      {/* Optional Mode Label or Keyboard Shortcut Tag */}
      {(showLabel || variant === "expanded") && (
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            fontWeight: 500,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: isHovered ? "var(--color-light)" : "var(--color-muted)",
            transition: "color 200ms ease",
            userSelect: "none",
          }}
        >
          {isDark ? "Dark" : "Light"}
        </span>
      )}
    </button>
  );
}
