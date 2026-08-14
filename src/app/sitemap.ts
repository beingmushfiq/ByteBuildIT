import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const STATIC_PAGES = [
  { path: "", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/work", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/solutions", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/industries", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
];

function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://bytebuildit.com").replace(
    /\/$/,
    ""
  );
}

// Minimal types for sitemap queries (avoids Supabase select inference issues)
interface SitemapRow {
  slug: string;
  updated_at: string;
}

interface ProjectSitemapRow extends SitemapRow {
  published_at: string | null;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date().toISOString();

  // Static pages
  for (const page of STATIC_PAGES) {
    entries.push({
      url: `${siteUrl}${page.path}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    });
  }

  try {
    const supabase = await createClient();

    // Fetch published projects, solutions, industries, and CMS pages in parallel
    const [projectsRes, solutionsRes, industriesRes, pagesRes] = await Promise.all([
      supabase
        .from("projects")
        .select("slug, updated_at, published_at")
        .eq("is_published", true),
      supabase
        .from("solutions")
        .select("slug, updated_at")
        .eq("is_published", true),
      supabase
        .from("industries")
        .select("slug, updated_at")
        .eq("is_published", true),
      supabase
        .from("pages")
        .select("slug, updated_at, published_at")
        .eq("is_published", true)
        .not("slug", "in", "(home,work,solutions,industries,about,contact)"),
    ]);

    // Projects
    if (projectsRes.data) {
      for (const project of projectsRes.data as unknown as ProjectSitemapRow[]) {
        entries.push({
          url: `${siteUrl}/work/${project.slug}`,
          lastModified: project.updated_at ?? project.published_at ?? now,
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    }

    // Solutions
    if (solutionsRes.data) {
      for (const solution of solutionsRes.data as unknown as SitemapRow[]) {
        entries.push({
          url: `${siteUrl}/solutions/${solution.slug}`,
          lastModified: solution.updated_at ?? now,
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    }

    // Industries
    if (industriesRes.data) {
      for (const industry of industriesRes.data as unknown as SitemapRow[]) {
        entries.push({
          url: `${siteUrl}/industries/${industry.slug}`,
          lastModified: industry.updated_at ?? now,
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    }

    // CMS pages (dynamic pages that aren't static routes)
    if (pagesRes.data) {
      for (const page of pagesRes.data as unknown as ProjectSitemapRow[]) {
        entries.push({
          url: `${siteUrl}/${page.slug}`,
          lastModified: page.updated_at ?? page.published_at ?? now,
          changeFrequency: "weekly",
          priority: 0.6,
        });
      }
    }
  } catch {
    // On DB error, return just the static pages
  }

  return entries;
}
