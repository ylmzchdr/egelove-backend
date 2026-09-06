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
    <footer className="border-t border-pink-200/60 bg-[#FFF7FA] py-10">
      <div className="mx-auto max-w-7xl px-6">

        <div className="flex justify-center gap-6 mb-8">
          {socialIcons.map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="text-[#2D1721]/60 hover:text-pink-600 transition"
              aria-label={label}
            >
              <Icon className="h-6 w-6" />
            </button>
          ))}
        </div>

        <div className="border-t border-pink-200/60 pt-8 text-center">

          <p className="text-[#2D1721]/80 font-semibold">
            © 2026 SenVeBen. Tüm Hakları Saklıdır.
          </p>

          <p className="mx-auto mt-4 max-w-4xl text-base leading-7 text-[#2D1721]/50">
            Bu web sitesindeki tüm içerik, tasarım, yazılım,
            EgeMatch AI teknolojisi, logolar, görseller ve metinler
            fikri mülkiyet hakları kapsamında korunmaktadır.
          </p>

          <p className="mx-auto mt-3 max-w-4xl text-base leading-7 text-[#2D1721]/50">
            İzinsiz kopyalanamaz, çoğaltılamaz, yayımlanamaz,
            ticari amaçla kullanılamaz veya başka platformlarda
            paylaşılamaz. Tüm haklar saklıdır.
          </p>

        </div>

      </div>
    </footer>
  );
}


