import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { useGame } from '@/lib/gameContext';
import StadiumBackground from '@/components/game/StadiumBackground';
import TournamentLogo from '@/components/game/TournamentLogo';
import GlobalLanguageBar from '@/components/game/GlobalLanguageBar';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { getTeams, getTeamName } from '@/lib/teams';

const ALL_TEAMS = getTeams();

// Shuffles through random teams with a slot-machine feel, then locks in
function TeamRevealSlot({ team, delay, lang, isHuman }) {
  const [displayTeam, setDisplayTeam] = useState(ALL_TEAMS[0]);
  const [locked, setLocked] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      let count = 0;
      intervalRef.current = setInterval(() => {
        setDisplayTeam(ALL_TEAMS[Math.floor(Math.random() * ALL_TEAMS.length)]);
        count++;
        if (count > 18) {
          clearInterval(intervalRef.current);
          setDisplayTeam(team);
          setLocked(true);
        }
      }, 80);
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      clearInterval(intervalRef.current);
    };
  }, [team, delay]);

  const name = getTeamName(displayTeam, lang);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      className={`glass rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 ${
        locked && isHuman
          ? 'border-2 border-primary shadow-lg shadow-primary/30 bg-primary/5'
          : locked
          ? 'border border-white/10'
          : 'border border-white/5'
      }`}
    >
      {/* Flag with slot animation */}
      <motion.div
        className="text-4xl w-12 flex items-center justify-center"
        animate={!locked ? { opacity: [1, 0.4, 1] } : { opacity: 1 }}
        transition={{ duration: 0.16, repeat: locked ? 0 : Infinity }}
      >
        {displayTeam.flag}
      </motion.div>

      <div className="flex-1 min-w-0">
        {/* Player name (only for human) */}
        {isHuman && (
          <p className="text-xs text-primary font-display font-bold tracking-wider uppercase mb-0.5">
            🎮 {team.player}
          </p>
        )}
        <p className={`font-display font-bold text-sm md:text-base truncate ${
          locked ? (isHuman ? 'text-primary' : 'text-foreground') : 'text-muted-foreground'
        }`}>
          {name}
        </p>
        {locked && (
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {lang === 'pt' ? 'Rating' : 'Rating'}: {team.rating}
          </p>
        )}
      </div>

      {locked && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="text-lg"
        >
          ✅
        </motion.div>
      )}
    </motion.div>
  );
}

export default function TeamDraw() {
  const { t, lang } = useI18n();
  const { teams, startGroupStage } = useGame();
  const [phase, setPhase] = useState('loading'); // loading | revealing | done
  const [loadingStep, setLoadingStep] = useState(0);

  const humanTeams = teams.filter(t => t.isHuman);
  const aiTeams = teams.filter(t => !t.isHuman);

  const LOADING_STEPS = lang === 'pt'
    ? ['Conectando ao servidor da FIFA…', 'Embaralhando seleções…', 'Preparando o sorteio…', 'Iniciando cerimônia…']
    : ['Connecting to FIFA server…', 'Shuffling national teams…', 'Preparing the draw…', 'Starting ceremony…'];

  useEffect(() => {
    if (phase !== 'loading') return;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setLoadingStep(step);
      if (step >= LOADING_STEPS.length) {
        clearInterval(interval);
        setTimeout(() => setPhase('revealing'), 400);
      }
    }, 600);
    return () => clearInterval(interval);
  }, [phase]);

  // Time for all reveal animations to finish
  const totalRevealTime = teams.length * 200 + 2000; // ms
  useEffect(() => {
    if (phase !== 'revealing') return;
    const t = setTimeout(() => setPhase('done'), totalRevealTime);
    return () => clearTimeout(t);
  }, [phase, totalRevealTime]);

  return (
    <div className="min-h-screen relative px-4 py-8">
      <StadiumBackground />
      <GlobalLanguageBar />

      {/* LOADING PHASE */}
      <AnimatePresence>
        {phase === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            style={{ background: 'radial-gradient(ellipse at center, #0d1525 0%, #060a14 100%)' }}
          >
            {/* Stadium beams */}
            <div className="absolute inset-0 overflow-hidden">
              {[0.3, 0.5, 0.7].map((x, i) => (
                <motion.div
                  key={i}
                  className="absolute top-0 h-full w-px"
                  style={{ left: `${x * 100}%`, background: `linear-gradient(to bottom, rgba(234,179,8,${0.3 - i * 0.05}), transparent)` }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                />
              ))}
            </div>

            <div className="relative z-10 text-center">
              <motion.div
                className="text-7xl mb-8"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              >
                ⚽
              </motion.div>

              <h2 className="font-display font-black text-2xl md:text-4xl text-primary mb-8">
                {t('teamDraw')}
              </h2>

              <div className="space-y-3 max-w-sm mx-auto">
                {LOADING_STEPS.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: loadingStep > i ? 1 : 0.2, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 text-sm"
                  >
                    <motion.div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0"
                      animate={{
                        backgroundColor: loadingStep > i ? '#EAB308' : 'rgba(255,255,255,0.1)',
                      }}
                    >
                      {loadingStep > i ? '✓' : i + 1}
                    </motion.div>
                    <span className={loadingStep > i ? 'text-foreground' : 'text-muted-foreground'}>
                      {step}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Pulse bar */}
              <motion.div className="mt-10 w-48 mx-auto h-0.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-yellow-400"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REVEAL PHASE */}
      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: phase !== 'loading' ? 1 : 0, y: phase !== 'loading' ? 0 : -20 }}
          className="text-center mb-10 pt-4"
        >
          <div className="flex justify-center mb-4">
            <TournamentLogo size="small" />
          </div>
          <h2 className="font-display font-bold text-2xl md:text-4xl flex items-center justify-center gap-3">
            <Sparkles className="w-6 h-6 text-primary" />
            {t('teamDraw')}
            <Sparkles className="w-6 h-6 text-primary" />
          </h2>
        </motion.div>

        {phase !== 'loading' && (
          <>
            {/* Human players */}
            {humanTeams.length > 0 && (
              <div className="mb-10">
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-display font-semibold text-lg text-primary mb-4 flex items-center gap-2"
                >
                  🎮 {t('players')}
                </motion.h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {humanTeams.map((team, i) => (
                    <TeamRevealSlot
                      key={team.code}
                      team={team}
                      delay={i * 250}
                      lang={lang}
                      isHuman
                    />
                  ))}
                </div>
              </div>
            )}

            {/* AI teams */}
            <div className="mb-10">
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-display font-semibold text-lg text-muted-foreground mb-4 flex items-center gap-2"
              >
                🤖 {t('aiControlled')}
              </motion.h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {aiTeams.map((team, i) => (
                  <motion.div
                    key={team.code}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (humanTeams.length * 0.25) + i * 0.04, duration: 0.3 }}
                    className="glass rounded-xl p-2.5 flex flex-col items-center gap-1.5 text-center"
                  >
                    <span className="text-2xl">{team.flag}</span>
                    <span className="text-[10px] font-medium text-muted-foreground leading-tight">
                      {getTeamName(team, lang)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Continue button */}
        <AnimatePresence>
          {phase === 'done' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center"
            >
              <Button
                onClick={startGroupStage}
                className="px-8 py-6 text-lg font-display font-bold bg-gradient-to-r from-primary to-yellow-500 hover:from-yellow-500 hover:to-primary text-primary-foreground rounded-2xl shadow-xl shadow-primary/20"
              >
                {t('continueToGroups')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}