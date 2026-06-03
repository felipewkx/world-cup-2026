import React from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { getTeamName } from '@/lib/teams';

export default function TeamCard({ team, index = 0, compact = false }) {
  const { lang, t } = useI18n();
  const name = getTeamName(team, lang);

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${team.isHuman ? 'text-primary' : ''}`}>
        <span className="text-lg">{team.flag}</span>
        <span className="text-sm font-medium truncate">{name}</span>
        {team.isHuman && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary font-semibold">
            {team.player}
          </span>
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`rounded-xl p-4 hover:bg-white/[0.07] transition-all duration-300 ${
        team.isHuman
          ? 'glass border-2 border-primary/40 shadow-lg shadow-primary/10'
          : 'glass'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl">{team.flag}</span>
        <div className="flex-1 min-w-0">
          <p className={`font-heading font-semibold text-sm truncate ${team.isHuman ? 'text-primary' : ''}`}>
            {name}
          </p>
          {team.isHuman && (
            <p className="text-xs text-primary font-display font-bold mt-0.5">
              🎮 {team.player}
            </p>
          )}
          {!team.isHuman && (
            <p className="text-[10px] text-muted-foreground mt-0.5 font-display">
              {team.confederation}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-muted-foreground">{t('rating')}</span>
          <span className={`font-display font-bold text-lg ${
            team.rating >= 90 ? 'text-primary' :
            team.rating >= 80 ? 'text-secondary' :
            team.rating >= 70 ? 'text-blue-400' : 'text-muted-foreground'
          }`}>
            {team.rating}
          </span>
        </div>
      </div>
    </motion.div>
  );
}