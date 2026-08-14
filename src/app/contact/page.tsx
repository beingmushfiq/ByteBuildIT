import type { Metadata } from "next";
import Navigation from "@/components/navigation/Navigation";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us about your broken process. We'll figure out what it could become. Start a project with ByteBuildIT.",
  openGraph: {
    title: "Contact | ByteBuildIT",
    description:
      "Tell us about your broken process. We'll figure out what it could become.",
  },
};

export default function ContactPage() {
  return (
    <>
      <Navigation />
      <main>
        <Contact />
      </main>
      <Footer />
    </>
  );
}
