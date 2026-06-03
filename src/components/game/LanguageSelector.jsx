import React from 'react';
import { useI18n } from '@/lib/i18n';
import { motion } from 'framer-motion';

export default function LanguageSelector() {
  const { lang, setLang } = useI18n();

  return (
    <div className="flex gap-3 items-center">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setLang('pt')}
        className={`text-3xl md:text-4xl transition-all duration-300 rounded-lg p-1.5 ${
          lang === 'pt' ? 'ring-2 ring-primary shadow-lg shadow-primary/20' : 'opacity-50 hover:opacity-80'
        }`}
        aria-label="Português"
      >
        🇧🇷
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setLang('en')}
        className={`text-3xl md:text-4xl transition-all duration-300 rounded-lg p-1.5 ${
          lang === 'en' ? 'ring-2 ring-primary shadow-lg shadow-primary/20' : 'opacity-50 hover:opacity-80'
        }`}
        aria-label="English"
      >
        🇺🇸
      </motion.button>
    </div>
  );
}