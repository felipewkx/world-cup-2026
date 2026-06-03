import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/lib/i18n';

const COMMENTARY_EN = [
  "The match is heating up…",
  "What a chance! Shot blocked!",
  "Dangerous free kick position…",
  "The goalkeeper makes a stunning save!",
  "Counter-attack! Racing down the wing…",
  "The crowd is on their feet!",
  "Incredible pressure from the midfield…",
  "The underdog is fighting back!",
  "Corner kick, everyone in the box…",
  "Calculating final result…",
];

const COMMENTARY_PT = [
  "A partida está ficando intensa…",
  "Que chance! Chute bloqueado!",
  "Falta perigosa na entrada da área…",
  "O goleiro faz uma defesa incrível!",
  "Contra-ataque! Correndo pela ala…",
  "A torcida está em pé!",
  "Pressão incrível no meio-campo…",
  "O azarão está reagindo!",
  "Escanteio, todos na área…",
  "Calculando resultado final…",
];

export default function LiveMatchOverlay({ isVisible }) {
  const { lang } = useI18n();
  const [lineIndex, setLineIndex] = useState(0);
  const commentary = lang === 'pt' ? COMMENTARY_PT : COMMENTARY_EN;

  useEffect(() => {
    if (!isVisible) {
      setLineIndex(0);
      return;
    }
    setLineIndex(0);
    const interval = setInterval(() => {
      setLineIndex(i => {
        if (i >= commentary.length - 1) {
          clearInterval(interval);
          return i;
        }
        return i + 1;
      });
    }, 700);
    return () => clearInterval(interval);
  }, [isVisible, lang]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="live-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          style={{ background: 'rgba(6,10,20,0.85)', backdropFilter: 'blur(6px)' }}
        >
          {/* Pulsing stadium light */}
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ background: 'radial-gradient(ellipse at center, rgba(234,179,8,0.06) 0%, transparent 70%)' }}
          />

          <div className="relative z-10 text-center px-8 max-w-xl">
            {/* LIVE badge */}
            <motion.div
              className="flex items-center justify-center gap-2 mb-6"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-red-400 font-display font-bold text-sm tracking-widest uppercase">LIVE</span>
            </motion.div>

            {/* Football animation */}
            <motion.div
              className="text-5xl mb-6"
              animate={{ x: [-15, 15, -15], rotate: [0, 360] }}
              transition={{ x: { duration: 0.8, repeat: Infinity }, rotate: { duration: 1.2, repeat: Infinity, ease: 'linear' } }}
            >
              ⚽
            </motion.div>

            {/* Commentary text */}
            <AnimatePresence mode="wait">
              <motion.p
                key={lineIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
                className="font-display font-bold text-lg md:text-2xl text-foreground"
              >
                {commentary[lineIndex]}
              </motion.p>
            </AnimatePresence>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mt-8">
              {commentary.map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  animate={{
                    backgroundColor: i <= lineIndex ? '#EAB308' : 'rgba(255,255,255,0.15)',
                    scale: i === lineIndex ? 1.4 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}