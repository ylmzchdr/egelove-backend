"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";

export default function ContactSection() {
  const { t } = useI18n();

  return (
    <section id="contact" className="py-16 bg-pink-950">
      <div className="mx-auto max-w-7xl px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{t.contact.title}</h2>
          <p className="text-white/70 mb-8">{t.contact.subtitle}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="flex flex-col items-center p-4 bg-pink-900/40 border border-white/10 rounded-xl">
              <Mail className="w-6 h-6 text-pink-300 mb-2" />
              <span className="text-sm text-white/80">{t.contact.email}</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-pink-900/40 border border-white/10 rounded-xl">
              <Phone className="w-6 h-6 text-pink-300 mb-2" />
              <span className="text-sm text-white/80">{t.contact.phone}</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-pink-900/40 border border-white/10 rounded-xl">
              <MapPin className="w-6 h-6 text-pink-300 mb-2" />
              <span className="text-sm text-white/80">{t.contact.location}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
