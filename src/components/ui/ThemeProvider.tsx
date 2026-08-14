"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useRef,
  useSyncExternalStore,
} from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: Theme;
  toggleTheme: (event?: React.MouseEvent | MouseEvent | { clientX: number; clientY: number }) => void;
  setTheme: (theme: Theme, event?: React.MouseEvent | MouseEvent | { clientX: number; clientY: number }) => void;
  isMounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "bytebuildit-theme";

/* ── DOM Mutation Helper ─────────────────────────────────────── */
function applyThemeDirect(nextTheme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute("data-theme", nextTheme);
  if (nextTheme === "light") {
    root.classList.add("light");
    root.classList.remove("dark");
  } else {
    root.classList.add("dark");
    root.classList.remove("light");
  }
}

/* ── External Store Subscriptions ────────────────────────────── */
const themeListeners = new Set<() => void>();

function notifyThemeListeners() {
  themeListeners.forEach((listener) => {
    try {
      listener();
    } catch {
      // Ignore listener error
    }
  });
}

function subscribeTheme(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  themeListeners.add(callback);
  window.addEventListener("storage", callback);
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", callback);
  return () => {
    themeListeners.delete(callback);
    window.removeEventListener("storage", callback);
    media.removeEventListener("change", callback);
  };
}

function getThemeSnapshot(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getThemeServerSnapshot(): Theme {
  return "dark";
}

function emptySubscribe() {
  return () => {};
}

function getMountedSnapshot(): boolean {
  return true;
}

function getMountedServerSnapshot(): boolean {
  return false;
}

/* ── Transient Canvas Particle & Shockwave Aura ──────────────── */
function triggerShockwaveEffect(
  rawOriginX: number,
  rawOriginY: number,
  toTheme: Theme
) {
  if (typeof window === "undefined") return;
  const width = window.innerWidth || 1024;
  const height = window.innerHeight || 768;
  const originX = Math.max(0, Math.min(width, Number.isFinite(rawOriginX) ? rawOriginX : width / 2));
  const originY = Math.max(0, Math.min(height, Number.isFinite(rawOriginY) ? rawOriginY : height / 2));

  const canvas = document.createElement("canvas");
  canvas.id = "theme-shockwave-canvas";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.scale(dpr, dpr);

  const isLight = toTheme === "light";
  const colors = isLight
    ? ["#2E4AF9", "#4A62FF", "#F59E0B", "#FBBF24", "#FFFFFF"]
    : ["#2E4AF9", "#7C3AED", "#38BDF8", "#818CF8", "#C084FC"];

  // Particle bursts
  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    alpha: number;
    decay: number;
    sparkleRate: number;
  }

  const particles: Particle[] = [];
  const particleCount = 45;

  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.4;
    const speed = Math.random() * 6 + 3.5;
    particles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: Math.random() * 3.5 + 1.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: Math.random() * 0.02 + 0.015,
      sparkleRate: Math.random() * 0.2 + 0.1,
    });
  }

  // Shockwave ring properties
  let ringRadius = 0;
  const maxRingRadius = Math.max(
    10,
    Math.hypot(
      Math.max(originX, width - originX),
      Math.max(originY, height - originY)
    )
  );
  let ringAlpha = 0.85;
  const startTime = performance.now();
  const duration = 750; // ms

  function animate(now: number) {
    const elapsed = Math.max(0, now - startTime);
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = Math.max(0, 1 - Math.pow(1 - progress, 3)); // Cubic ease out

    ctx?.clearRect(0, 0, width, height);

    // Draw expanding glowing ring safely
    ringRadius = Math.max(0, easeOut * maxRingRadius * 0.85);
    ringAlpha = Math.max(0, Math.min(1, (1 - progress) * 0.7));

    if (ctx && ringAlpha > 0.01 && ringRadius > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(originX, originY, ringRadius, 0, Math.PI * 2);
      ctx.lineWidth = Math.max(1, (1 - progress) * 16);
      ctx.strokeStyle = isLight
        ? `rgba(46, 74, 249, ${ringAlpha * 0.5})`
        : `rgba(124, 58, 237, ${ringAlpha * 0.5})`;
      ctx.shadowColor = isLight ? "#2E4AF9" : "#7C3AED";
      ctx.shadowBlur = 24;
      ctx.stroke();

      // Inner sharp ring
      const innerRadius = Math.max(0, ringRadius * 0.96);
      if (innerRadius > 0) {
        ctx.beginPath();
        ctx.arc(originX, originY, innerRadius, 0, Math.PI * 2);
        ctx.lineWidth = 2;
        ctx.strokeStyle = `rgba(255, 255, 255, ${ringAlpha * 0.8})`;
        ctx.stroke();
      }
      ctx.restore();
    }

    // Draw and update particles safely
    if (ctx) {
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94; // Drag
        p.vy *= 0.94;
        p.alpha = Math.max(0, p.alpha - p.decay);
        const particleRadius = Math.max(0, p.size * (1 - progress * 0.5));

        if (p.alpha > 0.01 && particleRadius > 0) {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(p.x, p.y, particleRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
    }

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      canvas.remove();
    }
  }

  requestAnimationFrame(animate);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getThemeServerSnapshot);
  const isMounted = useSyncExternalStore(emptySubscribe, getMountedSnapshot, getMountedServerSnapshot);
  const isTransitioningRef = useRef(false);

  useEffect(() => {
    applyThemeDirect(theme);
  }, [theme]);

  const setThemeWithAnimation = useCallback(
    async (
      nextTheme: Theme,
      event?: React.MouseEvent | MouseEvent | { clientX: number; clientY: number }
    ) => {
      if (isTransitioningRef.current) return;

      // Extract coordinates
      let x = window.innerWidth / 2;
      let y = window.innerHeight / 2;

      if (event && "clientX" in event && typeof event.clientX === "number") {
        x = event.clientX;
        y = event.clientY;
      } else if (typeof document !== "undefined") {
        const activeEl = document.activeElement as HTMLElement | null;
        if (activeEl && activeEl !== document.body) {
          const rect = activeEl.getBoundingClientRect();
          x = rect.left + rect.width / 2;
          y = rect.top + rect.height / 2;
        }
      }

      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      // Trigger transient particle shockwave aura
      triggerShockwaveEffect(x, y, nextTheme);

      // Check View Transitions API support
      const doc = document as unknown as {
        startViewTransition?: (callback: () => void | Promise<void>) => {
          ready: Promise<void>;
          finished: Promise<void>;
        };
      };

      if (!doc.startViewTransition) {
        // Fallback for browsers without View Transitions
        applyThemeDirect(nextTheme);
        localStorage.setItem(STORAGE_KEY, nextTheme);
        notifyThemeListeners();
        return;
      }

      isTransitioningRef.current = true;

      try {
        const transition = doc.startViewTransition(() => {
          applyThemeDirect(nextTheme);
          localStorage.setItem(STORAGE_KEY, nextTheme);
          notifyThemeListeners();
        });

        await transition.ready;

        // Animate circular clip-path from the click origin
        const clipPathAnimation = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ];

        document.documentElement.animate(
          {
            clipPath: clipPathAnimation,
          },
          {
            duration: 650,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );

        await transition.finished;
      } catch {
        applyThemeDirect(nextTheme);
        localStorage.setItem(STORAGE_KEY, nextTheme);
        notifyThemeListeners();
      } finally {
        isTransitioningRef.current = false;
      }
    },
    []
  );

  const toggleTheme = useCallback(
    (event?: React.MouseEvent | MouseEvent | { clientX: number; clientY: number }) => {
      const next = theme === "dark" ? "light" : "dark";
      setThemeWithAnimation(next, event);
    },
    [theme, setThemeWithAnimation]
  );

  // Global Keyboard Shortcut: Shift + D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing inside input, textarea, or contenteditable
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.shiftKey && (e.key === "D" || e.key === "d")) {
        e.preventDefault();
        toggleTheme();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleTheme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme: theme,
        toggleTheme,
        setTheme: setThemeWithAnimation,
        isMounted,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
