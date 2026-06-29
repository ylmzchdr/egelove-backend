"use client";

import { useI18n } from "@/lib/i18n-context";
import { Button } from "@/components/ui/button";

type LangKey = "TR" | "EN" | "RU" | "AR";

type HeroSectionProps = {
  onCtaClick?: () => void;
};

export default function HeroSection({ onCtaClick }: HeroSectionProps) {
  const { lang } = useI18n();

  const translations: Record<
    LangKey,
    {
      title: string;
      sub: string;
      cta: string;
    }
  > = {
    TR: {
      title: "Binlerce gerçek üye • Güvenli • AI Destekli",
      sub: "❤️ EgeMatch AI ile Akıllı Tanışma",
      cta: "Hemen Üye Ol",
    },
    EN: {
      title: "Thousands of real members • Secure • AI Powered",
      sub: "❤️ Smart Dating with EgeMatch AI",
      cta: "Sign Up Now",
    },
    RU: {
      title: "Тысячи реальных участников • Безопасно • На базе ИИ",
      sub: "❤️ Умные знакомства с EgeMatch AI",
      cta: "Зарегистрироваться",
    },
    AR: {
      title: "آلاف الأعضاء الحقيقيين • آمن • مدعوم بالذكاء الاصطناعي",
      sub: "❤️ تعارف ذكي مع EgeMatch AI",
      cta: "سجل الآن",
    },
  };

  const currentLang: LangKey = ["TR", "EN", "RU", "AR"].includes(lang)
    ? (lang as LangKey)
    : "TR";

  const currentText = translations[currentLang];
  const isRtl = currentLang === "AR";

  return (
    <section
      className="relative flex min-h-[90vh] items-center justify-start overflow-hidden text-white font-sans"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/hero-desktop.png')",
        }}
      />

      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />

      <div className="relative z-20 mx-auto w-full max-w-7xl px-6 md:px-12">
        <div className="max-w-2xl space-y-6">
          <div className="text-3xl text-[#FFC000] animate-pulse">❤️</div>

          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white drop-shadow-lg md:text-5xl">
            {currentText.title}
            <span className="mt-2 block text-[#FFC000] drop-shadow-md">
              {currentText.sub}
            </span>
          </h1>

          <div className="flex items-center gap-2 py-2">
            <div className="h-0.5 w-16 bg-[#FFC000]/60" />
            <div className="text-xs text-[#FFC000]">❤️</div>
            <div className="h-0.5 w-16 bg-[#FFC000]/60" />
          </div>

          <div className="pt-4">
            <Button
              className="rounded-full border border-black/10 bg-[#FFC000] px-12 py-7 text-lg font-black text-black shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-[#e6ad00] active:scale-95"
              onClick={onCtaClick}
            >
              {currentText.cta}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}