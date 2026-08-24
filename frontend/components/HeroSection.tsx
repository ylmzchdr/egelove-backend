"use client";

import { useI18n } from "@/lib/i18n-context";
import { Sparkles, UserPlus, Compass } from "lucide-react";

type LangKey = "TR" | "EN" | "RU" | "AR";

interface HeroSectionProps {
  onCtaClick?: () => void;
}

export default function HeroSection({ onCtaClick }: HeroSectionProps) {
  // Sitenin kendi büyük dil butonlarını dinleyen o meşhur antenimiz
  const { lang } = useI18n();

  // Reklam Stratejimize Uygun Dönüşüm Odaklı Yeni Dil Paketleri (Büyük Harf Uyumlu)
  const translations: Record<
    LangKey,
    {
      titlePrefix: string;
      titleHighlight: string;
      titleSuffix: string;
      subtitle: string;
      ctaRegister: string;
      ctaExplore: string;
      aiTitle: string;
      aiDescription: string;
    }
  > = {
    TR: {
      titlePrefix: "❤️ Aradığın kişi belki de sadece ",
      titleHighlight: "birkaç kilometre",
      titleSuffix: " uzakta.",
      subtitle: "Türkiye'nin 81 ilinde ve ilçelerinde yeni insanları keşfet. Sana uygun profilleri bul, beğen, eşleş ve tanış.",
      ctaRegister: "Ücretsiz Üye Ol",
      ctaExplore: "Üyeleri Keşfet",
      aiTitle: "EgeLove AI ile Sınırları Kaldırın",
      aiDescription: "Farklı diller konuşan insanlarla anında ve doğal iletişim kurun. Siz kendi dilinizde yazın, EgeLove AI mesajlarınızı anında çevirsin. Dil bariyeri olmadan, dünyanın ve Türkiye'nin dört bir yanından üyelerle akıcı sohbetin keyfini çıkarın!"
    },
    EN: {
      titlePrefix: "❤️ The person you are looking for might be just ",
      titleHighlight: "a few kilometers",
      titleSuffix: " away.",
      subtitle: "Discover new people across 81 provinces and districts. Find profiles that match you, like, match, and meet.",
      ctaRegister: "Sign Up for Free",
      ctaExplore: "Explore Members",
      aiTitle: "Break Barriers with EgeLove AI",
      aiDescription: "Communicate instantly and naturally with people speaking different languages. You write in your own language, and EgeLove AI translates your messages instantly. Enjoy fluent conversations without language barriers!"
    },
    RU: {
      titlePrefix: "❤️ Человек, которого вы ищете, возможно, всего в ",
      titleHighlight: "нескольких километрах",
      titleSuffix: " от вас.",
      subtitle: "Знакомьтесь с новыми людьми в 81 провинциях и районах. Находите подходящие профили, лайкайте, общайтесь и встречайтесь.",
      ctaRegister: "Зарегистрироваться бесплатно",
      ctaExplore: "Посмотреть участников",
      aiTitle: "Стирайте границы с EgeLove AI",
    	aiDescription: "Общайтесь мгновенно и естественно с людьми, говорящими на разных языках. Вы пишите на своем языке, а EgeLove AI мгновенно переводит сообщения. Наслаждайтесь свободным общением без языковых барьеров!"
    },
    AR: {
      titlePrefix: "❤️ الشخص الذي تبحث عنه قد يكون على بعد ",
      titleHighlight: "بضعة كيلومترات",
      titleSuffix: " فقط.",
      subtitle: "اكتشف أشخاصاً جدد في 81 ولاية ومنطقة. اعثر على الملفات الشخصية التي تناسبك، أعجب بها، تطابق وتعرف عليهم.",
      ctaRegister: "سجل مجاناً",
      ctaExplore: "استكشف الأعضاء",
      aiTitle: "أزل الحدود مع EgeLove AI",
      aiDescription: "تواصل فوراً وبشكل طبيعي مع أشخاص يتحدثون لغات مختلفة. اكتب بلغتك الخاصة، وسيقوم EgeLove AI بترجمة رسائلك على الفور. استمتع بمحادثات سلسة دون أي عوائق لغوية!"
    }
  };

  // Üstten gelen dili doğrula, yoksa TR'ye pasla
  const currentLang: LangKey = ["TR", "EN", "RU", "AR"].includes(lang)
    ? (lang as LangKey)
    : "TR";

  const t = translations[currentLang];
  const isRtl = currentLang === "AR";

  return (
    <section 
      className="relative overflow-hidden bg-[#0d1527] pt-32 pb-16 md:pt-40 md:pb-24"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Arka Plan Glow Işıkları */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-12 left-1/2 h-[400px] w-[500px] -translate-x-1/2 rounded-full bg-purple-600/15 blur-[120px]" />
        <div className="absolute top-20 left-1/3 h-[250px] w-[250px] rounded-full bg-pink-600/10 blur-[80px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 text-center md:px-12">
        {/* 1. BÖLÜM: ANA KANCA VE MANŞET */}
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-6xl md:leading-[1.15]">
            {t.titlePrefix}<span className="text-[#FFC000]">{t.titleHighlight}</span>{t.titleSuffix}
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 md:text-xl">
            {t.subtitle}
          </p>
        </div>

        {/* 2. BÖLÜM: AKSİYON BUTONLARI (CTA) */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={onCtaClick}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFC000] px-8 py-4 text-base font-bold text-black shadow-lg shadow-[#FFC000]/20 transition-all duration-300 hover:scale-[1.03] hover:bg-[#ffe066] sm:w-auto"
          >
            <UserPlus className="h-5 w-5" />
            {t.ctaRegister}
          </button>
          
                   {/* 🛰️ 81 İL VİZYONU CANLI GÖRÜNTÜLÜ SOHBET ODALARI BUTONU */}
          <button
            onClick={onCtaClick}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 px-8 py-4 text-base font-black text-white shadow-lg shadow-purple-600/30 transition-all duration-300 hover:scale-[1.03] hover:brightness-110 sm:w-auto select-none"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <span>🛰️ CANLI ODALARI İZLE</span>
          </button>

        </div>

        {/* 3. BÖLÜM: EGELOVE AI (HERO'NUN HEMEN ALTI) */}
        <div className="mx-auto mt-20 max-w-3xl rounded-2xl border border-purple-500/20 bg-gradient-to-b from-purple-950/20 to-transparent p-6 backdrop-blur-md md:p-8">
          <div className="flex items-center justify-center gap-2 text-[#FFC000]">
            <Sparkles className="h-5 w-5 animate-pulse" />
            <h2 className="text-lg font-bold tracking-wide uppercase text-white sm:text-xl">
              {t.aiTitle}
            </h2>
          </div>
          
          <p className="mt-4 text-sm leading-relaxed text-white/70 md:text-base">
            {t.aiDescription}
          </p>
        </div>
      </div>
    </section>
  );
}
