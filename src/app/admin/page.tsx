import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard",
};

interface DashboardStats {
  newLeads: number;
  totalProjects: number;
  draftProjects: number;
  scheduledProjects: number;
  recentLeads: { id: string; name: string | null; email: string; status: string; created_at: string }[];
  recentProjects: { id: string; title: string; slug: string; status: string; updated_at: string }[];
}

async function fetchDashboardData(): Promise<DashboardStats> {
  try {
    const supabase = await createClient();

    const [leadsResult, projectsResult, draftResult, scheduledResult, recentLeadsResult, recentProjectsResult] = await Promise.all([
      supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("projects").select("id", { count: "exact", head: true }),
      supabase.from("projects").select("id", { count: "exact", head: true }).eq("status", "draft"),
      supabase.from("projects").select("id", { count: "exact", head: true }).eq("status", "scheduled"),
      supabase.from("leads").select("id, name, email, status, created_at").order("created_at", { ascending: false }).limit(8),
      supabase.from("projects").select("id, title, slug, status, updated_at").order("updated_at", { ascending: false }).limit(6),
    ]);

    return {
      newLeads: leadsResult.count ?? 0,
      totalProjects: projectsResult.count ?? 0,
      draftProjects: draftResult.count ?? 0,
      scheduledProjects: scheduledResult.count ?? 0,
      recentLeads: recentLeadsResult.data ?? [],
      recentProjects: recentProjectsResult.data ?? [],
    };
  } catch {
    return {
      newLeads: 0,
      totalProjects: 0,
      draftProjects: 0,
      scheduledProjects: 0,
      recentLeads: [],
      recentProjects: [],
    };
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  new: { bg: "rgba(46, 74, 249, 0.12)", text: "#4A62FF", border: "rgba(46, 74, 249, 0.3)" },
  contacted: { bg: "rgba(59, 130, 246, 0.12)", text: "#60A5FA", border: "rgba(59, 130, 246, 0.3)" },
  qualified: { bg: "rgba(139, 92, 246, 0.12)", text: "#A78BFA", border: "rgba(139, 92, 246, 0.3)" },
  proposal: { bg: "rgba(245, 158, 11, 0.12)", text: "#FBBF24", border: "rgba(245, 158, 11, 0.3)" },
  won: { bg: "rgba(34, 197, 94, 0.12)", text: "#4ADE80", border: "rgba(34, 197, 94, 0.3)" },
  lost: { bg: "rgba(239, 68, 68, 0.12)", text: "#F87171", border: "rgba(239, 68, 68, 0.3)" },
};

export default async function AdminDashboardPage() {
  const stats = await fetchDashboardData();

  const statCards = [
    { label: "New Inquiries", value: stats.newLeads, href: "/admin/leads?status=new", accent: "var(--color-accent)" },
    { label: "Total Projects", value: stats.totalProjects, href: "/admin/projects", accent: "var(--color-neutral)" },
    { label: "Drafts", value: stats.draftProjects, href: "/admin/projects?status=draft", accent: "#FBBF24" },
    { label: "Scheduled", value: stats.scheduledProjects, href: "/admin/projects?status=scheduled", accent: "#A78BFA" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--color-light)" }}>
          Dashboard
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-muted)", marginTop: "var(--space-1)" }}>
          Overview of your CMS operations
        </p>
      </div>

      {/* Stat cards */}
      <div className="mb-8 grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        {statCards.map((card) => (
          <a
            key={card.label}
            href={card.href}
            className="group block rounded-lg transition-all duration-150"
            style={{
              padding: "var(--space-5)",
              backgroundColor: "var(--color-deep-navy)",
              border: "1px solid var(--color-gray-700)",
              textDecoration: "none",
            }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-muted)", marginBottom: "var(--space-2)" }}>
              {card.label}
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-3xl)", fontWeight: 700, letterSpacing: "-0.02em", color: card.accent }}>
              {card.value}
            </div>
          </a>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Leads */}
        <div
          className="rounded-lg"
          style={{
            backgroundColor: "var(--color-deep-navy)",
            border: "1px solid var(--color-gray-700)",
          }}
        >
          <div
            className="flex items-center justify-between"
            style={{ padding: "var(--space-4) var(--space-5)", borderBottom: "1px solid var(--color-gray-700)" }}
          >
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-base)", fontWeight: 600, color: "var(--color-light)" }}>
              Recent Inquiries
            </h2>
            <Link
              href="/admin/leads"
              style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--color-accent)", textDecoration: "none" }}
            >
              View all
            </Link>
          </div>
          <div>
            {stats.recentLeads.length === 0 ? (
              <div style={{ padding: "var(--space-8) var(--space-5)", textAlign: "center" }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-muted)" }}>
                  No inquiries yet
                </p>
              </div>
            ) : (
              <div>
                {stats.recentLeads.map((lead) => {
                  const colors = STATUS_COLORS[lead.status] ?? STATUS_COLORS.new;
                  return (
                    <div
                      key={lead.id}
                      className="flex items-center gap-3"
                      style={{
                        padding: "10px var(--space-5)",
                        borderBottom: "1px solid var(--color-gray-700)",
                      }}
                    >
                      <div className="min-w-0 flex-1">
                        <div style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-light)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {lead.name ?? lead.email}
                        </div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--color-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {lead.email}
                        </div>
                      </div>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "10px",
                          fontWeight: 500,
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                          color: colors.text,
                          backgroundColor: colors.bg,
                          border: `1px solid ${colors.border}`,
                          borderRadius: "var(--radius-full)",
                          padding: "2px 8px",
                          flexShrink: 0,
                        }}
                      >
                        {lead.status}
                      </span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--color-gray-500)", flexShrink: 0, whiteSpace: "nowrap" }}>
                        {formatDate(lead.created_at)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent Projects */}
        <div
          className="rounded-lg"
          style={{
            backgroundColor: "var(--color-deep-navy)",
            border: "1px solid var(--color-gray-700)",
          }}
        >
          <div
            className="flex items-center justify-between"
            style={{ padding: "var(--space-4) var(--space-5)", borderBottom: "1px solid var(--color-gray-700)" }}
          >
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-base)", fontWeight: 600, color: "var(--color-light)" }}>
              Recent Projects
            </h2>
            <Link
              href="/admin/projects"
              style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--color-accent)", textDecoration: "none" }}
            >
              View all
            </Link>
          </div>
          <div>
            {stats.recentProjects.length === 0 ? (
              <div style={{ padding: "var(--space-8) var(--space-5)", textAlign: "center" }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-muted)", marginBottom: "var(--space-3)" }}>
                  No projects yet. Create your first case study.
                </p>
                <Link
                  href="/admin/projects/new"
                  className="inline-flex items-center gap-2"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    fontWeight: 500,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: "var(--color-accent)",
                    textDecoration: "none",
                  }}
                >
                  + New Project
                </Link>
              </div>
            ) : (
              <div>
                {stats.recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center gap-3"
                    style={{
                      padding: "10px var(--space-5)",
                      borderBottom: "1px solid var(--color-gray-700)",
                    }}
                  >
                    <div className="min-w-0 flex-1">
                      <div style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-light)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {project.title}
                      </div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--color-muted)" }}>
                        /{project.slug}
                      </div>
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "10px",
                        fontWeight: 500,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        color: project.status === "published" ? "#4ADE80" : "#FBBF24",
                        backgroundColor: project.status === "published" ? "rgba(34,197,94,0.12)" : "rgba(245,158,11,0.12)",
                        border: `1px solid ${project.status === "published" ? "rgba(34,197,94,0.3)" : "rgba(245,158,11,0.3)"}`,
                        borderRadius: "var(--radius-full)",
                        padding: "2px 8px",
                        flexShrink: 0,
                      }}
                    >
                      {project.status}
                    </span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--color-gray-500)", flexShrink: 0, whiteSpace: "nowrap" }}>
                      {formatDate(project.updated_at)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-8">
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-base)", fontWeight: 600, color: "var(--color-light)", marginBottom: "var(--space-4)" }}>
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "New Project", href: "/admin/projects/new" },
            { label: "Manage Leads", href: "/admin/leads" },
            { label: "Edit Navigation", href: "/admin/navigation" },
            { label: "Site Settings", href: "/admin/settings" },
          ].map((action) => (
            <a
              key={action.label}
              href={action.href}
              className="group inline-flex items-center gap-2"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                fontWeight: 500,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "var(--color-light)",
                backgroundColor: "var(--color-deep-navy)",
                border: "1px solid var(--color-gray-700)",
                borderRadius: "var(--radius-md)",
                padding: "8px 16px",
                textDecoration: "none",
                transition: "border-color 150ms, background-color 150ms",
              }}
            >
              {action.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
