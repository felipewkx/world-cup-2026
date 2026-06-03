import React, { createContext, useContext, useState } from 'react';
import { getTeams } from './teams';
import { assignTeams, generateGroups, playGroupMatchday, getQualifiedTeams, generateKnockoutBracket, advanceKnockout } from './tournamentEngine';

const GameContext = createContext();

export function GameProvider({ children }) {
  const [phase, setPhase] = useState('home'); // home, registration, draw, groups, knockout, champion
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [groups, setGroups] = useState([]);
  const [groupMatchday, setGroupMatchday] = useState(0);
  const [bracket, setBracket] = useState(null);
  const [knockoutRound, setKnockoutRound] = useState('r16');
  const [champion, setChampion] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const startDraw = () => {
    const allTeams = getTeams();
    const assigned = assignTeams(players, allTeams);
    setTeams(assigned);
    setPhase('draw');
  };

  const startGroupStage = () => {
    const grps = generateGroups(teams);
    setGroups(grps);
    setGroupMatchday(0);
    setPhase('groups');
  };

  const playMatchday = () => {
    if (groupMatchday >= 3) return;
    setIsSimulating(true);
    setTimeout(() => {
      const updated = playGroupMatchday(groups, groupMatchday);
      setGroups(updated);
      setGroupMatchday(prev => prev + 1);
      setIsSimulating(false);
    }, 800);
  };

  const startKnockout = () => {
    const qualified = getQualifiedTeams(groups);
    const b = generateKnockoutBracket(qualified);
    setBracket(b);
    setKnockoutRound('r16');
    setPhase('knockout');
  };

  const playNextKnockoutRound = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const updated = advanceKnockout(bracket, knockoutRound);
      setBracket(updated);

      if (knockoutRound === 'r16') setKnockoutRound('quarterFinals');
      else if (knockoutRound === 'quarterFinals') setKnockoutRound('semiFinals');
      else if (knockoutRound === 'semiFinals') setKnockoutRound('thirdPlace');
      else if (knockoutRound === 'thirdPlace') setKnockoutRound('final');
      else if (knockoutRound === 'final') {
        setChampion(updated.champion);
        setPhase('champion');
      }
      setIsSimulating(false);
    }, 800);
  };

  const resetGame = () => {
    setPhase('home');
    setPlayers([]);
    setTeams([]);
    setGroups([]);
    setGroupMatchday(0);
    setBracket(null);
    setKnockoutRound('r16');
    setChampion(null);
  };

  return (
    <GameContext.Provider value={{
      phase, setPhase,
      players, setPlayers,
      teams, setTeams,
      groups, setGroups,
      groupMatchday,
      bracket, setBracket,
      knockoutRound,
      champion,
      isSimulating,
      startDraw,
      startGroupStage,
      playMatchday,
      startKnockout,
      playNextKnockoutRound,
      resetGame,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}