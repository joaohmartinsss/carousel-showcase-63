import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.svg";
import calendarIcon from "@/assets/calendar.svg";

interface Section {
  heading: string;
  body: string;
}

interface OfferingData {
  slug: string;
  title: string;
  tagline: string | null;
  description: string | null;
  sections: Section[];
  images: string[];
  cta_url: string | null;
  cta_label: string | null;
}

const Offering = () => {
  const location = useLocation();
  const slug = location.pathname.replace(/^\//, "");
  const [offering, setOffering] = useState<OfferingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data } = await supabase
        .from("offerings")
        .select("slug, title, tagline, description, sections, images, cta_url, cta_label")
        .eq("slug", slug)
        .maybeSingle();
      if (data) {
        setOffering({
          ...data,
          sections: (data.sections as unknown as Section[]) || [],
          images: data.images || [],
        } as OfferingData);
        document.title = `${data.title} — Pequeno`;
      }
      setLoading(false);
    })();
  }, [slug]);

  if (loading) {
    return <div className="p-8 text-xs text-muted-foreground">Loading…</div>;
  }

  if (!offering) {
    return (
      <div className="p-8 text-sm">
        Not found. <Link to="/" className="underline">Go home</Link>
      </div>
    );
  }

  const ctaUrl = offering.cta_url || "https://cal.com";
  const ctaLabel = offering.cta_label || "Book a call";

  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden">
      {/* Mobile nav */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="md:hidden px-8 pt-8 pb-4 flex justify-between text-xs uppercase tracking-tight font-sans font-normal text-muted-foreground"
      >
        <Link to="/brand-sprints" className="hover:text-foreground transition-colors duration-300">
          Brand Sprints
        </Link>
        <Link to="/inner-circle" className="hover:text-foreground transition-colors duration-300">
          Inner Circle
        </Link>
        <a
          href={ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors duration-300 inline-flex items-center gap-1"
        >
          <img src={calendarIcon} alt="" className="h-3 w-3" />
          Book a Call
        </a>
      </motion.nav>

      {/* Header */}
      <header className="px-8 md:px-16 pt-4 md:pt-12 pb-4 flex justify-between items-start">
        <Link to="/" className="flex flex-col" style={{ cursor: "default" }}>
          <motion.img
            src={logo}
            alt="Pequeno logo"
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
        </Link>
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden md:flex gap-4 text-xs uppercase tracking-tight pt-4 font-sans font-normal text-muted-foreground"
        >
          <Link
            to="/brand-sprints"
            className={`hover:text-foreground transition-colors duration-300 ${
              slug === "brand-sprints" ? "text-foreground" : ""
            }`}
          >
            Brand Sprints
          </Link>
          <Link
            to="/inner-circle"
            className={`hover:text-foreground transition-colors duration-300 ${
              slug === "inner-circle" ? "text-foreground" : ""
            }`}
          >
            Inner Circle
          </Link>
          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors duration-300 inline-flex items-center gap-1"
          >
            <img src={calendarIcon} alt="" className="h-3 w-3" />
            Book a Call
          </a>
        </motion.nav>
      </header>

      {/* Title + tagline */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.2, 0, 0, 1] }}
        className="px-8 md:px-16 pt-12 md:pt-24 pb-12 md:pb-16"
      >
        <p className="text-xs uppercase tracking-tight text-muted-foreground mb-4">
          {offering.title}
        </p>
        {offering.tagline && (
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter max-w-[20ch] mb-8">
            {offering.tagline}
          </h2>
        )}
        {offering.description && (
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-[60ch]">
            {offering.description}
          </p>
        )}

        <div className="mt-10">
          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-foreground px-5 py-3 text-xs uppercase tracking-tight font-sans hover:bg-foreground hover:text-background transition-colors duration-300"
          >
            <img src={calendarIcon} alt="" className="h-3 w-3" />
            {ctaLabel}
          </a>
        </div>
      </motion.section>

      {/* Image gallery (1920x1080) */}
      {offering.images.length > 0 && (
        <section className="px-8 md:px-16 pb-16 md:pb-24 space-y-8 md:space-y-12">
          {offering.images.map((src, i) => (
            <motion.div
              key={src + i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.2, 0, 0, 1] }}
              className="w-full bg-muted"
              style={{ aspectRatio: "1920 / 1080" }}
            >
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
          ))}
        </section>
      )}

      {/* Sections */}
      {offering.sections.length > 0 && (
        <section className="px-8 md:px-16 pb-24 max-w-5xl">
          <div className="space-y-12 md:space-y-16">
            {offering.sections.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                className="grid md:grid-cols-12 gap-4 md:gap-8 border-t border-border pt-8"
              >
                <h3 className="md:col-span-4 text-base md:text-lg font-bold tracking-tighter">
                  {s.heading}
                </h3>
                <p className="md:col-span-8 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {s.body}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="px-8 md:px-16 pb-24">
        <div className="border-t border-border pt-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <p className="text-2xl md:text-4xl font-bold tracking-tighter max-w-[24ch]">
            Ready to start? Let's talk.
          </p>
          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-foreground px-5 py-3 text-xs uppercase tracking-tight font-sans hover:bg-foreground hover:text-background transition-colors duration-300 self-start"
          >
            <img src={calendarIcon} alt="" className="h-3 w-3" />
            {ctaLabel}
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 md:px-16 py-16">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end font-sans gap-4">
          <span className="text-xs text-muted-foreground uppercase tracking-tight">
            © 2026 Pequeno Studio — based in São Paulo, working worldwide
          </span>
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
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Offering;
