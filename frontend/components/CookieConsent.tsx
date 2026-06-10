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
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-pink-900/95 backdrop-blur-md border-t border-white/10 p-4">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-white/70">
          Kişisel verilerinizi KVKK kapsamında işliyoruz. Detaylı bilgi için{" "}
          <button className="text-pink-300 underline">Gizlilik Politikası</button>nı inceleyin.
        </p>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10" onClick={() => setVisible(false)}>
            <X className="w-4 h-4 mr-1" /> Reddet
          </Button>
          <Button size="sm" className="bg-pink-600 hover:bg-pink-700 text-white" onClick={accept}>
            Kabul Et
          </Button>
        </div>
      </div>
    </div>
  );
}
