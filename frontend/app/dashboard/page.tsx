"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Crown,
  Heart,
  Loader2,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserRound,
  Users,
} from "lucide-react";

import Header from "@/components/Header";
import AuthDialog from "@/components/AuthDialog";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import { useI18n } from "@/lib/i18n-context";

type AuthTab = "login" | "register" | null;

type DashboardUser = {
  name?: string;
  username?: string;
  email?: string;
  city?: string | { id?: string; name?: string };
  profilePhoto?: string;
  avatar?: string;
  photo?: string;
};

type DashboardCard = {
  key: "find" | "messages" | "likes";
  href: string;
  title: string;
  description: string;
  icon: React.ComponentType<{
    className?: string;
    strokeWidth?: number;
  }>;
  gradient: string;
  iconBackground: string;
};

export default function DashboardPage() {
  const [authTab, setAuthTab] = useState<AuthTab>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Üye");
  const [userCity, setUserCity] = useState("Türkiye");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const { t, lang } = useI18n();
  const d = t.dashboard;

  const copy = {
    TR: {
      loading: "{copy.loading}",
      loginTitle: "Dashboard’a erişmek için giriş yap",
      loginDesc:
       "Sana uygun kişileri bulmak, beğenilerini görmek ve mesajlarına ulaşmak için hesabına giriş yapmalısın.",
      login: "Giriş Yap",
      register: "Ücretsiz Kayıt Ol",
      secureMembership: "Güvenli üyelik",
      freeStart: "Ücretsiz başlangıç",
      active: "Aktif",
      newLike: "Yeni beğeni",
      unread: "Okunmamış mesaj",
      discovery: "Keşif",
      nationwide: "İl genelinde bul",
      currentLocation: "Mevcut konum",
      firstStep: "İlk adımını tamamla",
      welcome: "EGELOVE’a hoş geldin",
      welcomeDesc:
        "Profilini tamamladığında diğer üyeler seni daha kolay keşfedebilir ve daha güvenilir bağlantılar kurabilirsin.",
      uploadPhoto: "Profil fotoğrafı yükle",
      fillAbout: "Hakkında kısmını doldur",
      interests: "İlgi alanlarını seç",
      firstLike: "İlk beğenini gönder",
      completeProfile: "Profilimi Tamamla",
      viewProfile: "Profilimi Görüntüle",
      quickAccess: "Hızlı erişim",
      quickDesc: "En çok kullandığın alanlara kolayca ulaş.",
      open: "Aç",
      visible: "Daha fazla görünür ol",
      premiumDesc:
        "Premium özelliklerle profilini öne çıkar ve daha fazla kişiyle bağlantı kur.",
      premium1: "Daha yüksek profil görünürlüğü",
      premium2: "Özel iletişim özellikleri",
      premium3: "Premium üye rozeti",
      explorePremium: "Premium’u Keşfet",
      safeUse: "Güvenli kullanım",
      protectTogether: "Topluluğumuzu birlikte koruyalım",
      safetyDesc:
        "Şüpheli hesapları ve uygunsuz davranışları profil üzerinden bildirebilirsin. Kişisel iletişim bilgilerini tanımadığın kişilerle paylaşma.",
      safetyCenter: "Güvenlik merkezini aç",
      messageDesc: "Sohbetlerine devam et ve yeni mesajlarını kontrol et.",
    },
    EN: {
      loading: "Preparing your dashboard...",
      loginTitle: "Log in to access your dashboard",
      loginDesc:
        "Log in to discover members, view your likes and access your messages.",
      login: "Log In",
      register: "Sign Up Free",
      secureMembership: "Secure membership",
      freeStart: "Free to start",
      active: "Active",
      newLike: "New likes",
      unread: "Unread messages",
      discovery: "Discovery",
      nationwide: "Discover across 81 provinces",
      currentLocation: "Current location",
      firstStep: "Complete your first step",
      welcome: "Welcome to EGELOVE",
      welcomeDesc:
        "Complete your profile so other members can discover you more easily and build more trustworthy connections.",
      uploadPhoto: "Upload a profile photo",
      fillAbout: "Complete your about section",
      interests: "Choose your interests",
      firstLike: "Send your first like",
      completeProfile: "Complete My Profile",
      viewProfile: "View My Profile",
      quickAccess: "Quick access",
      quickDesc: "Reach your most-used areas easily.",
      open: "Open",
      visible: "Get more visibility",
      premiumDesc:
        "Highlight your profile with Premium features and connect with more people.",
      premium1: "Higher profile visibility",
      premium2: "Exclusive communication features",
      premium3: "Premium member badge",
      explorePremium: "Explore Premium",
      safeUse: "Use safely",
      protectTogether: "Let’s protect our community together",
      safetyDesc:
        "Report suspicious accounts and inappropriate behavior from their profile. Do not share personal contact information with people you do not know.",
      safetyCenter: "Open Safety Center",
      messageDesc: "Continue your conversations and check new messages.",
    },
    RU: {
      loading: "Подготовка панели...",
      loginTitle: "Войдите, чтобы открыть панель",
      loginDesc:
        "Войдите, чтобы находить участников, смотреть лайки и читать сообщения.",
      login: "Войти",
      register: "Бесплатная регистрация",
      secureMembership: "Безопасная регистрация",
      freeStart: "Бесплатное начало",
      active: "Активно",
      newLike: "Новые лайки",
      unread: "Непрочитанные сообщения",
      discovery: "Поиск",
      nationwide: "Поиск по 81 провинции",
      currentLocation: "Текущее местоположение",
      firstStep: "Завершите первый шаг",
      welcome: "Добро пожаловать в EGELOVE",
      welcomeDesc:
        "Заполните профиль, чтобы другие участники легче находили вас и создавали надёжные связи.",
      uploadPhoto: "Загрузите фото профиля",
      fillAbout: "Заполните раздел о себе",
      interests: "Выберите интересы",
      firstLike: "Отправьте первый лайк",
      completeProfile: "Заполнить профиль",
      viewProfile: "Посмотреть профиль",
      quickAccess: "Быстрый доступ",
      quickDesc: "Легко переходите к часто используемым разделам.",
      open: "Открыть",
      visible: "Станьте заметнее",
      premiumDesc:
        "Продвигайте профиль с Premium и общайтесь с большим числом людей.",
      premium1: "Повышенная видимость профиля",
      premium2: "Особые функции общения",
      premium3: "Значок Premium",
      explorePremium: "Открыть Premium",
      safeUse: "Безопасность",
      protectTogether: "Давайте вместе защищать сообщество",
      safetyDesc:
        "Сообщайте о подозрительных аккаунтах и неприемлемом поведении. Не делитесь личными контактами с незнакомыми людьми.",
      safetyCenter: "Открыть центр безопасности",
      messageDesc: "Продолжайте общение и проверяйте новые сообщения.",
    },
    AR: {
      loading: "جارٍ تجهيز لوحة التحكم...",
      loginTitle: "سجّل الدخول للوصول إلى لوحة التحكم",
      loginDesc:
        "سجّل الدخول لاكتشاف الأعضاء ومشاهدة الإعجابات والوصول إلى رسائلك.",
      login: "تسجيل الدخول",
      register: "سجّل مجاناً",
      secureMembership: "عضوية آمنة",
      freeStart: "بداية مجانية",
      active: "نشط",
      newLike: "إعجابات جديدة",
      unread: "رسائل غير مقروءة",
      discovery: "اكتشاف",
      nationwide: "اكتشف في 81 ولاية",
      currentLocation: "الموقع الحالي",
      firstStep: "أكمل خطوتك الأولى",
      welcome: "مرحباً بك في EGELOVE",
      welcomeDesc:
        "أكمل ملفك الشخصي ليتمكن الأعضاء الآخرون من اكتشافك بسهولة وبناء علاقات أكثر موثوقية.",
      uploadPhoto: "حمّل صورة للملف الشخصي",
      fillAbout: "أكمل قسم نبذة عنك",
      interests: "اختر اهتماماتك",
      firstLike: "أرسل أول إعجاب",
      completeProfile: "أكمل ملفي الشخصي",
      viewProfile: "عرض ملفي الشخصي",
      quickAccess: "وصول سريع",
      quickDesc: "انتقل بسهولة إلى الأقسام الأكثر استخداماً.",
      open: "فتح",
      visible: "احصل على ظهور أكبر",
      premiumDesc: "أبرز ملفك بميزات بريميوم وتواصل مع عدد أكبر من الأشخاص.",
      premium1: "ظهور أعلى للملف الشخصي",
      premium2: "ميزات تواصل حصرية",
      premium3: "شارة عضو بريميوم",
      explorePremium: "اكتشف بريميوم",
      safeUse: "استخدام آمن",
      protectTogether: "لنحمي مجتمعنا معاً",
      safetyDesc:
        "أبلغ عن الحسابات المشبوهة والسلوك غير المناسب من خلال الملف الشخصي. لا تشارك معلومات الاتصال الشخصية مع أشخاص لا تعرفهم.",
      safetyCenter: "فتح مركز الأمان",
      messageDesc: "تابع محادثاتك وتحقق من رسائلك الجديدة.",
    },
  }[lang];

  useEffect(() => {
    const controller = new AbortController();
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setToken(null);
      setLoading(false);
      return;
    }

    setToken(accessToken);

    const loadUser = async () => {
      try {
        const response = await fetch("/api/users/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            setToken(null);
          }
          return;
        }

        const data = await response.json();
        const user: DashboardUser = data.user || data.profile || data;

        setUserName(
          user?.name || user?.username || user?.email?.split("@")[0] || "Üye",
        );

        const resolvedCity =
          typeof user?.city === "string"
            ? user.city
            : user?.city?.name || "Türkiye";

        setUserCity(resolvedCity);

        setProfilePhoto(
          user?.profilePhoto || user?.avatar || user?.photo || null,
        );
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Kullanıcı bilgileri alınamadı:", error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadUser();

    return () => controller.abort();
  }, []);

  const dashboardCards: DashboardCard[] = [
    {
      key: "find",
      href: "/search",
      title: d.find,
      description: d.findDesc,
      icon: Search,
      gradient: "from-fuchsia-500/20 via-purple-500/10 to-indigo-500/10",
      iconBackground: "from-fuchsia-500 via-purple-500 to-indigo-500",
    },
    {
      key: "messages",
      href: "/messages",
      title: t.nav.messages,
      description: copy.messageDesc,
      icon: MessageCircle,
      gradient: "from-blue-500/20 via-cyan-500/10 to-sky-500/10",
      iconBackground: "from-blue-500 via-cyan-500 to-sky-500",
    },
    {
      key: "likes",
      href: "/likes",
      title: d.friends,
      description: d.friendsDesc,
      icon: Users,
      gradient: "from-emerald-500/20 via-teal-500/10 to-cyan-500/10",
      iconBackground: "from-emerald-500 via-teal-500 to-cyan-500",
    },
  ];

  return (
    <div className="min-h-screen bg-[#e8eef6] text-foreground dark:bg-[#080b14] dark:text-white">
      <div className="lg:hidden">
        <Header
          onOpenLogin={() => setAuthTab("login")}
          onOpenRegister={() => setAuthTab("register")}
        />
      </div>

      <div className="flex min-h-screen">
        {!loading && token && (
          <div className="hidden shrink-0 lg:block">
            <div className="sticky top-0 h-screen">
              <Sidebar />
            </div>
          </div>
        )}

        <main className="relative min-w-0 flex-1 overflow-hidden bg-[radial-gradient(circle_at_10%_5%,rgba(56,189,248,0.14),transparent_28%),radial-gradient(circle_at_92%_14%,rgba(217,70,239,0.12),transparent_30%),linear-gradient(135deg,#e9f1f8_0%,#f7f4fb_48%,#e9eef7_100%)] dark:bg-[radial-gradient(circle_at_10%_5%,rgba(56,189,248,0.10),transparent_28%),radial-gradient(circle_at_92%_14%,rgba(217,70,239,0.10),transparent_30%),linear-gradient(135deg,#070a12_0%,#0d101a_52%,#090c15_100%)]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-40 -top-48 h-[500px] w-[500px] rounded-full bg-pink-500/[0.16] blur-[130px] dark:bg-pink-500/[0.10]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-48 top-40 h-[520px] w-[520px] rounded-full bg-violet-500/[0.14] blur-[140px] dark:bg-violet-500/[0.09]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-cyan-500/[0.10] blur-[130px] dark:bg-cyan-500/[0.06]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.025)_1px,transparent_1px)] bg-[size:42px_42px] opacity-60 dark:bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] dark:opacity-35"
          />

          <div className="relative z-10 mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 sm:py-8 xl:px-10">
            {loading ? (
              <div className="flex min-h-[75vh] items-center justify-center">
                <div className="text-center">
                  <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-pink-500/20 blur-xl" />

                    <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-xl">
                      <Loader2 className="h-8 w-8 animate-spin text-pink-400" />
                    </div>
                  </div>

                  <p className="mt-5 text-basefont-medium text-slate-400">
                    {copy.loading}
                  </p>
                </div>
              </div>
            ) : !token ? (
              <div className="flex min-h-[75vh] items-center justify-center py-10">
                <div className="relative w-full max-w-xl overflow-hidden rounded-[32px] border border-white/[0.08] bg-white/[0.045] p-7 text-center shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-10">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-pink-500/20 blur-[90px]"
                  />

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-purple-500/20 blur-[90px]"
                  />

                  <div className="relative">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[26px] bg-gradient-to-br from-pink-500 via-rose-500 to-orange-400 shadow-[0_20px_60px_rgba(236,72,153,0.3)]">
                      <Heart
                        className="h-9 w-9 fill-white text-foreground dark:text-white"
                        strokeWidth={1.8}
                      />
                    </div>

                    <p className="mt-7 text-xs font-bold uppercase tracking-[0.25em] text-pink-300">
                      EGELOVE
                    </p>

                    <h1 className="mt-3 text-3xl font-black tracking-tight text-foreground dark:text-white sm:text-4xl">
                      {copy.loginTitle}
                    </h1>

                    <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-400 sm:text-base">
                      {copy.loginDesc}
                    </p>

                    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => setAuthTab("login")}
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 px-7 text-sm font-extrabold text-foreground dark:text-white shadow-[0_15px_40px_rgba(236,72,153,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(236,72,153,0.35)]"
                      >
                        {copy.login}
                        <ArrowRight className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setAuthTab("register")}
                        className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-7 text-sm font-bold text-foreground dark:text-white transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08]"
                      >
                        {copy.register}
                      </button>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <ShieldCheck className="h-4 w-4 text-emerald-400" />
                        {copy.secureMembership}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-pink-400" />
                        {copy.freeStart}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Topbar
                  userName={userName}
                  userCity={userCity}
                  profilePhoto={profilePhoto}
                  isPremium={false}
                  unreadMessages={0}
                  unreadNotifications={0}
                />

                <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-[24px] border border-slate-300/65 bg-white/72 p-5 shadow-[0_16px_45px_rgba(71,85,105,0.10)] backdrop-blur-2xl dark:border-white/[0.07] dark:bg-white/[0.035] dark:shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
                    <div className="flex items-center justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-500/10 text-pink-300">
                        <Heart
                          className="h-5 w-5 fill-pink-400/20"
                          strokeWidth={1.8}
                        />
                      </span>

                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/[0.08] px-2 py-1 text-[10px] font-bold text-emerald-300">
                        <TrendingUp className="h-3 w-3" />
                        {copy.active}
                      </span>
                    </div>

                    <p className="mt-5 text-2xl font-black text-foreground dark:text-white">
                      —
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-400">
                      {copy.newLike}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-slate-300/65 bg-white/72 p-5 shadow-[0_16px_45px_rgba(71,85,105,0.10)] backdrop-blur-2xl dark:border-white/[0.07] dark:bg-white/[0.035] dark:shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
                    <div className="flex items-center justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
                        <MessageCircle className="h-5 w-5" strokeWidth={1.8} />
                      </span>

                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                        {t.nav.messages}
                      </span>
                    </div>

                    <p className="mt-5 text-2xl font-black text-foreground dark:text-white">
                      —
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-400">
                      {copy.unread}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-slate-300/65 bg-white/72 p-5 shadow-[0_16px_45px_rgba(71,85,105,0.10)] backdrop-blur-2xl dark:border-white/[0.07] dark:bg-white/[0.035] dark:shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
                    <div className="flex items-center justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300">
                        <Users className="h-5 w-5" strokeWidth={1.8} />
                      </span>

                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                        {copy.discovery}
                      </span>
                    </div>

                    <p className="mt-5 text-2xl font-black text-foreground dark:text-white">
                      81
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-400">
                      {copy.nationwide}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-slate-300/65 bg-white/72 p-5 shadow-[0_16px_45px_rgba(71,85,105,0.10)] backdrop-blur-2xl dark:border-white/[0.07] dark:bg-white/[0.035] dark:shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
                    <div className="flex items-center justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300">
                        <MapPin className="h-5 w-5" strokeWidth={1.8} />
                      </span>

                      <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                    </div>

                    <p className="mt-5 truncate text-lg font-black text-foreground dark:text-white">
                      {userCity}
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-400">
                      {copy.currentLocation}
                    </p>
                  </div>
                </section>

                <section className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(310px,0.65fr)]">
                  <div className="space-y-6">
                    <div className="relative overflow-hidden rounded-[30px] border border-pink-400/[0.14] bg-gradient-to-br from-pink-600 via-fuchsia-600 to-purple-700 p-6 shadow-[0_28px_80px_rgba(168,85,247,0.22)] sm:p-8">
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/15 blur-[80px]"
                      />

                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-orange-400/20 blur-[90px]"
                      />

                      <div className="relative z-10">
  <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
    <div className="max-w-2xl">

      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2">
        <Sparkles className="h-3.5 w-3.5" />
        {copy.firstStep}
      </div>

      <h2 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight text-white">
        {copy.welcome}, {userName}
      </h2>

      <p className="mt-3 max-w-xl text-base leading-7 text-white/75">
        {copy.welcomeDesc}
      </p>

                            <div className="mt-6 grid gap-3 text-sm text-foreground dark:text-white/90 sm:grid-cols-2">
                              <div className="flex items-center gap-2.5">
                                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" />
                                {copy.uploadPhoto}
                              </div>

                              <div className="flex items-center gap-2.5">
                                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" />
                                {copy.fillAbout}
                              </div>

                              <div className="flex items-center gap-2.5">
                                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" />
                                {copy.interests}
                              </div>

                              <div className="flex items-center gap-2.5">
                                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" />
                                {copy.firstLike}
                              </div>
                            </div>
                          </div>

                          <div className="flex shrink-0 flex-col gap-3">
                            <Link
                              href="/profile/edit"
                              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white px-6 text-sm font-black text-fuchsia-700 shadow-[0_15px_40px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-50"
                            >
                              <Camera className="h-4 w-4" />
                              {copy.completeProfile}
                            </Link>

                            <Link
                              href="/profile"
                              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-6 text-sm font-bold text-foreground dark:text-white backdrop-blur-xl transition-all duration-300 hover:bg-white/15"
                            >
                              {copy.viewProfile}
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-black tracking-tight text-foreground dark:text-white">
                            {copy.quickAccess}
                          </h2>

                          <p className="mt-1 text-sm text-slate-400">
                            {copy.quickDesc}
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        {dashboardCards.map((card) => {
                          const Icon = card.icon;

                          return (
                            <Link
                              key={card.key}
                              href={card.href}
                              className={`group relative overflow-hidden rounded-[26px] border border-white/[0.07] bg-gradient-to-br ${card.gradient} p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-slate-300/80 hover:shadow-[0_24px_65px_rgba(71,85,105,0.18)] dark:hover:border-white/[0.14] dark:hover:shadow-[0_22px_60px_rgba(0,0,0,0.25)]`}
                            >
                              <div
                                aria-hidden="true"
                                className="pointer-events-none absolute -right-12 -top-14 h-36 w-36 rounded-full bg-white/[0.06] blur-3xl transition-transform duration-500 group-hover:scale-125"
                              />

                              <div className="relative">
                                <div
                                  className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.iconBackground} shadow-lg`}
                                >
                                  <Icon
                                    className="h-5 w-5 text-foreground dark:text-white"
                                    strokeWidth={1.9}
                                  />
                                </div>

                              <h3 className="mt-5 text-lg font-black text-foreground dark:text-white">
  {card.title}
</h3>
                           <p className="mt-3 min-h-10 text-xl leading-8 text-slate-200">
  {card.description}
</p>

                                <div className="mt-5 flex items-center justify-between">
                                 <span className="text-sm font-bold text-slate-300">
                                    {copy.open}
                                  </span>

                                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.05] text-slate-400 transition-all duration-300 group-hover:border-white/15 group-hover:bg-white/10 group-hover:text-foreground dark:text-white">
                                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                                  </span>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <aside className="space-y-6">
                    <div className="relative overflow-hidden rounded-[28px] border border-amber-300/35 bg-gradient-to-br from-white/78 via-amber-50/72 to-fuchsia-50/72 p-6 shadow-[0_20px_65px_rgba(168,85,247,0.12)] backdrop-blur-2xl dark:border-amber-300/[0.12] dark:from-amber-400/[0.11] dark:via-pink-500/[0.08] dark:to-violet-500/[0.08] dark:shadow-[0_20px_60px_rgba(0,0,0,0.30)]">
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-amber-300/15 blur-[60px]"
                      />

                      <div className="relative">
                        <div className="flex items-start justify-between">
                          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-300/15 bg-amber-300/10 text-amber-300">
                            <Crown className="h-6 w-6" strokeWidth={1.8} />
                          </span>

                          <span className="rounded-full border border-pink-400/15 bg-pink-400/[0.08] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-pink-300">
                            Premium
                          </span>
                        </div>

                        <h2 className="mt-5 text-xl font-black text-foreground dark:text-white">
                          {copy.visible}
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-slate-400">
                          {copy.premiumDesc}
                        </p>

                        <div className="mt-5 space-y-3 text-xs text-slate-300">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-amber-300" />
                            {copy.premium1}
                          </div>

                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-amber-300" />
                            {copy.premium2}
                          </div>

                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-amber-300" />
                            {copy.premium3}
                          </div>
                        </div>

                        <Link
                          href="/premium"
                          className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500 px-5 text-sm font-black text-foreground dark:text-white shadow-[0_14px_35px_rgba(251,146,60,0.2)] transition-all duration-300 hover:-translate-y-0.5"
                        >
                          {copy.explorePremium}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>

                    <div className="rounded-[28px] border border-slate-300/65 bg-white/72 p-6 shadow-[0_18px_55px_rgba(71,85,105,0.11)] backdrop-blur-2xl dark:border-white/[0.07] dark:bg-white/[0.035] dark:shadow-[0_20px_60px_rgba(0,0,0,0.30)]">
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/[0.08] text-emerald-300">
                          <ShieldCheck className="h-5 w-5" strokeWidth={1.8} />
                        </span>

                        <div>
                          <h2 className="text-sm font-extrabold text-foreground dark:text-white">
                            {copy.safeUse}
                          </h2>

                          <p className="mt-0.5 text-[11px] text-slate-500">
                            {copy.protectTogether}
                          </p>
                        </div>
                      </div>

                      <p className="mt-5 text-xs leading-6 text-slate-400">
                        {copy.safetyDesc}
                      </p>

                      <Link
                        href="/help"
                        className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-emerald-300 transition hover:text-emerald-200"
                      >
                        {copy.safetyCenter}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </aside>
                </section>

                <nav className="fixed bottom-3 left-3 right-3 z-40 rounded-[24px] border border-white/10 bg-[#0a0d17]/90 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl lg:hidden">
                  <div className="grid grid-cols-4 gap-1">
                    <Link
                      href="/dashboard"
                      className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-2xl bg-pink-500/10 text-pink-300"
                    >
                      <Heart className="h-4 w-4 fill-pink-400/20" />
                     <span className="text-sm font-bold"> {t.nav.home}</span>
                    </Link>

                    <Link
                      href="/search"
                      className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-2xl text-slate-500 transition hover:bg-white/[0.05] hover:text-foreground dark:text-white"
                    >
                      <Search className="h-4 w-4" />
                      <span className="text-sm font-bold">                        {t.nav.discover}
                      </span>
                    </Link>

                    <Link
                      href="/messages"
                      className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-2xl text-slate-500 transition hover:bg-white/[0.05] hover:text-foreground dark:text-white"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-[9px] font-bold">
                        {t.nav.messages}
                      </span>
                    </Link>

                    <Link
                      href="/profile"
                      className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-2xl text-slate-500 transition hover:bg-white/[0.05] hover:text-foreground dark:text-white"
                    >
                      <UserRound className="h-4 w-4" />
                      <span className="text-[9px] font-bold">
                        {lang === "TR"
                          ? "Profilim"
                          : lang === "EN"
                            ? "My Profile"
                            : lang === "RU"
                              ? "Мой профиль"
                              : "ملفي"}
                      </span>
                    </Link>
                  </div>
                </nav>

                <div className="h-20 lg:hidden" />
              </>
            )}
          </div>
        </main>
      </div>

      <AuthDialog activeTab={authTab} onClose={() => setAuthTab(null)} />
    </div>
  );
}