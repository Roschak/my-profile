"use client";
import { motion } from "framer-motion";

export default function Template({ children }) {
  return (
    <>
      {/* Lightning Flash Transition */}
      <motion.div 
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "var(--white)", // marble flash
          zIndex: 9999,
          pointerEvents: "none",
          mixBlendMode: "overlay"
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}
