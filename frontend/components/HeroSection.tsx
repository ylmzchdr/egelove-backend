"use client";

import { useI18n } from "@/lib/i18n-context";
import {
  Sparkles,
  UserPlus,
  Video,
  ShieldCheck,
  MapPin,
  Languages,
} from "lucide-react";

type LangKey = "TR" | "EN" | "RU" | "AR";

interface HeroSectionProps {
  onCtaClick?: () => void;
}

export default function HeroSection({ onCtaClick }: HeroSectionProps) {
  const { lang } = useI18n();

  const translations: Record<
    LangKey,
    {
      eyebrow: string;
      titlePrefix: string;
      titleHighlight: string;
      titleSuffix: string;
      subtitle: string;
      ctaRegister: string;
      ctaExplore: string;
      aiTitle: string;
      aiDescription: string;
      languageSupport: string;
      provinceCoverage: string;
      secureConnection: string;
      liveMembers: string;
      romanticQuote: string;
    }
  > = {
    TR: {
      eyebrow: "CANLI GÖRÜNTÜLÜ • ANINDA MESAJ • 4 DİLDE İLETİŞİM",
      titlePrefix: "Aradığın kişi belki de sadece ",
      titleHighlight: "birkaç kilometre",
      titleSuffix: " uzakta.",
      subtitle:
        "Türkiye'nin 81 ilinde ve ilçelerinde yeni insanları keşfet. Sana uygun profilleri bul, beğen, eşleş ve tanış. Karşılıklı eşleştiğin kişilerle anında görüntülü konuş.",
      ctaRegister: "Ücretsiz Üye Ol",
      ctaExplore: "Canlı Görüntülü Konuş",
      aiTitle: "SENveBEN AI ile sınırları kaldırın",
      aiDescription:
        "Farklı diller konuşan insanlarla daha kolay iletişim kurun. Siz kendi dilinizde yazın, SENveBEN AI mesajlarınızı anında çevirsin.",
      languageSupport: "Dil desteği",
      provinceCoverage: "İl kapsamı",
      secureConnection: "Güvenli bağlantı",
      liveMembers: "81 ilden canlı üyeler",
      romanticQuote: "Aşkın her yaşta güzel...",
    },

    EN: {
      eyebrow: "LIVE VIDEO • INSTANT MESSAGES • 4 LANGUAGES",
      titlePrefix: "The person you're looking for might be just ",
      titleHighlight: "a few kilometers",
      titleSuffix: " away.",
      subtitle:
        "Discover new people across all 81 provinces of Türkiye. Find profiles that match you, connect and start one-to-one video conversations with people you mutually like.",
      ctaRegister: "Sign Up for Free",
      ctaExplore: "Start Live Video Chat",
      aiTitle: "Break barriers with SENveBEN AI",
      aiDescription:
        "Connect naturally with people who speak different languages. Write in your own language and let SENveBEN AI translate your messages instantly.",
      languageSupport: "Language support",
      provinceCoverage: "Province coverage",
      secureConnection: "Secure connection",
      liveMembers: "Members from 81 provinces",
      romanticQuote: "Love is beautiful at every age...",
    },

    RU: {
      eyebrow: "ВИДЕО • МГНОВЕННЫЕ СООБЩЕНИЯ • 4 ЯЗЫКА",
      titlePrefix: "Человек, которого вы ищете, может быть всего в ",
      titleHighlight: "нескольких километрах",
      titleSuffix: " от вас.",
      subtitle:
        "Знакомьтесь с новыми людьми во всех 81 провинции Турции. Находите подходящие профили, знакомьтесь и общайтесь один на один по видеосвязи.",
      ctaRegister: "Зарегистрироваться бесплатно",
      ctaExplore: "Начать видеочат",
      aiTitle: "Уберите языковые барьеры с SENveBEN AI",
      aiDescription:
        "Общайтесь с людьми, говорящими на разных языках. Пишите на своём языке, а SENveBEN AI мгновенно переведёт ваши сообщения.",
      languageSupport: "Поддержка языков",
      provinceCoverage: "Провинции",
      secureConnection: "Безопасное соединение",
      liveMembers: "Участники из 81 провинции",
      romanticQuote: "Любовь прекрасна в любом возрасте...",
    },

    AR: {
      eyebrow: "فيديو مباشر • رسائل فورية • 4 لغات",
      titlePrefix: "قد يكون الشخص الذي تبحث عنه على بُعد ",
      titleHighlight: "بضعة كيلومترات",
      titleSuffix: " فقط.",
      subtitle:
        "اكتشف أشخاصًا جددًا في جميع أنحاء تركيا وفي جميع المحافظات الـ81. اعثر على الملفات المناسبة وابدأ محادثات فيديو مباشرة مع الأشخاص الذين تتبادلون الإعجاب.",
      ctaRegister: "سجل مجانًا",
      ctaExplore: "ابدأ محادثة فيديو",
      aiTitle: "تجاوز حواجز اللغة مع SENveBEN AI",
      aiDescription:
        "تواصل بسهولة مع أشخاص يتحدثون لغات مختلفة. اكتب بلغتك ودع SENveBEN AI يترجم رسائلك فورًا.",
      languageSupport: "دعم اللغات",
      provinceCoverage: "المحافظات",
      secureConnection: "اتصال آمن",
      liveMembers: "أعضاء من 81 محافظة",
      romanticQuote: "الحب جميل في كل عمر...",
    },
  };

  const currentLang: LangKey = ["TR", "EN", "RU", "AR"].includes(lang)
    ? (lang as LangKey)
    : "TR";

  const t = translations[currentLang];
  const isRtl = currentLang === "AR";

  return (
    <section
      className="relative isolate overflow-hidden bg-[#310D0C] text-[#F8D290]"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* TEMİZ BORDEAU / ALTIN ARKA PLAN */}
      <div className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_70%_28%,rgba(246,186,72,0.12),transparent_28%),linear-gradient(135deg,#310D0C_0%,#512510_52%,#310D0C_100%)]" />

      <div className="pointer-events-none absolute left-[8%] top-[18%] -z-20 h-72 w-72 rounded-full bg-[#F6BA48]/7 blur-[120px]" />
      <div className="pointer-events-none absolute right-[8%] top-[20%] -z-20 h-80 w-80 rounded-full bg-[#F8D290]/8 blur-[130px]" />

      {/* ÜST BİLGİ BANDI */}
      <div className="border-b border-[#F6BA48]/25 bg-[#310D0C]/65 backdrop-blur-md">
        <div className="mx-auto flex min-h-14 max-w-7xl items-center justify-center px-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#F6BA48]/40 bg-[#F8D290]/95 px-4 py-1.5 text-center text-[10px] font-black tracking-wide text-[#310D0C] shadow-[0_8px_25px_rgba(0,0,0,0.18)] sm:text-xs">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#3FB36E] shadow-[0_0_10px_rgba(63,179,110,0.9)]" />
            <span>{t.eyebrow}</span>
          </div>
        </div>
      </div>

      {/* ANA HERO */}
      <div className="mx-auto grid min-h-[640px] max-w-7xl grid-cols-1 items-center gap-12 px-5 py-14 sm:px-8 md:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:px-12 lg:py-24">
        {/* SOL */}
        <div className="relative z-10 max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#F6BA48]/25 bg-[#512510]/55 px-4 py-2 text-xs font-bold text-[#F8D290]/85 backdrop-blur-sm">
            <MapPin className="h-4 w-4 text-[#F6BA48]" />
            {t.liveMembers}
          </div>

          <h1 className="max-w-3xl text-4xl font-black leading-[1.06] tracking-tight text-[#FFF7E8] sm:text-5xl md:text-6xl lg:text-[4.1rem]">
            {t.titlePrefix}
            <span className="text-[#F6BA48] drop-shadow-[0_2px_18px_rgba(246,186,72,0.28)]">
              {t.titleHighlight}
            </span>
            {t.titleSuffix}
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-[#F8D290]/82 sm:text-lg sm:leading-8">
            {t.subtitle}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onCtaClick}
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border border-[#F6BA48] bg-[#F6BA48] px-7 py-4 text-sm font-black text-[#310D0C] shadow-[0_12px_32px_rgba(246,186,72,0.20)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#EF912C]"
            >
              <UserPlus className="h-5 w-5" />
              {t.ctaRegister}
            </button>

            <button
              type="button"
              onClick={onCtaClick}
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border border-[#F6BA48]/45 bg-[#310D0C]/65 px-7 py-4 text-sm font-black text-[#F8D290] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-[#F6BA48]/70 hover:bg-[#512510]"
            >
              <Video className="h-5 w-5 text-[#F6BA48]" />
              {t.ctaExplore}
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#F6BA48]/25 bg-[#310D0C]/50 px-3.5 py-2 text-xs font-bold text-[#F8D290]/80">
              <ShieldCheck className="h-4 w-4 text-[#3FB36E]" />
              {t.secureConnection}
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-[#F6BA48]/25 bg-[#310D0C]/50 px-3.5 py-2 text-xs font-bold text-[#F8D290]/80">
              <Languages className="h-4 w-4 text-[#F6BA48]" />
              4 {t.languageSupport}
            </div>
          </div>
        </div>

        {/* SAĞ AI PANELİ */}
        <div className="relative z-10 mx-auto w-full max-w-xl">
          <div className="pointer-events-none absolute -inset-5 rounded-[36px] bg-[#F6BA48]/8 blur-3xl" />

          <div className="relative overflow-hidden rounded-[28px] border border-[#F6BA48]/45 bg-gradient-to-br from-[#512510]/92 via-[#683312]/82 to-[#310D0C]/94 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-8">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#F6BA48]/10 blur-3xl" />

            <div className="relative">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#F6BA48]/30 bg-[#F6BA48]/10">
                  <Sparkles className="h-5 w-5 text-[#F6BA48]" />
                </div>

                <h2 className="text-lg font-black text-[#FFF7E8] sm:text-xl">
                  {t.aiTitle}
                </h2>
              </div>

              <p className="text-sm leading-7 text-[#F8D290]/78 sm:text-base">
                {t.aiDescription}
              </p>

              <div className="mt-7 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-[#F6BA48]/25 bg-[#310D0C]/42 p-4">
                  <div className="flex items-center gap-2">
                    <Languages className="h-5 w-5 text-[#F6BA48]" />
                    <span className="text-2xl font-black text-[#F6BA48]">
                      4
                    </span>
                  </div>

                  <div className="mt-2 text-xs font-bold text-[#F8D290]/68">
                    {t.languageSupport}
                  </div>
                </div>

                <div className="rounded-2xl border border-[#F6BA48]/25 bg-[#310D0C]/42 p-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-[#F6BA48]" />
                    <span className="text-2xl font-black text-[#F6BA48]">
                      81
                    </span>
                  </div>

                  <div className="mt-2 text-xs font-bold text-[#F8D290]/68">
                    {t.provinceCoverage}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3 rounded-2xl border border-[#3FB36E]/25 bg-[#3FB36E]/5 px-4 py-3">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#3FB36E] shadow-[0_0_10px_rgba(63,179,110,0.8)]" />

                <span className="text-xs font-bold text-[#F8D290]/72">
                  {t.secureConnection}
                </span>
              </div>
            </div>
          </div>

          <p className="mt-5 text-center text-base font-semibold italic text-[#F8D290]/75 sm:text-lg">
            “{t.romanticQuote}”
          </p>
        </div>
      </div>
    </section>
  );
}