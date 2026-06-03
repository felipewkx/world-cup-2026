import React, { useEffect, useState } from 'react';
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
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ background: 'radial-gradient(ellipse at center, #0d1525 0%, #060a14 100%)' }}
        >
          {/* Stadium light beams */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-full"
              style={{ background: 'linear-gradient(to bottom, rgba(234,179,8,0.5), transparent)' }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
            />
            <motion.div
              className="absolute top-0 left-1/3 w-[1px] h-full"
              style={{ background: 'linear-gradient(to bottom, rgba(234,179,8,0.2), transparent)' }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            />
            <motion.div
              className="absolute top-0 right-1/3 w-[1px] h-full"
              style={{ background: 'linear-gradient(to bottom, rgba(234,179,8,0.2), transparent)' }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            />
          </div>

          {/* Center glow */}
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at center, rgba(234,179,8,0.08) 0%, transparent 60%)' }}
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
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="font-display font-black text-3xl md:text-5xl bg-gradient-to-r from-primary via-yellow-300 to-primary bg-clip-text text-transparent mb-3"
            >
              {title}
            </motion.h1>

            {subtitle && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-muted-foreground text-base md:text-lg font-body"
              >
                {subtitle}
              </motion.p>
            )}

            {/* Progress bar */}
            <motion.div
              className="mt-10 mx-auto w-48 h-0.5 bg-white/10 rounded-full overflow-hidden"
            >
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-yellow-400 rounded-full"
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