"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n-context";
import type { Lang } from "@/lib/i18n";

type HeaderProps = {
  onOpenLogin?: () => void;
  onOpenRegister?: () => void;
};

type MeResponse = {
  name?: string | null;
  surname?: string | null;
  email?: string | null;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://egelove-backend.onrender.com";

const languages: { code: Lang; label: string }[] = [
  { code: "TR", label: "Türkçe" },
  { code: "EN", label: "English" },
  { code: "RU", label: "Русский" },
  { code: "AR", label: "العربية" },
];

const welcomeByLang: Record<Lang, string> = {
  TR: "Hoş geldin",
  EN: "Welcome",
  RU: "Добро пожаловать",
  AR: "مرحباً",
};

function getFirstName(user: MeResponse | null) {
  const fullName = `${user?.name || ""} ${user?.surname || ""}`.trim();

  if (fullName) {
    return fullName.split(" ")[0];
  }

  if (user?.email) {
    return user.email.split("@")[0];
  }

  return "Panel";
}

export default function Header({ onOpenLogin, onOpenRegister }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const { lang, setLang, t } = useI18n();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setIsLoggedIn(false);
      setUserName(null);
      return;
    }

    setIsLoggedIn(true);

    const fetchMe = async () => {
      try {
        const res = await fetch(`${API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
  setUserName(null);
  return;
}

const data = await res.json();
const user = data.user || data.profile || data;
setUserName(getFirstName(user));
      } catch {
  setUserName(null);
}
    };

    fetchMe();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
    setUserName(null);
    window.location.href = "/";
  };

  const loggedInLabel = userName
  ? `${welcomeByLang[lang]} ${userName}`
  : `${welcomeByLang[lang]}`;

  const navItems = [
  { label: t.nav.home, href: "/" },
  { label: t.nav.dashboard, href: "/dashboard" },
  { label: t.nav.likes, href: "/likes" },
  { label: t.nav.messages, href: "/messages" },
  { label: t.nav.premium, href: "/premium" },
];

  return (
    <header className="sticky top-0 z-50 bg-[#FFC000] text-black shadow-md border-b border-black/10 font-sans">
      <div className="mx-auto max-w-7xl px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <Heart className="w-7 h-7 text-black fill-black" />
          <span className="text-xl font-black tracking-tighter text-black lowercase">
            egelove
          </span>
        </Link>

        <nav className="hidden lg:flex gap-6" aria-label="Ana navigasyon">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-black/80 hover:text-black transition font-bold text-sm no-underline"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex gap-2 items-center">
          <div className="flex items-center bg-white/30 rounded border border-black/10 p-0.5">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`px-2 py-1 rounded text-xs font-bold transition ${
                  lang === l.code
                    ? "bg-white text-black shadow-sm"
                    : "text-black/70 hover:text-black hover:bg-white/20"
                }`}
              >
                {l.code}
              </button>
            ))}
          </div>

          <div className="w-px h-6 bg-black/20 mx-2" />

          {isLoggedIn ? (
            <>
              <Link
                href="/profile"
                className="bg-black text-[#FFC000] font-bold text-xs h-8 px-4 rounded flex items-center no-underline max-w-[220px] truncate"
              >
                {loggedInLabel}
              </Link>

              <Button
                className="bg-white text-black hover:bg-white/80 font-bold text-xs h-8 px-4 shadow-sm"
                onClick={handleLogout}
              >
                Çıkış
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="text-black border-black/60 hover:bg-black/10 hover:text-black text-xs font-bold h-8 px-4 bg-transparent"
                onClick={onOpenLogin}
              >
                {t.auth.login}
              </Button>

              {onOpenRegister && (
                <Button
                  className="bg-black text-[#FFC000] hover:bg-black/80 font-bold text-xs h-8 px-4 shadow-sm"
                  onClick={onOpenRegister}
                >
                  {t.auth.register}
                </Button>
              )}
            </>
          )}
        </div>

        <button
          className="lg:hidden text-black"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menüyü aç/kapat"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FFC000] border-t border-black/10 p-4">
          <nav className="flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-black font-bold text-left no-underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <div className="flex gap-2 my-2 bg-white/20 p-1 rounded w-fit">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLang(l.code);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    lang === l.code
                      ? "bg-white text-black"
                      : "text-black/70 hover:text-black"
                  }`}
                >
                  {l.code}
                </button>
              ))}
            </div>

            {isLoggedIn ? (
              <>
                <Link
                 href="/profile"
                  className="bg-black text-[#FFC000] w-full font-bold text-center rounded px-4 py-2 no-underline truncate"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {loggedInLabel}
                </Link>

                <Button
                  className="bg-white text-black w-full font-bold"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                >
                  Çıkış
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="w-full text-black border-black/40 bg-transparent font-bold"
                  onClick={() => {
                    if (onOpenLogin) onOpenLogin();
                    setMobileMenuOpen(false);
                  }}
                >
                  {t.auth.login}
                </Button>

                {onOpenRegister && (
                  <Button
                    className="bg-black text-[#FFC000] w-full font-bold"
                    onClick={() => {
                      onOpenRegister();
                      setMobileMenuOpen(false);
                    }}
                  >
                    {t.auth.register}
                  </Button>
                )}
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}