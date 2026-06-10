"use client";

import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";

const socialIcons = [
  { icon: Facebook, label: "Facebook" },
  { icon: Instagram, label: "Instagram" },
  { icon: Twitter, label: "Twitter" },
  { icon: Youtube, label: "Youtube" },
];

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="py-8 bg-pink-950 border-t border-white/10 text-center text-white/50 text-sm">
      <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <span>© 2026 egelove. {t.footer.copyright}</span>
        <div className="flex gap-4">
          {socialIcons.map(({ icon: Icon, label }) => (
            <Icon key={label} className="w-5 h-5 hover:text-white transition cursor-pointer" aria-label={label} />
          ))}
        </div>
      </div>
    </footer>
  );
}
