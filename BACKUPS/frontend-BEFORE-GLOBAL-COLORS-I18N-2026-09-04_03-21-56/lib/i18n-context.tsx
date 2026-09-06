"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { type Lang, translations } from "./i18n";

type I18nContextType = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (typeof translations)["TR"];
};

const I18nContext = createContext<I18nContextType | null>(null);
const STORAGE_KEY = "egelove-language";
const supportedLanguages: Lang[] = ["TR", "EN", "RU", "AR"];

function isLang(value: string | null): value is Lang {
  return !!value && supportedLanguages.includes(value.toUpperCase() as Lang);
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("TR");

  const applyLanguage = useCallback((nextLang: Lang) => {
    document.documentElement.lang = nextLang.toLowerCase();
    document.documentElement.dir = nextLang === "AR" ? "rtl" : "ltr";
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const initialLang: Lang = isLang(saved) ? saved.toUpperCase() as Lang : "TR";
    setLangState(initialLang);
    applyLanguage(initialLang);
  }, [applyLanguage]);

  const setLang = useCallback((nextLang: Lang) => {
    setLangState(nextLang);
    localStorage.setItem(STORAGE_KEY, nextLang);
    applyLanguage(nextLang);
  }, [applyLanguage]);

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
