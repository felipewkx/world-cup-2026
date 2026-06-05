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
        if (count > 14) {
          clearInterval(intervalRef.current);
          setDisplayTeam(team);
          setLocked(true);
        }
      }, 70);
    }, delay);
    return () => { clearTimeout(startTimeout); clearInterval(intervalRef.current); };
  }, [team, delay]);

  const name = getTeamName(displayTeam, lang);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay / 1000 }}
      className={`rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 ${locked && isHuman ? 'human-team-row' : 'card-light'}`}
    >
      <motion.div
        className="text-4xl w-12 flex items-center justify-center shrink-0"
        animate={!locked ? { opacity: [1, 0.3, 1] } : { opacity: 1 }}
        transition={{ duration: 0.14, repeat: locked ? 0 : Infinity }}
      >
        {displayTeam.flag}
      </motion.div>

      <div className="flex-1 min-w-0">
        {isHuman && locked && (
          <p className="text-xs font-display font-bold tracking-wider uppercase mb-0.5" style={{ color: '#B8900C' }}>
            🎮 {team.player}
          </p>
        )}
        <p className={`font-display font-bold text-sm md:text-base truncate`}
          style={{ color: locked ? (isHuman ? '#92740A' : '#212529') : '#6C757D' }}>
          {name}
        </p>
        {locked && (
          <p className="text-[10px] mt-0.5" style={{ color: '#6C757D' }}>
            Rating: {team.rating} · {team.confederation}
          </p>
        )}
      </div>

      {locked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="text-lg shrink-0"
        >
          {isHuman ? '🌟' : '✅'}
        </motion.div>
      )}
    </motion.div>
  );
}

export default function TeamDraw() {
  const { t, lang } = useI18n();
  const { teams, startGroupStage } = useGame();
  const [phase, setPhase] = useState('loading');
  const [loadingStep, setLoadingStep] = useState(0);

  const humanTeams = teams.filter(tm => tm.isHuman);
  const aiTeams    = teams.filter(tm => !tm.isHuman);

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
        setTimeout(() => setPhase('ready'), 350);
      }
    }, 550);
    return () => clearInterval(interval);
  }, [phase, LOADING_STEPS.length]);

  return (
    <div className="min-h-screen relative px-4 py-8">
      <StadiumBackground />
      <GlobalLanguageBar />

      {/* Loading overlay */}
      <AnimatePresence>
        {phase === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ exit: { duration: 0.3 } }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            style={{ background: '#FFFFFF' }}
          >
            <div className="text-center px-6">
              <motion.div
                className="text-6xl mb-8"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
              >
                ⚽
              </motion.div>

              <h2 className="font-display font-black text-2xl md:text-3xl mb-8 tracking-wide" style={{ color: '#212529' }}>
                {t('teamDraw')}
              </h2>

              <div className="space-y-3 max-w-sm mx-auto">
                {LOADING_STEPS.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: loadingStep > i ? 1 : 0.25, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-3 text-sm"
                  >
                    <motion.div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                      animate={{
                        background: loadingStep > i ? '#F5C400' : '#F3F4F6',
                        color: loadingStep > i ? '#1A1200' : '#6C757D',
                      }}
                    >
                      {loadingStep > i ? '✓' : i + 1}
                    </motion.div>
                    <span style={{ color: loadingStep > i ? '#212529' : '#6C757D' }}>{step}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10 w-48 mx-auto h-1 rounded-full overflow-hidden" style={{ background: '#E9ECEF' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #F5C400, #FFD84D)' }}
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      {phase === 'ready' && (
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10 pt-4"
          >
            <div className="flex justify-center mb-4">
              <TournamentLogo size="small" />
            </div>
            <h2 className="font-display font-bold text-2xl md:text-4xl flex items-center justify-center gap-3"
              style={{ color: '#212529' }}>
              <Sparkles className="w-6 h-6" style={{ color: '#B8900C' }} />
              {t('teamDraw')}
              <Sparkles className="w-6 h-6" style={{ color: '#B8900C' }} />
            </h2>
          </motion.div>

          {/* Human players */}
          {humanTeams.length > 0 && (
            <div className="mb-10">
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-display font-semibold text-base mb-4 flex items-center gap-2"
                style={{ color: '#B8900C' }}
              >
                🎮 {t('players')}
              </motion.h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {humanTeams.map((team, i) => (
                  <TeamRevealSlot key={team.code} team={team} delay={i * 200} lang={lang} isHuman />
                ))}
              </div>
            </div>
          )}

          {/* AI teams */}
          <div className="mb-10">
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="font-display font-semibold text-base mb-4 flex items-center gap-2"
              style={{ color: '#6C757D' }}
            >
              🤖 {t('aiControlled')}
            </motion.h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {aiTeams.map((team, i) => (
                <motion.div
                  key={team.code}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03, duration: 0.25 }}
                  className="card-light rounded-xl p-2.5 flex flex-col items-center gap-1.5 text-center"
                >
                  <span className="text-2xl">{team.flag}</span>
                  <span className="text-[10px] font-medium leading-tight" style={{ color: '#495057' }}>
                    {getTeamName(team, lang)}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Continue — immediately available */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex justify-center pb-8"
          >
            <Button
              onClick={startGroupStage}
              className="px-10 py-6 text-lg font-display font-bold rounded-2xl shadow-xl hover:scale-105 transition-transform"
              style={{
                background: 'linear-gradient(135deg, #F5C400, #FFD84D)',
                color: '#1A1200',
                boxShadow: '0 6px 20px rgba(245,196,0,0.30)',
              }}
            >
              {t('continueToGroups')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
}