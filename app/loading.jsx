"use client";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "var(--bg)",
      zIndex: 9999
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 1.2, 
          repeat: Infinity, 
          repeatType: "reverse",
          ease: "easeInOut"
        }}
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "2rem",
          color: "var(--gold)",
          letterSpacing: "0.3em",
          textShadow: "0 0 20px var(--gold-dim)"
        }}
      >
        OLYMPUS
      </motion.div>
    </div>
  );
}
