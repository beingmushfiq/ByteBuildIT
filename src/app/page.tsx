import SmoothScroll from "@/components/ui/SmoothScroll";
import Navigation from "@/components/navigation/Navigation";
import Hero from "@/components/sections/Hero";
import ComplexitySystem from "@/components/sections/ComplexitySystem";
import ProblemFinder from "@/components/sections/ProblemFinder";
import Projects from "@/components/sections/Projects";
import WhatWeBuild from "@/components/sections/WhatWeBuild";
import ProductStudio from "@/components/sections/ProductStudio";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <SmoothScroll>
      <Navigation />
      <main>
        <Hero />
        <ComplexitySystem />
        <ProblemFinder />
        <Projects />
        <WhatWeBuild />
        <ProductStudio />
        <About />
        <Contact />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
