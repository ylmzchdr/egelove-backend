"use client";

import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Heart,
  ShieldCheck,
} from "lucide-react";

const socialIcons = [
  { icon: Facebook, label: "Facebook" },
  { icon: Instagram, label: "Instagram" },
  { icon: Twitter, label: "X" },
  { icon: Youtube, label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[#F6BA48]/25 bg-[#310D0C]">
      {/* Hafif altın ışık */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-[-180px] left-1/2 h-80 w-[700px] -translate-x-1/2 rounded-full bg-[#F6BA48]/5 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-10 md:px-12">
        {/* Marka */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#F6BA48]/35 bg-[#7E4114]/45">
              <Heart
                className="h-5 w-5 fill-[#F6BA48] text-[#F6BA48]"
                strokeWidth={2}
              />
            </div>

            <div className="text-left">
              <div className="text-xl font-black tracking-tight text-[#FFF7E8]">
                SEN<span className="text-[#F6BA48]">ve</span>BEN
              </div>

              <div className="text-[9px] font-black tracking-[0.28em] text-[#F6BA48]/75">
                DAHA FAZLA AŞK
              </div>
            </div>
          </div>

          {/* Sosyal medya */}
          <div className="mt-7 flex justify-center gap-3">
            {socialIcons.map(({ icon: Icon, label }) => (
              <button
                key={label}
                type="button"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#F6BA48]/20 bg-[#512510]/45 text-[#F8D290]/60 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#F6BA48]/55 hover:bg-[#683312] hover:text-[#F6BA48]"
              >
                <Icon className="h-4.5 w-4.5" />
              </button>
            ))}
          </div>
        </div>

        {/* Ayırıcı */}
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-[#F6BA48]/30 to-transparent" />

        {/* Telif */}
        <div className="text-center">
          <p className="font-bold text-[#FFF7E8]/90">
            © 2026 SENveBEN. Tüm Hakları Saklıdır.
          </p>

          <p className="mx-auto mt-4 max-w-4xl text-sm leading-6 text-[#F8D290]/55">
            Bu web sitesindeki tüm içerik, tasarım, yazılım, SENveBEN AI
            teknolojisi, logolar, görseller ve metinler fikri mülkiyet hakları
            kapsamında korunmaktadır.
          </p>

          <p className="mx-auto mt-2 max-w-4xl text-sm leading-6 text-[#F8D290]/55">
            İzinsiz kopyalanamaz, çoğaltılamaz, yayımlanamaz, ticari amaçla
            kullanılamaz veya başka platformlarda paylaşılamaz. Tüm haklar
            saklıdır.
          </p>

          {/* Güvenlik */}
          <div className="mt-6 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#3FB36E]/20 bg-[#3FB36E]/5 px-4 py-2 text-xs font-bold text-[#F8D290]/65">
              <ShieldCheck className="h-4 w-4 text-[#3FB36E]" />
              Güvenli ve samimi bağlantılar
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}