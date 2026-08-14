"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(
          authError.message === "Invalid login credentials"
            ? "Invalid email or password."
            : authError.message
        );
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="flex items-center justify-center"
      style={{ minHeight: "100vh", backgroundColor: "var(--color-dark)" }}
    >
      <div style={{ width: "100%", maxWidth: 400, padding: "0 var(--space-6)" }}>
        {/* Brand */}
        <div className="mb-8 text-center">
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-2xl)",
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            <span style={{ color: "var(--color-light)" }}>Byte</span>
            <span style={{ color: "var(--color-light)", fontWeight: 700 }}>Build</span>
            <span style={{ color: "var(--color-accent)", fontWeight: 700 }}>IT</span>
          </span>
          <div
            className="mt-2"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-muted)",
            }}
          >
            CMS Admin
          </div>
        </div>

        {/* Login card */}
        <div
          className="rounded-lg"
          style={{
            backgroundColor: "var(--color-deep-navy)",
            border: "1px solid var(--color-gray-700)",
            padding: "var(--space-8)",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-lg)",
              fontWeight: 600,
              color: "var(--color-light)",
              marginBottom: "var(--space-6)",
            }}
          >
            Sign in to your account
          </h1>

          {error && (
            <div
              className="mb-4 rounded"
              style={{
                padding: "10px 14px",
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-sm)",
                color: "#F87171",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.25)",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--color-muted)",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-sm)",
                  color: "var(--color-light)",
                  backgroundColor: "var(--color-dark)",
                  border: "1px solid var(--color-gray-700)",
                  borderRadius: "var(--radius-md)",
                  padding: "10px 12px",
                  outline: "none",
                  width: "100%",
                  transition: "border-color 150ms",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-accent)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-gray-700)"; }}
              />
            </div>

            <div className="mb-6">
              <label
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--color-muted)",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-sm)",
                  color: "var(--color-light)",
                  backgroundColor: "var(--color-dark)",
                  border: "1px solid var(--color-gray-700)",
                  borderRadius: "var(--radius-md)",
                  padding: "10px 12px",
                  outline: "none",
                  width: "100%",
                  transition: "border-color 150ms",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-accent)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-gray-700)"; }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                fontWeight: 500,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "var(--color-white)",
                backgroundColor: "var(--color-accent)",
                border: "none",
                borderRadius: "var(--radius-md)",
                padding: "10px 20px",
                width: "100%",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
                transition: "background-color 150ms",
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div
          className="mt-6 text-center"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--color-gray-500)",
          }}
        >
          <Link
            href="/"
            style={{ color: "var(--color-muted)", textDecoration: "none" }}
          >
            &larr; Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}
