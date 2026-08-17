"use client";

import { Sparkles, UserPlus, Compass } from "lucide-react";

interface HeroSectionProps {
  onCtaClick: () => void;
}

export default function HeroSection({ onCtaClick }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[#0d1527] pt-32 pb-16 md:pt-40 md:pb-24">
      {/* Arka Plan Glow Işıkları */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-12 left-1/2 h-[400px] w-[500px] -translate-x-1/2 rounded-full bg-purple-600/15 blur-[120px]" />
        <div className="absolute top-20 left-1/3 h-[250px] w-[250px] rounded-full bg-pink-600/10 blur-[80px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 text-center md:px-12">
        {/* 1. BÖLÜM: ANA KANCA V0E MANŞET */}
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-6xl md:leading-[1.15]">
            ❤️ Aradığın kişi belki de sadece <span className="text-[#FFC000]">birkaç kilometre</span> uzakta.
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 md:text-xl">
            Türkiye'nin 81 ilinde ve ilçelerinde yeni insanları keşfet. Sana uygun profilleri bul, beğen, eşleş ve tanış.
          </p>
        </div>

        {/* 2. BÖLÜM: AKSİYON BUTONLARI (CTA) */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={onCtaClick}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFC000] px-8 py-4 text-base font-bold text-black shadow-lg shadow-[#FFC000]/20 transition-all duration-300 hover:scale-[1.03] hover:bg-[#ffe066] sm:w-auto"
          >
            <UserPlus className="h-5 w-5" />
            Ücretsiz Üye Ol
          </button>
          
          <button
            onClick={onCtaClick}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.1] hover:border-white/30 sm:w-auto"
          >
            <Compass className="h-5 w-5" />
            Üyeleri Keşfet
          </button>
        </div>

        {/* 3. BÖLÜM: EGELOVE AI (HERO'NUN HEMEN ALTI) */}
        <div className="mx-auto mt-20 max-w-3xl rounded-2xl border border-purple-500/20 bg-gradient-to-b from-purple-950/20 to-transparent p-6 backdrop-blur-md md:p-8">
          <div className="flex items-center justify-center gap-2 text-[#FFC000]">
            <Sparkles className="h-5 w-5 animate-pulse" />
            <h2 className="text-lg font-bold tracking-wide uppercase text-white sm:text-xl">
              EgeLove AI ile Sınırları Kaldırın
            </h2>
          </div>
          
          <p className="mt-4 text-sm leading-relaxed text-white/70 md:text-base">
            Farklı diller konuşan insanlarla anında ve doğal iletişim kurun. Siz kendi dilinizde yazın, 
            EgeLove AI mesajlarınızı anında çevirsin. Türkçe, İngilizce, Rusça veya Arapça konuşan üyelerle 
            dil bariyeri olmadan akıcı sohbetin keyfini çıkarın!
          </p>
        </div>
      </div>
    </section>
  );
}