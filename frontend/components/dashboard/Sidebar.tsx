"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";
import {
  Bell,
  ChevronRight,
  Compass,
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

export default function Sidebar() {
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
      platform: "{copy.platform}",
      menu: "Menü",
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
      platform: "Social Discovery Platform",
      menu: "Menu",
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
      platform: "Платформа знакомств",
      menu: "Меню",
      account: "Мой аккаунт",
      special: "Особое",
      premiumText: "Больше видимости, неограниченное общение и особые функции.",
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
      platform: "منصة اكتشاف اجتماعي",
      menu: "القائمة",
      account: "حسابي",
      special: "مميز",
      premiumText: "احصل على ظهور أكبر وتواصل غير محدود وميزات حصرية.",
      premiumCta: "اكتشف بريميوم",
      secure: "اتصال آمن",
      protected: "حسابك محمي",
      logout: "تسجيل الخروج",
      mainMenu: "القائمة الرئيسية",
      accountMenu: "قائمة الحساب",
    },
  }[lang];

  const mainMenuItems: MenuItem[] = [
    { label: copy.home, href: "/dashboard", icon: Gauge },
    { label: copy.discover, href: "/search", icon: Compass },
    { label: copy.likes, href: "/likes", icon: Heart },
    { label: copy.messages, href: "/messages", icon: MessageCircle },
    { label: copy.notifications, href: "/notifications", icon: Bell },
  ];

  const accountMenuItems: MenuItem[] = [
    { label: copy.profile, href: "/profile", icon: UserRound },
    { label: copy.settings, href: "/settings", icon: Settings },
    { label: copy.help, href: "/help", icon: HelpCircle },
  ];

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
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
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
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400/80",
          active
            ? "bg-gradient-to-r from-pink-500/20 via-rose-500/15 to-orange-400/10 text-white shadow-[0_12px_35px_rgba(236,72,153,0.12)]"
            : "text-slate-300 hover:bg-white/[0.055] hover:text-white",
        ].join(" ")}
      >
        {active && (
          <span
            aria-hidden="true"
            className="absolute bottom-2 left-0 top-2 w-1 rounded-r-full bg-gradient-to-b from-pink-400 via-rose-400 to-orange-300 shadow-[0_0_18px_rgba(244,114,182,0.85)]"
          />
        )}

        <span
          className={[
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
            "transition-all duration-300",
            active
              ? "border-pink-400/25 bg-pink-400/10 text-pink-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
              : "border-white/[0.06] bg-white/[0.025] text-slate-500 group-hover:border-white/10 group-hover:bg-white/[0.06] group-hover:text-pink-300",
          ].join(" ")}
        >
          <Icon className="h-[19px] w-[19px]" strokeWidth={1.9} />
        </span>

        <span className="min-w-0 flex-1 truncate text-base font-semibold tracking-[0.01em]">
          {item.label}
        </span>

        {item.badge && (
          <span className="rounded-full border border-pink-400/20 bg-pink-400/10 px-2 py-0.5 text-[10px] font-bold text-pink-300">
            {item.badge}
          </span>
        )}

        <ChevronRight
          className={[
            "h-4 w-4 shrink-0 transition-all duration-300",
            active
              ? "translate-x-0 text-pink-300 opacity-100"
              : "-translate-x-1 text-slate-600 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
          ].join(" ")}
          strokeWidth={2}
        />
      </Link>
    );
  };

  return (
    <aside className="relative flex h-full min-h-screen w-full flex-col overflow-hidden border-r border-white/[0.07] bg-[#080b14]/95 text-white backdrop-blur-2xl lg:w-[286px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-28 h-72 w-72 rounded-full bg-pink-500/[0.13] blur-[90px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -right-28 h-72 w-72 rounded-full bg-violet-500/[0.09] blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:34px_34px] opacity-30"
      />

      <div className="relative z-10 flex h-full min-h-screen flex-col">
        <div className="border-b border-white/[0.065] px-5 pb-5 pt-6">
          <Link
            href="/dashboard"
            className="group flex items-center gap-3 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400/80"
          >
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-orange-400 opacity-90 shadow-[0_12px_35px_rgba(236,72,153,0.28)] transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-[1px] rounded-[15px] bg-gradient-to-br from-white/20 to-transparent" />

              <Heart
                className="relative z-10 h-6 w-6 fill-white text-white"
                strokeWidth={1.8}
              />

              <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-[#090c15] bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.7)]" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-[20px] font-black tracking-[-0.04em] text-white">
                  EGE
                </span>
                <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-orange-300 bg-clip-text text-[20px] font-black tracking-[-0.04em] text-transparent">
                  LOVE
                </span>
              </div>

              <p className="mt-0.5 truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                {copy.platform}
              </p>
            </div>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <nav aria-label={copy.mainMenu}>
            <p className="mb-2.5 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
              {copy.menu}
            </p>

            <div className="space-y-1.5">
              {mainMenuItems.map(renderMenuItem)}
            </div>
          </nav>

          <div className="my-5 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

          <nav aria-label={copy.accountMenu}>
            <p className="mb-2.5 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
              {copy.account}
            </p>

            <div className="space-y-1.5">
              {accountMenuItems.map(renderMenuItem)}
            </div>
          </nav>

          <div className="relative mt-6 overflow-hidden rounded-[24px] border border-pink-400/[0.14] bg-gradient-to-br from-pink-500/[0.13] via-violet-500/[0.07] to-orange-400/[0.08] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-7 -top-9 h-24 w-24 rounded-full bg-pink-400/20 blur-3xl"
            />

            <div className="relative">
              <div className="mb-4 flex items-start justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-300/10 text-amber-300">
                  <Crown className="h-5 w-5" strokeWidth={1.9} />
                </span>

                <span className="flex items-center gap-1 rounded-full border border-emerald-400/15 bg-emerald-400/[0.08] px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                  <Sparkles className="h-3 w-3" />
                  {copy.special}
                </span>
              </div>

              <h3 className="text-base font-extrabold tracking-tight text-white">
                EGELOVE Premium
              </h3>

              <p className="mt-1.5 text-[11px] leading-5 text-slate-400">
                {copy.premiumText}
              </p>

              <Link
                href="/premium"
                className="mt-4 flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 px-3 text-xs font-extrabold text-white shadow-[0_10px_30px_rgba(236,72,153,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(236,72,153,0.32)] focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-300"
              >
                {copy.premiumCta}
                <ChevronRight className="h-4 w-4" strokeWidth={2.2} />
              </Link>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-400/[0.09] bg-emerald-400/[0.035] px-3.5 py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400/[0.08] text-emerald-300">
              <ShieldCheck className="h-[18px] w-[18px]" strokeWidth={1.9} />
            </span>

            <div className="min-w-0">
              <p className="text-[11px] font-bold text-slate-300">
                {copy.secure}
              </p>
              <p className="mt-0.5 text-[10px] text-slate-600">
                {copy.protected}
              </p>
            </div>
          </div>
        </div>

        <div className="relative border-t border-white/[0.065] p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="group flex min-h-12 w-full items-center gap-3 rounded-2xl border border-transparent px-3.5 py-3 text-left text-slate-500 transition-all duration-300 hover:border-red-400/[0.09] hover:bg-red-400/[0.055] hover:text-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.055] bg-white/[0.025] transition-all duration-300 group-hover:border-red-400/10 group-hover:bg-red-400/[0.07]">
              <LogOut className="h-[19px] w-[19px]" strokeWidth={1.9} />
            </span>

            <span className="flex-1 text-base font-semibold">{copy.logout}</span>

            <ChevronRight
              className="h-4 w-4 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
              strokeWidth={2}
            />
          </button>

          <p className="mt-3 text-center text-[9px] font-medium tracking-[0.08em] text-slate-700">
            EGELOVE © 2026
          </p>
        </div>
      </div>
    </aside>
  );
}