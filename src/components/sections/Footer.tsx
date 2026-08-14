"use client";

import Link from "next/link";

const FOOTER_LINKS = {
  Work: [
    { label: "All projects", href: "/work" },
    { label: "Case studies", href: "/work" },
  ],
  Solutions: [
    { label: "Business Systems", href: "/#what-we-build" },
    { label: "Automation", href: "/#what-we-build" },
    { label: "AI & Intelligence", href: "/#what-we-build" },
    { label: "Digital Products", href: "/#what-we-build" },
  ],
  Company: [
    { label: "Approach", href: "/#approach-detail" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: "var(--color-bg-base)",
        borderTop: "1px solid var(--color-border)",
        paddingTop: "var(--space-20)",
        paddingBottom: "var(--space-12)",
      }}
    >
      <div className="container">
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "var(--space-12)",
          marginBottom: "var(--space-16)",
        }}
          className="md:!grid-cols-[1.5fr_1fr_1fr_1fr]"
        >
          {/* Brand */}
          <div>
            <Link
              href="/"
              style={{
                display: "inline-block",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "1.05rem",
                letterSpacing: "-0.02em",
                textDecoration: "none",
                marginBottom: "var(--space-4)",
              }}
            >
              <span style={{ color: "var(--color-light)" }}>BYTE</span>
              <span style={{ color: "var(--color-light)" }}>BUILD</span>
              <span style={{ color: "var(--color-accent)" }}>IT</span>
            </Link>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sm)",
              lineHeight: 1.7,
              color: "var(--color-muted)",
              maxWidth: "280px",
            }}>
              We turn inefficient business processes into software systems that actually work.
            </p>
          </div>

          {/* Link groups */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-muted)",
                marginBottom: "var(--space-4)",
              }}>
                {group}
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "var(--text-sm)",
                        color: "var(--color-muted)",
                        textDecoration: "none",
                        transition: "color 200ms ease",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = "var(--color-light)")}
                      onMouseLeave={e => (e.currentTarget.style.color = "var(--color-muted)")}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "var(--space-4)",
          paddingTop: "var(--space-6)",
          borderTop: "1px solid var(--color-border)",
        }}>
          <p style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: "0.06em",
            color: "var(--color-muted)",
          }}>
            © {year} ByteBuildIT. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "var(--space-6)" }}>
            {["Privacy", "Terms"].map(item => (
              <Link
                key={item}
                href="#"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  letterSpacing: "0.06em",
                  color: "var(--color-muted)",
                  textDecoration: "none",
                  transition: "color 200ms ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--color-light)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--color-muted)")}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
