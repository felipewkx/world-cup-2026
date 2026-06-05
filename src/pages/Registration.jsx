import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { useGame } from '@/lib/gameContext';
import StadiumBackground from '@/components/game/StadiumBackground';
import TournamentLogo from '@/components/game/TournamentLogo';
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

  const removePlayer = (idx) => setPlayers(players.filter((_, i) => i !== idx));

  const startEdit = (idx) => { setEditingIdx(idx); setEditName(players[idx]); };

  const saveEdit = () => {
    if (editName.trim()) {
      const updated = [...players];
      updated[editingIdx] = editName.trim();
      setPlayers(updated);
    }
    setEditingIdx(-1);
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center px-4 py-8">
      <StadiumBackground />
      <GlobalLanguageBar />

      <div className="relative z-10 w-full max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setPhase('home')}
            className="p-2 rounded-lg hover:bg-black/5 transition-colors"
            style={{ color: '#6C757D' }}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <TournamentLogo size="small" />
          <div className="w-9" /> {/* spacer */}
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="font-display font-bold text-2xl md:text-3xl" style={{ color: '#212529' }}>
            {t('registration')}
          </h2>
          <p className="text-sm mt-2 flex items-center justify-center gap-2" style={{ color: '#6C757D' }}>
            <Users className="w-4 h-4" />
            {players.length}/48 {t('players')}
          </p>
        </motion.div>

        {/* Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-light p-4 mb-6"
        >
          <div className="flex gap-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
              placeholder={t('enterName')}
              className="border-border bg-white text-foreground placeholder:text-muted-foreground"
              maxLength={30}
            />
            <Button
              onClick={addPlayer}
              disabled={!name.trim() || players.length >= 48}
              className="shrink-0 font-semibold"
              style={{
                background: 'linear-gradient(135deg, #F5C400, #FFD84D)',
                color: '#1A1200',
                boxShadow: '0 2px 8px rgba(245,196,0,0.25)',
              }}
            >
              <UserPlus className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">{t('addPlayer')}</span>
            </Button>
          </div>
          {players.length >= 48 && (
            <p className="text-xs mt-2" style={{ color: '#E53535' }}>{t('maxPlayers')}</p>
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
                className="card-light rounded-xl p-3 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-display font-bold"
                  style={{ background: 'linear-gradient(135deg, rgba(245,196,0,0.20), rgba(37,154,90,0.20))', color: '#92740A' }}>
                  {i + 1}
                </div>

                {editingIdx === i ? (
                  <div className="flex-1 flex gap-2">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                      className="h-8 text-sm border-border"
                      autoFocus
                    />
                    <Button size="sm" variant="ghost" onClick={saveEdit}>
                      <Check className="w-4 h-4" style={{ color: '#259A5A' }} />
                    </Button>
                  </div>
                ) : (
                  <>
                    <span className="flex-1 font-medium text-sm" style={{ color: '#212529' }}>{p}</span>
                    <Button size="sm" variant="ghost" onClick={() => startEdit(i)}
                      className="h-7 w-7 p-0 hover:bg-black/5" style={{ color: '#6C757D' }}>
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => removePlayer(i)}
                      className="h-7 w-7 p-0 hover:bg-red-50" style={{ color: '#E53535' }}>
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Start / hint */}
        {players.length === 0 ? (
          <p className="text-center text-sm" style={{ color: '#6C757D' }}>{t('minPlayers')}</p>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Button
              onClick={startDraw}
              className="w-full py-6 text-lg font-display font-bold rounded-2xl shadow-xl hover:scale-[1.02] transition-transform"
              style={{
                background: 'linear-gradient(135deg, #F5C400, #FFD84D)',
                color: '#1A1200',
                boxShadow: '0 6px 20px rgba(245,196,0,0.30)',
              }}
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