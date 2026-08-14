import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { generateMetadata as buildMetadata, generateJsonLd } from "@/lib/seo";
import type { Page, PageSection } from "@/lib/supabase/types";

type PageWithSections = Page & {
  sections: PageSection[];
};

// ── Reserved slugs that have their own route handlers ────────────

const RESERVED_SLUGS = new Set([
  "home",
  "work",
  "solutions",
  "industries",
  "about",
  "contact",
  "admin",
  "api",
  "sitemap",
  "robots",
]);

// ── Metadata ─────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  if (RESERVED_SLUGS.has(slug)) {
    return {};
  }

  const supabase = await createClient();

  const { data } = await supabase
    .from("pages")
    .select("title, slug, description, meta_title, meta_description, thumbnail_url, updated_at, published_at")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!data) {
    return {};
  }

  return buildMetadata(data as Page);
}

// ── Page Component ───────────────────────────────────────────────

export default async function CMSPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (RESERVED_SLUGS.has(slug)) {
    notFound();
  }

  const supabase = await createClient();

  const { data } = await supabase
    .from("pages")
    .select(`
      *,
      sections:page_sections(*)
    `)
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!data) {
    notFound();
  }

  const page = data as PageWithSections;

  // Sort sections by sort_order and filter to visible
  if (page.sections && Array.isArray(page.sections)) {
    page.sections.sort((a, b) => a.sort_order - b.sort_order);
    page.sections = page.sections.filter((s) => s.is_visible);
  }

  // Generate structured data
  const jsonLd = generateJsonLd("WebPage", page);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        {page.sections.map((section) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
        {(!page.sections || page.sections.length === 0) && (
          <section className="section container">
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-4xl)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--color-light)", marginBottom: "var(--space-4)" }}>
              {page.title}
            </h1>
            {page.description && (
              <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-lg)", color: "var(--color-muted)", maxWidth: 640 }}>
                {page.description}
              </p>
            )}
          </section>
        )}
      </main>
    </>
  );
}

// ── Section Renderer ─────────────────────────────────────────────

function SectionRenderer({ section }: { section: PageSection }) {
  switch (section.section_type) {
    case "hero":
      return <HeroSection section={section} />;
    case "content":
      return <ContentSection section={section} />;
    case "faq":
      return <FAQSection section={section} />;
    case "cta":
      return <CTASection section={section} />;
    case "gallery":
      return <GallerySection section={section} />;
    default:
      return <ContentSection section={section} />;
  }
}

function HeroSection({ section }: { section: PageSection }) {
  return (
    <section
      className="container"
      style={{
        paddingTop: "var(--space-32)",
        paddingBottom: "var(--space-24)",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-5xl)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--color-light)", lineHeight: 1.1, marginBottom: "var(--space-6)" }}>
        {section.title}
      </h1>
      {section.content && (
        <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-lg)", color: "var(--color-muted)", maxWidth: 640, margin: "0 auto", lineHeight: 1.6 }}>
          {section.content}
        </p>
      )}
    </section>
  );
}

function ContentSection({ section }: { section: PageSection }) {
  return (
    <section className="section container">
      {section.title && (
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-3xl)", fontWeight: 600, letterSpacing: "-0.02em", color: "var(--color-light)", marginBottom: "var(--space-6)" }}>
          {section.title}
        </h2>
      )}
      {section.content && (
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-base)",
            color: "var(--color-neutral)",
            lineHeight: 1.7,
            maxWidth: 720,
          }}
          dangerouslySetInnerHTML={{ __html: section.content }}
        />
      )}
    </section>
  );
}

function FAQSection({ section }: { section: PageSection }) {
  let faqs: { question: string; answer: string }[] = [];

  if (section.metadata && typeof section.metadata === "object" && "faqs" in section.metadata) {
    faqs = (section.metadata as { faqs: { question: string; answer: string }[] }).faqs;
  }

  return (
    <section className="section container">
      {section.title && (
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-3xl)", fontWeight: 600, letterSpacing: "-0.02em", color: "var(--color-light)", marginBottom: "var(--space-8)" }}>
          {section.title}
        </h2>
      )}
      <div style={{ maxWidth: 720 }}>
        {faqs.map((faq, i) => (
          <div
            key={i}
            style={{
              borderBottom: "1px solid var(--color-gray-700)",
              padding: "var(--space-4) 0",
            }}
          >
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--color-light)", marginBottom: "var(--space-2)" }}>
              {faq.question}
            </h3>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-muted)", lineHeight: 1.6 }}>
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTASection({ section }: { section: PageSection }) {
  return (
    <section
      className="section container"
      style={{ textAlign: "center" }}
    >
      <div style={{ padding: "var(--space-12)", backgroundColor: "var(--color-deep-navy)", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-gray-700)" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-3xl)", fontWeight: 600, letterSpacing: "-0.02em", color: "var(--color-light)", marginBottom: "var(--space-4)" }}>
          {section.title}
        </h2>
        {section.content && (
          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-base)", color: "var(--color-muted)", marginBottom: "var(--space-6)", maxWidth: 480, margin: "0 auto var(--space-6)" }}>
            {section.content}
          </p>
        )}
        <Link
          href="/contact"
          className="btn btn-primary"
          style={{ textDecoration: "none" }}
        >
          Get in Touch
        </Link>
      </div>
    </section>
  );
}

function GallerySection({ section }: { section: PageSection }) {
  let images: { url: string; alt?: string }[] = [];

  if (section.metadata && typeof section.metadata === "object" && "images" in section.metadata) {
    images = (section.metadata as { images: { url: string; alt?: string }[] }).images;
  }

  return (
    <section className="section container">
      {section.title && (
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-3xl)", fontWeight: 600, letterSpacing: "-0.02em", color: "var(--color-light)", marginBottom: "var(--space-8)" }}>
          {section.title}
        </h2>
      )}
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
        {images.map((img, i) => (
          <div
            key={i}
            style={{
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              backgroundColor: "var(--color-deep-navy)",
              border: "1px solid var(--color-gray-700)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.url}
              alt={img.alt || section.title}
              style={{ width: "100%", height: 240, objectFit: "cover", display: "block" }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
