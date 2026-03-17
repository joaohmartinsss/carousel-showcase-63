import { motion } from "framer-motion";
import ProjectCarousel from "@/components/ProjectCarousel";
import AboutFooter from "@/components/AboutFooter";

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
  title: "Project Name",
  index: "01",
  role: "Brand Identity",
  images: [project1a, project1b, project1c]
},
{
  title: "Project Name",
  index: "02",
  role: "Brand Identity",
  images: [project2a, project2b, project2c]
},
{
  title: "Project Name",
  index: "03",
  role: "Art Direction",
  images: [project3a, project3b, project3c]
},
{
  title: "Project Name",
  index: "04",
  role: "Digital Experience",
  images: [project4a, project4b, project4c]
}];


const Index = () => {
  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden">
      {/* Header */}
      <header className="px-8 md:px-16 pt-12 pb-8 flex justify-between items-start">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
          className="text-5xl font-bold tracking-tighter md:text-lg">Pequeno


        </motion.h1>
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex gap-6 text-sm uppercase tracking-tight pt-4 font-sans font-medium">
          
          <a href="#work" className="text-muted-foreground hover:text-foreground transition-colors duration-300">
            Work
          </a>
          <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors duration-300">
            About
          </a>
        </motion.nav>
      </header>

      {/* Subtitle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="px-8 md:px-16 pb-24">
        
        <p className="text-muted-foreground uppercase tracking-tight font-sans font-normal text-xs">MULTIDISCIPLINARY DESIGN STUDIO

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

      {/* About */}
      <div id="about">
        <AboutFooter />
      </div>
    </div>);

};

export default Index;