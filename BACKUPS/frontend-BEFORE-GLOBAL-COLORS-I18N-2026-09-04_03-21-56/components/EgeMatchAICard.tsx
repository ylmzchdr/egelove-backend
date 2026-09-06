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
    subtitle: "Yapay zekÃ¢ uyum analizi",
    perfectMatch: "MÃ¼kemmel Uyum",
    highMatch: "YÃ¼ksek Uyum",
    mediumMatch: "Orta Uyum",
    lowMatch: "DÃ¼ÅŸÃ¼k Uyum",
    shortComment: "AI kÄ±sa yorum",
    energy: "Enerji",
    interest: "Ä°lgi",
    love: "AÅŸk",
    premiumMessage:
      "Premium Ã¼yeler detaylÄ± AI aÅŸk analizini gÃ¶rebilir.",
    profileFallback: "bu profil",
    summary: (name) =>
      `EgeMatch AI, senin profil bilgilerinle ${name} arasÄ±ndaki ilgi, yaÅŸam tarzÄ± ve iliÅŸki beklentisi uyumunu analiz eder.`,
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
    subtitle: "ĞĞ½Ğ°Ğ»Ğ¸Ğ· ÑĞ¾Ğ²Ğ¼ĞµÑÑ‚Ğ¸Ğ¼Ğ¾ÑÑ‚Ğ¸ Ñ Ğ¿Ğ¾Ğ¼Ğ¾Ñ‰ÑŒÑ Ğ˜Ğ˜",
    perfectMatch: "Ğ˜Ğ´ĞµĞ°Ğ»ÑŒĞ½Ğ°Ñ ÑĞ¾Ğ²Ğ¼ĞµÑÑ‚Ğ¸Ğ¼Ğ¾ÑÑ‚ÑŒ",
    highMatch: "Ğ’Ñ‹ÑĞ¾ĞºĞ°Ñ ÑĞ¾Ğ²Ğ¼ĞµÑÑ‚Ğ¸Ğ¼Ğ¾ÑÑ‚ÑŒ",
    mediumMatch: "Ğ¡Ñ€ĞµĞ´Ğ½ÑÑ ÑĞ¾Ğ²Ğ¼ĞµÑÑ‚Ğ¸Ğ¼Ğ¾ÑÑ‚ÑŒ",
    lowMatch: "ĞĞ¸Ğ·ĞºĞ°Ñ ÑĞ¾Ğ²Ğ¼ĞµÑÑ‚Ğ¸Ğ¼Ğ¾ÑÑ‚ÑŒ",
    shortComment: "ĞšÑ€Ğ°Ñ‚ĞºĞ¸Ğ¹ ĞºĞ¾Ğ¼Ğ¼ĞµĞ½Ñ‚Ğ°Ñ€Ğ¸Ğ¹ Ğ˜Ğ˜",
    energy: "Ğ­Ğ½ĞµÑ€Ğ³Ğ¸Ñ",
    interest: "Ğ˜Ğ½Ñ‚ĞµÑ€ĞµÑ",
    love: "Ğ›ÑĞ±Ğ¾Ğ²ÑŒ",
    premiumMessage:
      "ĞŸÑ€ĞµĞ¼Ğ¸ÑƒĞ¼-ÑƒÑ‡Ğ°ÑÑ‚Ğ½Ğ¸ĞºĞ¸ Ğ¼Ğ¾Ğ³ÑƒÑ‚ Ğ¿Ñ€Ğ¾ÑĞ¼Ğ°Ñ‚Ñ€Ğ¸Ğ²Ğ°Ñ‚ÑŒ Ğ¿Ğ¾Ğ´Ñ€Ğ¾Ğ±Ğ½Ñ‹Ğ¹ Ğ°Ğ½Ğ°Ğ»Ğ¸Ğ· ÑĞ¾Ğ²Ğ¼ĞµÑÑ‚Ğ¸Ğ¼Ğ¾ÑÑ‚Ğ¸.",
    profileFallback: "ÑÑ‚Ğ¸Ğ¼ Ğ¿Ñ€Ğ¾Ñ„Ğ¸Ğ»ĞµĞ¼",
    summary: (name) =>
      `EgeMatch AI Ğ°Ğ½Ğ°Ğ»Ğ¸Ğ·Ğ¸Ñ€ÑƒĞµÑ‚ ÑĞ¾Ğ²Ğ¼ĞµÑÑ‚Ğ¸Ğ¼Ğ¾ÑÑ‚ÑŒ Ğ¼ĞµĞ¶Ğ´Ñƒ Ğ²Ğ°ÑˆĞ¸Ğ¼ Ğ¿Ñ€Ğ¾Ñ„Ğ¸Ğ»ĞµĞ¼ Ğ¸ ${name}, ÑƒÑ‡Ğ¸Ñ‚Ñ‹Ğ²Ğ°Ñ Ğ¸Ğ½Ñ‚ĞµÑ€ĞµÑÑ‹, Ğ¾Ğ±Ñ€Ğ°Ğ· Ğ¶Ğ¸Ğ·Ğ½Ğ¸ Ğ¸ Ğ¾Ğ¶Ğ¸Ğ´Ğ°Ğ½Ğ¸Ñ Ğ¾Ñ‚ Ğ¾Ñ‚Ğ½Ğ¾ÑˆĞµĞ½Ğ¸Ğ¹.`,
  },

  AR: {
    subtitle: "ØªØ­Ù„ÙŠÙ„ Ø§Ù„ØªÙˆØ§ÙÙ‚ Ø¨Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ",
    perfectMatch: "ØªÙˆØ§ÙÙ‚ Ù…Ø«Ø§Ù„ÙŠ",
    highMatch: "ØªÙˆØ§ÙÙ‚ Ù…Ø±ØªÙØ¹",
    mediumMatch: "ØªÙˆØ§ÙÙ‚ Ù…ØªÙˆØ³Ø·",
    lowMatch: "ØªÙˆØ§ÙÙ‚ Ù…Ù†Ø®ÙØ¶",
    shortComment: "ØªØ¹Ù„ÙŠÙ‚ Ø³Ø±ÙŠØ¹ Ø¨Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ",
    energy: "Ø§Ù„Ø·Ø§Ù‚Ø©",
    interest: "Ø§Ù„Ø§Ù‡ØªÙ…Ø§Ù…",
    love: "Ø§Ù„Ø­Ø¨",
    premiumMessage:
      "ÙŠÙ…ÙƒÙ† Ù„Ø£Ø¹Ø¶Ø§Ø¡ Ø¨Ø±ÙŠÙ…ÙŠÙˆÙ… Ù…Ø´Ø§Ù‡Ø¯Ø© ØªØ­Ù„ÙŠÙ„ Ø§Ù„Ø­Ø¨ Ø§Ù„Ù…ÙØµÙ„ Ø¨Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ.",
    profileFallback: "Ù‡Ø°Ø§ Ø§Ù„Ù…Ù„Ù Ø§Ù„Ø´Ø®ØµÙŠ",
    summary: (name) =>
      `ÙŠØ­Ù„Ù„ EgeMatch AI Ø§Ù„ØªÙˆØ§ÙÙ‚ Ø¨ÙŠÙ† Ù…Ù„ÙÙƒ Ø§Ù„Ø´Ø®ØµÙŠ Ùˆ${name} Ø¨Ù†Ø§Ø¡Ù‹ Ø¹Ù„Ù‰ Ø§Ù„Ø§Ù‡ØªÙ…Ø§Ù…Ø§Øª ÙˆÙ†Ù…Ø· Ø§Ù„Ø­ÙŠØ§Ø© ÙˆØªÙˆÙ‚Ø¹Ø§Øª Ø§Ù„Ø¹Ù„Ø§Ù‚Ø©.`,
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
      <div className="absolute left-[-40%] top-0 h-full w-1/3 skew-x-[-20deg] bg-pink-50 blur-xl transition-all duration-1000 group-hover:left-[120%]" />

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
              <h3 className="flex items-center gap-2 text-xl font-black text-[#2D1721]">
                <span>â¤ï¸ EgeMatch AI</span>
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
          <div className="text-6xl font-black tracking-tight text-[#2D1721] drop-shadow-lg">
            %{animatedScore}
          </div>

          <div className="mb-3 rounded-full border border-pink-300/30 bg-pink-500/20 px-4 py-1.5 text-base font-bold text-pink-50 shadow-lg shadow-pink-500/20">
            {finalLabel}
          </div>
        </div>

        <div className="mb-5 h-3 overflow-hidden rounded-full bg-pink-50">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-400 via-fuchsia-400 to-yellow-300 shadow-lg shadow-pink-400/40 transition-all duration-700"
            style={{ width: `${animatedScore}%` }}
          />
        </div>

        <div className="mb-5 rounded-2xl border border-pink-200 bg-black/15 p-4">
          <div className="mb-2 flex items-center gap-2 text-base font-bold text-pink-100">
            <BrainCircuit className="h-4 w-4 text-yellow-200" />
            {tx.shortComment}
          </div>

          <p className="text-base leading-7 text-pink-50/85">
            {finalSummary}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl border border-pink-200 bg-pink-50 p-3">
            <p className="text-xs text-pink-100/60">{tx.energy}</p>
            <p className="text-lg font-black text-[#2D1721]">%{energy}</p>
          </div>

          <div className="rounded-2xl border border-pink-200 bg-pink-50 p-3">
            <p className="text-xs text-pink-100/60">{tx.interest}</p>
            <p className="text-lg font-black text-[#2D1721]">%{interest}</p>
          </div>

          <div className="rounded-2xl border border-pink-200 bg-pink-50 p-3">
            <p className="text-xs text-pink-100/60">{tx.love}</p>
            <p className="text-lg font-black text-[#2D1721]">%{love}</p>
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
