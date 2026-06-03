import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { useGame } from '@/lib/gameContext';
import { getTeamName } from '@/lib/teams';
import StadiumBackground from '@/components/game/StadiumBackground';
import GlobalLanguageBar from '@/components/game/GlobalLanguageBar';
import { Button } from '@/components/ui/button';
import { RotateCcw, Trophy, Medal } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ChampionScreen() {
  const { lang, t } = useI18n();
  const { champion, bracket, resetGame } = useGame();
  const confettiDone = useRef(false);

  useEffect(() => {
    if (champion && !confettiDone.current) {
      confettiDone.current = true;
      // Multiple confetti bursts
      const fire = (opts) => confetti({ ...opts, particleCount: 100, spread: 80, origin: { y: 0.6 } });
      fire({ angle: 60, origin: { x: 0 } });
      setTimeout(() => fire({ angle: 120, origin: { x: 1 } }), 300);
      setTimeout(() => fire({ angle: 90, origin: { x: 0.5 } }), 600);
      setTimeout(() => {
        confetti({ particleCount: 200, spread: 160, origin: { y: 0.4 }, colors: ['#EAB308', '#10B981', '#FFFFFF'] });
      }, 1000);
    }
  }, [champion]);

  if (!champion || !bracket) return null;

  const champName = getTeamName(champion, lang);
  const runnerUp = bracket.final.winner === bracket.final.teamA ? bracket.final.teamB : bracket.final.teamA;
  const third = bracket.thirdPlace?.winner;
  const fourth = bracket.thirdPlace?.winner === bracket.thirdPlace?.teamA ? bracket.thirdPlace?.teamB : bracket.thirdPlace?.teamA;

  const ranking = [
    { team: champion, label: t('champion_label'), emoji: '🥇', color: 'from-yellow-400 to-amber-600' },
    { team: runnerUp, label: t('runnerUp'), emoji: '🥈', color: 'from-gray-300 to-gray-500' },
    { team: third, label: t('thirdPlaceLabel'), emoji: '🥉', color: 'from-amber-600 to-orange-800' },
    { team: fourth, label: t('fourthPlace'), emoji: '🏅', color: 'from-slate-400 to-slate-600' },
  ].filter(r => r.team);

  return (
    <div className="min-h-screen relative px-4 py-8 flex flex-col items-center">
      <StadiumBackground />
      <GlobalLanguageBar />
      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center">
        {/* Trophy */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 1.5, bounce: 0.4 }}
          className="mb-6"
        >
          <div className="relative">
            <div className="text-8xl md:text-[120px] animate-float">🏆</div>
            <div className="absolute inset-0 text-8xl md:text-[120px] blur-2xl opacity-30">🏆</div>
          </div>
        </motion.div>

        {/* Champion title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-8"
        >
          <p className="font-display text-xs md:text-sm tracking-[0.3em] text-primary/70 uppercase mb-2">
            🏆 {t('champion')} 🏆
          </p>
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-5xl md:text-7xl">{champion.flag}</span>
          </div>
          <h1 className="font-display font-black text-3xl md:text-5xl bg-gradient-to-r from-primary via-yellow-300 to-primary bg-clip-text text-transparent animate-gradient mb-4">
            {champName}
          </h1>

          {champion.isHuman && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
              className="glass-strong rounded-2xl p-6 mt-4 animate-pulse-glow"
            >
              <p className="font-display font-bold text-xl md:text-2xl text-primary mb-2">
                {t('congratulations')}, {champion.player}! 🎉
              </p>
              <p className="text-muted-foreground text-sm md:text-base">
                {t('youWon')} {champName}!
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Final ranking */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="w-full mb-10"
        >
          <h3 className="font-display font-bold text-lg text-center mb-6 flex items-center justify-center gap-2">
            <Medal className="w-5 h-5 text-primary" />
            {t('finalRanking')}
          </h3>

          <div className="space-y-3">
            {ranking.map((r, i) => (
              <motion.div
                key={r.team.code}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.8 + i * 0.15 }}
                className="glass rounded-xl p-4 flex items-center gap-4"
              >
                <span className="text-2xl md:text-3xl">{r.emoji}</span>
                <span className="text-2xl md:text-3xl">{r.team.flag}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm md:text-base truncate">{getTeamName(r.team, lang)}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-xs font-display font-bold bg-gradient-to-r ${r.color} bg-clip-text text-transparent`}>
                      {r.label}
                    </span>
                    {r.team.isHuman && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary">
                        🎮 {r.team.player}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-display font-bold text-lg text-muted-foreground">{r.team.rating}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* New game button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          <Button
            onClick={resetGame}
            className="px-8 py-5 font-display font-bold bg-gradient-to-r from-primary to-yellow-500 hover:from-yellow-500 hover:to-primary text-primary-foreground rounded-2xl shadow-xl shadow-primary/20 text-base"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            {t('newGame')}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}