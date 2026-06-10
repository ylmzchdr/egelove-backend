"use client";

import { useI18n } from "@/lib/i18n-context";
import { Button } from "@/components/ui/button";

type HeroSectionProps = {
  onCtaClick?: () => void;
};

export default function HeroSection({ onCtaClick }: HeroSectionProps) {
  const { lang } = useI18n();

  // Fotoğraftaki 4 dildeki orijinal metinler (Dil butonuna basınca anında değişir)
  const translations = {
    TR: {
      title: "Türkiye’nin Ege and Akdeniz’de buluştuğu güvenilir ve samimi arkadaşlık platformu:",
      sub: "egelove.tr",
      cta: "Hemen Üye Ol",
    },
    EN: {
      title: "Turkey's reliable and friendly dating platform where the Aegean and Mediterranean meet:",
      sub: "egelove.tr",
      cta: "Sign Up Now",
    },
    RU: {
      title: "Надежная и дружелюбная платформа для знакомств, где встречаются Эгейское и Средиземное моря Турции:",
      sub: "egelove.tr",
      cta: "Зарегистрироваться",
    },
    AR: {
      title: "منصة تعارف موثوقة وودية في تركيا حيث يلتقي بحر إيجة والبحر المتوسط:",
      sub: "egelove.tr",
      cta: "سجل الآن",
    },
  };

  const currentText = translations[lang as keyof typeof translations] || translations.TR;

  return (
    <section className="relative min-h-[90vh] flex items-center justify-start text-white overflow-hidden font-sans">
      
      {/* SARI GÜNEŞLİ MANZARA - public/images/hero-desktop.png konumundaki resmi doğrudan arka plana basar */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ 
          backgroundImage: "url('/images/hero-desktop.png')" 
        }}
      />
      
      {/* Güneşin parlamasını bozmayan, ama yazıların jilet gibi okunmasını sağlayan sol sıcak filtre */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent z-10" />

      {/* METİNLER VE OVAL SARI BUTON */}
      <div className="relative z-20 mx-auto max-w-7xl px-6 md:px-12 w-full">
        <div className="max-w-2xl space-y-6">
          
          {/* Orijinal Küçük Kalp */}
          <div className="text-[#FFC000] text-3xl animate-pulse">❤️</div>

          {/* Orijinal Büyük Başlık */}
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-white drop-shadow-lg">
            {currentText.title}{" "}
            <span className="text-[#FFC000] block mt-2 drop-shadow-md">
              {currentText.sub}
            </span>
          </h1>

          {/* Alt Süs Çizgileri */}
          <div className="flex items-center gap-2 py-2">
            <div className="w-16 h-0.5 bg-[#FFC000]/60" />
            <div className="text-[#FFC000] text-xs">❤️</div>
            <div className="w-16 h-0.5 bg-[#FFC000]/60" />
          </div>

          {/* Dinamik Diller Arası Küçük Hatırlatma / Çeviri Yazısı (Fotoğraftaki gibi alt alta şık durur) */}
          <p className="text-sm md:text-base text-gray-300 italic max-w-xl opacity-90">
            {lang === "TR" ? translations.EN.title + " " + translations.EN.sub : translations.TR.title + " " + translations.TR.sub}
          </p>

          {/* Orijinal Oval Sapsarı "Hemen Üye Ol" Butonu */}
          <div className="pt-4">
            <Button
              className="bg-[#FFC000] text-black hover:bg-[#e6ad00] text-lg font-black px-12 py-7 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 border border-black/10"
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
