import React from 'react';
import { useI18n } from '@/lib/i18n';
import { motion } from 'framer-motion';

export default function GlobalLanguageBar() {
  const { lang, setLang } = useI18n();

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setLang('pt')}
        className={`text-2xl rounded-lg p-1 transition-all duration-200 ${
          lang === 'pt'
            ? 'ring-2 ring-primary shadow-lg shadow-primary/30'
            : 'opacity-40 hover:opacity-70'
        }`}
        aria-label="Português"
      >
        🇧🇷
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setLang('en')}
        className={`text-2xl rounded-lg p-1 transition-all duration-200 ${
          lang === 'en'
            ? 'ring-2 ring-primary shadow-lg shadow-primary/30'
            : 'opacity-40 hover:opacity-70'
        }`}
        aria-label="English"
      >
        🇺🇸
      </motion.button>
    </div>
  );
}