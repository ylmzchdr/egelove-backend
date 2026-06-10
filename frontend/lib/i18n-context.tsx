"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { type Lang, translations } from "./i18n";

type I18nContextType = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (typeof translations)["TR"];
};

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("TR");

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    document.documentElement.lang = newLang.toLowerCase();
    document.documentElement.dir = newLang === "AR" ? "rtl" : "ltr";
  }, []);

  return (
    <I18nContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
