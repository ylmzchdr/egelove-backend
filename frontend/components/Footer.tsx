"use client";

import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const socialIcons = [
  { icon: Facebook, label: "Facebook" },
  { icon: Instagram, label: "Instagram" },
  { icon: Twitter, label: "X" },
  { icon: Youtube, label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#17000f] py-10">
      <div className="mx-auto max-w-7xl px-6">

        <div className="flex justify-center gap-6 mb-8">
          {socialIcons.map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="text-white/60 hover:text-[#FFC000] transition"
              aria-label={label}
            >
              <Icon className="h-6 w-6" />
            </button>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 text-center">

          <p className="text-white/80 font-semibold">
            © 2026 EgeLove. Tüm Hakları Saklıdır.
          </p>

          <p className="mx-auto mt-4 max-w-4xl text-sm leading-7 text-white/50">
            Bu web sitesindeki tüm içerik, tasarım, yazılım,
            EgeMatch AI teknolojisi, logolar, görseller ve metinler
            fikri mülkiyet hakları kapsamında korunmaktadır.
          </p>

          <p className="mx-auto mt-3 max-w-4xl text-sm leading-7 text-white/50">
            İzinsiz kopyalanamaz, çoğaltılamaz, yayımlanamaz,
            ticari amaçla kullanılamaz veya başka platformlarda
            paylaşılamaz. Tüm haklar saklıdır.
          </p>

        </div>

      </div>
    </footer>
  );
}