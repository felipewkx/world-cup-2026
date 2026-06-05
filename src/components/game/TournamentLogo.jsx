import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/themeContext";

const COPA1 = "/copa1.png";
const COPA2 = "/copa2.png";

export default function TournamentLogo({ size = "large" }) {
  const { isDark } = useTheme();

  const dim =
    size === "large"
      ? "w-40 h-40 md:w-52 md:h-52"
      : "w-20 h-20";

  const src = isDark ? COPA2 : COPA1;

  return (
    <motion.div
      className={`${dim} relative flex items-center justify-center`}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.img
        key={src}
        src={src}
        alt="FIFA World Cup 2026"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full h-full object-contain"
        style={{
          filter: isDark
            ? "drop-shadow(0 0 18px rgba(0,162,255,0.30)) drop-shadow(0 4px 24px rgba(57,255,20,0.15))"
            : "drop-shadow(0 4px 18px rgba(245,196,0,0.25))",
        }}
      />
    </motion.div>
  );
}