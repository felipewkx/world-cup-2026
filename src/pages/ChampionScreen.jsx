import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useGame } from "@/lib/gameContext";
import { getTeamName } from "@/lib/teams";
import StadiumBackground from "@/components/game/StadiumBackground";
import GlobalLanguageBar from "@/components/game/GlobalLanguageBar";
import { Button } from "@/components/ui/button";
import { RotateCcw, Medal } from "lucide-react";
import confetti from "canvas-confetti";

export default function ChampionScreen() {
  const { lang, t } = useI18n();
  const { champion, bracket, resetGame } = useGame();
  const confettiDone = useRef(false);

  useEffect(() => {
    if (champion && !confettiDone.current) {
      confettiDone.current = true;

      const fire = (opts) =>
        confetti({
          ...opts,
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });

      fire({ angle: 60, origin: { x: 0 } });
      setTimeout(() => fire({ angle: 120, origin: { x: 1 } }), 300);
      setTimeout(() => fire({ angle: 90, origin: { x: 0.5 } }), 600);

      setTimeout(() => {
        confetti({
          particleCount: 220,
          spread: 170,
          origin: { y: 0.4 },
          colors: ["#F5C400", "#259A5A", "#E53535", "#FFFFFF", "#FF8A00"],
        });
      }, 1000);
    }
  }, [champion]);

  if (!champion || !bracket) return null;

  const champName = getTeamName(champion, lang);
  const runnerUp =
    bracket.final.winner === bracket.final.teamA
      ? bracket.final.teamB
      : bracket.final.teamA;

  const third = bracket.thirdPlace?.winner;

  const fourth =
    bracket.thirdPlace?.winner === bracket.thirdPlace?.teamA
      ? bracket.thirdPlace?.teamB
      : bracket.thirdPlace?.teamA;

  const ranking = [
    {
      team: champion,
      label: t("champion_label"),
      emoji: "🥇",
      bg: "#FFF9E6",
      border: "#F5C400",
      textColor: "#92740A",
    },
    {
      team: runnerUp,
      label: t("runnerUp"),
      emoji: "🥈",
      bg: "#F8F9FA",
      border: "#ADB5BD",
      textColor: "#495057",
    },
    {
      team: third,
      label: t("thirdPlaceLabel"),
      emoji: "🥉",
      bg: "#FFF5EE",
      border: "#FF8A00",
      textColor: "#C05A00",
    },
    {
      team: fourth,
      label: t("fourthPlace"),
      emoji: "🏅",
      bg: "#F8F9FA",
      border: "#CDD1D7",
      textColor: "#6C757D",
    },
  ].filter((r) => r.team);

  return (
    <div className="min-h-screen relative px-4 py-8 flex flex-col items-center">
      <StadiumBackground />
      <GlobalLanguageBar />

      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center">
        {/* Trophy */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 1.5, bounce: 0.4 }}
          className="mb-6"
        >
          <img
            src="/copa1.png"
            alt="FIFA World Cup 2026"
            className="w-36 h-36 md:w-48 md:h-48 object-contain animate-float"
            style={{ filter: "drop-shadow(0 6px 24px rgba(245,196,0,0.35))" }}
          />
        </motion.div>

        {/* Champion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-8 w-full"
        >
          <p
            className="font-display text-xs md:text-sm tracking-[0.3em] uppercase mb-2"
            style={{ color: "#B8900C" }}
          >
            ⭐ {t("champion")} ⭐
          </p>

          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-5xl md:text-7xl">{champion.flag}</span>
          </div>

          <h1
            className="font-display font-black text-3xl md:text-5xl mb-4"
            style={{
              background:
                "linear-gradient(135deg, #B8900C, #F5C400, #FFE066, #F5C400, #B8900C)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "gradient-shift 3s ease infinite",
            }}
          >
            {champName}
          </h1>
        </motion.div>

        {/* Ranking */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="w-full mb-10"
        >
          <h3 className="font-display font-bold text-lg text-center mb-6 flex items-center justify-center gap-2 text-[#212529] dark:text-[#a3ffc2] dark:[text-shadow:0_0_5px_#259A5A,0_0_10px_rgba(37,154,146,0.5)]">
            <Medal className="w-5 h-5" style={{ color: "#B8900C" }} />
            {t("finalRanking")}
          </h3>

          <div className="space-y-3">
            {ranking.map((r, i) => (
              <motion.div
                key={r.team.code}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.8 + i * 0.15 }}
                className="rounded-xl p-4 flex items-center gap-4 border"
                style={{
                  background: r.bg,
                  borderColor: r.border,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                }}
              >
                <span className="text-2xl md:text-3xl">{r.emoji}</span>
                <span className="text-2xl md:text-3xl">{r.team.flag}</span>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm md:text-base truncate">
                    {getTeamName(r.team, lang)}
                  </p>

                  <span
                    className="text-xs font-bold"
                    style={{ color: r.textColor }}
                  >
                    {r.label}
                  </span>
                </div>

                <span className="font-bold">{r.team.rating}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* New game */}
        <Button onClick={resetGame} className="px-8 py-5 font-bold rounded-2xl">
          <RotateCcw className="w-5 h-5 mr-2" />
          {t("newGame")}
        </Button>
      </div>
    </div>
  );
}
