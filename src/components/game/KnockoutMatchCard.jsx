import React from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { getTeamName } from '@/lib/teams';

export default function KnockoutMatchCard({ match, index = 0, isLive = false }) {
  const { lang, t } = useI18n();
  if (!match) return null;

  const { teamA, teamB, result, winner } = match;
  const nameA = getTeamName(teamA, lang);
  const nameB = getTeamName(teamB, lang);
  const played = !!result;

  const winnerA = played && winner === teamA;
  const winnerB = played && winner === teamB;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.08 }}
      className={`glass rounded-xl p-3 min-w-[200px] relative overflow-hidden transition-all duration-300 ${
        isLive ? 'border border-red-500/40 shadow-lg shadow-red-500/10' : 'border border-white/5'
      }`}
    >
      {/* LIVE badge */}
      {isLive && (
        <motion.div
          className="absolute top-1.5 right-1.5 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/40"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <span className="text-[9px] font-display font-bold text-red-400 uppercase tracking-wider">Live</span>
        </motion.div>
      )}

      {/* Team A */}
      <div className={`flex items-center gap-2 p-2 rounded-lg transition-all duration-300 ${
        winnerA
          ? 'bg-secondary/10 border border-secondary/30 shadow-sm shadow-secondary/10'
          : played && !winnerA
          ? 'opacity-40'
          : ''
      } ${teamA.isHuman ? 'ring-1 ring-primary/30' : ''}`}>
        <span className="text-xl">{teamA.flag}</span>
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-semibold truncate ${winnerA ? 'text-secondary' : played && !winnerA ? 'text-muted-foreground' : 'text-foreground'}`}>
            {nameA}
          </p>
          {teamA.isHuman && (
            <p className="text-[9px] text-primary font-display font-bold">🎮 {teamA.player}</p>
          )}
        </div>
        {played && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`font-display font-bold text-lg ${winnerA ? 'text-secondary' : 'text-muted-foreground'}`}
          >
            {result.goalsA}
          </motion.span>
        )}
        {winnerA && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="text-sm">✅</motion.span>
        )}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-2 px-2 py-1">
        <div className="flex-1 h-px bg-white/5" />
        <span className="text-[10px] text-muted-foreground font-display">{t('vs')}</span>
        <div className="flex-1 h-px bg-white/5" />
      </div>

      {/* Team B */}
      <div className={`flex items-center gap-2 p-2 rounded-lg transition-all duration-300 ${
        winnerB
          ? 'bg-secondary/10 border border-secondary/30 shadow-sm shadow-secondary/10'
          : played && !winnerB
          ? 'opacity-40'
          : ''
      } ${teamB.isHuman ? 'ring-1 ring-primary/30' : ''}`}>
        <span className="text-xl">{teamB.flag}</span>
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-semibold truncate ${winnerB ? 'text-secondary' : played && !winnerB ? 'text-muted-foreground' : 'text-foreground'}`}>
            {nameB}
          </p>
          {teamB.isHuman && (
            <p className="text-[9px] text-primary font-display font-bold">🎮 {teamB.player}</p>
          )}
        </div>
        {played && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`font-display font-bold text-lg ${winnerB ? 'text-secondary' : 'text-muted-foreground'}`}
          >
            {result.goalsB}
          </motion.span>
        )}
        {winnerB && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="text-sm">✅</motion.span>
        )}
      </div>

      {/* Badges */}
      {played && (result.extraTime || result.penalties) && (
        <div className="flex justify-center gap-1 mt-2">
          {result.extraTime && (
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400">{t('afterExtraTime')}</span>
          )}
          {result.penalties && (
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400">
              PEN {result.penaltyScore[0]}-{result.penaltyScore[1]}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}