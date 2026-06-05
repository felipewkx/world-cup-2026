import React from 'react';
import { useI18n } from '@/lib/i18n';
import { useTheme } from '@/lib/themeContext';
import { motion } from 'framer-motion';
import DarkModeToggle from './DarkModeToggle';

export default function GlobalLanguageBar() {
  const { lang, setLang } = useI18n();
  const { isDark } = useTheme();

  const barStyle = isDark
    ? { background: '#111111', border: '1px solid #292929', boxShadow: '0 2px 12px rgba(0,0,0,0.6)' }
    : { background: '#FFFFFF', border: '1px solid #DDE1E7', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' };

  const activeLangStyle = isDark
    ? { background: 'rgba(0,162,255,0.15)', boxShadow: '0 0 0 1.5px rgba(0,162,255,0.5)' }
    : { background: 'rgba(245,196,0,0.18)', boxShadow: '0 0 0 1.5px rgba(245,196,0,0.6)' };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      {/* Language buttons */}
      <div className="flex gap-1.5 p-1 rounded-xl" style={barStyle}>
        {[
          { code: 'pt', flag: '🇧🇷', label: 'Português' },
          { code: 'en', flag: '🇺🇸', label: 'English' },
        ].map(({ code, flag, label }) => (
          <motion.button
            key={code}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setLang(code)}
            className="text-xl rounded-lg px-2 py-1 transition-all duration-200"
            style={lang === code ? activeLangStyle : { opacity: 0.45 }}
            aria-label={label}
          >
            {flag}
          </motion.button>
        ))}
      </div>

      {/* Dark mode toggle */}
      <DarkModeToggle />
    </div>
  );
}