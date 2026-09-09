"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";
import {
  Bell,
  ChevronRight,
  Crown,
  Gauge,
  Heart,
  HelpCircle,
  LogOut,
  MessageCircle,
  Settings,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

type MenuItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{
    className?: string;
    strokeWidth?: number;
  }>;
  badge?: string;
};

function isRouteActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { lang } = useI18n();

  const copy = {
    TR: {
      home: "Ana Sayfa",
      discover: "Sana Uygun Kişiyi Bul",
      likes: "Beğeniler",
      messages: "Mesajlar",
      notifications: "Bildirimler",
      profile: "Profilim",
      settings: "Ayarlar",
      help: "Yardım Merkezi",
      platform: "SENveBEN.TR KALİTESİNDE GÜVENLİ DENEYİM",
      menu: "Kumanda Merkezi",
      account: "Hesabım",
      special: "Özel",
      premiumText:
        "Daha fazla görünürlük, sınırsız iletişim ve özel özelliklere eriş.",
      premiumCta: "Premium’u İncele",
      secure: "Güvenli bağlantı",
      protected: "Hesabın korunuyor",
      logout: "Çıkış Yap",
      mainMenu: "Ana menü",
      accountMenu: "Hesap menüsü",
    },

    EN: {
      home: "Home",
      discover: "Discover",
      likes: "Likes",
      messages: "Messages",
      notifications: "Notifications",
      profile: "My Profile",
      settings: "Settings",
      help: "Help Center",
      platform: "SECURE SenVeBen.TR EXPERIENCE",
      menu: "Control Center",
      account: "My Account",
      special: "Special",
      premiumText:
        "Get more visibility, unlimited communication and exclusive features.",
      premiumCta: "Explore Premium",
      secure: "Secure connection",
      protected: "Your account is protected",
      logout: "Log Out",
      mainMenu: "Main menu",
      accountMenu: "Account menu",
    },

    RU: {
      home: "Главная",
      discover: "Поиск",
      likes: "Лайки",
      messages: "Сообщения",
      notifications: "Уведомления",
      profile: "Мой профиль",
      settings: "Настройки",
      help: "Центр помощи",
      platform: "БЕЗОПАСНЫЙ ОПЫТ SenVeBen.TR",
      menu: "Центр управления",
      account: "Мой аккаунт",
      special: "Особое",
      premiumText:
        "Больше видимости, неограниченное общение и особые функции.",
      premiumCta: "Открыть Premium",
      secure: "Безопасное соединение",
      protected: "Ваш аккаунт защищён",
      logout: "Выйти",
      mainMenu: "Главное меню",
      accountMenu: "Меню аккаунта",
    },

    AR: {
      home: "الرئيسية",
      discover: "اكتشف",
      likes: "الإعجابات",
      messages: "الرسائل",
      notifications: "الإشعارات",
      profile: "ملفي الشخصي",
      settings: "الإعدادات",
      help: "مركز المساعدة",
      platform: "تجربة SenVeBen.TR الآمنة",
      menu: "مركز التحكم",
      account: "حسابي",
      special: "مميز",
      premiumText:
        "احصل على ظهور أكبر وتواصل غير محدود وميزات حصرية.",
      premiumCta: "اكتشف بريميوم",
      secure: "اتصال آمن",
      protected: "حسابك محمي",
      logout: "تسجيل الخروج",
      mainMenu: "القائمة الرئيسية",
      accountMenu: "قائمة الحساب",
    },
  }[lang];

  const mainMenuItems: MenuItem[] = [
    {
      label: copy.home,
      href: "/dashboard",
      icon: Gauge,
    },
    {
      label: copy.likes,
      href: "/likes",
      icon: Heart,
    },
    {
      label: copy.messages,
      href: "/messages",
      icon: MessageCircle,
    },
    {
      label: copy.notifications,
      href: "/notifications",
      icon: Bell,
    },
  ];

  const accountMenuItems: MenuItem[] = [
    {
      label: copy.profile,
      href: "/profile",
      icon: UserRound,
    },
    {
      label: copy.help,
      href: "/help",
      icon: HelpCircle,
    },
  ];

  const settingsMenuItem: MenuItem = {
    label: copy.settings,
    href: "/settings",
    icon: Settings,
  };

  const handleLogout = () => {
    try {
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
    } finally {
      router.push("/auth");
      router.refresh();
    }
  };

  const renderMenuItem = (item: MenuItem) => {
    const Icon = item.icon;
    const active = isRouteActive(pathname, item.href);

    return (
      <Link
        key={item.href}
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={[
          "group relative flex min-h-12 items-center gap-3 rounded-2xl px-3.5 py-3",
          "transition-all duration-300 ease-out",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F6BA48]/80",
          active
            ? "bg-gradient-to-r from-[#7E4114] via-[#683312] to-[#512510] text-[#F8D290] shadow-[0_12px_35px_rgba(49,13,12,0.38)]"
            : "text-[#B5A093] hover:bg-[#683312]/45 hover:text-[#F8D290]",
        ].join(" ")}
      >
        {active && (
          <span
            aria-hidden="true"
            className="absolute bottom-2 left-0 top-2 w-1 rounded-r-full bg-gradient-to-b from-[#F8D290] via-[#F6BA48] to-[#EF912C] shadow-[0_0_18px_rgba(246,186,72,0.75)]"
          />
        )}

        <span
          className={[
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
            "transition-all duration-300",
            active
              ? "border-[#F6BA48]/70 bg-[#310D0C]/70 text-[#F6BA48] shadow-[inset_0_1px_0_rgba(248,210,144,0.12)]"
              : "border-[#9F7C61]/30 bg-[#512510]/35 text-[#9F7C61] group-hover:border-[#F6BA48]/50 group-hover:bg-[#683312]/50 group-hover:text-[#F6BA48]",
          ].join(" ")}
        >
          <Icon
            className="h-[19px] w-[19px]"
            strokeWidth={1.9}
          />
        </span>

        <span className="min-w-0 flex-1 truncate text-base font-semibold tracking-[0.01em]">
          {item.label}
        </span>

        {item.badge && (
          <span className="rounded-full border border-[#F6BA48]/30 bg-[#F6BA48]/10 px-2 py-0.5 text-[10px] font-bold text-[#F6BA48]">
            {item.badge}
          </span>
        )}

        <ChevronRight
          className={[
            "h-4 w-4 shrink-0 transition-all duration-300",
            active
              ? "translate-x-0 text-[#F6BA48] opacity-100"
              : "-translate-x-1 text-[#795843] opacity-0 group-hover:translate-x-0 group-hover:text-[#F6BA48] group-hover:opacity-100",
          ].join(" ")}
          strokeWidth={2}
        />
      </Link>
    );
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col overflow-hidden border-r border-[#F6BA48]/20 bg-gradient-to-b from-[#310D0C] via-[#310D0C] to-[#512510] transition-all duration-300 md:sticky md:top-0 md:flex ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      {/* ARKA PLAN IŞIKLARI */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-28 h-72 w-72 rounded-full bg-[#B16323]/15 blur-[90px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -right-28 h-72 w-72 rounded-full bg-[#F6BA48]/10 blur-[100px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(246,186,72,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(246,186,72,0.025)_1px,transparent_1px)] bg-[size:34px_34px] opacity-40"
      />

      <div className="relative z-10 flex h-full min-h-screen flex-col">

        {/* LOGO */}
        <div className="border-b border-[#F6BA48]/20 px-5 pb-5 pt-6">
          <Link
            href="/dashboard"
            className="group flex items-center gap-3 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F6BA48]/80"
          >
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#F6BA48] via-[#CF7526] to-[#7E4114] opacity-95 shadow-[0_12px_35px_rgba(246,186,72,0.22)] transition-transform duration-300 group-hover:scale-105" />

              <div className="absolute inset-[1px] rounded-[15px] bg-gradient-to-br from-[#F8D290]/35 to-transparent" />

              <Heart
                className="relative z-10 h-6 w-6 fill-[#310D0C] text-[#310D0C]"
                strokeWidth={1.8}
              />

              <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-[#310D0C] bg-[#3FB36E] shadow-[0_0_14px_rgba(63,179,110,0.65)]" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-[20px] font-black tracking-[-0.04em] text-[#F8D290]">
                  SEN
                </span>

                <span className="bg-gradient-to-r from-[#F8D290] via-[#F6BA48] to-[#EF912C] bg-clip-text text-[20px] font-black tracking-[-0.04em] text-transparent">
                  VEBEN
                </span>
              </div>

              <p className="mt-0.5 truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9F7C61]">
                {copy.platform}
              </p>
            </div>
          </Link>
        </div>

        {/* MENÜ ALANI */}
        <div className="flex-1 overflow-y-auto px-4 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

          {/* ANA MENÜ */}
          <nav aria-label={copy.mainMenu}>
            <p className="mb-2.5 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9F7C61]">
              {copy.menu}
            </p>

            <div className="space-y-1.5">
              {mainMenuItems.map(renderMenuItem)}
            </div>
          </nav>

          <div className="my-5 h-px bg-gradient-to-r from-transparent via-[#F6BA48]/25 to-transparent" />

          {/* HESAP MENÜSÜ */}
          <nav aria-label={copy.accountMenu}>
            <p className="mb-2.5 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9F7C61]">
              {copy.account}
            </p>

            <div className="space-y-1.5">
              {accountMenuItems.map(renderMenuItem)}
            </div>
          </nav>

          {/* PREMIUM */}
          <div className="relative mt-6 overflow-hidden rounded-[24px] border border-[#F6BA48]/35 bg-gradient-to-br from-[#683312]/90 via-[#512510]/95 to-[#310D0C] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-7 -top-9 h-24 w-24 rounded-full bg-[#F6BA48]/20 blur-3xl"
            />

            <div className="relative">
              <div className="mb-4 flex items-start justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#F6BA48]/40 bg-[#F6BA48]/10 text-[#F6BA48]">
                  <Crown
                    className="h-5 w-5"
                    strokeWidth={1.9}
                  />
                </span>

                <span className="flex items-center gap-1 rounded-full border border-[#3FB36E]/35 bg-[#3FB36E]/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-[#3FB36E]">
                  <Sparkles className="h-3 w-3" />
                  {copy.special}
                </span>
              </div>

              <h3 className="text-base font-extrabold tracking-tight text-[#F8D290]">
                SenVeBen Premium
              </h3>

              <p className="mt-1.5 text-[11px] leading-5 text-[#B5A093]">
                {copy.premiumText}
              </p>

              <Link
                href="/premium"
                className="mt-4 flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#F6BA48] via-[#EF912C] to-[#CF7526] px-3 text-xs font-extrabold text-[#310D0C] shadow-[0_10px_30px_rgba(246,186,72,0.20)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(246,186,72,0.30)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F8D290]"
              >
                {copy.premiumCta}

                <ChevronRight
                  className="h-4 w-4"
                  strokeWidth={2.2}
                />
              </Link>
            </div>
          </div>

          {/* GÜVENLİ BAĞLANTI */}
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#3FB36E]/20 bg-[#3FB36E]/[0.06] px-3.5 py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#3FB36E]/10 text-[#3FB36E]">
              <ShieldCheck
                className="h-[18px] w-[18px]"
                strokeWidth={1.9}
              />
            </span>

            <div className="min-w-0">
              <p className="text-[11px] font-bold text-[#F8D290]">
                {copy.secure}
              </p>

              <p className="mt-0.5 text-[10px] text-[#9F7C61]">
                {copy.protected}
              </p>
            </div>
          </div>
        </div>

        {/* EN ALT BÖLÜM */}
        <div className="relative border-t border-[#F6BA48]/20 p-4">

          {/* AYARLAR */}
          <div className="mb-2">
            {renderMenuItem(settingsMenuItem)}
          </div>

          {/* ÇIKIŞ */}
          <button
            type="button"
            onClick={handleLogout}
            className="group flex min-h-12 w-full items-center gap-3 rounded-2xl border border-transparent px-3.5 py-3 text-left text-[#9F7C61] transition-all duration-300 hover:border-[#F6BA48]/20 hover:bg-[#683312]/40 hover:text-[#F8D290] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F6BA48]/60"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#9F7C61]/25 bg-[#512510]/35 transition-all duration-300 group-hover:border-[#F6BA48]/35 group-hover:bg-[#683312]/50 group-hover:text-[#F6BA48]">
              <LogOut
                className="h-[19px] w-[19px]"
                strokeWidth={1.9}
              />
            </span>

            <span className="flex-1 text-base font-semibold">
              {copy.logout}
            </span>

            <ChevronRight
              className="h-4 w-4 -translate-x-1 text-[#F6BA48] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
              strokeWidth={2}
            />
          </button>

          <p className="mt-3 text-center text-[9px] font-medium tracking-[0.08em] text-[#795843]">
            SenVeBen © 2026
          </p>
        </div>
      </div>
    </aside>
  );
}