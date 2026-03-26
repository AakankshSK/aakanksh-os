import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Education } from "@/components/sections/Education";
import { Contact } from "@/components/sections/Contact";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SystemQueryPanel } from "@/components/ai/SystemQueryPanel";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Education />
      <Contact />
      <SiteFooter />
      <SystemQueryPanel />
    </>
  );
}
