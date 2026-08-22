"use client";

import {
  Bell,
  Check,
  ChevronDown,
  Crown,
  Languages,
  LogOut,
  Menu,
  MessageCircle,
  Moon,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";
import type { Lang } from "@/lib/i18n";

type TopbarProps = {
  userName?: string;
  userCity?: string;
  profilePhoto?: string | null;
  isPremium?: boolean;
  unreadMessages?: number;
  unreadNotifications?: number;
  onOpenMobileMenu?: () => void;
};

type ActivePanel = "notifications" | "messages" | "language" | "profile" | null;

type ThemeMode = "dark" | "light";

const languages: Array<{
  code: Lang;
  shortLabel: string;
  label: string;
  flag: string;
}> = [
  {
    code: "TR",
    shortLabel: "TR",
    label: "Türkçe",
    flag: "🇹🇷",
  },
  {
    code: "EN",
    shortLabel: "EN",
    label: "English",
    flag: "🇬🇧",
  },
  {
    code: "RU",
    shortLabel: "RU",
    label: "Русский",
    flag: "🇷🇺",
  },
  {
    code: "AR",
    shortLabel: "AR",
    label: "العربية",
    flag: "🇸🇦",
  },
];

export default function Topbar({
  userName = "Üye",
  userCity = "Türkiye",
  profilePhoto = null,
  isPremium = false,
  unreadMessages = 0,
  unreadNotifications = 0,
  onOpenMobileMenu,
}: TopbarProps) {
  const router = useRouter();
  const { lang, setLang } = useI18n();

  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [searchValue, setSearchValue] = useState("");
  const [theme, setTheme] = useState<ThemeMode>("dark");

  const topbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedTheme = localStorage.getItem("egelove-theme");

    const initialTheme: ThemeMode =
      storedTheme === "light" || storedTheme === "dark"
        ? storedTheme
        : "dark";

    setTheme(initialTheme);

    document.documentElement.classList.toggle(
      "dark",
      initialTheme === "dark",
    );

    document.documentElement.classList.toggle(
      "light",
      initialTheme === "light",
    );

  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        topbarRef.current &&
        !topbarRef.current.contains(event.target as Node)
      ) {
        setActivePanel(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActivePanel(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const togglePanel = (panel: Exclude<ActivePanel, null>) => {
    setActivePanel((currentPanel) =>
      currentPanel === panel ? null : panel,
    );
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const query = searchValue.trim();

    if (!query) {
      router.push("/search");
      return;
    }

    router.push(`/search?q=${encodeURIComponent(query)}`);
    setActivePanel(null);
  };

  const handleThemeChange = () => {
    const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark";

    setTheme(nextTheme);
    localStorage.setItem("egelove-theme", nextTheme);

    document.documentElement.classList.toggle(
      "dark",
      nextTheme === "dark",
    );

    document.documentElement.classList.toggle(
      "light",
      nextTheme === "light",
    );
  };

  const handleLanguageChange = (languageCode: Lang) => {
    setLang(languageCode);
    setActivePanel(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.clear();

    document.cookie =
      "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie =
      "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie =
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    router.push("/");
    router.refresh();
  };

  const currentLanguage =
    languages.find(
      (language) => language.code === lang,
    ) || languages[0];

  return (
    <div
      ref={topbarRef}
      className="relative z-50 mb-7 rounded-[26px] border border-white/[0.07] bg-[#0b0e18]/80 px-3 py-3 shadow-[0_20px_70px_rgba(0,0,0,0.24)] backdrop-blur-2xl sm:px-4"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-pink-400/50 to-transparent"
      />

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Menüyü aç"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.035] text-slate-300 transition-all duration-300 hover:border-pink-400/20 hover:bg-pink-400/[0.07] hover:text-pink-300 lg:hidden"
        >
          <Menu className="h-5 w-5" strokeWidth={1.9} />
        </button>

        <form
          onSubmit={handleSearch}
          className="group relative hidden min-w-0 flex-1 md:block"
        >
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-600 transition-colors duration-300 group-focus-within:text-pink-300"
            strokeWidth={1.9}
          />

          <input
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="İsim, şehir veya kullanıcı adı ara..."
            aria-label="Üye ara"
            className="h-11 w-full rounded-2xl border border-white/[0.07] bg-white/[0.035] pl-11 pr-20 text-base font-medium text-white outline-none transition-all duration-300 placeholder:text-slate-600 hover:border-white/10 focus:border-pink-400/25 focus:bg-white/[0.055] focus:shadow-[0_0_0_4px_rgba(244,114,182,0.05)]"
          />

          <span className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-lg border border-white/[0.07] bg-white/[0.035] px-2 py-1 text-[9px] font-bold text-slate-600 xl:block">
            ENTER
          </span>
        </form>

        <Link
          href="/search"
          aria-label="Üye ara"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.035] text-slate-400 transition-all duration-300 hover:border-pink-400/20 hover:bg-pink-400/[0.07] hover:text-pink-300 md:hidden"
        >
          <Search className="h-[19px] w-[19px]" strokeWidth={1.9} />
        </Link>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={handleThemeChange}
            aria-label={
              theme === "dark"
                ? "Açık temaya geç"
                : "Koyu temaya geç"
            }
            className="group flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.035] text-slate-400 transition-all duration-300 hover:border-amber-300/20 hover:bg-amber-300/[0.07] hover:text-amber-300"
          >
            {theme === "dark" ? (
              <Sun
                className="h-[18px] w-[18px] transition-transform duration-500 group-hover:rotate-45"
                strokeWidth={1.9}
              />
            ) : (
              <Moon
                className="h-[18px] w-[18px] transition-transform duration-500 group-hover:-rotate-12"
                strokeWidth={1.9}
              />
            )}
          </button>

          <div className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => togglePanel("language")}
              aria-expanded={activePanel === "language"}
              className={[
                "flex h-11 items-center gap-2 rounded-2xl border px-3",
                "text-xs font-extrabold transition-all duration-300",
                activePanel === "language"
                  ? "border-pink-400/25 bg-pink-400/[0.08] text-pink-300"
                  : "border-white/[0.07] bg-white/[0.035] text-slate-400 hover:border-white/15 hover:bg-white/[0.06] hover:text-white",
              ].join(" ")}
            >
              <Languages className="h-[17px] w-[17px]" strokeWidth={1.9} />

              <span>{currentLanguage.shortLabel}</span>
<ChevronDown
                className={[
                  "h-3.5 w-3.5 transition-transform duration-300",
                  activePanel === "language" ? "rotate-180" : "",
                ].join(" ")}
              />
            </button>

            {activePanel === "language" && (
              <div className="absolute right-0 top-[calc(100%+12px)] w-44 overflow-hidden rounded-[22px] border border-white/[0.09] bg-[#0d101b] p-2 shadow-[0_28px_90px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
                <div className="space-y-1">
                  {languages.map((language) => {
                    const isSelected = lang === language.code;
                    return (
                      <button
                        key={language.code}
                        type="button"
                        onClick={() => {
                          setLang(language.code);
                          setActivePanel(null);
                        }}
                        className={[
                          "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-all duration-200",
                          isSelected
                            ? "bg-purple-600 text-white font-black shadow-lg"
                            : "text-slate-400 hover:bg-white/[0.05] hover:text-white",
                        ].join(" ")}
                      >
                        <span className="text-base">{language.flag}</span>
                        <span className="text-xs font-bold">{language.label}</span>
                        {isSelected && <Check className="h-3.5 w-3.5 ml-auto text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>


          <div className="relative">
            <button
              type="button"
              onClick={() => togglePanel("messages")}
              aria-label="Mesajlar"
              aria-expanded={activePanel === "messages"}
              className={[
                "relative flex h-11 w-11 items-center justify-center rounded-2xl border transition-all duration-300",
                activePanel === "messages"
                  ? "border-blue-400/25 bg-blue-400/[0.08] text-blue-300"
                  : "border-white/[0.07] bg-white/[0.035] text-slate-400 hover:border-blue-400/20 hover:bg-blue-400/[0.07] hover:text-blue-300",
              ].join(" ")}
            >
              <MessageCircle
                className="h-[19px] w-[19px]"
                strokeWidth={1.9}
              />

              {unreadMessages > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#0b0e18] bg-blue-500 px-1 text-[9px] font-black text-white">
                  {unreadMessages > 99 ? "99+" : unreadMessages}
                </span>
              )}
            </button>

            {activePanel === "messages" && (
              <div className="absolute right-0 top-[calc(100%+12px)] w-[320px] max-w-[calc(100vw-24px)] overflow-hidden rounded-[24px] border border-white/[0.09] bg-[#0d101b]/95 shadow-[0_28px_90px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
                <div className="flex items-center justify-between border-b border-white/[0.065] px-4 py-4">
                  <div>
                    <p className="text-base font-extrabold text-white">
                      Mesajlar
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-600">
                      Son konuşmaların
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActivePanel(null)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-600 transition hover:bg-white/[0.05] hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="px-5 py-8 text-center">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-400/[0.08] text-blue-300">
                    <MessageCircle
                      className="h-5 w-5"
                      strokeWidth={1.8}
                    />
                  </span>

                  <p className="mt-4 text-xs font-bold text-slate-300">
                    Mesaj önizlemeleri hazırlanıyor
                  </p>

                  <p className="mt-1.5 text-[10px] leading-5 text-slate-600">
                    Gerçek mesaj verileri bağlandığında son konuşmalar
                    burada görünecek.
                  </p>
                </div>

                <Link
                  href="/messages"
                  onClick={() => setActivePanel(null)}
                  className="flex min-h-11 items-center justify-center border-t border-white/[0.065] text-xs font-bold text-blue-300 transition hover:bg-blue-400/[0.05]"
                >
                  Tüm mesajları aç
                </Link>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => togglePanel("notifications")}
              aria-label="Bildirimler"
              aria-expanded={activePanel === "notifications"}
              className={[
                "relative flex h-11 w-11 items-center justify-center rounded-2xl border transition-all duration-300",
                activePanel === "notifications"
                  ? "border-pink-400/25 bg-pink-400/[0.08] text-pink-300"
                  : "border-white/[0.07] bg-white/[0.035] text-slate-400 hover:border-pink-400/20 hover:bg-pink-400/[0.07] hover:text-pink-300",
              ].join(" ")}
            >
              <Bell
                className="h-[19px] w-[19px]"
                strokeWidth={1.9}
              />

              {unreadNotifications > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#0b0e18] bg-pink-500 px-1 text-[9px] font-black text-white">
                  {unreadNotifications > 99
                    ? "99+"
                    : unreadNotifications}
                </span>
              )}
            </button>

            {activePanel === "notifications" && (
              <div className="absolute right-0 top-[calc(100%+12px)] w-[340px] max-w-[calc(100vw-24px)] overflow-hidden rounded-[24px] border border-white/[0.09] bg-[#0d101b]/95 shadow-[0_28px_90px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
                <div className="flex items-center justify-between border-b border-white/[0.065] px-4 py-4">
                  <div>
                    <p className="text-base font-extrabold text-white">
                      Bildirimler
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-600">
                      Hesabındaki son gelişmeler
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActivePanel(null)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-600 transition hover:bg-white/[0.05] hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="px-5 py-8 text-center">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-400/[0.08] text-pink-300">
                    <Bell className="h-5 w-5" strokeWidth={1.8} />
                  </span>

                  <p className="mt-4 text-xs font-bold text-slate-300">
                    Yeni bildirimin bulunmuyor
                  </p>

                  <p className="mt-1.5 text-[10px] leading-5 text-slate-600">
                    Beğeni, mesaj ve profil hareketleri burada
                    gösterilecek.
                  </p>
                </div>

                <Link
                  href="/notifications"
                  onClick={() => setActivePanel(null)}
                  className="flex min-h-11 items-center justify-center border-t border-white/[0.065] text-xs font-bold text-pink-300 transition hover:bg-pink-400/[0.05]"
                >
                  Bildirim merkezini aç
                </Link>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => togglePanel("profile")}
              aria-expanded={activePanel === "profile"}
              className={[
                "flex h-11 items-center gap-2 rounded-2xl border p-1.5 pr-2.5 transition-all duration-300",
                activePanel === "profile"
                  ? "border-pink-400/25 bg-pink-400/[0.08]"
                  : "border-white/[0.07] bg-white/[0.035] hover:border-white/15 hover:bg-white/[0.06]",
              ].join(" ")}
            >
              <span className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-pink-500 via-rose-500 to-orange-400">
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt={`${userName} profil fotoğrafı`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound
                    className="h-[17px] w-[17px] text-white"
                    strokeWidth={1.9}
                  />
                )}

                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#10131e] bg-emerald-400" />
              </span>

              {/* 🌟 HER EKRANDA PARILDAYAN VIP KARŞILAMA VE İSİM ALANI */}
              <div className="flex flex-col text-left min-w-0 pr-1">
                <span className="block max-w-28 truncate text-xs font-black text-slate-200">
                  {userName}
                </span>
                <span className="block max-w-28 truncate text-[10px] font-medium text-purple-400">
                  {userCity}
                </span>
              </div>

              <ChevronDown
                className={[
                  "hidden h-3.5 w-3.5 text-slate-600 transition-transform duration-300 xl:block",
                  activePanel === "profile" ? "rotate-180" : "",
                ].join(" ")}
              />
            </button>

            {activePanel === "profile" && (
              <div className="absolute right-0 top-[calc(100%+12px)] w-72 overflow-hidden rounded-[24px] border border-white/[0.09] bg-[#0d101b]/95 p-2 shadow-[0_28px_90px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
                <div className="relative overflow-hidden rounded-[19px] border border-white/[0.06] bg-gradient-to-br from-pink-500/[0.12] via-violet-500/[0.07] to-transparent p-4">
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-orange-400 shadow-[0_10px_30px_rgba(236,72,153,0.2)]">
                      {profilePhoto ? (
                        <img
                          src={profilePhoto}
                          alt={`${userName} profil fotoğrafı`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <UserRound
                          className="h-6 w-6 text-white"
                          strokeWidth={1.8}
                        />
                      )}
                    </span>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-base font-extrabold text-white">
                          {userName}
                        </p>

                        {isPremium && (
                          <Crown className="h-3.5 w-3.5 text-amber-300" />
                        )}
                      </div>

                      <p className="mt-1 truncate text-[10px] text-slate-500">
                        {userCity}
                      </p>

                      <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-400/[0.08] px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-emerald-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Çevrimiçi
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-2 space-y-1">
                  <Link
                    href="/profile"
                    onClick={() => setActivePanel(null)}
                    className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-xs font-bold text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
                  >
                    <UserRound className="h-4 w-4 text-pink-300" />
                    Profilimi görüntüle
                  </Link>

                  <Link
                    href="/profile/edit"
                    onClick={() => setActivePanel(null)}
                    className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-xs font-bold text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
                  >
                    <Settings className="h-4 w-4 text-blue-300" />
                    Profili düzenle
                  </Link>

                  <Link
                    href="/premium"
                    onClick={() => setActivePanel(null)}
                    className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-xs font-bold text-slate-400 transition hover:bg-amber-300/[0.06] hover:text-amber-200"
                  >
                    <Crown className="h-4 w-4 text-amber-300" />
                    Premium özellikler
                  </Link>

                  <Link
                    href="/help"
                    onClick={() => setActivePanel(null)}
                    className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-xs font-bold text-slate-400 transition hover:bg-emerald-300/[0.05] hover:text-emerald-200"
                  >
                    <ShieldCheck className="h-4 w-4 text-emerald-300" />
                    Güvenlik merkezi
                  </Link>
                </div>

                {!isPremium && (
                  <Link
                    href="/premium"
                    onClick={() => setActivePanel(null)}
                    className="mt-2 flex items-center gap-3 rounded-2xl border border-amber-300/[0.11] bg-gradient-to-r from-amber-300/[0.08] via-orange-400/[0.06] to-pink-500/[0.07] px-3 py-3 transition hover:border-amber-300/20"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-300/[0.1] text-amber-300">
                      <Sparkles className="h-4 w-4" />
                    </span>

                    <span className="min-w-0">
                      <span className="block text-[11px] font-extrabold text-white">
                        Premium’a yükselt
                      </span>

                      <span className="mt-0.5 block text-[9px] text-slate-500">
                        Daha fazla görünürlük kazan
                      </span>
                    </span>
                  </Link>
                )}

                <div className="my-2 h-px bg-white/[0.06]" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-xs font-bold text-slate-500 transition hover:bg-red-400/[0.06] hover:text-red-300"
                >
                  <LogOut className="h-4 w-4" />
                  Güvenli çıkış yap
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}