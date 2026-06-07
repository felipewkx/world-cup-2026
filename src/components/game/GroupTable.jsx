import React from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { getTeamName } from "@/lib/teams";

function GroupTable({ group, index = 0 }) {
  const { lang } = useI18n();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="card-light overflow-hidden"
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between border-b border-border"
        style={{ background: "#F8F9FA" }}
      >
        <h3 className="font-display font-bold text-sm !text-red-600 tracking-wide">
          Group {group.name}
        </h3>

        {group.completed && (
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-bold"
            style={{
              background: "rgba(37,154,90,0.12)",
              color: "#259A5A",
              border: "1px solid rgba(37,154,90,0.25)",
            }}
          >
            ✓ Complete
          </span>
        )}
      </div>

      {group.completed && (
        <div
          className="px-4 py-1.5 flex items-center gap-2 border-b border-border"
          style={{ background: "rgba(37,154,90,0.04)" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full inline-block"
            style={{ background: "#259A5A" }}
          />
          <span
            className="text-[10px] font-semibold"
            style={{ color: "#259A5A" }}
          >
            {lang === "pt"
              ? "2 classificadas · 3ª elegível"
              : "2 qualified · 3rd eligible"}
          </span>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr
              className="border-b border-border"
              style={{ background: "#F8F9FA" }}
            >
              <th className="text-left px-3 py-2 font-semibold text-muted-foreground w-6">
                #
              </th>
              <th className="text-left px-2 py-2 font-semibold text-muted-foreground">
                {lang === "pt" ? "Seleção" : "Team"}
              </th>
              <th className="text-center px-1 py-2 font-semibold text-muted-foreground">
                P
              </th>
              <th className="text-center px-1 py-2 font-semibold text-muted-foreground">
                W
              </th>
              <th className="text-center px-1 py-2 font-semibold text-muted-foreground">
                D
              </th>
              <th className="text-center px-1 py-2 font-semibold text-muted-foreground">
                L
              </th>
              <th className="text-center px-1 py-2 font-semibold text-muted-foreground">
                GD
              </th>
              <th
                className="text-center px-2 py-2 font-bold"
                style={{ color: "#F5C400" }}
              >
                Pts
              </th>
            </tr>
          </thead>
          <tbody>
            {group.teams.map((team, i) => {
              const qualified = group.completed && i < 2;
              const thirdChance = group.completed && i === 2;
              const isHuman = !!team.isHuman;
              const gd = team.stats.gf - team.stats.ga;

              return (
                <tr
                  key={team.code}
                  className={`transition-all duration-300 ${isHuman ? "human-team-row" : ""}`}
                  style={
                    !isHuman
                      ? {
                          background: "#FFFFFF", // Força o fundo branco em todas as posições
                          borderBottom: "1px solid #EEF0F3",
                        }
                      : { borderBottom: "1px solid rgba(234,179,8,0.2)" }
                  }
                >
                  <td className="px-3 py-2.5">
                    <span
                      className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold transition-colors duration-200 ${
                        qualified
                          ? "!bg-[#259A5A] !text-white"
                          : thirdChance
                            ? "!bg-[rgba(245,196,0,0.3)] !text-amber-900 dark:!bg-[#F5C400] dark:!text-black"
                            : "!bg-[#E2E8F0] !text-[#4A5568] dark:!bg-[#343A40] dark:!text-white"
                      }`}
                    >
                      {i + 1}
                    </span>
                  </td>

                  <td className="px-2 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base leading-none">
                        {team.flag}
                      </span>
                      <span
                        className={`font-medium truncate max-w-[80px] ${
                          isHuman
                            ? "font-semibold !text-[#92740A] dark:!text-[#ffd859]"
                            : "!text-[#212529] dark:!text-[#718096]"
                        }`}
                      >
                        {getTeamName(team, lang)}
                      </span>

                      {isHuman && (
                        <motion.span
                          animate={{ opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-[9px] px-1.5 py-0.5 rounded-full font-bold shrink-0 !text-[#92740A] !bg-[rgba(245,196,0,0.25)] border border-[rgba(234,179,8,0.5)] dark:!text-[#fff275] dark:!bg-[rgba(245,196,0,0.12)] dark:!border-[rgba(245,196,0,0.4)] dark:[text-shadow:0_0_3px_rgba(245,196,0,0.3)]"
                        >
                          🎮 {team.player}
                        </motion.span>
                      )}
                    </div>
                  </td>

                  <td className="text-center px-1 py-2.5 text-muted-foreground">
                    {team.stats.played}
                  </td>
                  <td
                    className="text-center px-1 py-2.5 font-medium"
                    style={{ color: "#259A5A" }}
                  >
                    {team.stats.won}
                  </td>
                  <td className="text-center px-1 py-2.5 text-muted-foreground">
                    {team.stats.drawn}
                  </td>
                  <td
                    className="text-center px-1 py-2.5 font-medium"
                    style={{ color: "#E53535" }}
                  >
                    {team.stats.lost}
                  </td>
                  <td
                    className={`text-center px-1 py-2.5 font-semibold text-xs ${
                      gd > 0 ? "" : gd < 0 ? "" : "text-muted-foreground"
                    }`}
                    style={
                      gd > 0
                        ? { color: "#259A5A" }
                        : gd < 0
                          ? { color: "#E53535" }
                          : {}
                    }
                  >
                    {gd > 0 ? "+" : ""}
                    {gd}
                  </td>
                  <td
                    className="text-center px-2 py-2.5 font-bold text-sm"
                    style={
                      isHuman ? { color: "#92740A" } : { color: "#1A1A1A" }
                    }
                  >
                    {team.stats.points}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export default React.memo(GroupTable);
