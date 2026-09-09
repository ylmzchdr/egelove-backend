"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookieConsent");
    if (!accepted) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookieConsent", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-[#310D0C]/95 backdrop-blur-md border-t border-[#F6BA48]/20 p-4">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-base text-[#F8D290]/80">
          Kişisel verilerinizi KVKK kapsamında işliyoruz. Detaylı bilgi için{" "}
          <button className="text-[#F6BA48] underline hover:text-[#EF912C] transition-colors">
            Gizlilik Politikası
          </button>
          nı inceleyin.
        </p>
        <div className="flex gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="border-[#F6BA48]/30 text-[#F8D290] hover:bg-[#F6BA48]/10 hover:text-[#F8D290]"
            onClick={() => setVisible(false)}
          >
            <X className="w-4 h-4 mr-1" /> Reddet
          </Button>
          <Button
            size="sm"
            className="bg-[#F6BA48] hover:bg-[#EF912C] text-[#310D0C] font-semibold"
            onClick={accept}
          >
            Kabul Et
          </Button>
        </div>
      </div>
    </div>
  );
}
