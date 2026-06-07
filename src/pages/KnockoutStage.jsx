import React, { useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useGameState, useGameActions } from "@/lib/gameContext";
import StadiumBackground from "@/components/game/StadiumBackground";
import TournamentLogo from "@/components/game/TournamentLogo";
import KnockoutMatchCard from "@/components/game/KnockoutMatchCard";
import GlobalLanguageBar from "@/components/game/GlobalLanguageBar";
import LiveMatchOverlay from "@/components/game/LiveMatchOverlay";
import PhaseTransition from "@/components/game/PhaseTransition";
import { Button } from "@/components/ui/button";
import { Play, Loader2, Trophy } from "lucide-react";

const ROUND_LABELS = {
  r16: "roundOf16",
  quarterFinals: "quarterFinals",
  semiFinals: "semiFinals",
  thirdPlace: "thirdPlace",
  final: "final",
};

export default function KnockoutStage() {
  const { t, lang } = useI18n();
  const { bracket, knockoutRound, isSimulating } = useGameState();
  const { playNextKnockoutRound } = useGameActions();
  const [showTransition, setShowTransition] = useState(false);
  const [transitionTitle, setTransitionTitle] = useState("");

  if (!bracket) return null;

  const currentLabel = t(ROUND_LABELS[knockoutRound]);

  const handlePlay = () => {
    const nextRoundLabels = {
      r16: { en: "Quarter Finals", pt: "Quartas de Final" },
      quarterFinals: { en: "Semi Finals", pt: "Semifinais" },
      semiFinals: { en: "Finals", pt: "Finais" },
      thirdPlace: { en: "Grand Final", pt: "Grande Final" },
      final: { en: "Champion Crowned!", pt: "Campeão Coroado!" },
    };
    setTransitionTitle(nextRoundLabels[knockoutRound]?.[lang] || currentLabel);
    setShowTransition(true);
  };

  const renderRound = (label, matches, highlight = false) => {
    if (!matches || (Array.isArray(matches) && matches.length === 0))
      return null;
    const matchArray = Array.isArray(matches) ? matches : [matches];
    return (
      <div className="mb-10">
        <h3
          className={`font-display font-bold text-sm md:text-base mb-4 flex items-center gap-2`}
          style={{ color: highlight ? "#B8900C" : "#6C757D" }}
        >
          {highlight && (
            <Trophy className="w-4 h-4" style={{ color: "#B8900C" }} />
          )}
          {label}
        </h3>
        <div
          className={`grid gap-3 ${
            matchArray.length > 4
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              : matchArray.length > 2
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                : matchArray.length === 2
                  ? "grid-cols-1 sm:grid-cols-2"
                  : "grid-cols-1 max-w-sm mx-auto"
          }`}
        >
          {matchArray.map((match, i) => (
            <KnockoutMatchCard key={i} match={match} index={i} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen relative px-4 py-8">
      <StadiumBackground />
      <GlobalLanguageBar />
      <LiveMatchOverlay isVisible={isSimulating} />
      <PhaseTransition
        show={showTransition}
        title={transitionTitle}
        icon={knockoutRound === "final" ? "🏆" : "⚽"}
        onDone={() => {
          setShowTransition(false);
          playNextKnockoutRound();
        }}
        duration={2200}
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
          <h2
            className="font-display font-bold text-2xl md:text-3xl"
            style={{ color: "#212529" }}
          >
            {t("bracket")}
          </h2>
          <p className="text-sm mt-1" style={{ color: "#6C757D" }}>
            {currentLabel}
          </p>
        </motion.div>

        {/* Play button */}
        <div className="flex justify-center mb-8">
          <Button
            onClick={handlePlay}
            disabled={isSimulating || showTransition}
            className="font-display font-bold rounded-xl px-8 py-5 text-base shadow-lg hover:scale-105 transition-transform"
            style={{
              background: isSimulating
                ? "#F3F4F6"
                : "linear-gradient(135deg, #F5C400, #FFD84D)",
              color: isSimulating ? "#6C757D" : "#1A1200",
              boxShadow: isSimulating
                ? "none"
                : "0 6px 20px rgba(245,196,0,0.30)",
            }}
          >
            {isSimulating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {t("simulating")}
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                {t("playNextRound")}: {currentLabel}
              </>
            )}
          </Button>
        </div>

        {/* Bracket */}
        {bracket.final?.result && renderRound(t("final"), bracket.final, true)}
        {bracket.thirdPlace?.result &&
          renderRound(t("thirdPlace"), bracket.thirdPlace)}
        {bracket.semiFinals.length > 0 &&
          renderRound(t("semiFinals"), bracket.semiFinals)}
        {bracket.quarterFinals.length > 0 &&
          renderRound(t("quarterFinals"), bracket.quarterFinals)}
        {bracket.r16.length > 0 && renderRound(t("roundOf16"), bracket.r16)}
      </div>
    </div>
  );
}
