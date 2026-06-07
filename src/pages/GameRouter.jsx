import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGameState } from "@/lib/gameContext";
import HomePage from "./HomePage";
import Registration from "./Registration";
import TeamDraw from "./TeamDraw";
import GroupStage from "./GroupStage";
import KnockoutStage from "./KnockoutStage";
import ChampionScreen from "./ChampionScreen";

const pages = {
  home: HomePage,
  registration: Registration,
  draw: TeamDraw,
  groups: GroupStage,
  knockout: KnockoutStage,
  champion: ChampionScreen,
};

export default function GameRouter() {
  const { phase } = useGameState();
  const Page = pages[phase] || HomePage;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={phase}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Page />
      </motion.div>
    </AnimatePresence>
  );
}
