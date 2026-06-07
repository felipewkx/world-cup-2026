import React from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { getTeamName } from "@/lib/teams";

function TeamRow({ team, goals, isWinner, isPlayed }) {
  const { lang } = useI18n();
  const name = getTeamName(team, lang);
  const isHuman = !!team.isHuman;

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all duration-200 ${
        isHuman ? "human-team-row" : ""
      } ${isPlayed && !isWinner && !isHuman ? "opacity-40" : ""}`}
      style={
        !isHuman && isWinner && isPlayed
          ? {
              background: "rgba(37,154,90,0.08)",
              borderLeft: "3px solid #259A5A",
            }
          : !isHuman
            ? {}
            : {}
      }
    >
      <span className="text-xl leading-none shrink-0">{team.flag}</span>
      <div className="flex-1 min-w-0">
        <p
          className={`text-xs font-semibold truncate leading-tight ${
            isHuman
              ? "!text-[#92740A] dark:!text-[#FFD343]"
              : isWinner && isPlayed
                ? "!text-[#259A5A] dark:!text-[#a3ffc2]"
                : isPlayed && !isWinner
                  ? "!text-[#0ba350] dark:!text-[#E2E8F0]"
                  : "!text-[#07519b] dark:!text-[#E2E8F0]"
          }`}
        >
          {name}
        </p>

        {isHuman && (
          <motion.p
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-[9px] font-display font-bold leading-none mt-0.5"
            style={{ color: "#B8900C" }}
          >
            🎮 {team.player}
          </motion.p>
        )}
      </div>

      {isPlayed && (
        <div className="flex items-center gap-1 shrink-0">
          <span
            className="font-display font-bold text-base w-5 text-center"
            style={
              isWinner
                ? isHuman
                  ? { color: "#B8900C" }
                  : { color: "#259A5A" }
                : { color: "#8A9099" }
            }
          >
            {goals}
          </span>
          {isWinner && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              {isHuman ? "🌟" : "✅"}
            </motion.span>
          )}
        </div>
      )}
    </div>
  );
}

export default function KnockoutMatchCard({ match, index = 0 }) {
  const { t } = useI18n();
  if (!match) return null;
  const { teamA, teamB, result, winner } = match;
  const played = !!result;
  const winnerA = played && winner === teamA;
  const winnerB = played && winner === teamB;
  const hasHuman = teamA?.isHuman || teamB?.isHuman;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.06, type: "spring", stiffness: 200 }}
      className={`card-light-hover overflow-hidden ${hasHuman ? "" : ""}`}
      style={
        hasHuman
          ? {
              borderColor: "rgba(234,179,8,0.45)",
              boxShadow: "0 2px 12px rgba(234,179,8,0.12)",
            }
          : {}
      }
    >
      <div className="p-2 space-y-0.5">
        <TeamRow
          team={teamA}
          goals={result?.goalsA}
          isWinner={winnerA}
          isPlayed={played}
        />
        <div className="flex items-center gap-2 px-3 py-0.5">
          <div className="flex-1 h-px" style={{ background: "#EEF0F3" }} />
          <span className="text-[10px] text-muted-foreground font-display uppercase tracking-wider">
            vs
          </span>
          <div className="flex-1 h-px" style={{ background: "#EEF0F3" }} />
        </div>
        <TeamRow
          team={teamB}
          goals={result?.goalsB}
          isWinner={winnerB}
          isPlayed={played}
        />
      </div>

      {played && (result.extraTime || result.penalties) && (
        <div className="flex justify-center gap-1 pb-2 pt-0.5">
          {result.extraTime && !result.penalties && (
            <span
              className="text-[9px] px-2 py-0.5 rounded-full font-semibold"
              style={{
                background: "rgba(255,138,0,0.12)",
                color: "#D97706",
                border: "1px solid rgba(255,138,0,0.25)",
              }}
            >
              {t("afterExtraTime")}
            </span>
          )}
          {result.penalties && (
            <span
              className="text-[9px] px-2 py-0.5 rounded-full font-semibold"
              style={{
                background: "rgba(229,53,53,0.10)",
                color: "#E53535",
                border: "1px solid rgba(229,53,53,0.25)",
              }}
            >
              PEN {result.penaltyScore[0]}–{result.penaltyScore[1]}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}
