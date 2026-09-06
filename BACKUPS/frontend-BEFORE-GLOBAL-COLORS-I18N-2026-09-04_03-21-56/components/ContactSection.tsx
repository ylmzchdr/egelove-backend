"use client";

import { Mail, Globe, Sparkles } from "lucide-react";

export default function ContactSection() {
  return (
    <section className="bg-[#FFF7FA] py-20">
      <div className="mx-auto max-w-6xl px-6">

        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-[#2D1721]">
            İletişim
          </h2>

          <p className="mt-4 text-lg text-[#2D1721]/70 max-w-2xl mx-auto">
            Sorularınız, önerileriniz veya iş birlikleri için bizimle iletişime geçebilirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

          <div className="rounded-2xl border border-[#EC4899]/20 bg-[#FFFFFF] p-8 text-center shadow-xl">
            <Mail className="mx-auto mb-4 h-10 w-10 text-pink-600" />

            <h3 className="mb-3 text-xl font-bold text-[#2D1721]">
              E-Posta
            </h3>

            <a
              href="mailto:hello@senveben.tr"
              className="text-pink-600 hover:underline break-all"
            >
              hello@senveben.tr
            </a>
          </div>

          <div className="rounded-2xl border border-[#EC4899]/20 bg-[#FFFFFF] p-8 text-center shadow-xl">
            <Globe className="mx-auto mb-4 h-10 w-10 text-pink-600" />

            <h3 className="mb-3 text-xl font-bold text-[#2D1721]">
              Web Sitesi
            </h3>

            <a
              href="https://senveben.tr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:underline break-all"
            >
              https://senveben.tr
            </a>
          </div>

          <div className="rounded-2xl border border-[#EC4899]/20 bg-[#FFFFFF] p-8 text-center shadow-xl">
            <Sparkles className="mx-auto mb-4 h-10 w-10 text-pink-600" />

            <h3 className="mb-3 text-xl font-bold text-[#2D1721]">
              Teknoloji
            </h3>

            <p className="text-pink-600 font-semibold">
              ❤️ EgeMatch AI Destekli
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}


