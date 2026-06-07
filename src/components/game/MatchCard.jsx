import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { getTeamName } from "@/lib/teams";
import { ChevronDown, ChevronUp } from "lucide-react";

function MatchCard({ match, index = 0 }) {
  const { lang, t } = useI18n();
  const [showStats, setShowStats] = useState(false);
  const { teamA, teamB, result } = match;
  const nameA = getTeamName(teamA, lang);
  const nameB = getTeamName(teamB, lang);
  const winA = result.goalsA > result.goalsB;
  const winB = result.goalsB > result.goalsA;
  const isDraw = result.goalsA === result.goalsB;
  const hasHuman = teamA.isHuman || teamB.isHuman;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 220 }}
      className="card-light-hover overflow-hidden"
      style={
        hasHuman
          ? {
              borderColor: "rgba(234,179,8,0.4)",
              boxShadow: "0 2px 12px rgba(234,179,8,0.10)",
            }
          : {}
      }
    >
      <div className="p-3 md:p-4">
        {/* Score row */}
        <div className="flex items-center gap-2">
          {/* Team A */}
          <div
            className={`flex-1 flex items-center gap-2 min-w-0 rounded-lg px-2 py-1.5 ${teamA.isHuman ? "human-team-row" : ""}`}
            style={
              !teamA.isHuman && winA
                ? { background: "rgba(37,154,90,0.06)" }
                : !teamA.isHuman
                  ? {}
                  : {}
            }
          >
            <span className="text-xl leading-none shrink-0">{teamA.flag}</span>
            <div className="min-w-0">
              <p
                className={`font-semibold text-xs md:text-sm truncate`}
                style={
                  teamA.isHuman
                    ? { color: "#92740A" }
                    : winA
                      ? { color: "#259A5A" }
                      : winB
                        ? { color: "#8A9099" }
                        : { color: "#212529" }
                }
              >
                {nameA}
              </p>
              {teamA.isHuman && (
                <p
                  className="text-[10px] font-display font-bold"
                  style={{ color: "#B8900C" }}
                >
                  🎮 {teamA.player}
                </p>
              )}
            </div>
          </div>

          {/* Score */}
          <motion.div
            initial={{ scale: 0.4 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              duration: 0.6,
              delay: index * 0.05 + 0.1,
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg shrink-0 font-display font-bold text-lg md:text-xl tabular-nums"
            style={{ background: "#F8F9FA", border: "1px solid #EEF0F3" }}
          >
            <span style={winA ? { color: "#259A5A" } : { color: "#212529" }}>
              {result.goalsA}
            </span>
            <span className="text-muted-foreground text-sm mx-0.5">–</span>
            <span style={winB ? { color: "#259A5A" } : { color: "#212529" }}>
              {result.goalsB}
            </span>
          </motion.div>

          {/* Team B */}
          <div
            className={`flex-1 flex items-center gap-2 justify-end min-w-0 rounded-lg px-2 py-1.5 ${teamB.isHuman ? "human-team-row" : ""}`}
            style={
              !teamB.isHuman && winB
                ? { background: "rgba(37,154,90,0.06)" }
                : !teamB.isHuman
                  ? {}
                  : {}
            }
          >
            <div className="text-right min-w-0">
              <p
                className="font-semibold text-xs md:text-sm truncate"
                style={
                  teamB.isHuman
                    ? { color: "#92740A" }
                    : winB
                      ? { color: "#259A5A" }
                      : winA
                        ? { color: "#8A9099" }
                        : { color: "#212529" }
                }
              >
                {nameB}
              </p>
              {teamB.isHuman && (
                <p
                  className="text-[10px] font-display font-bold text-right"
                  style={{ color: "#B8900C" }}
                >
                  🎮 {teamB.player}
                </p>
              )}
            </div>
            <span className="text-xl leading-none shrink-0">{teamB.flag}</span>
          </div>
        </div>

        {/* Draw / ET / penalties badges */}
        {(isDraw || result.extraTime || result.penalties) && (
          <div className="flex justify-center gap-2 mt-2">
            {isDraw && (
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                style={{
                  background: "rgba(245,196,0,0.15)",
                  color: "#92740A",
                  border: "1px solid rgba(234,179,8,0.3)",
                }}
              >
                Draw
              </span>
            )}
            {result.extraTime && !result.penalties && (
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
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
                className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
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

        {/* Stats toggle */}
        <button
          onClick={() => setShowStats((s) => !s)}
          className="w-full flex items-center justify-center gap-1 mt-2.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
        >
          {showStats ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
          <span>Stats</span>
        </button>
      </div>

      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border"
          >
            <div className="p-3 space-y-2" style={{ background: "#F8F9FA" }}>
              <StatBar
                label={t("possession")}
                a={result.stats.possession[0]}
                b={result.stats.possession[1]}
                suffix="%"
              />
              <StatBar
                label={t("shots")}
                a={result.stats.shots[0]}
                b={result.stats.shots[1]}
              />
              <StatBar
                label={t("shotsOnTarget")}
                a={result.stats.shotsOnTarget[0]}
                b={result.stats.shotsOnTarget[1]}
              />
              <StatBar
                label={t("corners")}
                a={result.stats.corners[0]}
                b={result.stats.corners[1]}
              />
              <StatBar
                label={t("fouls")}
                a={result.stats.fouls[0]}
                b={result.stats.fouls[1]}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default React.memo(MatchCard);

function StatBar({ label, a, b, suffix = "" }) {
  const total = a + b || 1;
  const pctA = (a / total) * 100;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px]">
        <span className="font-semibold tabular-nums text-foreground">
          {a}
          {suffix}
        </span>
        <span className="text-muted-foreground flex-1 text-center px-2">
          {label}
        </span>
        <span className="font-semibold tabular-nums text-foreground">
          {b}
          {suffix}
        </span>
      </div>
      <div
        className="flex h-1.5 rounded-full overflow-hidden"
        style={{ background: "#E9ECEF" }}
      >
        <div
          className="rounded-l-full transition-all duration-500"
          style={{ width: `${pctA}%`, background: "rgba(245,196,0,0.80)" }}
        />
        <div
          className="rounded-r-full transition-all duration-500"
          style={{
            width: `${100 - pctA}%`,
            background: "rgba(37,154,90,0.65)",
          }}
        />
      </div>
    </div>
  );
}
