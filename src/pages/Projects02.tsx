import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { cdnImage, cdnSrcSet } from "@/lib/image";
import logo from "@/assets/logo.svg";

interface ProjectRow {
  title: string;
  role: string;
  images: string[];
}

const Projects02 = () => {
  const [projects, setProjects] = useState<ProjectRow[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("projects")
        .select("title, role, images, sort_order")
        .order("sort_order", { ascending: true });
      if (!active || !data) return;
      setProjects(
        data.map((p) => ({
          title: p.title,
          role: p.role || "",
          images: p.images || [],
        }))
      );
    })();
    return () => {
      active = false;
    };
  }, []);


  const allImages = projects.flatMap((p) =>
    p.images.map((src, i) => ({ src, title: p.title, role: p.role, isFirst: i === 0 }))
  );

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <div className="md:flex md:min-h-screen">
        {/* Left fixed sidebar */}
        <aside className="md:fixed md:top-0 md:left-0 md:h-screen md:w-[38%] lg:w-[32%] xl:w-[28%] md:overflow-y-auto px-8 md:px-12 py-10 md:py-12 flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
            className="flex items-center gap-3 mb-12"
          >
            <img src={logo} alt="Pequeno" className="h-5 w-5" />
            <span className="text-sm font-semibold tracking-tight">Pequeno</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.2, 0, 0, 1] }}
            className="text-2xl md:text-[1.6rem] leading-[1.15] tracking-tighter font-semibold mb-6"
          >
            Brand identities for founders and strategy partners.
          </motion.h1>

          <p className="text-xs text-muted-foreground leading-relaxed max-w-[42ch] mb-10">
            From Portuguese: small. Not a measure of ambition, but of approach — focused, precise, nimble. A design practice shaping thoughtful brand identities from São Paulo, working worldwide.
          </p>

          <div className="mb-10">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-4">Selected clients</p>
            <ul className="grid grid-cols-2 gap-y-1.5 gap-x-4 text-sm tracking-tight">
              {projects.map((p) => (
                <li key={p.title}>{p.title}</li>
              ))}
            </ul>
          </div>

          <div className="flex gap-2 mb-10">
            <a
              href="mailto:hey@pequeno.studio"
              className="px-4 py-2 rounded-full bg-foreground text-background text-xs uppercase tracking-tight hover:opacity-80 transition"
            >
              Get in touch
            </a>
            <a
              href="https://cal.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full border border-border text-xs uppercase tracking-tight hover:bg-muted transition"
            >
              Book a call
            </a>
          </div>

          <div className="mb-10">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3">Services</p>
            <ul className="grid grid-cols-2 gap-y-1.5 gap-x-4 text-sm tracking-tight text-muted-foreground">
              <li>Brand identity</li>
              <li>Art direction</li>
              <li>Naming</li>
              <li>Typography</li>
              <li>Packaging</li>
              <li>Web design</li>
            </ul>
          </div>

          <div className="mt-auto pt-8 flex flex-col gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
            <span>© 2026 Pequeno Studio</span>
            <span>São Paulo — Worldwide</span>
          </div>
        </aside>

        {/* Right scrollable gallery */}
        <main className="md:ml-[38%] lg:ml-[32%] xl:ml-[28%] md:w-[62%] lg:w-[68%] xl:w-[72%] px-8 md:px-10 py-10 md:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
            {allImages.map((item, i) => (
              <motion.figure
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.6, delay: (i % 6) * 0.04, ease: [0.2, 0, 0, 1] }}
                className={`relative overflow-hidden bg-muted ${
                  i % 7 === 0 ? "sm:col-span-2" : ""
                }`}
              >
                <img
                  src={cdnImage(item.src, 960)}
                  srcSet={cdnSrcSet(item.src, [480, 720, 960, 1280])}
                  sizes="(min-width: 768px) 35vw, 100vw"
                  alt={item.title}
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  fetchPriority={i === 0 ? "high" : i < 3 ? "auto" : "low"}
                  className="w-full h-auto block"
                />

                {item.isFirst && (
                  <figcaption className="absolute left-3 bottom-3 text-[10px] uppercase tracking-wider text-background/90 bg-foreground/70 backdrop-blur px-2 py-1 rounded">
                    {item.title} — {item.role}
                  </figcaption>
                )}
              </motion.figure>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Projects02;
