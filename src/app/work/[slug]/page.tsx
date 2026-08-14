import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/sections/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

/* ── Project data ────────────────────────────────────────── */
const PROJECTS = {
  ordershield: {
    num: "01", title: "OrderShield", subtitle: "Order Management System",
    year: "2024", tags: ["Commerce", "Operations", "Automation"], accent: "#2E4AF9",
    problem: "A mid-size e-commerce distributor was managing 1,200+ daily orders across 7 spreadsheets, shared between 14 staff. Orders were lost. Exceptions went unnoticed. Fulfillment depended entirely on institutional knowledge held by three people.",
    solution: "We designed and built a centralized order management system with real-time routing, exception management, and a configurable approval workflow. The system integrates directly with the client's warehouse management and shipping carriers.",
    outcome: "Within 90 days of launch, order processing time dropped 74%, the error rate fell 91%, and the three key-person dependencies were fully eliminated. The client's operations team grew from 14 to 9 people — and handled 40% more volume.",
    metrics: [
      { label: "Processing time",  value: "−74%", context: "From avg. 12 min to 3 min per order" },
      { label: "Error rate",       value: "−91%", context: "From 8.4% to 0.7% order error rate" },
      { label: "Volume capacity",  value: "+40%", context: "More orders, fewer staff" },
      { label: "Team size",        value: "−36%", context: "14 → 9 — by design, not cuts" },
    ],
    phases: [
      { label: "Discovery",  desc: "Process mapping, stakeholder interviews, failure mode analysis" },
      { label: "Design",     desc: "Data model, workflow engine design, UI architecture" },
      { label: "Build",      desc: "8-week engineering sprint with embedded weekly client reviews" },
      { label: "Transition", desc: "2-week parallel run, then complete cutover" },
    ],
    stack: ["Next.js", "Supabase", "PostgreSQL", "TypeScript", "Vercel"],
  },
  staffsync: {
    num: "02", title: "StaffSync", subtitle: "Field Operations Platform",
    year: "2024", tags: ["Workforce", "Scheduling", "Mobile"], accent: "#7C3AED",
    problem: "A facilities management company with 200+ field staff across 12 sites was coordinating schedules via WhatsApp groups, paper timesheets, and a shared Google Sheet that no one fully trusted. No-shows were frequent, overtime was invisible, and invoicing was weeks behind.",
    solution: "A mobile-first scheduling and dispatch platform with real-time attendance tracking, shift management, and automated timesheet generation. Built to work offline-first for staff in low-connectivity environments.",
    outcome: "No-shows dropped 83% within the first month. Coordinator time spent on scheduling fell 60%. Invoicing became weekly instead of monthly. The platform became the operational backbone of the business.",
    metrics: [
      { label: "No-show rate",        value: "−83%",  context: "Automated reminders + real-time visibility" },
      { label: "Coordinator time",    value: "−60%",  context: "From 30h/week to 12h/week on scheduling" },
      { label: "Invoice cycle",       value: "3×",    context: "From monthly to weekly invoicing" },
      { label: "Attendance accuracy", value: "99.1%", context: "Via mobile check-in" },
    ],
    phases: [
      { label: "Operations audit", desc: "Site visits, workflow mapping, gap analysis" },
      { label: "System design",    desc: "Offline-first architecture, permission model design" },
      { label: "Mobile build",     desc: "PWA + native-quality mobile experience" },
      { label: "Rollout",          desc: "Phased site-by-site deployment over 3 weeks" },
    ],
    stack: ["Next.js", "Supabase", "PWA", "PostgreSQL", "TypeScript"],
  },
  invoiceflow: {
    num: "03", title: "InvoiceFlow", subtitle: "Accounts Receivable Automation",
    year: "2023", tags: ["Finance", "AI", "Workflow"], accent: "#059669",
    problem: "A professional services firm was receiving 2,000+ supplier invoices per month via email. Each was manually opened, data-entered into the ERP, validated, and routed for approval. The process took 5 days average and had a 6% error rate causing payment delays and vendor disputes.",
    solution: "An AI-powered document processing pipeline that extracts invoice data, validates against PO records, and routes for approval — with human review reserved only for exceptions and high-value invoices.",
    outcome: "Average processing time dropped from 5 days to under 4 hours. Manual review reduced by 78% — staff now focus on exceptions rather than data entry. Payment disputes fell significantly as accuracy improved.",
    metrics: [
      { label: "Cycle time",     value: "−96%",  context: "5 days → 3.8 hours average" },
      { label: "Manual review",  value: "−78%",  context: "89% auto-approved with high confidence" },
      { label: "Error rate",     value: "−82%",  context: "From 6% to 1.1%" },
      { label: "Monthly volume", value: "2,841", context: "Invoices processed last month" },
    ],
    phases: [
      { label: "Process mapping",    desc: "End-to-end AP workflow analysis, exception taxonomy" },
      { label: "AI pipeline design", desc: "Document extraction model selection, confidence thresholds" },
      { label: "Integration",        desc: "ERP connector, approval workflow, audit trail" },
      { label: "Validation",         desc: "6-week parallel run, accuracy tuning" },
    ],
    stack: ["Python", "Next.js", "Supabase", "OpenAI", "TypeScript", "PostgreSQL"],
  },
} as const;

type Slug = keyof typeof PROJECTS;

export function generateStaticParams() {
  return Object.keys(PROJECTS).map(slug => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS[slug as Slug];
  if (!project) return { title: "Project not found" };
  return {
    title: `${project.title} — ${project.subtitle}`,
    description: project.problem.slice(0, 160),
  };
}

export default async function CaseStudyPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const project = PROJECTS[slug as Slug];
  if (!project) notFound();

  return (
    <>
      <Navigation />
      <main style={{ backgroundColor: "var(--color-dark)", minHeight: "100vh" }}>

        {/* ── Hero ──────────────────────────────────────── */}
        <section style={{ paddingTop: "var(--space-40)", paddingBottom: "var(--space-16)", borderBottom: "1px solid var(--color-border)" }}>
          <div className="container">
            {/* Breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-8)" }}>
              <Link href="/work" style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-muted)", textDecoration: "none" }}>
                Work
              </Link>
              <span style={{ color: "var(--color-gray-700)", fontSize: "10px" }}>→</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--color-gray-600)", letterSpacing: "0.06em" }}>
                {project.title}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-8)", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: "280px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", marginBottom: "var(--space-4)" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", color: project.accent }}>{project.num}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-muted)" }}>{project.year}</span>
                </div>
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 7vw, 6rem)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 0.95, color: "var(--color-light)", marginBottom: "var(--space-4)" }}>
                  {project.title}
                </h1>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)", letterSpacing: "0.04em", color: "var(--color-muted)", marginBottom: "var(--space-6)" }}>
                  {project.subtitle}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                  {project.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                </div>
              </div>

              {/* Metric strip */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1px", backgroundColor: "var(--color-border)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-xl)", overflow: "hidden" }}>
                {project.metrics.map(m => (
                  <div key={m.label} style={{ padding: "var(--space-5) var(--space-6)", backgroundColor: "var(--color-dark)" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "2.25rem", fontWeight: 700, letterSpacing: "-0.03em", color: project.accent, lineHeight: 1, marginBottom: "var(--space-2)" }}>{m.value}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-muted)", marginBottom: "4px" }}>{m.label}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--color-gray-600)", letterSpacing: "0.04em" }}>{m.context}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Body ──────────────────────────────────────── */}
        <section className="section">
          <div className="container" style={{ maxWidth: "760px" }}>

            {[
              { heading: "The Problem",   text: project.problem   },
              { heading: "What We Built", text: project.solution  },
              { heading: "The Outcome",   text: project.outcome   },
            ].map(({ heading, text }) => (
              <div key={heading} style={{ marginBottom: "var(--space-16)" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: project.accent, marginBottom: "var(--space-4)" }}>
                  {heading}
                </div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(1.05rem, 1.4vw, 1.2rem)", lineHeight: 1.8, color: "var(--color-neutral)" }}>
                  {text}
                </p>
                <div style={{ height: 1, backgroundColor: "var(--color-border)", marginTop: "var(--space-12)" }} />
              </div>
            ))}

            {/* Phases */}
            <div style={{ marginBottom: "var(--space-16)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: project.accent, marginBottom: "var(--space-8)" }}>
                How We Worked
              </div>
              {project.phases.map((phase, i) => (
                <div key={phase.label} style={{ display: "flex", gap: "var(--space-8)", padding: "var(--space-5) 0", borderBottom: i < project.phases.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", color: project.accent, minWidth: "80px", flexShrink: 0 }}>
                    {`0${i + 1}`}
                  </span>
                  <div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-light)", marginBottom: "var(--space-1)" }}>{phase.label}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-muted)", lineHeight: 1.65 }}>{phase.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stack */}
            <div style={{ padding: "var(--space-6)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-xl)", display: "flex", alignItems: "center", flexWrap: "wrap", gap: "var(--space-6)" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-gray-600)" }}>Stack</span>
              {project.stack.map(tech => (
                <span key={tech} style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.04em", color: "var(--color-muted)" }}>{tech}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Footer nav ────────────────────────────────── */}
        <section style={{ borderTop: "1px solid var(--color-border)", padding: "var(--space-20) 0" }}>
          <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "var(--space-6)" }}>
            <Link href="/work" style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", fontWeight: 500, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--color-muted)", textDecoration: "none" }}>
              ← All work
            </Link>
            <Link
              href="/#contact"
              style={{
                display: "inline-flex", alignItems: "center", gap: "var(--space-2)",
                fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)",
                fontWeight: 500, letterSpacing: "0.07em", textTransform: "uppercase",
                color: "var(--color-white)", backgroundColor: "var(--color-accent)",
                padding: "0.75rem 1.5rem", borderRadius: "var(--radius-md)",
                textDecoration: "none",
              }}
            >
              Start a similar project ↗
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
