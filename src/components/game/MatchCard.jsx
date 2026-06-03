import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { getTeamName } from '@/lib/teams';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function MatchCard({ match, index = 0 }) {
  const { lang, t } = useI18n();
  const [showStats, setShowStats] = useState(false);
  const { teamA, teamB, result } = match;
  const nameA = getTeamName(teamA, lang);
  const nameB = getTeamName(teamB, lang);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.08 }}
      className="glass rounded-xl overflow-hidden"
    >
      <div className="p-3 md:p-4">
        {/* Score row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <span className="text-xl md:text-2xl">{teamA.flag}</span>
            <div className="min-w-0">
              <p className="font-semibold text-xs md:text-sm truncate">{nameA}</p>
              {teamA.isHuman && <p className="text-[10px] text-primary">🎮 {teamA.player}</p>}
            </div>
          </div>

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', duration: 0.6, bounce: 0.5 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 shrink-0"
          >
            <span className="font-display font-bold text-lg md:text-xl">{result.goalsA}</span>
            <span className="text-muted-foreground text-xs">-</span>
            <span className="font-display font-bold text-lg md:text-xl">{result.goalsB}</span>
          </motion.div>

          <div className="flex-1 flex items-center gap-2 justify-end min-w-0">
            <div className="text-right min-w-0">
              <p className="font-semibold text-xs md:text-sm truncate">{nameB}</p>
              {teamB.isHuman && <p className="text-[10px] text-primary">🎮 {teamB.player}</p>}
            </div>
            <span className="text-xl md:text-2xl">{teamB.flag}</span>
          </div>
        </div>

        {/* Extra time / penalties badges */}
        {(result.extraTime || result.penalties) && (
          <div className="flex justify-center gap-2 mt-2">
            {result.extraTime && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-medium">
                {t('afterExtraTime')}
              </span>
            )}
            {result.penalties && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-medium">
                {t('penaltyShootout')} ({result.penaltyScore[0]}-{result.penaltyScore[1]})
              </span>
            )}
          </div>
        )}

        {/* Stats toggle */}
        <button
          onClick={() => setShowStats(!showStats)}
          className="w-full flex items-center justify-center gap-1 mt-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {showStats ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {showStats ? '' : 'Stats'}
        </button>
      </div>

      {/* Match stats */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/5 overflow-hidden"
          >
            <div className="p-3 space-y-2">
              <StatBar label={t('possession')} a={result.stats.possession[0]} b={result.stats.possession[1]} suffix="%" />
              <StatBar label={t('shots')} a={result.stats.shots[0]} b={result.stats.shots[1]} />
              <StatBar label={t('shotsOnTarget')} a={result.stats.shotsOnTarget[0]} b={result.stats.shotsOnTarget[1]} />
              <StatBar label={t('corners')} a={result.stats.corners[0]} b={result.stats.corners[1]} />
              <StatBar label={t('fouls')} a={result.stats.fouls[0]} b={result.stats.fouls[1]} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function StatBar({ label, a, b, suffix = '' }) {
  const total = a + b || 1;
  const pctA = (a / total) * 100;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px]">
        <span className="font-medium">{a}{suffix}</span>
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{b}{suffix}</span>
      </div>
      <div className="flex h-1.5 rounded-full overflow-hidden bg-white/5">
        <div className="bg-primary/60 rounded-l-full transition-all duration-500" style={{ width: `${pctA}%` }} />
        <div className="bg-secondary/60 rounded-r-full transition-all duration-500" style={{ width: `${100 - pctA}%` }} />
      </div>
    </div>
  );
}