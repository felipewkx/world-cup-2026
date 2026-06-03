import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { useGame } from '@/lib/gameContext';
import StadiumBackground from '@/components/game/StadiumBackground';
import TournamentLogo from '@/components/game/TournamentLogo';
import LanguageSelector from '@/components/game/LanguageSelector';
import GlobalLanguageBar from '@/components/game/GlobalLanguageBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus, X, Edit2, Check, ArrowRight, ArrowLeft, Users } from 'lucide-react';

export default function Registration() {
  const { t } = useI18n();
  const { players, setPlayers, setPhase, startDraw } = useGame();
  const [name, setName] = useState('');
  const [editingIdx, setEditingIdx] = useState(-1);
  const [editName, setEditName] = useState('');

  const addPlayer = () => {
    if (!name.trim() || players.length >= 48) return;
    setPlayers([...players, name.trim()]);
    setName('');
  };

  const removePlayer = (idx) => {
    setPlayers(players.filter((_, i) => i !== idx));
  };

  const startEdit = (idx) => {
    setEditingIdx(idx);
    setEditName(players[idx]);
  };

  const saveEdit = () => {
    if (editName.trim()) {
      const updated = [...players];
      updated[editingIdx] = editName.trim();
      setPlayers(updated);
    }
    setEditingIdx(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') addPlayer();
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center px-4 py-8">
      <StadiumBackground />
      <GlobalLanguageBar />
      <div className="relative z-10 w-full max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => setPhase('home')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <TournamentLogo size="small" />
          <LanguageSelector />
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="font-display font-bold text-2xl md:text-3xl">{t('registration')}</h2>
          <p className="text-muted-foreground text-sm mt-2 flex items-center justify-center gap-2">
            <Users className="w-4 h-4" />
            {players.length}/48 {t('players')}
          </p>
        </motion.div>

        {/* Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-4 mb-6"
        >
          <div className="flex gap-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('enterName')}
              className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground"
              maxLength={30}
            />
            <Button
              onClick={addPlayer}
              disabled={!name.trim() || players.length >= 48}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
            >
              <UserPlus className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">{t('addPlayer')}</span>
            </Button>
          </div>
          {players.length >= 48 && (
            <p className="text-xs text-destructive mt-2">{t('maxPlayers')}</p>
          )}
        </motion.div>

        {/* Player list */}
        <div className="space-y-2 mb-8">
          <AnimatePresence>
            {players.map((p, i) => (
              <motion.div
                key={`${p}-${i}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.03 }}
                className="glass rounded-xl p-3 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-sm font-display font-bold text-primary">
                  {i + 1}
                </div>
                {editingIdx === i ? (
                  <div className="flex-1 flex gap-2">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                      className="bg-white/5 border-white/10 h-8 text-sm"
                      autoFocus
                    />
                    <Button size="sm" variant="ghost" onClick={saveEdit}>
                      <Check className="w-4 h-4 text-secondary" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <span className="flex-1 font-medium text-sm">{p}</span>
                    <Button size="sm" variant="ghost" onClick={() => startEdit(i)} className="text-muted-foreground hover:text-foreground h-7 w-7 p-0">
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => removePlayer(i)} className="text-muted-foreground hover:text-destructive h-7 w-7 p-0">
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Start button */}
        {players.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm">{t('minPlayers')}</p>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              onClick={startDraw}
              className="w-full py-6 text-lg font-display font-bold bg-gradient-to-r from-primary to-yellow-500 hover:from-yellow-500 hover:to-primary text-primary-foreground rounded-2xl shadow-xl shadow-primary/20"
            >
              {t('startGame')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}