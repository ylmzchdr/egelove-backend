"use client";

import { Mail, Globe, Sparkles } from "lucide-react";

export default function ContactSection() {
  return (
    <section className="bg-[#210014] py-20">
      <div className="mx-auto max-w-6xl px-6">

        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-white">
            İletişim
          </h2>

          <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto">
            Sorularınız, önerileriniz veya iş birlikleri için bizimle iletişime geçebilirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

          <div className="rounded-2xl border border-[#FFC000]/20 bg-[#2b0620] p-8 text-center shadow-xl">
            <Mail className="mx-auto mb-4 h-10 w-10 text-[#FFC000]" />

            <h3 className="mb-3 text-xl font-bold text-white">
              E-Posta
            </h3>

            <a
              href="mailto:hello@egelove.tr"
              className="text-[#FFC000] hover:underline break-all"
            >
              hello@egelove.tr
            </a>
          </div>

          <div className="rounded-2xl border border-[#FFC000]/20 bg-[#2b0620] p-8 text-center shadow-xl">
            <Globe className="mx-auto mb-4 h-10 w-10 text-[#FFC000]" />

            <h3 className="mb-3 text-xl font-bold text-white">
              Web Sitesi
            </h3>

            <a
              href="https://egelove.tr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FFC000] hover:underline break-all"
            >
              https://egelove.tr
            </a>
          </div>

          <div className="rounded-2xl border border-[#FFC000]/20 bg-[#2b0620] p-8 text-center shadow-xl">
            <Sparkles className="mx-auto mb-4 h-10 w-10 text-[#FFC000]" />

            <h3 className="mb-3 text-xl font-bold text-white">
              Teknoloji
            </h3>

            <p className="text-[#FFC000] font-semibold">
              ❤️ EgeMatch AI Destekli
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}