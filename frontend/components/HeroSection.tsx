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
      badge: string;
      ai: string;
      cta: string;
    }
  > = {
    TR: {
      title: "İngilizce, Rusça veya Arapça bilmenize gerek yok.",
      sub: "EgeLove AI, mesajlarınızı anında çevirir. Siz kendi dilinizde yazın, karşınızdaki kendi dilinde okusun. Türkçe, İngilizce, Rusça ve Arapça konuşan üyelerle doğal ve akıcı iletişimin keyfini çıkarın.",
      badge: "👥 Binlerce Gerçek Üye • 🛡️ Güvenli • 🧠 AI Destekli",
      ai: "❤️ EgeMatch AI ile Akıllı Tanışma",
      cta: "Hemen Üye Ol",
    },
    EN: {
      title: "No need to know English, Russian or Arabic.",
      sub: "EgeLove AI instantly translates your messages. Write in your own language while your match reads them in theirs. Enjoy natural conversations in Turkish, English, Russian and Arabic.",
      badge: "👥 Thousands of Real Members • 🛡️ Secure • 🧠 AI Powered",
      ai: "❤️ Smart Dating with EgeMatch AI",
      cta: "Sign Up Now",
    },
    RU: {
      title: "Вам не нужно знать английский, русский или арабский язык.",
      sub: "EgeLove AI мгновенно переводит ваши сообщения. Пишите на своем языке, а собеседник будет читать их на своем. Общайтесь свободно на турецком, английском, русском и арабском языках.",
      badge: "👥 Тысячи реальных участников • 🛡️ Безопасно • 🧠 На базе ИИ",
      ai: "❤️ Умные знакомства с EgeMatch AI",
      cta: "Зарегистрироваться",
    },
    AR: {
      title: "لست بحاجة إلى معرفة الإنجليزية أو الروسية أو العربية.",
      sub: "يقوم EgeLove AI بترجمة رسائلك فورًا. اكتب بلغتك وسيقرأ الطرف الآخر الرسالة بلغته. استمتع بمحادثات طبيعية بالتركية والإنجليزية والروسية والعربية.",
      badge: "👥 آلاف الأعضاء الحقيقيين • 🛡️ آمن • 🧠 مدعوم بالذكاء الاصطناعي",
      ai: "❤️ تعارف ذكي مع EgeMatch AI",
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
        <div className="max-w-3xl space-y-5">
          <div className="text-3xl text-[#FFC000] animate-pulse">❤️</div>

          <h1 className="max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-white drop-shadow-lg md:text-5xl">
            {currentText.title}
          </h1>

          <p className="max-w-2xl text-base font-semibold leading-7 text-[#FFC000] drop-shadow-md md:text-xl md:leading-8">
            {currentText.sub}
          </p>

          <div className="flex items-center gap-2 py-1">
            <div className="h-0.5 w-16 bg-[#FFC000]/60" />
            <div className="text-xs text-[#FFC000]">❤️</div>
            <div className="h-0.5 w-16 bg-[#FFC000]/60" />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-bold text-white/95 md:text-base">
              {currentText.badge}
            </p>

            <p className="text-xl font-extrabold text-[#FFC000] drop-shadow-md md:text-2xl">
              {currentText.ai}
            </p>
          </div>

          <div className="pt-3">
            <Button
              className="rounded-full border border-black/10 bg-[#FFC000] px-10 py-6 text-base font-black text-black shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-[#e6ad00] active:scale-95 md:px-12 md:py-7 md:text-lg"
              onClick={onCtaClick}
            >
              {currentText.cta}
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 z-20 hidden md:block">
        <a
          href="https://egelove.tr"
          className="text-lg font-extrabold tracking-wide text-[#FFC000] drop-shadow-[0_0_12px_rgba(255,192,0,0.45)] transition hover:scale-105 md:text-xl"
        >
          https://egelove.tr
        </a>
      </div>
    </section>
  );
}