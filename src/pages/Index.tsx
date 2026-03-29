import { useState } from "react";
import { motion } from "framer-motion";
import PulgaTetris from "@/components/PulgaTetris";
import logo from "@/assets/logo.svg";

// ============================================================
// V0 — Landing page (logo + about + tetris)
// ============================================================

const Index = () => {
  const [showGame, setShowGame] = useState(true);

  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden min-h-screen flex flex-col items-center justify-center px-8">
      <div className="flex flex-col items-center">
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
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-sm font-bold tracking-tighter mt-1 mb-12"
        >
          Dropping soon.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <PulgaTetris open={showGame} onClose={() => setShowGame(false)} inline />
        </motion.div>
      </div>
    </div>
  );
};

export default Index;

