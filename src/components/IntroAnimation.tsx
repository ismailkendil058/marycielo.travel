import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation = ({ onComplete }: IntroAnimationProps) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // Phase 1: Horizon Line & Glow - Starts at 0s
    // Phase 2: Brand Name Appearance - Starts at 0.8s
    // Phase 3: Airplane/Glide Path - Starts at 1.5s
    // Phase 4: Final Hold & Fadeout - Starts at 3.5s

    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 3500),
      setTimeout(() => onComplete(), 4500),
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505] overflow-hidden">
      {/* Background Ambient Glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,#F0E7C8_0%,transparent_50%)]"
      />

      <div className="relative flex flex-col items-center">
        {/* The Horizon Line */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "240px", opacity: 0.6 }}
          transition={{ duration: 1.5, ease: "circOut" }}
          className="h-[1px] bg-gradient-to-r from-transparent via-[#F0E7C8] to-transparent mb-8"
        />

        {/* The Brand Name */}
        <div className="relative overflow-hidden h-12 flex items-center">
          <motion.h1
            initial={{ y: 40, opacity: 0, letterSpacing: "1em" }}
            animate={{ y: 0, opacity: 1, letterSpacing: "0.4em" }}
            transition={{
              y: { duration: 1.2, ease: [0.19, 1, 0.22, 1] },
              opacity: { duration: 1, delay: 0.2 },
              letterSpacing: { duration: 2, ease: "easeOut" }
            }}
            className="font-display text-2xl md:text-4xl text-[#F0E7C8] uppercase font-light"
          >
            marycielo.travel
          </motion.h1>

          {/* Shimmer Effect */}
          <motion.div
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{ duration: 2, delay: 1.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
            className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]"
          />
        </div>

        {/* The Subtle Glide Path */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 100, opacity: [0, 0.4, 0] }}
          transition={{ duration: 2.5, delay: 1, ease: "linear", repeat: Infinity }}
          className="absolute -top-4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F0E7C8] to-transparent"
          style={{ width: '40px' }}
        />
      </div>

      {/* Discret Skip Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        whileHover={{ opacity: 0.8 }}
        transition={{ delay: 2.5, duration: 1 }}
        onClick={onComplete}
        className="absolute bottom-10 font-body text-[10px] tracking-[0.3em] uppercase text-[#F0E7C8] border-b border-transparent hover:border-[#F0E7C8] pb-1 transition-all"
      >
        Explorer
      </motion.button>

      {/* Final Fadeout Overlay */}
      <AnimatePresence>
        {phase === 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0 bg-white z-[110] pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default IntroAnimation;
