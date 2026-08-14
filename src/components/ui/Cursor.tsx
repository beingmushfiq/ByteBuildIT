"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Cursor() {
  const dotRef    = useRef<HTMLDivElement>(null);
  const ringRef   = useRef<HTMLDivElement>(null);
  const labelRef  = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    // Check pointer capability
    const isFine = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isFine || prefersReducedMotion) return;

    const dot  = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    let posX = 0, posY = 0;
    let targetX = 0, targetY = 0;
    let rafId: number;

    // Dot follows mouse exactly
    const onMove = (e: MouseEvent) => {
      posX = e.clientX;
      posY = e.clientY;
      gsap.set(dot, { x: posX, y: posY });
    };

    // Ring follows with lag
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      targetX = lerp(targetX, posX, 0.12);
      targetY = lerp(targetY, posY, 0.12);
      gsap.set(ring, { x: targetX, y: targetY });
      gsap.set(label, { x: targetX, y: targetY });
      rafId = requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener("mousemove", onMove);

    // Handle interactive elements
    const onEnter = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      const type = el.dataset.cursorType ?? "default";

      if (type === "project") {
        gsap.to(ring, { scale: 3.5, opacity: 0.7, duration: 0.4, ease: "power3.out" });
        gsap.to(label, { opacity: 1, scale: 1, duration: 0.3, ease: "power3.out" });
        gsap.to(dot, { scale: 0, duration: 0.3 });
        label.textContent = "VIEW CASE";
        setActive(true);
      } else if (type === "link" || el.tagName === "A" || el.tagName === "BUTTON") {
        gsap.to(ring, { scale: 1.8, borderColor: "rgba(46,74,249,0.6)", duration: 0.3, ease: "power3.out" });
      }
    };

    const onLeave = () => {
      gsap.to(ring, { scale: 1, borderColor: "var(--color-cursor-ring)", opacity: 1, duration: 0.4, ease: "power3.out" });
      gsap.to(dot, { scale: 1, duration: 0.3 });
      gsap.to(label, { opacity: 0, scale: 0.8, duration: 0.25 });
      setActive(false);
    };

    // Register interactive elements
    const registerInteractives = () => {
      document.querySelectorAll<HTMLElement>("a, button, [data-cursor-type]").forEach(el => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    };

    registerInteractives();

    // Mutation observer for dynamically added elements
    const observer = new MutationObserver(registerInteractives);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Precision dot */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 5,
          height: 5,
          borderRadius: "50%",
          backgroundColor: "var(--color-cursor-dot)",
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-50%, -50%)",
          willChange: "transform",
        }}
      />

      {/* Ring */}
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "1px solid var(--color-cursor-ring)",
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-50%, -50%)",
          willChange: "transform",
          transition: "border-color 200ms ease",
        }}
      />

      {/* Label (VIEW CASE etc.) */}
      <div
        ref={labelRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-50%, -50%)",
          opacity: 0,
          scale: "0.8",
          fontFamily: "var(--font-mono)",
          fontSize: "9px",
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--color-light)",
          whiteSpace: "nowrap",
          willChange: "transform, opacity",
        }}
      />
    </>
  );
}
