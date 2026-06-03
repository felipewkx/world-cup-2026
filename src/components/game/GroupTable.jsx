import React from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { getTeamName } from '@/lib/teams';

export default function GroupTable({ group, index = 0 }) {
  const { lang, t } = useI18n();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass rounded-xl overflow-hidden"
    >
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <h3 className="font-display font-bold text-sm text-primary">
          {t('group')} {group.name}
        </h3>
        {group.completed && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/20 text-secondary">✓</span>
        )}
      </div>

      {group.completed && (
        <div className="px-4 py-2 bg-secondary/5 border-b border-secondary/10 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-secondary inline-block" />
          <span className="text-[10px] text-secondary font-display font-bold tracking-wider uppercase">
            {lang === 'pt' ? '2 classificadas · Top 3ª elegível' : '2 qualified · Top 3rd eligible'}
          </span>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-muted-foreground border-b border-white/5">
              <th className="text-left px-3 py-2 font-medium">#</th>
              <th className="text-left px-2 py-2 font-medium">{lang === 'pt' ? 'Seleção' : 'Team'}</th>
              <th className="text-center px-1 py-2 font-medium">{t('played')}</th>
              <th className="text-center px-1 py-2 font-medium">{t('won')}</th>
              <th className="text-center px-1 py-2 font-medium">{t('drawn')}</th>
              <th className="text-center px-1 py-2 font-medium">{t('lost')}</th>
              <th className="text-center px-1 py-2 font-medium">{t('goalDifference')}</th>
              <th className="text-center px-2 py-2 font-medium text-primary">{t('points')}</th>
            </tr>
          </thead>
          <tbody>
            {group.teams.map((team, i) => {
              const qualified = group.completed && i < 2;
              const thirdChance = group.completed && i === 2;
              return (
                <tr
                  key={team.code}
                  className={`border-b border-white/[0.03] transition-colors ${
                    qualified ? 'bg-secondary/[0.08]' : 
                    thirdChance ? 'bg-primary/[0.05]' : ''
                  }`}
                >
                  <td className="px-3 py-2">
                    <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                      qualified ? 'bg-secondary/20 text-secondary' :
                      thirdChance ? 'bg-primary/20 text-primary' : 'text-muted-foreground'
                    }`}>
                      {i + 1}
                    </span>
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{team.flag}</span>
                      <span className="font-medium truncate max-w-[80px]">{getTeamName(team, lang)}</span>
                      {team.isHuman && (
                        <span className="text-[9px] px-1 py-0.5 rounded bg-primary/20 text-primary shrink-0">
                          {team.player}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="text-center px-1 py-2">{team.stats.played}</td>
                  <td className="text-center px-1 py-2">{team.stats.won}</td>
                  <td className="text-center px-1 py-2">{team.stats.drawn}</td>
                  <td className="text-center px-1 py-2">{team.stats.lost}</td>
                  <td className="text-center px-1 py-2">{team.stats.gf - team.stats.ga}</td>
                  <td className="text-center px-2 py-2 font-bold text-primary">{team.stats.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}