import { motion } from "framer-motion";

const AboutFooter = () => {
  return (
    <footer className="px-8 md:px-16 pt-32 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32"
      >
        {/* About */}
        <div>
          <h3 className="font-mono text-sm uppercase tracking-tight text-muted-foreground mb-6">About</h3>
          <p className="text-lg leading-relaxed max-w-[50ch]">
            An independent design studio focused on brand identity, art direction, 
            and digital experiences for cultural institutions, architects, and luxury brands. 
            We build systems that are precise, restrained, and enduring.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-mono text-sm uppercase tracking-tight text-muted-foreground mb-6">Contact</h3>
          <div className="space-y-3 text-lg">
            <a href="mailto:hello@studio.com" className="block hover:text-muted-foreground transition-colors duration-300">
              hello@studio.com
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="block hover:text-muted-foreground transition-colors duration-300">
              Instagram
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="block hover:text-muted-foreground transition-colors duration-300">
              LinkedIn
            </a>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="mt-32 flex justify-between items-end"
      >
        <span className="font-mono text-sm text-muted-foreground uppercase tracking-tight">
          © 2024
        </span>
        <span className="font-mono text-sm text-muted-foreground uppercase tracking-tight">
          Selected Works
        </span>
      </motion.div>
    </footer>
  );
};

export default AboutFooter;
