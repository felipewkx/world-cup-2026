import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/lib/themeContext';
import { Sun, Moon } from 'lucide-react';

export default function DarkModeToggle() {
  const { isDark, toggle } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300"
      style={isDark
        ? { background: '#1a1a1a', border: '1px solid #00A2FF44', boxShadow: '0 0 12px rgba(0,162,255,0.20)' }
        : { background: '#FFFFFF', border: '1px solid #DDE1E7', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }
      }
    >
      <motion.div
        key={isDark ? 'moon' : 'sun'}
        initial={{ rotate: -30, opacity: 0, scale: 0.6 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 30, opacity: 0, scale: 0.6 }}
        transition={{ duration: 0.25 }}
      >
        {isDark
          ? <Moon className="w-4 h-4" style={{ color: '#00A2FF' }} />
          : <Sun className="w-4 h-4" style={{ color: '#F5C400' }} />
        }
      </motion.div>
    </motion.button>
  );
}