import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/lib/themeContext';

export default function StadiumBackground() {
  const { isDark } = useTheme();

  if (isDark) {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Pure black base */}
        <div className="absolute inset-0" style={{ background: '#000000' }} />

        {/* Neon blue — top left */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,162,255,0.12) 0%, transparent 65%)', filter: 'blur(60px)' }} />

        {/* Neon green — top center pulse */}
        <motion.div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[280px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(57,255,20,0.07) 0%, transparent 60%)', filter: 'blur(40px)' }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Neon red — right */}
        <div className="absolute top-1/3 -right-20 w-[320px] h-[320px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,49,49,0.08) 0%, transparent 65%)', filter: 'blur(50px)' }} />

        {/* Neon pink — bottom */}
        <div className="absolute -bottom-16 left-1/3 w-[380px] h-[240px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(255,16,240,0.06) 0%, transparent 62%)', filter: 'blur(45px)' }} />

        {/* Subtle dark grid */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,162,255,0.4) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(0,162,255,0.4) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Scanline overlay for gaming feel */}
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)',
          }}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0" style={{ background: '#F8F9FA' }} />
      <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(37,154,90,0.09) 0%, transparent 68%)', filter: 'blur(50px)' }} />
      <motion.div
        className="absolute -top-20 left-1/2 -translate-x-1/2 w-[560px] h-[260px] rounded-full"
        style={{ background: 'radial-gradient(ellipse, rgba(234,179,8,0.10) 0%, transparent 62%)', filter: 'blur(30px)' }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute top-1/3 -right-20 w-[300px] h-[300px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(229,53,53,0.06) 0%, transparent 68%)', filter: 'blur(40px)' }} />
      <div className="absolute -bottom-16 left-1/3 w-[350px] h-[220px] rounded-full"
        style={{ background: 'radial-gradient(ellipse, rgba(255,138,0,0.07) 0%, transparent 65%)', filter: 'blur(35px)' }} />
      <div className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.2) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,0,0,0.2) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
}