"use client";

import { useEffect, useState } from "react";
import { Heart, Sparkles, Zap, BrainCircuit } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";
import type { Lang } from "@/lib/i18n";

type EgeMatchAICardProps = {
  score?: number;
  energy?: number;
  interest?: number;
  love?: number;
  label?: string;
  summary?: string;
  name?: string;
};

type MatchText = {
  subtitle: string;
  perfectMatch: string;
  highMatch: string;
  mediumMatch: string;
  lowMatch: string;
  shortComment: string;
  energy: string;
  interest: string;
  love: string;
  premiumMessage: string;
  profileFallback: string;
  summary: (name: string) => string;
};

const TEXT: Record<Lang, MatchText> = {
  TR: {
    subtitle: "Yapay zekâ uyum analizi",
    perfectMatch: "Mükemmel Uyum",
    highMatch: "Yüksek Uyum",
    mediumMatch: "Orta Uyum",
    lowMatch: "Düşük Uyum",
    shortComment: "AI kısa yorum",
    energy: "Enerji",
    interest: "İlgi",
    love: "Aşk",
    premiumMessage:
      "Premium üyeler detaylı AI aşk analizini görebilir.",
    profileFallback: "bu profil",
    summary: (name) =>
      `EgeMatch AI, senin profil bilgilerinle ${name} arasındaki ilgi, yaşam tarzı ve ilişki beklentisi uyumunu analiz eder.`,
  },

  EN: {
    subtitle: "AI compatibility analysis",
    perfectMatch: "Perfect Match",
    highMatch: "High Match",
    mediumMatch: "Medium Match",
    lowMatch: "Low Match",
    shortComment: "AI quick insight",
    energy: "Energy",
    interest: "Interest",
    love: "Love",
    premiumMessage:
      "Premium members can view the detailed AI love analysis.",
    profileFallback: "this profile",
    summary: (name) =>
      `EgeMatch AI analyzes the compatibility between your profile and ${name} based on interests, lifestyle and relationship expectations.`,
  },

  RU: {
    subtitle: "Анализ совместимости с помощью ИИ",
    perfectMatch: "Идеальная совместимость",
    highMatch: "Высокая совместимость",
    mediumMatch: "Средняя совместимость",
    lowMatch: "Низкая совместимость",
    shortComment: "Краткий комментарий ИИ",
    energy: "Энергия",
    interest: "Интерес",
    love: "Любовь",
    premiumMessage:
      "Премиум-участники могут просматривать подробный анализ совместимости.",
    profileFallback: "этим профилем",
    summary: (name) =>
      `EgeMatch AI анализирует совместимость между вашим профилем и ${name}, учитывая интересы, образ жизни и ожидания от отношений.`,
  },

  AR: {
    subtitle: "تحليل التوافق بالذكاء الاصطناعي",
    perfectMatch: "توافق مثالي",
    highMatch: "توافق مرتفع",
    mediumMatch: "توافق متوسط",
    lowMatch: "توافق منخفض",
    shortComment: "تعليق سريع بالذكاء الاصطناعي",
    energy: "الطاقة",
    interest: "الاهتمام",
    love: "الحب",
    premiumMessage:
      "يمكن لأعضاء بريميوم مشاهدة تحليل الحب المفصل بالذكاء الاصطناعي.",
    profileFallback: "هذا الملف الشخصي",
    summary: (name) =>
      `يحلل EgeMatch AI التوافق بين ملفك الشخصي و${name} بناءً على الاهتمامات ونمط الحياة وتوقعات العلاقة.`,
  },
};

export default function EgeMatchAICard({
  score = 87,
  energy = 92,
  interest = 84,
  love = 89,
  label,
  summary,
  name,
}: EgeMatchAICardProps) {
  const { lang } = useI18n();
  const [animatedScore, setAnimatedScore] = useState(0);

  const currentLang: Lang = ["TR", "EN", "RU", "AR"].includes(lang)
    ? (lang as Lang)
    : "TR";

  const tx = TEXT[currentLang];
  const profileName = name?.trim() || tx.profileFallback;

  useEffect(() => {
    const target = Math.max(0, Math.min(score, 100));
    let current = 0;

    const timer = setInterval(() => {
      current += 2;

      if (current >= target) {
        current = target;
        clearInterval(timer);
      }

      setAnimatedScore(current);
    }, 18);

    return () => clearInterval(timer);
  }, [score]);

  const finalLabel =
    label ||
    (score >= 90
      ? tx.perfectMatch
      : score >= 75
        ? tx.highMatch
        : score >= 55
          ? tx.mediumMatch
          : tx.lowMatch);

  const finalSummary = summary || tx.summary(profileName);

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-pink-300/40 bg-gradient-to-br from-[#3b001f] via-[#760052] to-[#05051f] p-5 shadow-2xl shadow-pink-950/50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_35%)]" />
      <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-pink-400/30 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-purple-500/30 blur-3xl" />
      <div className="absolute left-[-40%] top-0 h-full w-1/3 skew-x-[-20deg] bg-white/10 blur-xl transition-all duration-1000 group-hover:left-[120%]" />

      <div className="relative z-10">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-500/20 shadow-lg shadow-pink-500/20">
              <div className="absolute inset-0 animate-ping rounded-2xl bg-pink-400/20" />
              <Heart
                className="relative h-6 w-6 text-pink-300"
                fill="currentColor"
              />
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-xl font-black text-white">
                <span>❤️ EgeMatch AI</span>
              </h3>

              <p className="text-xs font-medium text-pink-100/70">
                {tx.subtitle}
              </p>
            </div>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-yellow-300/10">
            <Sparkles className="h-6 w-6 animate-pulse text-yellow-300" />
          </div>
        </div>

        <div className="mb-5 flex flex-wrap items-end gap-3">
          <div className="text-6xl font-black tracking-tight text-white drop-shadow-lg">
            %{animatedScore}
          </div>

          <div className="mb-3 rounded-full border border-pink-300/30 bg-pink-500/20 px-4 py-1.5 text-base font-bold text-pink-50 shadow-lg shadow-pink-500/20">
            {finalLabel}
          </div>
        </div>

        <div className="mb-5 h-3 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-400 via-fuchsia-400 to-yellow-300 shadow-lg shadow-pink-400/40 transition-all duration-700"
            style={{ width: `${animatedScore}%` }}
          />
        </div>

        <div className="mb-5 rounded-2xl border border-white/10 bg-black/15 p-4">
          <div className="mb-2 flex items-center gap-2 text-base font-bold text-pink-100">
            <BrainCircuit className="h-4 w-4 text-yellow-200" />
            {tx.shortComment}
          </div>

          <p className="text-base leading-7 text-pink-50/85">
            {finalSummary}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
            <p className="text-xs text-pink-100/60">{tx.energy}</p>
            <p className="text-lg font-black text-white">%{energy}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
            <p className="text-xs text-pink-100/60">{tx.interest}</p>
            <p className="text-lg font-black text-white">%{interest}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
            <p className="text-xs text-pink-100/60">{tx.love}</p>
            <p className="text-lg font-black text-white">%{love}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-yellow-300/30 bg-yellow-300/10 p-3 text-xs font-semibold text-yellow-100">
          <Zap className="h-4 w-4 shrink-0" />
          <span>{tx.premiumMessage}</span>
        </div>
      </div>
    </div>
  );
}