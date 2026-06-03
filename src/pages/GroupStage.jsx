import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { useGame } from '@/lib/gameContext';
import StadiumBackground from '@/components/game/StadiumBackground';
import TournamentLogo from '@/components/game/TournamentLogo';
import GroupTable from '@/components/game/GroupTable';
import MatchCard from '@/components/game/MatchCard';
import GlobalLanguageBar from '@/components/game/GlobalLanguageBar';
import LiveMatchOverlay from '@/components/game/LiveMatchOverlay';
import PhaseTransition from '@/components/game/PhaseTransition';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, ArrowRight, Loader2, LayoutGrid, List } from 'lucide-react';

export default function GroupStage() {
  const { t, lang } = useI18n();
  const { groups, groupMatchday, playMatchday, startKnockout, isSimulating } = useGame();
  const [view, setView] = useState('standings');
  const [showTransition, setShowTransition] = useState(false);
  const allComplete = groups.every(g => g.completed);

  const handleAdvance = () => {
    setShowTransition(true);
  };

  // Get matches for current view
  const allMatches = groups.flatMap(g => g.matches);
  const matchesByMatchday = [1, 2, 3].map(md => allMatches.filter(m => m.matchday === md));

  return (
    <div className="min-h-screen relative px-4 py-8">
      <StadiumBackground />
      <GlobalLanguageBar />
      <LiveMatchOverlay isVisible={isSimulating} />
      <PhaseTransition
        show={showTransition}
        title={lang === 'pt' ? 'Fase Eliminatória' : 'Knockout Stage'}
        subtitle={lang === 'pt' ? 'Oitavas de Final' : 'Round of 16 Begins'}
        icon="⚔️"
        onDone={() => { setShowTransition(false); startKnockout(); }}
        duration={2500}
      />
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-3">
            <TournamentLogo size="small" />
          </div>
          <h2 className="font-display font-bold text-2xl md:text-3xl">{t('groupStage')}</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {t('matchday')} {groupMatchday}/3
          </p>
        </motion.div>

        {/* View toggle & action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <Tabs value={view} onValueChange={setView} className="w-auto">
            <TabsList className="bg-white/5">
              <TabsTrigger value="standings" className="gap-1.5 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <LayoutGrid className="w-3.5 h-3.5" />
                {t('standings')}
              </TabsTrigger>
              <TabsTrigger value="matches" className="gap-1.5 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <List className="w-3.5 h-3.5" />
                {t('matches')}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {!allComplete ? (
            <Button
              onClick={playMatchday}
              disabled={isSimulating}
              className="font-display font-bold bg-gradient-to-r from-primary to-yellow-500 hover:from-yellow-500 hover:to-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/20 px-6 py-5"
            >
              {isSimulating ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t('simulating')}</>
              ) : (
                <><Play className="w-4 h-4 mr-2" />{t('playGroupMatchday')} {groupMatchday + 1}</>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleAdvance}
              className="font-display font-bold bg-gradient-to-r from-secondary to-emerald-400 hover:from-emerald-400 hover:to-secondary text-secondary-foreground rounded-xl shadow-lg shadow-secondary/20 px-6 py-5"
            >
              {t('advanceToKnockout')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {view === 'standings' ? (
            <motion.div
              key="standings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
            >
              {groups.map((group, i) => (
                <GroupTable key={group.name} group={group} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="matches"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {matchesByMatchday.map((matches, mdIdx) => (
                matches.length > 0 && (
                  <div key={mdIdx} className="mb-8">
                    <h3 className="font-display font-semibold text-sm text-primary mb-3">
                      {t('matchday')} {mdIdx + 1}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {matches.map((match, i) => (
                        <MatchCard key={`${match.teamA.code}-${match.teamB.code}`} match={match} index={i} />
                      ))}
                    </div>
                  </div>
                )
              ))}
              {allMatches.length === 0 && (
                <div className="text-center text-muted-foreground py-16">
                  <p className="text-lg">⚽</p>
                  <p className="mt-2">{t('playGroupMatchday')} 1</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}