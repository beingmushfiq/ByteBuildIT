import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/ui/Cursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    "ByteBuildIT",
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
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#05080F",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <Cursor />
        {children}
      </body>
    </html>
  );
}
