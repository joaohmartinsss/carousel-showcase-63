import { motion } from "framer-motion";
import ProjectCarousel from "@/components/ProjectCarousel";

import project1a from "@/assets/project-1a.jpg";
import project1b from "@/assets/project-1b.jpg";
import project1c from "@/assets/project-1c.jpg";
import project2a from "@/assets/project-2a.jpg";
import project2b from "@/assets/project-2b.jpg";
import project2c from "@/assets/project-2c.jpg";
import project3a from "@/assets/project-3a.jpg";
import project3b from "@/assets/project-3b.jpg";
import project3c from "@/assets/project-3c.jpg";
import project4a from "@/assets/project-4a.jpg";
import project4b from "@/assets/project-4b.jpg";
import project4c from "@/assets/project-4c.jpg";

const projects = [
{
  title: "Más Group",
  index: "01",
  role: "BRAND IDENTITY",
  images: [project1a, project1b, project1c]
},
{
  title: "Arcway",
  index: "02",
  role: "BRAND IDENTITY",
  images: [project2a, project2b, project2c]
},
{
  title: "Entelo",
  index: "03",
  role: "BRAND IDENTITY",
  images: [project3a, project3b, project3c]
},
{
  title: "Tino",
  index: "04",
  role: "BRAND IDENTITY",
  images: [project4a, project4b, project4c]
}];

const Index = () => {
  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden">
      {/* Header */}
      <header className="px-8 md:px-16 pt-12 pb-4 flex justify-between items-start">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
          className="text-5xl font-bold tracking-tighter md:text-lg">
          Pequeno
        </motion.h1>
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex gap-4 text-xs uppercase tracking-tight pt-4 font-sans font-normal text-muted-foreground">
          <a href="mailto:hello@pequeno.studio" className="hover:text-foreground transition-colors duration-300">
            hello@pequeno.studio
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors duration-300">
            Instagram
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors duration-300">
            LinkedIn
          </a>
        </motion.nav>
      </header>

      {/* About + Subtitle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="px-8 md:px-16 pb-24">
        <p className="text-muted-foreground uppercase tracking-tight font-sans font-normal text-xs mb-6">
          MULTIDISCIPLINARY DESIGN STUDIO
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-[50ch]">
          (adj.) — from Portuguese, meaning small. Not a measure of ambition, but of approach: focused, precise, and nimble. A design practice dedicated to shaping clear, enduring brand identities. Working closely with founders or in sync with agencies that need sharp, reliable execution. Moving fluidly between one-off projects and long-term collaborations, with a focus on clarity, consistency, and quiet precision.
        </p>
      </motion.div>

      {/* Projects */}
      <div id="work">
        {projects.map((project) =>
        <ProjectCarousel
          key={project.index}
          title={project.title}
          index={project.index}
          role={project.role}
          images={project.images} />
        )}
      </div>

      {/* Footer */}
      <footer className="px-8 md:px-16 py-16">
        <div className="flex justify-between items-end font-sans">
          <span className="text-sm text-muted-foreground uppercase tracking-tight">© 2026</span>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors duration-300">
              Instagram
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors duration-300">
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
