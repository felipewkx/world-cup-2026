import React from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { useGame } from '@/lib/gameContext';
import StadiumBackground from '@/components/game/StadiumBackground';
import TournamentLogo from '@/components/game/TournamentLogo';
import LanguageSelector from '@/components/game/LanguageSelector';
import GlobalLanguageBar from '@/components/game/GlobalLanguageBar';
import { Trophy, Play, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const { t } = useI18n();
  const { setPhase } = useGame();

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center px-4">
      <StadiumBackground />
      <GlobalLanguageBar />

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
        {/* Language selector */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <LanguageSelector />
        </motion.div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', duration: 1 }}
          className="mb-6"
        >
          <TournamentLogo size="large" />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="font-display font-black text-3xl md:text-5xl lg:text-6xl tracking-tight">
            <span className="bg-gradient-to-r from-primary via-yellow-300 to-primary bg-clip-text text-transparent animate-gradient">
              {t('title').split(' ').slice(0, -2).join(' ')}
            </span>
            <br />
            <span className="text-foreground">{t('title').split(' ').slice(-2).join(' ')}</span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-muted-foreground text-base md:text-lg max-w-md"
        >
          {t('subtitle')}
        </motion.p>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex gap-4 md:gap-6 mt-8 text-muted-foreground text-xs md:text-sm"
        >
          <div className="flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-primary" />
            <span>48 {t('players') === 'Jogadores' ? 'Seleções' : 'Teams'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-primary" />
            <span>{t('knockout')}</span>
          </div>
        </motion.div>

        {/* Start button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-10"
        >
          <Button
            onClick={() => setPhase('registration')}
            className="relative group px-8 py-6 text-lg font-display font-bold bg-gradient-to-r from-primary to-yellow-500 hover:from-yellow-500 hover:to-primary text-primary-foreground rounded-2xl shadow-2xl shadow-primary/30 transition-all duration-300 hover:shadow-primary/50 hover:scale-105"
          >
            <Play className="w-5 h-5 mr-2 inline" />
            {t('startGame')}
            <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
        </motion.div>

        {/* Bottom decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.2 }}
          className="mt-16 flex items-center gap-3 text-muted-foreground/50 text-xs"
        >
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-white/20" />
          <span className="font-display tracking-[0.2em]">⚽ 2026 ⚽</span>
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-white/20" />
        </motion.div>
      </div>
    </div>
  );
}