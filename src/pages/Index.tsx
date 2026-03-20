import { useState } from "react";
import { motion } from "framer-motion";
import PulgaTetris from "@/components/PulgaTetris";
import ProjectCarousel from "@/components/ProjectCarousel";
import logo from "@/assets/logo.svg";
import calendarIcon from "@/assets/calendar.svg";

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
  const [showGame, setShowGame] = useState(false);
  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden">
      {/* Mobile nav - above logo */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="md:hidden px-8 pt-8 pb-4 flex justify-between text-xs uppercase tracking-tight font-sans font-normal text-muted-foreground">
        <a href="mailto:hey@pequeno.studio" className="hover:text-foreground transition-colors duration-300">
          hey@pequeno.studio
        </a>
        <a href="https://www.instagram.com/joaohmartinss/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors duration-300">
          Instagram
        </a>
        <a href="https://www.linkedin.com/in/joaohenriquems/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors duration-300">
          LinkedIn
        </a>
        <a href="https://cal.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors duration-300 inline-flex items-center gap-1">
          <img src={calendarIcon} alt="" className="h-3 w-3" />
          Book a Call
        </a>
      </motion.nav>

      {/* Header */}
      <header className="px-8 md:px-16 pt-4 md:pt-12 pb-4 flex justify-between items-start">
        <div className="flex flex-col">
          <motion.img
            src={logo}
            alt="Pequeno logo"
            onClick={() => setShowGame(true)}
            style={{ cursor: 'default' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
            className="h-4 w-4 mb-1" />
          
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
            className="text-5xl font-bold tracking-tighter md:text-xl">
            Pequeno
          </motion.h1>
        </div>
        {/* Desktop nav */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden md:flex gap-4 text-xs uppercase tracking-tight pt-4 font-sans font-normal text-muted-foreground">
          <a href="mailto:hey@pequeno.studio" className="hover:text-foreground transition-colors duration-300">
            hey@pequeno.studio
          </a>
          <a href="https://www.instagram.com/joaohmartinss/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors duration-300">
            Instagram
          </a>
          <a href="https://www.linkedin.com/in/joaohenriquems/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors duration-300">
            LinkedIn
          </a>
          <a href="https://cal.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors duration-300 inline-flex items-center gap-1">
            <img src={calendarIcon} alt="" className="h-3 w-3" />
            Book a Call
          </a>
        </motion.nav>
      </header>

      {/* About + Subtitle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="px-8 md:px-16 pb-24">
        <p className="text-xs text-muted-foreground leading-relaxed max-w-[50ch]">From Portuguese: small. Not a measure of ambition, but of approach: focused, precise, nimble. A design practice dedicated to shaping thoughtful and beautiful brand identities. Working closely with founders and with strategy agencies that need sharp, reliable execution. From São Paulo, working worldwide.
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
        <div className="flex flex-col md:flex-row md:justify-between md:items-end font-sans gap-4">
          <span className="text-xs text-muted-foreground uppercase tracking-tight">© 2026 Pequeno Studio — based in São Paulo, working worldwide</span>
          <div className="flex gap-4 text-xs uppercase tracking-tight text-muted-foreground">
            <a href="mailto:hey@pequeno.studio" className="hover:text-foreground transition-colors duration-300">
              hey@pequeno.studio
            </a>
            <a href="https://www.instagram.com/joaohmartinss/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors duration-300">
              Instagram
            </a>
            <a href="https://www.linkedin.com/in/joaohenriquems/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors duration-300">
              LinkedIn
            </a>
            <a href="https://cal.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors duration-300 inline-flex items-center gap-1">
              <img src={calendarIcon} alt="" className="h-3 w-3" />
              Book a Call
            </a>
          </div>
        </div>
      </footer>
      <PulgaTetris open={showGame} onClose={() => setShowGame(false)} />
    </div>);

};

export default Index;
