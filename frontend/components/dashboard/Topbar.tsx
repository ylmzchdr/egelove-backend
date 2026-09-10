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

  Search,
  Settings,
  ShieldCheck,
  Sparkles,

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

type ActivePanel =
  | "notifications"
  | "messages"
  | "language"
  | "profile"
  | null;

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
    {
    code: "AZ",
    shortLabel: "AZ",
    label: "Azərbaycan",
    flag: "🇦🇿",
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

  const topbarText = {
    TR:{search:"İsim, şehir veya kullanıcı adı ara...",member:"Üye ara",messages:"Mesajlar",notifications:"Bildirimler",online:"Çevrimiçi",viewProfile:"Profilimi görüntüle",editProfile:"Profili düzenle",premium:"Premium özellikler",security:"Güvenlik merkezi",upgrade:"Premium’a yükselt",logout:"Güvenli çıkış yap",recent:"{topbarText.recent}",preparing:"{topbarText.preparing}",messageInfo:"{topbarText.messageInfo}",allMessages:"{topbarText.allMessages}",latest:"{topbarText.latest}",noNotifications:"{topbarText.noNotifications}",notificationInfo:"{topbarText.notificationInfo}",notificationCenter:"{topbarText.notificationCenter}",visibility:"{topbarText.visibility}",profilePhoto:"profil fotoğrafı"},
    AZ:{search:"Ad, şəhər və ya istifadəçi adı axtar...",member:"Üzv axtar",messages:"Mesajlar",notifications:"Bildirişlər",online:"Onlayn",viewProfile:"Profilimə bax",editProfile:"Profili redaktə et",premium:"Premium xüsusiyyətlər",security:"Təhlükəsizlik mərkəzi",upgrade:"Premiuma yüksəlt",logout:"Təhlükəsiz çıxış et",recent:"Son söhbətləriniz",preparing:"Mesaj önizləmələri hazırlanır",messageInfo:"Həqiqi mesaj məlumatları qoşulduqda son söhbətlər burada görünəcək.",allMessages:"Bütün mesajları aç",latest:"Hesabınızdakı son yeniliklər",noNotifications:"Yeni bildirişiniz yoxdur",notificationInfo:"Bəyənmələr, mesajlar və profil hərəkətləri burada göstəriləcək.",notificationCenter:"Bildiriş mərkəzini aç",visibility:"Daha çox görünürlük əldə et",profilePhoto:"profil şəkli"},
    EN:{search:"Search by name, city or username...",member:"Search members",messages:"Messages",notifications:"Notifications",online:"Online",viewProfile:"View my profile",editProfile:"Edit profile",premium:"Premium features",security:"Security center",upgrade:"Upgrade to Premium",logout:"Sign out securely",recent:"Your recent conversations",preparing:"Message previews are being prepared",messageInfo:"Your latest conversations will appear here when message data is connected.",allMessages:"Open all messages",latest:"Latest updates on your account",noNotifications:"You have no new notifications",notificationInfo:"Likes, messages and profile activity will appear here.",notificationCenter:"Open notification center",visibility:"Get more visibility",profilePhoto:"profile photo"},
    RU:{search:"Поиск по имени, городу или имени пользователя...",member:"Найти участника",messages:"Сообщения",notifications:"Уведомления",online:"В сети",viewProfile:"Посмотреть мой профиль",editProfile:"Редактировать профиль",premium:"Премиум-функции",security:"Центр безопасности",upgrade:"Перейти на Premium",logout:"Безопасный выход",recent:"Последние разговоры",preparing:"Предпросмотр сообщений готовится",messageInfo:"Последние разговоры появятся здесь после подключения данных сообщений.",allMessages:"Открыть все сообщения",latest:"Последние события аккаунта",noNotifications:"Новых уведомлений нет",notificationInfo:"Лайки, сообщения и активность профиля будут отображаться здесь.",notificationCenter:"Открыть центр уведомлений",visibility:"Получите больше видимости",profilePhoto:"фото профиля"},
    AR:{search:"ابحث بالاسم أو المدينة أو اسم المستخدم...",member:"بحث عن عضو",messages:"الرسائل",notifications:"الإشعارات",online:"متصل",viewProfile:"عرض ملفي الشخصي",editProfile:"تعديل الملف الشخصي",premium:"ميزات Premium",security:"مركز الأمان",upgrade:"الترقية إلى Premium",logout:"تسجيل خروج آمن",recent:"محادثاتك الأخيرة",preparing:"جارٍ إعداد معاينات الرسائل",messageInfo:"ستظهر محادثاتك الأخيرة هنا عند ربط بيانات الرسائل.",allMessages:"فتح جميع الرسائل",latest:"آخر تحديثات حسابك",noNotifications:"ليس لديك إشعارات جديدة",notificationInfo:"ستظهر الإعجابات والرسائل ونشاط الملف الشخصي هنا.",notificationCenter:"فتح مركز الإشعارات",visibility:"احصل على ظهور أكبر",profilePhoto:"صورة الملف الشخصي"}
  }[lang];

  const [activePanel, setActivePanel] =
    useState<ActivePanel>(null);

  const [searchValue, setSearchValue] =
    useState("");

  const [theme, setTheme] =
    useState<ThemeMode>("dark");

  const topbarRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedTheme =
      localStorage.getItem("egelove-theme");

    const initialTheme: ThemeMode =
      storedTheme === "light" ||
      storedTheme === "dark"
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
    const handleOutsideClick = (
      event: MouseEvent,
    ) => {
      if (
        topbarRef.current &&
        !topbarRef.current.contains(
          event.target as Node,
        )
      ) {
        setActivePanel(null);
      }
    };

    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        setActivePanel(null);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );

      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, []);

  const togglePanel = (
    panel: Exclude<ActivePanel, null>,
  ) => {
    setActivePanel((currentPanel) =>
      currentPanel === panel
        ? null
        : panel,
    );
  };

  const handleSearch = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const query = searchValue.trim();

    if (!query) {
      router.push("/search");
      return;
    }

    router.push(
      `/search?q=${encodeURIComponent(query)}`,
    );

    setActivePanel(null);
  };

  const handleThemeChange = () => {
    const nextTheme: ThemeMode =
      theme === "dark"
        ? "light"
        : "dark";

    setTheme(nextTheme);

    localStorage.setItem(
      "egelove-theme",
      nextTheme,
    );

    document.documentElement.classList.toggle(
      "dark",
      nextTheme === "dark",
    );

    document.documentElement.classList.toggle(
      "light",
      nextTheme === "light",
    );
  };

  const handleLanguageChange = (
    languageCode: Lang,
  ) => {
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
      (language) =>
        language.code === lang,
    ) || languages[0];

  return (
    <div
      ref={topbarRef}
      className="relative z-50 mb-7 rounded-[26px] border border-[#F6BA48]/70 bg-[#310D0C]/90 px-3 py-3 shadow-[0_20px_70px_rgba(0,0,0,0.24)] backdrop-blur-2xl sm:px-4"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-[#F6BA48]/60 to-transparent"
      />

      <div className="flex items-center gap-2.5">
        {/* MOBİL MENÜ */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Menüyü aç"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#F6BA48]/25 bg-[#512510]/65 text-[#F8D290]/85 transition-all duration-300 hover:border-[#F6BA48]/55 hover:bg-[#7E4114]/60 hover:text-[#F6BA48] lg:hidden"
        >
          <Menu
            className="h-5 w-5"
            strokeWidth={1.9}
          />
        </button>

        {/* ARAMA */}
        <form
          onSubmit={handleSearch}
         className="group relative hidden min-w-0 flex-1 md:block md:max-w-[420px] lg:max-w-[450px] xl:max-w-[480px]"
        >
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#F6BA48]/60 transition-colors duration-300 group-focus-within:text-[#F6BA48]"
            strokeWidth={1.9}
          />

          <input
            type="search"
            value={searchValue}
            onChange={(event) =>
              setSearchValue(
                event.target.value,
              )
            }
            placeholder={topbarText.search}
            aria-label={topbarText.member}
            className="h-11 w-full rounded-2xl border border-[#F6BA48]/25 bg-[#512510]/55 pl-11 pr-20 text-base font-medium text-[#F8D290] outline-none transition-all duration-300 placeholder:text-[#B5A093]/70 hover:border-[#F6BA48]/40 focus:border-[#F6BA48]/60 focus:bg-[#683312]/55 focus:shadow-[0_0_0_4px_rgba(246,186,72,0.10)]"
          />

          <span className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-lg border border-[#F6BA48]/20 bg-[#512510]/60 px-2 py-1 text-[9px] font-bold text-[#B5A093]/80 xl:block">
            ENTER
          </span>
        </form>

        {/* MOBİL ARAMA */}
        <Link
          href="/search"
          aria-label={topbarText.member}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#F6BA48]/25 bg-[#512510]/65 text-[#F8D290]/75 transition-all duration-300 hover:border-[#F6BA48]/55 hover:bg-[#7E4114]/60 hover:text-[#F6BA48] md:hidden"
        >
          <Search
            className="h-[19px] w-[19px]"
            strokeWidth={1.9}
          />
        </Link>

        {/* SAĞ KONTROLLER */}
        <div className="ml-auto flex min-w-0 shrink-0 items-center gap-2">

          {/* TEMA */}

          {/* DİLLER */}
<div className="hidden items-center gap-1 sm:flex">
  {languages.map((language) => {
    const isSelected = lang === language.code;

    return (
      <button
        key={language.code}
        type="button"
        onClick={() => handleLanguageChange(language.code)}
        aria-label={`${language.label} diline geç`}
        className={[
          "flex h-9 min-w-[38px] items-center justify-center rounded-xl px-2",
          "text-[11px] font-extrabold transition-all duration-200",
          isSelected
            ? "border border-[#F6BA48]/60 bg-[#7E4114]/70 text-[#F8D290] shadow-[0_0_14px_rgba(246,186,72,0.12)]"
            : "border border-transparent text-[#B5A093]/80 hover:border-[#F6BA48]/30 hover:bg-[#7E4114]/45 hover:text-[#F8D290]",
        ].join(" ")}
      >
        {language.shortLabel}
      </button>
    );
  })}
</div>
          {/* MESAJLAR */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                togglePanel("messages")
              }
              aria-label={topbarText.messages}
              aria-expanded={
                activePanel === "messages"
              }
              className={[
                "relative flex h-11 shrink-0 items-center justify-center gap-2 rounded-2xl border px-3 transition-all duration-300",
                activePanel === "messages"
            ? "border-[#F6BA48]/60 bg-[#7E4114]/70 text-[#F8D290]"
                 : "border-[#F6BA48]/25 bg-[#512510]/65 text-[#F8D290]/80 hover:border-[#F6BA48]/55 hover:bg-[#7E4114]/60 hover:text-[#F8D290]"
              ].join(" ")}
            >
              <MessageCircle
                className="h-[19px] w-[19px]"
                strokeWidth={1.9}
              />

              <span className="hidden text-xs font-bold md:inline">
                {topbarText.messages}
              </span>

              {unreadMessages > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#310D0C] bg-[#F6BA48] px-1 text-[9px] font-black text-[#310D0C]">
                  {unreadMessages > 99
                    ? "99+"
                    : unreadMessages}
                </span>
              )}
            </button>

            {activePanel === "messages" && (
              <div className="absolute right-0 top-[calc(100%+12px)] w-[320px] max-w-[calc(100vw-24px)] overflow-hidden rounded-[24px] border border-[#F6BA48]/45 bg-[#310D0C]/95 shadow-[0_28px_90px_rgba(49,13,12,0.55)] backdrop-blur-2xl">
                <div className="flex items-center justify-between border-b border-[#F6BA48]/20 px-4 py-4">
                  <div>
                    <p className="text-base font-extrabold text-white">
                      {topbarText.messages}
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-600">
                      {topbarText.recent}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setActivePanel(null)
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-[#B5A093]/70 transition hover:bg-[#7E4114]/45 hover:text-[#F8D290]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="px-5 py-8 text-center">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#F6BA48]/35 bg-[#7E4114]/50 text-[#F6BA48]">
                    <MessageCircle
                      className="h-5 w-5"
                      strokeWidth={1.8}
                    />
                  </span>

                  <p className="mt-4 text-xs font-bold text-[#F8D290]">
                    {topbarText.preparing}
                  </p>

                  <p className="mt-1.5 text-[10px] leading-5 text-[#B5A093]/75">
                    {topbarText.messageInfo}
                  </p>
                </div>

                <Link
                  href="/messages"
                  onClick={() =>
                    setActivePanel(null)
                  }
                  className="flex min-h-11 items-center justify-center border-t border-[#F6BA48]/20 text-xs font-bold text-[#F6BA48] transition hover:bg-[#7E4114]/40"
                >
                  {topbarText.allMessages}
                </Link>
              </div>
            )}
          </div>

          {/* BİLDİRİMLER */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                togglePanel("notifications")
              }
              aria-label={topbarText.notifications}
              aria-expanded={
                activePanel ===
                "notifications"
              }
              className={[
                "relative flex h-11 shrink-0 items-center justify-center gap-2 rounded-2xl border px-3 transition-all duration-300",
                activePanel ===
                "notifications"
                 ? "border-[#F6BA48]/60 bg-[#7E4114]/70 text-[#F8D290]"
                 : "border-[#F6BA48]/25 bg-[#512510]/65 text-[#F8D290]/80 hover:border-[#F6BA48]/55 hover:bg-[#7E4114]/60 hover:text-[#F8D290]"
              ].join(" ")}
            >
              <Bell
                className="h-[19px] w-[19px]"
                strokeWidth={1.9}
              />

              <span className="hidden text-xs font-bold md:inline">
                {topbarText.notifications}
              </span>

              {unreadNotifications > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#310D0C] bg-[#F6BA48] px-1 text-[9px] font-black text-[#310D0C]">
                  {unreadNotifications >
                  99
                    ? "99+"
                    : unreadNotifications}
                </span>
              )}
            </button>

            {activePanel ===
              "notifications" && (
              <div className="absolute right-0 top-[calc(100%+12px)] w-[340px] max-w-[calc(100vw-24px)] overflow-hidden rounded-[24px] border border-[#F6BA48]/45 bg-[#310D0C]/95 shadow-[0_28px_90px_rgba(49,13,12,0.55)] backdrop-blur-2xl">
                <div className="flex items-center justify-between border-b border-[#F6BA48]/20 px-4 py-4">
                  <div>
                    <p className="text-base font-extrabold text-white">
                      {topbarText.notifications}
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-600">
                      {topbarText.latest}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setActivePanel(null)
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-[#B5A093]/70 transition hover:bg-[#7E4114]/45 hover:text-[#F8D290]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="px-5 py-8 text-center">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#F6BA48]/35 bg-[#7E4114]/50 text-[#F6BA48]">
                    <Bell
                      className="h-5 w-5"
                      strokeWidth={1.8}
                    />
                  </span>

                  <p className="mt-4 text-xs font-bold text-[#F8D290]">
                    {topbarText.noNotifications}
                  </p>

                  <p className="mt-1.5 text-[10px] leading-5 text-[#B5A093]/75">
                    {topbarText.notificationInfo}
                  </p>
                </div>

                <Link
                  href="/notifications"
                  onClick={() =>
                    setActivePanel(null)
                  }
                  className="flex min-h-11 items-center justify-center border-t border-[#F6BA48]/20 text-xs font-bold text-[#F6BA48] transition hover:bg-[#7E4114]/40"
                >
                  {topbarText.notificationCenter}
                </Link>
              </div>
            )}
          </div>

          {/* PROFİL */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                togglePanel("profile")
              }
              aria-expanded={
                activePanel === "profile"
              }
              className={[
                "flex h-11 shrink-0 items-center gap-2 rounded-2xl border p-1.5 pr-2.5 transition-all duration-300",
                activePanel === "profile"
               ? "border-[#F6BA48]/60 bg-[#7E4114]/70"
                : "border-[#F6BA48]/25 bg-[#512510]/65 hover:border-[#F6BA48]/55 hover:bg-[#7E4114]/60"
              ].join(" ")}
            >
             <span className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#F6BA48]/60 bg-gradient-to-br from-[#F6BA48] via-[#B16323] to-[#7E4114]">
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt={`${userName} ${topbarText.profilePhoto}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound
                    className="h-[17px] w-[17px] text-white"
                    strokeWidth={1.9}
                  />
                )}

                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#310D0C] bg-[#3FB36E]" />
              </span>

              <div className="hidden min-w-0 pr-1 text-left sm:flex sm:flex-col">
                <span className="block max-w-28 truncate text-xs font-black text-[#F8D290]">
                  {userName}
                </span>

              <span className="block max-w-28 truncate text-[10px] font-medium text-[#F6BA48]/80">
                  {userCity}
                </span>
              </div>

              <ChevronDown
                className={[
                  "hidden h-3.5 w-3.5 text-[#F6BA48]/70 transition-transform duration-300 xl:block",
                  activePanel === "profile"
                    ? "rotate-180"
                    : "",
                ].join(" ")}
              />
            </button>

            {activePanel === "profile" && (
             <div className="absolute right-0 top-[calc(100%+12px)] w-72 overflow-hidden rounded-[24px] border border-[#F6BA48]/45 bg-[#310D0C]/95 p-2 shadow-[0_28px_90px_rgba(49,13,12,0.55)] backdrop-blur-2xl">
              <div className="relative overflow-hidden rounded-[19px] border border-[#F6BA48]/30 bg-gradient-to-br from-[#7E4114]/70 via-[#512510]/80 to-[#310D0C]/90 p-4">
                  <div className="flex items-center gap-3">
                   <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#F6BA48]/60 bg-gradient-to-br from-[#F6BA48] via-[#B16323] to-[#7E4114] shadow-[0_10px_30px_rgba(246,186,72,0.18)]">
                      {profilePhoto ? (
                        <img
                          src={profilePhoto}
                          alt={`${userName} ${topbarText.profilePhoto}`}
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
                          <Crown className="h-3.5 w-3.5 text-[#F6BA48]" />
                        )}
                      </div>

                      <p className="mt-1 truncate text-[10px] text-[#B5A093]/75">
                        {userCity}
                      </p>

                      <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#3FB36E]/10 px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-[#3FB36E]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#3FB36E]" />
                        {topbarText.online}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-2 space-y-1">
                  <Link
                    href="/profile"
                    onClick={() =>
                      setActivePanel(null)
                    }
                    className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-xs font-bold text-[#F8D290]/80 transition hover:bg-[#7E4114]/45 hover:text-[#F8D290]"
                  >
                  <UserRound className="h-4 w-4 text-[#F6BA48]" />
                    {topbarText.viewProfile}
                  </Link>

                  <Link
                    href="/profile/edit"
                    onClick={() =>
                      setActivePanel(null)
                    }
                    className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-xs font-bold text-[#F8D290]/80 transition hover:bg-[#7E4114]/45 hover:text-[#F8D290]"
                  >
                    <Settings className="h-4 w-4 text-[#F6BA48]" />
                    {topbarText.editProfile}
                  </Link>

                  <Link
                    href="/premium"
                    onClick={() =>
                      setActivePanel(null)
                    }
                    className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-xs font-bold text-slate-400 transition hover:bg-[#7E4114]/45 hover:text-[#F8D290]"
                  >
                    <Crown className="h-4 w-4 text-[#F6BA48]" />
                    {topbarText.premium}
                  </Link>

                  <Link
                    href="/help"
                    onClick={() =>
                      setActivePanel(null)
                    }
                    className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-xs font-bold text-slate-400 transition hover:bg-[#7E4114]/45 hover:text-[#F8D290]"
                  >
                    <ShieldCheck className="h-4 w-4 text-[#F6BA48]" />
                    {topbarText.security}
                  </Link>
                </div>

                {!isPremium && (
                  <Link
                    href="/premium"
                    onClick={() =>
                      setActivePanel(null)
                    }
                    className="mt-2 flex items-center gap-3 rounded-2xl border border-[#F6BA48]/35 bg-gradient-to-r from-[#7E4114]/70 via-[#683312]/75 to-[#512510]/80 px-3 py-3 transition hover:border-[#F6BA48]/65 hover:bg-[#7E4114]/80"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-300/[0.1] text-[#F6BA48]">
                      <Sparkles className="h-4 w-4" />
                    </span>

                    <span className="min-w-0">
                      <span className="block text-[11px] font-extrabold text-white">
                        {topbarText.upgrade}
                      </span>

                      <span className="mt-0.5 block text-[9px] text-[#B5A093]/75">
                        {topbarText.visibility}
                      </span>
                    </span>
                  </Link>
                )}

                <div className="my-2 h-px bg-[#F6BA48]/15" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-xs font-bold text-[#B5A093]/80 transition hover:bg-red-400/[0.08] hover:text-red-300"
                >
                  <LogOut className="h-4 w-4" />
                  {topbarText.logout}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
