import React from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useGame } from "@/lib/gameContext";
import StadiumBackground from "@/components/game/StadiumBackground";
import TournamentLogo from "@/components/game/TournamentLogo";
import GlobalLanguageBar from "@/components/game/GlobalLanguageBar";
import { Trophy, Play, Globe, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const { t, lang } = useI18n();
  const { setPhase } = useGame();

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center px-4 py-12">
      <StadiumBackground />
      <GlobalLanguageBar />

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto w-full">
        {/* Host strip */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3 mb-8 px-4 py-2 rounded-full text-xs font-semibold bg-[#032961] border border-[#DDE1E7] text-[#14a707] shadow-[0_1px_4px_rgba(0,0,0,0.06)] dark:bg-[rgba(3,41,97,0.2)] dark:border-[rgba(255,255,255,0.15)]"
        >
          <span className="dark:text-[#F8F9FA]">🇺🇸 USA</span>
          <span className="text-[#CDD1D7] dark:text-[#4A5568]">·</span>
          <span className="dark:text-[#F8F9FA]">🇨🇦 Canada</span>
          <span className="text-[#CDD1D7] dark:text-[#4A5568]">·</span>
          <span className="dark:text-[#F8F9FA]">🇲🇽 Mexico</span>
          <span className="text-[#CDD1D7] dark:text-[#4A5568]">·</span>
          <span className="font-display font-bold text-[#B8900C] dark:text-[#FFD343]">
            2026
          </span>
        </motion.div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", duration: 0.9 }}
          className="mb-6"
        >
          <TournamentLogo size="large" />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h1
            className="font-display font-black text-3xl md:text-5xl lg:text-6xl tracking-tight leading-tight"
            style={{ color: "inherit" }}
          >
            <span
              className="bg-gradient-to-r from-[#259A5A] via-[#E61D25] to-[#2A398D] bg-clip-text text-transparent inline-block"
              style={{ WebkitTextFillColor: "transparent" }}
            >
              FIFA World Cup
            </span>
            <br />
            <span
              className="font-extrabold text-2xl md:text-4xl tracking-wide opacity-90 block mt-1"
              style={{ color: "var(--foreground, #F8F9FA) !important" }}
            >
              2026 Simulator
            </span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-base md:text-lg max-w-md leading-relaxed"
          style={{ color: "#05a01a" }}
        >
          {t("subtitle")}
        </motion.p>

        {/* Feature chips */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap gap-3 mt-8 justify-center"
        >
          {[
            {
              icon: <Globe className="w-3.5 h-3.5" />,
              label: lang === "pt" ? "48 Seleções" : "48 Teams",
            },
            {
              icon: <Trophy className="w-3.5 h-3.5" />,
              label: lang === "pt" ? "Fase Eliminatória" : "Knockout Stage",
            },
            {
              icon: <Users className="w-3.5 h-3.5" />,
              label: lang === "pt" ? "Multi-jogador" : "Multiplayer",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                background: "#FFFFFF",
                border: "1px solid #DDE1E7",
                color: "#495057",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              <span style={{ color: "#259A5A" }}>{f.icon}</span>
              {f.label}
            </div>
          ))}
        </motion.div>

        {/* Start CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-10"
        >
          <Button
            onClick={() => setPhase("registration")}
            className="px-10 py-6 text-lg font-display font-bold rounded-2xl shadow-xl hover:scale-105 transition-transform duration-200"
            style={{
              background:
                "linear-gradient(135deg, #F5C400 0%, #FFD84D 50%, #F5C400 100%)",
              color: "#1A1200",
              boxShadow: "0 8px 24px rgba(245,196,0,0.30)",
            }}
          >
            <Play className="w-5 h-5 mr-2 inline" />
            {t("startGame")}
          </Button>
        </motion.div>

        {/* Decorative rule */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1 }}
          className="mt-16 flex items-center gap-3 text-xs font-display tracking-[0.25em]"
          style={{ color: "#ADB5BD" }}
        >
          <div
            className="w-16 h-px"
            style={{
              background: "linear-gradient(to right, transparent, #CDD1D7)",
            }}
          />
          ⚽ 2026 ⚽
          <div
            className="w-16 h-px"
            style={{
              background: "linear-gradient(to left, transparent, #CDD1D7)",
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
