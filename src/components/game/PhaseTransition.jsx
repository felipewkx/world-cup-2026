import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PhaseTransition({ show, title, subtitle, icon = '⚽', onDone, duration = 2200 }) {
  useEffect(() => {
    if (show) {
      const t = setTimeout(onDone, duration);
      return () => clearTimeout(t);
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="phase-transition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(12px)' }}
        >
          {/* Subtle light shafts */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[1/2, 1/3, 2/3].map((x, i) => (
              <motion.div
                key={i}
                className="absolute top-0 h-full"
                style={{
                  left: `${x * 100}%`,
                  width: i === 0 ? '2px' : '1px',
                  background: `linear-gradient(to bottom, rgba(245,196,0,${i === 0 ? 0.4 : 0.18}), transparent)`,
                }}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              />
            ))}
          </div>

          {/* Gold glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, rgba(245,196,0,0.08) 0%, transparent 60%)' }}
          />

          <div className="relative z-10 text-center px-6">
            <motion.div
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', duration: 0.8, bounce: 0.5 }}
              className="text-7xl md:text-9xl mb-6"
            >
              {icon}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="font-display font-black text-3xl md:text-5xl mb-3"
              style={{
                background: 'linear-gradient(135deg, #B8900C, #F5C400, #FFE066, #F5C400, #B8900C)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {title}
            </motion.h1>

            {subtitle && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-base md:text-lg font-body"
                style={{ color: '#6C757D' }}
              >
                {subtitle}
              </motion.p>
            )}

            {/* Progress bar */}
            <motion.div
              className="mt-10 mx-auto w-48 h-1 rounded-full overflow-hidden"
              style={{ background: '#E9ECEF' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #F5C400, #FFD84D)' }}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: duration / 1000 - 0.3, delay: 0.3, ease: 'linear' }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}