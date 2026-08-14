import type { Metadata } from "next";

// ── Types ────────────────────────────────────────────────────────

export interface SEOFields {
  title: string;
  slug: string;
  description?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  thumbnail_url?: string | null;
  updated_at?: string;
  published_at?: string | null;
}

export interface SEOOrganization {
  name: string;
  slug: string;
  logo_url?: string | null;
  website_url?: string | null;
  description?: string | null;
}

export interface SEOFAQ {
  question: string;
  answer: string;
}

export type JsonLdType =
  | "Organization"
  | "WebSite"
  | "WebPage"
  | "Product"
  | "FAQPage";

// ── Defaults ─────────────────────────────────────────────────────

const SITE_NAME = "ByteBuildIT";
const SITE_DESCRIPTION =
  "Software systems for businesses that have outgrown manual work. Business automation, custom software, intelligent systems.";
const DEFAULT_OG_IMAGE = "/og-default.png";

function getSiteUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bytebuildit.com";
  return baseUrl.replace(/\/$/, "");
}

// ── Fallbacks ────────────────────────────────────────────────────

export function getSEOFallbacks(entity: SEOFields): {
  title: string;
  description: string;
  ogImage: string;
} {
  const title = entity.meta_title || entity.title || SITE_NAME;
  const description =
    entity.meta_description ||
    entity.description ||
    SITE_DESCRIPTION;
  const ogImage = entity.thumbnail_url || DEFAULT_OG_IMAGE;

  return { title, description, ogImage };
}

// ── Metadata generation ──────────────────────────────────────────

export function generateMetadata(entity: SEOFields): Metadata {
  const { description, ogImage } = getSEOFallbacks(entity);
  const siteUrl = getSiteUrl();
  const fullTitle = entity.meta_title || `${entity.title} | ${SITE_NAME}`;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      type: "website",
      locale: "en_US",
      siteName: SITE_NAME,
      url: `${siteUrl}/${entity.slug}`,
      images: [
        {
          url: ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}`,
          width: 1200,
          height: 630,
          alt: entity.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}`],
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `${siteUrl}/${entity.slug}`,
    },
  };

  return metadata;
}

// ── JSON-LD structured data ──────────────────────────────────────

function buildOrganizationJsonLd(org?: SEOOrganization | null) {
  const siteUrl = getSiteUrl();
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: org?.name ?? SITE_NAME,
    url: org?.website_url ?? siteUrl,
    description: org?.description ?? SITE_DESCRIPTION,
  };

  if (org?.logo_url) {
    data.logo = org.logo_url.startsWith("http")
      ? org.logo_url
      : `${siteUrl}${org.logo_url}`;
  }

  return data;
}

function buildWebSiteJsonLd(org?: SEOOrganization | null) {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: org?.name ?? SITE_NAME,
    url: siteUrl,
    description: org?.description ?? SITE_DESCRIPTION,
    publisher: {
      "@type": "Organization",
      name: org?.name ?? SITE_NAME,
      logo: org?.logo_url
        ? org.logo_url.startsWith("http")
          ? org.logo_url
          : `${siteUrl}${org.logo_url}`
        : undefined,
    },
  };
}

function buildWebPageJsonLd(entity: SEOFields, org?: SEOOrganization | null) {
  const siteUrl = getSiteUrl();
  const { title, description } = getSEOFallbacks(entity);

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${siteUrl}/${entity.slug}`,
    dateModified: entity.updated_at ?? new Date().toISOString(),
    datePublished: entity.published_at ?? entity.updated_at ?? new Date().toISOString(),
    isPartOf: {
      "@type": "WebSite",
      name: org?.name ?? SITE_NAME,
      url: siteUrl,
    },
  };
}

function buildProductJsonLd(
  entity: SEOFields & { price?: string; currency?: string },
  org?: SEOOrganization | null
) {
  const siteUrl = getSiteUrl();
  const { title, description } = getSEOFallbacks(entity);

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: title,
    description,
    url: `${siteUrl}/${entity.slug}`,
    brand: {
      "@type": "Organization",
      name: org?.name ?? SITE_NAME,
    },
  };

  if (entity.thumbnail_url) {
    data.image = entity.thumbnail_url.startsWith("http")
      ? entity.thumbnail_url
      : `${siteUrl}${entity.thumbnail_url}`;
  }

  if (entity.price) {
    data.offers = {
      "@type": "Offer",
      price: entity.price,
      priceCurrency: entity.currency ?? "USD",
      availability: "https://schema.org/InStock",
    };
  }

  return data;
}

function buildFAQPageJsonLd(faqs: SEOFAQ[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateJsonLd(
  type: "Organization",
  org?: SEOOrganization | null
): Record<string, unknown>;
export function generateJsonLd(
  type: "WebSite",
  org?: SEOOrganization | null
): Record<string, unknown>;
export function generateJsonLd(
  type: "WebPage",
  entity: SEOFields,
  org?: SEOOrganization | null
): Record<string, unknown>;
export function generateJsonLd(
  type: "Product",
  entity: SEOFields & { price?: string; currency?: string },
  org?: SEOOrganization | null
): Record<string, unknown>;
export function generateJsonLd(
  type: "FAQPage",
  faqs: SEOFAQ[]
): Record<string, unknown>;
export function generateJsonLd(
  type: JsonLdType,
  entityOrFaqs?: SEOFields | SEOFAQ[] | SEOOrganization | null,
  org?: SEOOrganization | null
): Record<string, unknown> {
  switch (type) {
    case "Organization":
      return buildOrganizationJsonLd(entityOrFaqs as SEOOrganization | null);
    case "WebSite":
      return buildWebSiteJsonLd(entityOrFaqs as SEOOrganization | null);
    case "WebPage":
      return buildWebPageJsonLd(entityOrFaqs as SEOFields, org);
    case "Product":
      return buildProductJsonLd(entityOrFaqs as SEOFields, org);
    case "FAQPage":
      return buildFAQPageJsonLd(entityOrFaqs as SEOFAQ[]);
  }
}
