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
  { code: "AZ", label: "AZ" },
];

const welcomeByLang: Record<Lang, string> = {
  TR: "Hoş geldin",
  EN: "Welcome",
  RU: "Добро пожаловать",
  AR: "مرحباً",
  AZ: "Xoş gəlmisiniz",
};

function getFirstName(user: MeResponse | null) {
  const fullName = `${user?.name || ""} ${user?.surname || ""}`.trim();

  if (fullName) {
    return fullName.split(" ")[0];
  }

  if (user?.email) {
    return user.email.split("@")[0];
  }

  return "Benim Sayfam";
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
        const res = await fetch(`/api/users/me`, {
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
    <header className="sticky top-0 z-50 border-b border-[#F6BA48]/45 bg-gradient-to-r from-[#310D0C] via-[#512510] to-[#683312] text-[#F8D290] shadow-[0_10px_35px_rgba(49,13,12,0.28)] font-sans">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="group flex items-center gap-2.5 no-underline">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#F6BA48]/55 bg-[#7E4114]/75 shadow-[0_0_18px_rgba(246,186,72,0.18)]">
            <Heart className="h-5 w-5 fill-[#F6BA48] text-[#F6BA48]" />
          </span>

          <div className="leading-none">
            <span className="block text-xl font-black tracking-tight text-[#F8D290] transition-colors group-hover:text-[#F6BA48]">
              SENveBEN
            </span>
            <span className="mt-1 block text-[9px] font-bold tracking-[0.24em] text-[#F6BA48]/80">
              DAHA FAZLA AŞK
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-6" aria-label="Ana navigasyon">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="relative text-sm font-bold text-[#F8D290]/85 no-underline transition hover:text-[#F6BA48] after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-[#F6BA48] after:transition-all hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-[#F6BA48]/35 bg-[#310D0C]/45 p-0.5 backdrop-blur">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  console.log("LANG:", l.code);
                  setLang(l.code);
                }}
                className={`rounded-md px-2 py-1 text-xs font-bold transition ${
                  lang === l.code
                    ? "bg-[#F6BA48] text-[#310D0C] shadow-sm"
                    : "text-[#F8D290]/75 hover:bg-[#964F1C]/70 hover:text-[#F8D290]"
                }`}
              >
                {l.code}
              </button>
            ))}
          </div>

          <div className="mx-2 h-6 w-px bg-[#F6BA48]/30" />

          {isLoggedIn ? (
            <>
              <Link
                href="/profile"
                className="flex h-8 max-w-[220px] items-center truncate rounded-lg border border-[#F6BA48]/45 bg-[#7E4114]/80 px-4 text-xs font-bold text-[#F8D290] no-underline transition hover:bg-[#964F1C]"
              >
                {loggedInLabel}
              </Link>

              <Button
                className="h-8 border border-[#F6BA48]/60 bg-[#F6BA48] px-4 text-xs font-bold text-[#310D0C] shadow-sm hover:bg-[#EF912C]"
                onClick={handleLogout}
              >
                {t.auth.logout}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="h-8 border-[#F6BA48]/65 bg-transparent px-4 text-xs font-bold text-[#F8D290] hover:bg-[#964F1C]/60 hover:text-[#F8D290]"
                onClick={onOpenLogin}
              >
                {t.auth.login}
              </Button>

              {onOpenRegister && (
                <Button
                  className="h-8 border border-[#F6BA48] bg-[#F6BA48] px-4 text-xs font-bold text-[#310D0C] shadow-sm hover:bg-[#EF912C]"
                  onClick={onOpenRegister}
                >
                  {t.auth.register}
                </Button>
              )}
            </>
          )}
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#F6BA48]/45 bg-[#7E4114]/65 text-[#F6BA48] lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menüyü aç/kapat"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-[#F6BA48]/25 bg-[#310D0C] p-4 lg:hidden">
          <nav className="flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-lg px-3 py-2 text-left font-bold text-[#F8D290] no-underline transition hover:bg-[#512510] hover:text-[#F6BA48]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <div className="my-2 flex w-fit gap-2 rounded-lg border border-[#F6BA48]/30 bg-[#512510] p-1">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLang(l.code);
                    setMobileMenuOpen(false);
                  }}
                  className={`rounded-md px-2 py-1 text-xs font-bold ${
                    lang === l.code
                      ? "bg-[#F6BA48] text-[#310D0C]"
                      : "text-[#F8D290]/75 hover:text-[#F8D290]"
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
                  className="w-full truncate rounded-lg border border-[#F6BA48]/45 bg-[#7E4114] px-4 py-2 text-center font-bold text-[#F8D290] no-underline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {loggedInLabel}
                </Link>

                <Button
                  className="w-full bg-[#F6BA48] font-bold text-[#310D0C] hover:bg-[#EF912C]"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                >
                  {t.auth.logout}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="w-full border-[#F6BA48]/55 bg-transparent font-bold text-[#F8D290] hover:bg-[#512510] hover:text-[#F8D290]"
                  onClick={() => {
                    if (onOpenLogin) onOpenLogin();
                    setMobileMenuOpen(false);
                  }}
                >
                  {t.auth.login}
                </Button>

                {onOpenRegister && (
                  <Button
                    className="w-full bg-[#F6BA48] font-bold text-[#310D0C] hover:bg-[#EF912C]"
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

