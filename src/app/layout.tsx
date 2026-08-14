import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ByteBuildIT — We turn inefficient business processes into software",
    template: "%s | ByteBuildIT",
  },
  description:
    "Software systems for businesses that have outgrown manual work. Business automation, custom software, intelligent systems.",
  keywords: [
    "business automation",
    "custom software",
    "intelligent systems",
    "business process software",
    "workflow automation",
    "enterprise software",
  ],
  authors: [{ name: "ByteBuildIT" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ByteBuildIT",
    title: "ByteBuildIT — We turn inefficient business processes into software",
    description:
      "Software systems for businesses that have outgrown manual work. Business automation, custom software, intelligent systems.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ByteBuildIT — We turn inefficient business processes into software",
    description:
      "Software systems for businesses that have outgrown manual work. Business automation, custom software, intelligent systems.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000F26",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
