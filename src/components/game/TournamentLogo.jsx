import React from 'react';
import { motion } from 'framer-motion';

export default function TournamentLogo({ size = 'large' }) {
  const s = size === 'large' ? 'w-32 h-32 md:w-40 md:h-40' : 'w-16 h-16';
  const textSize = size === 'large' ? 'text-lg md:text-xl' : 'text-xs';

  return (
    <motion.div
      className={`${s} relative flex items-center justify-center`}
      animate={{ rotateY: [0, 360] }}
      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
    >
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-2 border-primary/40 animate-pulse-glow" />
      <div className="absolute inset-1 rounded-full border border-primary/20" />
      
      {/* Inner glow */}
      <div className="absolute inset-3 rounded-full bg-gradient-to-br from-primary/20 via-secondary/10 to-primary/20" />
      
      {/* Trophy icon */}
      <div className={`relative z-10 font-display font-bold ${textSize} text-primary flex flex-col items-center`}>
        <span className="text-3xl md:text-5xl">🏆</span>
        {size === 'large' && <span className="mt-1 text-[10px] tracking-[0.3em] text-primary/70 uppercase">2026</span>}
      </div>
    </motion.div>
  );
}