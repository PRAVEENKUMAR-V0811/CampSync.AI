import React from 'react';
import { motion } from 'framer-motion';

const LogoLoader = () => {
  // Brand blue updated to match the SVG data provided (#0D00A6)
  const brandBlue = "#0D00A6";

  const segmentVariants = {
    initial: (direction) => ({
      x: direction.x,
      y: direction.y,
      opacity: 0,
      scale: 0.8
    }),
    animate: {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 12,
        delay: 0.3
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-white">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear"
        }}
        className="relative w-32 h-32 md:w-40 md:h-40"
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* LEFT SIDE: LEFT AS IS PER INSTRUCTIONS */}
          {/* Top Left Segment (Thick Arc) */}
          <motion.path
            custom={{ x: -15, y: -15 }}
            variants={segmentVariants}
            initial="initial"
            animate="animate"
            d="M 48,8 A 42,42 0 0 0 8,48 L 26,48 A 24,24 0 0 1 48,26 Z"
            fill={brandBlue}
          />

          {/* Bottom Left Segment (Thin Arc) */}
          <motion.path
            custom={{ x: -15, y: 15 }}
            variants={segmentVariants}
            initial="initial"
            animate="animate"
            d="M 8,52 A 42,42 0 0 0 48,92 L 48,78 A 28,28 0 0 1 22,52 Z"
            fill={brandBlue}
          />

          {/* RIGHT SIDE: INCREASED VERTICAL SPACE */}
          {/* Top Right Segment (Solid Quadrant - shortened vertically) */}
          <motion.path
            custom={{ x: 15, y: -15 }}
            variants={segmentVariants}
            initial="initial"
            animate="animate"
            // Changed bottom Y from 48 to 41 to increase space
            d="M 52,8 A 42,42 0 0 1 92,41 L 52,41 Z"
            fill={brandBlue}
          />

          {/* Bottom Right Segment (Solid Quadrant - shortened vertically) */}
          <motion.path
            custom={{ x: 15, y: 15 }}
            variants={segmentVariants}
            initial="initial"
            animate="animate"
            // Changed top Y from 52 to 59 to increase space
            d="M 92,59 A 42,42 0 0 1 52,92 L 52,59 Z"
            fill={brandBlue}
          />
        </svg>

        <motion.div 
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent pointer-events-none"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="mt-10 text-center"
      >
        <h1 
          className="text-3xl md:text-4xl font-bold tracking-tight"
          style={{ color: brandBlue, fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          CampSync<span className="opacity-80">.AI</span>
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="text-sm mt-2 text-slate-500 font-medium tracking-wide"
        >
          INTELLIGENT CAMPUS MANAGEMENT
        </motion.p>
        
        <div className="w-32 h-1 bg-slate-100 mt-4 mx-auto overflow-hidden rounded-full">
          <motion.div
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full"
            style={{ backgroundColor: brandBlue }}
          />
        </div>
      </motion.div>
      </div>
  );
};

export default LogoLoader;


