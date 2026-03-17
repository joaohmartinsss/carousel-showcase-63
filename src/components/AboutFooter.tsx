import { motion } from "framer-motion";

const AboutFooter = () => {
  return (
    <footer className="px-8 md:px-16 pt-32 pb-16 bg-gradient-to-t from-yellow-300 to-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32">
        
        {/* About */}
        <div>
          <h3 className="text-sm uppercase tracking-tight text-muted-foreground mb-6 font-sans font-normal">About</h3>
          <p className="text-lg leading-relaxed max-w-[50ch]">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.



          </p>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-sm uppercase tracking-tight text-muted-foreground mb-6 font-sans font-normal">Contact</h3>
          <div className="space-y-3 text-lg">
            <a href="mailto:hello@studio.com" className="block hover:text-muted-foreground transition-colors duration-300">hello@pequeno.studio

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
        className="mt-32 flex justify-between items-end font-sans">
        
        <span className="text-sm text-muted-foreground uppercase tracking-tight font-sans">© 2026

        </span>
        <span className="text-sm text-muted-foreground uppercase tracking-tight font-sans">
          Selected Works
        </span>
      </motion.div>
    </footer>);

};

export default AboutFooter;