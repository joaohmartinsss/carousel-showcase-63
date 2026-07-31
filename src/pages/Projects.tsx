import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProjectCarousel from "@/components/ProjectCarousel";
import logo from "@/assets/logo.svg";
import calendarIcon from "@/assets/calendar.svg";
import { supabase } from "@/integrations/supabase/client";

interface ProjectData {
  title: string;
  index: string;
  role: string;
  images: string[];
}

const Projects = () => {
  const [projects, setProjects] = useState<ProjectData[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("projects")
        .select("title, role, images, sort_order")
        .order("sort_order", { ascending: true });
      if (!active || !data) return;
      setProjects(
        data.map((p, i) => ({
          title: p.title,
          role: p.role || "",
          images: p.images || [],
          index: String(i + 1).padStart(2, "0"),
        }))
      );
    })();
    return () => {
      active = false;
    };
  }, []);


  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden">
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="md:hidden px-8 pt-8 pb-4 flex justify-between text-xs uppercase tracking-tight font-sans font-normal text-muted-foreground"
      >
        <a
          href="https://cal.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors duration-300 inline-flex items-center gap-1"
        >
          <img src={calendarIcon} alt="" className="h-3 w-3" />
          Book a Call
        </a>
      </motion.nav>

      <header className="px-8 md:px-16 pt-4 md:pt-12 pb-4 flex justify-between items-start">
        <div className="flex flex-col">
          <motion.img
            src={logo}
            alt="Pequeno logo"
            style={{ cursor: "default" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
            className="h-4 w-4 mb-1"
          />
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
            className="text-5xl font-bold tracking-tighter md:text-xl"
          >
            Pequeno
          </motion.h1>
        </div>
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden md:flex gap-4 text-xs uppercase tracking-tight pt-4 font-sans font-normal text-muted-foreground"
        >
          <a
            href="https://cal.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors duration-300 inline-flex items-center gap-1"
          >
            <img src={calendarIcon} alt="" className="h-3 w-3" />
            Book a Call
          </a>
        </motion.nav>
      </header>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="px-8 md:px-16 pb-24"
      >
        <p className="text-xs text-muted-foreground leading-relaxed max-w-[50ch]">
          Pequeno means small. That's the point.
          <br />
          <br />
          We design brand identities. Senior work, no layers between you and the person doing it. Working with founders and strategy agencies, from São Paulo to anywhere.
        </p>
      </motion.div>

      <div id="work">
        {projects.map((project) => (
          <ProjectCarousel
            key={project.index}
            title={project.title}
            index={project.index}
            role={project.role}
            images={project.images}
          />
        ))}
      </div>

      <footer className="px-8 md:px-16 py-16">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end font-sans gap-4">
          <span className="text-xs text-muted-foreground uppercase tracking-tight">
            © 2026 Pequeno Studio — based in São Paulo, working worldwide
          </span>
          <div className="flex gap-4 text-xs uppercase tracking-tight text-muted-foreground">
            <a
              href="mailto:hey@pequeno.studio"
              className="hover:text-foreground transition-colors duration-300"
            >
              hey@pequeno.studio
            </a>
            <a
              href="https://www.instagram.com/joaohmartinss/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors duration-300"
            >
              Instagram
            </a>
            <a
              href="https://www.linkedin.com/in/joaohenriquems/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors duration-300"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Projects;
