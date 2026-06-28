"use client";

import { Heart, Sparkles, Zap } from "lucide-react";

type EgeMatchAICardProps = {
  score?: number;
  name?: string;
};

export default function EgeMatchAICard({
  score = 87,
  name = "bu profil",
}: EgeMatchAICardProps) {
  const getLabel = () => {
    if (score >= 90) return "Mükemmel Uyum";
    if (score >= 75) return "Yüksek Uyum";
    if (score >= 55) return "Orta Uyum";
    return "Düşük Uyum";
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-pink-400/30 bg-gradient-to-br from-rose-950 via-fuchsia-950 to-slate-950 p-5 shadow-2xl shadow-pink-900/30">
      <div className="absolute -right-10 -top-10 h-32 w-32 animate-pulse rounded-full bg-pink-500/30 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-32 w-32 animate-pulse rounded-full bg-purple-500/30 blur-3xl" />

      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-500/20">
              <Heart className="h-6 w-6 animate-bounce text-pink-400" fill="currentColor" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">❤️ EgeMatch AI</h3>
              <p className="text-xs text-pink-100/70">Yapay zeka uyum analizi</p>
            </div>
          </div>

          <Sparkles className="h-6 w-6 animate-pulse text-yellow-300" />
        </div>

        <div className="mb-5 flex items-end gap-3">
          <div className="text-5xl font-black tracking-tight text-white">
            %{score}
          </div>
          <div className="mb-2 rounded-full bg-pink-500/20 px-3 py-1 text-sm font-semibold text-pink-100">
            {getLabel()}
          </div>
        </div>

        <div className="mb-4 h-3 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-pink-400 via-fuchsia-400 to-yellow-300 transition-all duration-1000"
            style={{ width: `${score}%` }}
          />
        </div>

        <p className="mb-4 text-sm leading-relaxed text-pink-50/85">
          EgeMatch AI, senin profil bilgilerinle {name} arasındaki ilgi,
          yaşam tarzı ve ilişki beklentisi uyumunu analiz eder.
        </p>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl bg-white/10 p-3">
            <p className="text-xs text-pink-100/60">Enerji</p>
            <p className="font-bold text-white">%92</p>
          </div>

          <div className="rounded-2xl bg-white/10 p-3">
            <p className="text-xs text-pink-100/60">İlgi</p>
            <p className="font-bold text-white">%84</p>
          </div>

          <div className="rounded-2xl bg-white/10 p-3">
            <p className="text-xs text-pink-100/60">Aşk</p>
            <p className="font-bold text-white">%89</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-yellow-300/20 bg-yellow-300/10 p-3 text-xs text-yellow-100">
          <Zap className="h-4 w-4" />
          Premium üyeler detaylı AI aşk analizini görebilir.
        </div>
      </div>
    </div>
  );
}