import { About } from "@/components/sections/About";
import { Capabilities } from "@/components/sections/Capabilities";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Upskilling } from "@/components/sections/Upskilling";
import { Work } from "@/components/sections/Work";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Capabilities />
      <Work />
      <Projects />
      <Skills />
      <Upskilling />
      <Contact />
    </>
  );
}
