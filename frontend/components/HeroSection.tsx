"use client";

import { useI18n } from "@/lib/i18n-context";
import { Sparkles, UserPlus, Video, ShieldCheck } from "lucide-react";

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
      brandLine: string;
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
      eyebrow: "CANLI GÖRÜŞ • ANINDA MESAJLAŞ • 4 DİLDE İLETİŞİM",
      brandLine: "DAHA FAZLA AŞK",
      titlePrefix: "Aradığın kişi belki de sadece ",
      titleHighlight: "birkaç kilometre",
      titleSuffix: " uzakta.",
      subtitle:
        "Türkiye'nin 81 ilinde ve ilçelerinde yeni insanları keşfet. Sana uygun profilleri bul, beğen, eşleş ve tanış. Birebir, karşılıklı eşleştiğin ve beğendiğin gerçek kişilerle anında görüntülü konuş.",
      ctaRegister: "Ücretsiz Üye Ol",
      ctaExplore: "Birebir Canlı Görüntülü Konuş",
      aiTitle: "SENveBEN AI ile Sınırları Kaldırın",
      aiDescription:
        "Farklı diller konuşan insanlarla anında ve doğal iletişim kurun. Siz kendi dilinizde yazın, SENveBEN AI mesajlarınızı anında çevirsin.",
    },
    EN: {
      eyebrow: "LIVE VIDEO • INSTANT MESSAGES • 4 LANGUAGES",
      brandLine: "MORE LOVE",
      titlePrefix: "The person you are looking for might be just ",
      titleHighlight: "a few kilometers",
      titleSuffix: " away.",
      subtitle:
        "Discover new people across Türkiye. Find profiles that match you, like, connect and meet. Start one-to-one video conversations with real people you mutually like.",
      ctaRegister: "Sign Up for Free",
      ctaExplore: "Start Live Video Chat",
      aiTitle: "Break Barriers with SENveBEN AI",
      aiDescription:
        "Write in your own language and let SENveBEN AI translate your messages instantly for natural conversations.",
    },
    RU: {
      eyebrow: "ВИДЕО • МГНОВЕННЫЕ СООБЩЕНИЯ • 4 ЯЗЫКА",
      brandLine: "БОЛЬШЕ ЛЮБВИ",
      titlePrefix: "Человек, которого вы ищете, возможно, всего в ",
      titleHighlight: "нескольких километрах",
      titleSuffix: " от вас.",
      subtitle:
        "Знакомьтесь с новыми людьми по всей Турции. Находите подходящие профили, общайтесь и переходите к видеосвязи с теми, кто понравился вам взаимно.",
      ctaRegister: "Зарегистрироваться бесплатно",
      ctaExplore: "Начать видеочат",
      aiTitle: "Стирайте границы с SENveBEN AI",
      aiDescription:
        "Пишите на своем языке — SENveBEN AI мгновенно переведет сообщения для естественного общения.",
    },
    AR: {
      eyebrow: "فيديو مباشر • رسائل فورية • 4 لغات",
      brandLine: "المزيد من الحب",
      titlePrefix: "قد يكون الشخص الذي تبحث عنه على بعد ",
      titleHighlight: "بضعة كيلومترات",
      titleSuffix: " فقط.",
      subtitle:
        "اكتشف أشخاصاً جدداً في جميع أنحاء تركيا. اعثر على الملفات المناسبة وتواصل مع الأشخاص الذين يعجبون بك أيضاً وابدأ محادثة فيديو مباشرة.",
      ctaRegister: "سجل مجاناً",
      ctaExplore: "ابدأ محادثة فيديو",
      aiTitle: "أزل الحدود مع SENveBEN AI",
      aiDescription:
        "اكتب بلغتك وسيترجم SENveBEN AI رسائلك فوراً لتستمتع بمحادثات طبيعية وسلسة.",
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
      {/* SENveBEN GERÇEK GÜN BATIMI ATMOSFERİ */}
      <div className="absolute inset-0 -z-20 bg-[url('/senveben-hero-banner.png')] bg-cover bg-center bg-no-repeat" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(49,13,12,0.92)_0%,rgba(81,37,16,0.76)_38%,rgba(126,65,20,0.36)_68%,rgba(49,13,12,0.18)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(49,13,12,0.08)_0%,rgba(49,13,12,0.12)_52%,rgba(49,13,12,0.90)_100%)]" />

      {/* FOTOĞRAF ÜZERİNDE HAFİF ALTIN IŞIK */}
      <div className="pointer-events-none absolute inset-x-0 top-[30%] -z-10 h-44 opacity-60">
        <div className="absolute left-[6%] bottom-0 h-24 w-[38%] rounded-full bg-[#F6BA48]/10 blur-3xl" />
        <div className="absolute right-[8%] bottom-0 h-24 w-[34%] rounded-full bg-[#F8D290]/10 blur-3xl" />
      </div>

      {/* FOTOĞRAFIN GÜNEŞİ KULLANILIYOR */}
      <div className="pointer-events-none absolute right-[24%] top-16 -z-10 h-20 w-20 rounded-full bg-[#F6BA48]/8 blur-3xl md:h-24 md:w-24" />

      {/* PREMIUM ÜST BANT */}
      <div className="border-b border-[#F6BA48]/40 bg-[#310D0C]/55 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#F6BA48]/55 bg-[#F8D290]/90 px-4 py-1.5 text-[11px] font-black tracking-wide text-[#310D0C] shadow-[0_5px_22px_rgba(49,13,12,0.25)] sm:text-xs">
            <span className="h-2.5 w-2.5 rounded-full bg-[#3FB36E] shadow-[0_0_10px_rgba(63,179,110,0.9)]" />
            {t.eyebrow}
          </div>
        </div>
      </div>

      <div className="mx-auto grid min-h-[690px] max-w-7xl grid-cols-1 items-center gap-10 px-6 py-16 md:px-12 lg:grid-cols-[1.05fr_.95fr] lg:py-20">
        {/* SOL: MARKA + MESAJ */}
        <div className="relative">
          <div className="mb-7 inline-flex items-center gap-4">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-[28px] border border-[#F6BA48]/65 bg-[#310D0C]/70 shadow-[0_0_32px_rgba(246,186,72,0.24)] backdrop-blur-md">
              <span className="text-4xl">❤</span>
              <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[#512510] bg-[#3FB36E]" />
            </div>

            <div>
              <div className="text-4xl font-black tracking-tight text-[#F8D290] sm:text-5xl">
                SENveBEN
              </div>
              <div className="mt-1 text-xs font-black tracking-[0.38em] text-[#F6BA48]">
                {t.brandLine}
              </div>
            </div>
          </div>

          <h1 className="max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-[#FFF7E8] sm:text-5xl md:text-6xl">
            {t.titlePrefix}
            <span className="text-[#F6BA48] drop-shadow-[0_2px_16px_rgba(246,186,72,0.25)]">
              {t.titleHighlight}
            </span>
            {t.titleSuffix}
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-[#F8D290]/88 md:text-lg">
            {t.subtitle}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={onCtaClick}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#F6BA48] bg-[#F6BA48] px-7 py-4 text-sm font-black text-[#310D0C] shadow-[0_10px_30px_rgba(246,186,72,0.22)] transition hover:-translate-y-0.5 hover:bg-[#EF912C]"
            >
              <UserPlus className="h-5 w-5" />
              {t.ctaRegister}
            </button>

            <button
              onClick={onCtaClick}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#F6BA48]/55 bg-[#310D0C]/65 px-7 py-4 text-sm font-black text-[#F8D290] backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-[#512510]/85"
            >
              <Video className="h-5 w-5 text-[#F6BA48]" />
              {t.ctaExplore}
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 text-xs font-bold text-[#F8D290]/80">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F6BA48]/30 bg-[#310D0C]/45 px-3 py-1.5">
              <ShieldCheck className="h-4 w-4 text-[#3FB36E]" />
              Güvenli bağlantı
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F6BA48]/30 bg-[#310D0C]/45 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-[#3FB36E]" />
              81 ilden canlı üyeler
            </span>
          </div>
        </div>

        {/* SAĞ: ROMANTİK PREMIUM PANEL */}
        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -inset-5 rounded-[40px] bg-[#F6BA48]/10 blur-3xl" />

          <div className="relative overflow-hidden rounded-[32px] border border-[#F6BA48]/55 bg-gradient-to-br from-[#310D0C]/84 via-[#683312]/76 to-[#512510]/90 p-6 shadow-[0_30px_80px_rgba(49,13,12,0.48)] backdrop-blur-xl md:p-8">
            <div className="pointer-events-none absolute -right-12 -top-10 h-44 w-44 rounded-full bg-[#F6BA48]/16 blur-3xl" />

            <div className="relative">
              <div className="mb-5 flex items-center gap-2 text-[#F6BA48]">
                <Sparkles className="h-5 w-5 animate-pulse" />
                <h2 className="text-lg font-black tracking-wide text-[#FFF7E8] sm:text-xl">
                  {t.aiTitle}
                </h2>
              </div>

              <p className="text-sm leading-7 text-[#F8D290]/80 md:text-base">
                {t.aiDescription}
              </p>

              <div className="mt-7 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-[#F6BA48]/30 bg-[#310D0C]/40 p-4">
                  <div className="text-2xl font-black text-[#F6BA48]">4</div>
                  <div className="mt-1 text-xs font-bold text-[#F8D290]/70">
                    Dil desteği
                  </div>
                </div>

                <div className="rounded-2xl border border-[#F6BA48]/30 bg-[#310D0C]/40 p-4">
                  <div className="text-2xl font-black text-[#F6BA48]">81</div>
                  <div className="mt-1 text-xs font-bold text-[#F8D290]/70">
                    İl kapsamı
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-5 text-center text-lg font-semibold italic text-[#F8D290]/85">
            “Aşkın her yaşta güzel...”
          </p>
        </div>
      </div>
    </section>
  );
}
