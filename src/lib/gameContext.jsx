import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from "react";
import { getTeams } from "./teams";
import {
  assignTeams,
  generateGroups,
  playGroupMatchday,
  getQualifiedTeams,
  generateKnockoutBracket,
  advanceKnockout,
} from "./tournamentEngine";

const GameStateContext = createContext();
const GameActionsContext = createContext();

export function GameProvider({ children }) {
  const [phase, setPhase] = useState("home"); // home, registration, draw, groups, knockout, champion
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [groups, setGroups] = useState([]);
  const [groupMatchday, setGroupMatchday] = useState(0);
  const [bracket, setBracket] = useState(null);
  const [knockoutRound, setKnockoutRound] = useState("r16");
  const [champion, setChampion] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const startDraw = useCallback(() => {
    const allTeams = getTeams();
    const assigned = assignTeams(players, allTeams);
    setTeams(assigned);
    setPhase("draw");
  }, [players]);

  const startGroupStage = useCallback(() => {
    const grps = generateGroups(teams);
    setGroups(grps);
    setGroupMatchday(0);
    setPhase("groups");
  }, [teams]);

  const playMatchday = useCallback(() => {
    if (groupMatchday >= 3) return;
    setIsSimulating(true);
    setTimeout(() => {
      const updated = playGroupMatchday(groups, groupMatchday);
      setGroups(updated);
      setGroupMatchday((prev) => prev + 1);
      setIsSimulating(false);
    }, 800);
  }, [groups, groupMatchday]);

  const startKnockout = useCallback(() => {
    const qualified = getQualifiedTeams(groups);
    const b = generateKnockoutBracket(qualified);
    setBracket(b);
    setKnockoutRound("r16");
    setPhase("knockout");
  }, [groups]);

  const playNextKnockoutRound = useCallback(() => {
    setIsSimulating(true);
    setTimeout(() => {
      const updated = advanceKnockout(bracket, knockoutRound);
      setBracket(updated);

      if (knockoutRound === "r16") setKnockoutRound("quarterFinals");
      else if (knockoutRound === "quarterFinals")
        setKnockoutRound("semiFinals");
      else if (knockoutRound === "semiFinals") setKnockoutRound("thirdPlace");
      else if (knockoutRound === "thirdPlace") setKnockoutRound("final");
      else if (knockoutRound === "final") {
        setChampion(updated.champion);
        setPhase("champion");
      }
      setIsSimulating(false);
    }, 800);
  }, [bracket, knockoutRound]);

  const resetGame = useCallback(() => {
    setPhase("home");
    setPlayers([]);
    setTeams([]);
    setGroups([]);
    setGroupMatchday(0);
    setBracket(null);
    setKnockoutRound("r16");
    setChampion(null);
  }, []);

  const stateValue = useMemo(
    () => ({
      phase,
      players,
      teams,
      groups,
      groupMatchday,
      bracket,
      knockoutRound,
      champion,
      isSimulating,
    }),
    [
      phase,
      players,
      teams,
      groups,
      groupMatchday,
      bracket,
      knockoutRound,
      champion,
      isSimulating,
    ],
  );

  const actionsValue = useMemo(
    () => ({
      setPhase,
      setPlayers,
      setTeams,
      setGroups,
      setBracket,
      startDraw,
      startGroupStage,
      playMatchday,
      startKnockout,
      playNextKnockoutRound,
      resetGame,
    }),
    [
      setPhase,
      setPlayers,
      setTeams,
      setGroups,
      setBracket,
      startDraw,
      startGroupStage,
      playMatchday,
      startKnockout,
      playNextKnockoutRound,
      resetGame,
    ],
  );

  return (
    <GameStateContext.Provider value={stateValue}>
      <GameActionsContext.Provider value={actionsValue}>
        {children}
      </GameActionsContext.Provider>
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  return useContext(GameStateContext);
}

export function useGameActions() {
  return useContext(GameActionsContext);
}

export function useGame() {
  const state = useGameState();
  const actions = useGameActions();
  return useMemo(() => ({ ...state, ...actions }), [state, actions]);
}
