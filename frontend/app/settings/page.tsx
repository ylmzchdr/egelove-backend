"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  Check,
  ChevronRight,
  Globe2,
  Heart,
  Lock,

  Palette,
  ShieldCheck,
  Sparkles,
  UserRound,
  Volume2,
  Eye,
  MessageCircle,
} from "lucide-react";

import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import Header from "@/components/Header";
import { useI18n } from "@/lib/i18n-context";
import type { Lang } from "@/lib/i18n";

type ToggleProps = {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
};

function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={[
        "relative h-7 w-12 shrink-0 rounded-full border transition-all duration-300",
        checked
          ? "border-pink-400/40 bg-gradient-to-r from-fuchsia-500 to-blue-500 shadow-[0_0_24px_rgba(217,70,239,0.22)]"
          : "border-white/10 bg-white/[0.06]",
      ].join(" ")}
    >
      <span
        className={[
          "absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300",
          checked ? "left-6" : "left-1",
        ].join(" ")}
      />
    </button>
  );
}

const languageOptions: Array<{
  code: Lang;
  label: string;
  native: string;
  flag: string;
}> = [
  { code: "TR", label: "Türkçe", native: "Türkçe", flag: "🇹🇷" },
  { code: "EN", label: "English", native: "English", flag: "🇬🇧" },
  { code: "RU", label: "Русский", native: "Русский", flag: "🇷🇺" },
  { code: "AR", label: "العربية", native: "العربية", flag: "🇸🇦" },
];

const copy = {
  TR: {
    title: "Ayarlar",
    subtitle: "EgeLove deneyimini kendine göre özelleştir.",
    appearance: "Görünüm",
    appearanceDesc: "EgeLove'ın görünümünü ve ekran tercihlerini yönet.",
    language: "Dil",
    languageDesc: "EgeLove'da kullanmak istediğin dili seç.",
    notifications: "Bildirimler",
    notificationsDesc: "Sana hangi bildirimlerin gönderileceğini seç.",
    newMessages: "Yeni mesajlar",
    newMessagesDesc: "Yeni bir mesaj geldiğinde bildirim al.",
    likes: "Beğeniler",
    likesDesc: "Biri seni beğendiğinde bildirim al.",
    matches: "Eşleşmeler",
    matchesDesc: "Yeni bir eşleşme olduğunda bildirim al.",
    sounds: "Bildirim sesleri",
    soundsDesc: "Bildirimlerde ses kullan.",
    privacy: "Gizlilik ve güvenlik",
    privacyDesc: "Hesabının görünürlüğünü ve güvenliğini yönet.",
    online: "Çevrimiçi durumunu göster",
    onlineDesc: "Diğer üyeler çevrimiçi olduğunu görebilsin.",
    read: "Okundu bilgisini göster",
    readDesc: "Mesajların okundu bilgisini karşı tarafa göster.",
    profile: "Profil ayarları",
    profileDesc: "Profil bilgilerini ve fotoğrafını düzenle.",
    editProfile: "Profilimi Düzenle",
    security: "Güvenlik",
    securityDesc: "Hesabını güvende tutmak için profil bilgilerini kontrol et.",
    account: "Hesap",
    accountDesc: "Hesabınla ilgili işlemler.",
    help: "Yardım Merkezi",
    logout: "Çıkış Yap",
    saved: "Ayarların kaydedildi",
    secure: "Hesabın güvende",
    secureDesc: "EgeLove hesabın güvenli bağlantı ile korunuyor.",
    premium: "Premium",
    premiumDesc: "Daha fazla özellik ve görünürlük için Premium'u keşfet.",
    premiumCta: "Premium'u İncele",
    active: "Aktif",
  },
  EN: {
    title: "Settings",
    subtitle: "Customize your EgeLove experience.",
    appearance: "Appearance",
    appearanceDesc: "Manage how EgeLove looks and feels.",
    language: "Language",
    languageDesc: "Choose the language you want to use on EgeLove.",
    notifications: "Notifications",
    notificationsDesc: "Choose which notifications you want to receive.",
    newMessages: "New messages",
    newMessagesDesc: "Get notified when a new message arrives.",
    likes: "Likes",
    likesDesc: "Get notified when someone likes you.",
    matches: "Matches",
    matchesDesc: "Get notified when you have a new match.",
    sounds: "Notification sounds",
    soundsDesc: "Use sounds for notifications.",
    privacy: "Privacy & security",
    privacyDesc: "Manage your account visibility and security.",
    online: "Show online status",
    onlineDesc: "Let other members see when you're online.",
    read: "Show read receipts",
    readDesc: "Let others see when you have read their messages.",
    profile: "Profile settings",
    profileDesc: "Edit your profile information and photo.",
    editProfile: "Edit My Profile",
    security: "Security",
    securityDesc: "Review your profile information to keep your account secure.",
    account: "Account",
    accountDesc: "Account-related actions.",
    help: "Help Center",
    logout: "Log Out",
    saved: "Settings saved",
    secure: "Your account is secure",
    secureDesc: "Your EgeLove account is protected with a secure connection.",
    premium: "Premium",
    premiumDesc: "Discover Premium for more features and visibility.",
    premiumCta: "Explore Premium",
    active: "Active",
  },
  RU: {
    title: "Настройки",
    subtitle: "Настройте EgeLove под себя.",
    appearance: "Внешний вид",
    appearanceDesc: "Управляйте внешним видом EgeLove.",
    language: "Язык",
    languageDesc: "Выберите язык EgeLove.",
    notifications: "Уведомления",
    notificationsDesc: "Выберите нужные уведомления.",
    newMessages: "Новые сообщения",
    newMessagesDesc: "Получайте уведомления о новых сообщениях.",
    likes: "Лайки",
    likesDesc: "Получайте уведомления, когда вас лайкают.",
    matches: "Совпадения",
    matchesDesc: "Получайте уведомления о новых совпадениях.",
    sounds: "Звуки уведомлений",
    soundsDesc: "Использовать звуки уведомлений.",
    privacy: "Конфиденциальность и безопасность",
    privacyDesc: "Управляйте видимостью и безопасностью аккаунта.",
    online: "Показывать статус онлайн",
    onlineDesc: "Разрешить другим видеть, что вы онлайн.",
    read: "Показывать прочитанные сообщения",
    readDesc: "Разрешить другим видеть прочтение сообщений.",
    profile: "Настройки профиля",
    profileDesc: "Изменяйте данные профиля и фотографию.",
    editProfile: "Изменить профиль",
    security: "Безопасность",
    securityDesc: "Проверьте данные профиля для защиты аккаунта.",
    account: "Аккаунт",
    accountDesc: "Действия с аккаунтом.",
    help: "Центр помощи",
    logout: "Выйти",
    saved: "Настройки сохранены",
    secure: "Ваш аккаунт защищён",
    secureDesc: "Аккаунт EgeLove защищён безопасным соединением.",
    premium: "Premium",
    premiumDesc: "Откройте Premium для дополнительных функций.",
    premiumCta: "Открыть Premium",
    active: "Активна",
  },
  AR: {
    title: "الإعدادات",
    subtitle: "خصّص تجربة EgeLove كما تريد.",
    appearance: "المظهر",
    appearanceDesc: "تحكم في مظهر EgeLove.",
    language: "اللغة",
    languageDesc: "اختر اللغة التي تريد استخدامها.",
    notifications: "الإشعارات",
    notificationsDesc: "اختر الإشعارات التي تريد استلامها.",
    newMessages: "الرسائل الجديدة",
    newMessagesDesc: "احصل على إشعار عند وصول رسالة جديدة.",
    likes: "الإعجابات",
    likesDesc: "احصل على إشعار عندما يعجب بك شخص.",
    matches: "التطابقات",
    matchesDesc: "احصل على إشعار عند وجود تطابق جديد.",
    sounds: "أصوات الإشعارات",
    soundsDesc: "استخدم الأصوات مع الإشعارات.",
    privacy: "الخصوصية والأمان",
    privacyDesc: "تحكم في ظهور حسابك وأمانه.",
    online: "إظهار حالة الاتصال",
    onlineDesc: "السماح للأعضاء برؤية أنك متصل.",
    read: "إظهار إيصالات القراءة",
    readDesc: "السماح للآخرين بمعرفة أنك قرأت الرسائل.",
    profile: "إعدادات الملف الشخصي",
    profileDesc: "عدّل معلومات ملفك وصورتك.",
    editProfile: "تعديل ملفي",
    security: "الأمان",
    securityDesc: "راجع معلومات ملفك للحفاظ على أمان الحساب.",
    account: "الحساب",
    accountDesc: "إجراءات متعلقة بالحساب.",
    help: "مركز المساعدة",
    logout: "تسجيل الخروج",
    saved: "تم حفظ الإعدادات",
    secure: "حسابك آمن",
    secureDesc: "حساب EgeLove محمي باتصال آمن.",
    premium: "Premium",
    premiumDesc: "اكتشف Premium للمزيد من الميزات.",
    premiumCta: "استكشف Premium",
    active: "نشط",
  },
} as const;

export default function SettingsPage() {
  const { lang, setLang } = useI18n();
  const t = copy[lang] ?? copy.TR;

  const [newMessages, setNewMessages] = useState(true);
  const [likes, setLikes] = useState(true);
  const [matches, setMatches] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [online, setOnline] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const readBool = (key: string, fallback: boolean) => {
      const value = localStorage.getItem(key);
      return value === null ? fallback : value === "true";
    };

    setNewMessages(readBool("egelove-notify-messages", true));
    setLikes(readBool("egelove-notify-likes", true));
    setMatches(readBool("egelove-notify-matches", true));
    setSounds(readBool("egelove-notify-sounds", true));
    setOnline(readBool("egelove-show-online", true));
    setReadReceipts(readBool("egelove-read-receipts", true));

  }, []);

  const saveValue = (key: string, value: boolean) => {
    localStorage.setItem(key, String(value));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  };

  const changeLanguage = (nextLang: Lang) => {
    setLang(nextLang);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  };

  const Row = ({
    icon: Icon,
    title,
    description,
    children,
  }: {
    icon: typeof Bell;
    title: string;
    description: string;
    children?: React.ReactNode;
  }) => (
    <div className="flex items-center gap-4 border-b border-white/[0.06] py-5 last:border-b-0">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.035] text-pink-300">
        <Icon className="h-5 w-5" strokeWidth={1.8} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-white">{title}</p>
        <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
      </div>
      {children}
    </div>
  );

  const Section = ({
    icon: Icon,
    title,
    description,
    children,
  }: {
    icon: typeof Bell;
    title: string;
    description: string;
    children: React.ReactNode;
  }) => (
    <section className="overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.035] shadow-[0_25px_80px_rgba(0,0,0,0.18)] backdrop-blur-2xl">
      <div className="border-b border-white/[0.06] px-6 py-5 sm:px-7">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500/20 to-blue-500/20 text-pink-300">
            <Icon className="h-5 w-5" strokeWidth={1.8} />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">{title}</h2>
            <p className="mt-0.5 text-sm text-slate-500">{description}</p>
          </div>
        </div>
      </div>
      <div className="px-6 sm:px-7">{children}</div>
    </section>
  );

  return (
    <div
      className="min-h-screen bg-[#080b14] text-white"
      dir={lang === "AR" ? "rtl" : "ltr"}
    >
      <div className="lg:hidden">
        <Header />
      </div>

      <div className="flex min-h-screen">
        <div className="hidden shrink-0 lg:block">
          <div className="sticky top-0 h-screen">
            <Sidebar />
          </div>
        </div>

        <main className="relative min-w-0 flex-1 overflow-hidden bg-[radial-gradient(circle_at_10%_5%,rgba(56,189,248,0.09),transparent_28%),radial-gradient(circle_at_92%_14%,rgba(217,70,239,0.09),transparent_30%),linear-gradient(135deg,#070a12_0%,#0d101a_52%,#090c15_100%)]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-40 -top-48 h-[500px] w-[500px] rounded-full bg-pink-500/[0.13] blur-[130px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-48 top-40 h-[520px] w-[520px] rounded-full bg-violet-500/[0.11] blur-[140px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-cyan-500/[0.07] blur-[130px]"
          />

          <div className="relative z-10">
            <div className="hidden lg:block">
              <Topbar />
            </div>

            <div className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6 sm:py-8 xl:px-8">
              <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-pink-400/20 bg-pink-500/[0.08] px-3 py-1.5 text-xs font-bold text-pink-300">
                    <SettingsIcon />
                    {t.title}
                  </div>
                  <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                    {t.title}
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                    {t.subtitle}
                  </p>
                </div>

                {saved && (
                  <div className="inline-flex items-center gap-2 self-start rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.08] px-4 py-2.5 text-sm font-bold text-emerald-300 sm:self-auto">
                    <Check className="h-4 w-4" />
                    {t.saved}
                  </div>
                )}
              </div>

              <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
                <Section
                  icon={Palette}
                  title={t.appearance}
                  description={t.appearanceDesc}
                >
                  <Row
                    icon={Globe2}
                    title={t.language}
                    description={t.languageDesc}
                  >
                    <div className="flex flex-wrap justify-end gap-1.5">
                      {languageOptions.map((item) => (
                        <button
                          key={item.code}
                          type="button"
                          onClick={() => changeLanguage(item.code)}
                          className={[
                            "rounded-xl border px-3 py-2 text-xs font-black transition-all",
                            lang === item.code
                              ? "border-pink-400/30 bg-gradient-to-r from-fuchsia-500/20 to-blue-500/20 text-white shadow-[0_0_22px_rgba(217,70,239,0.15)]"
                              : "border-white/[0.08] bg-white/[0.025] text-slate-500 hover:border-white/15 hover:text-white",
                          ].join(" ")}
                        >
                          {item.flag} {item.code}
                        </button>
                      ))}
                    </div>
                  </Row>
                </Section>

                <Section
                  icon={Bell}
                  title={t.notifications}
                  description={t.notificationsDesc}
                >
                  <Row
                    icon={MessageCircle}
                    title={t.newMessages}
                    description={t.newMessagesDesc}
                  >
                    <Toggle
                      checked={newMessages}
                      label={t.newMessages}
                      onChange={(value) => {
                        setNewMessages(value);
                        saveValue("egelove-notify-messages", value);
                      }}
                    />
                  </Row>

                  <Row
                    icon={Heart}
                    title={t.likes}
                    description={t.likesDesc}
                  >
                    <Toggle
                      checked={likes}
                      label={t.likes}
                      onChange={(value) => {
                        setLikes(value);
                        saveValue("egelove-notify-likes", value);
                      }}
                    />
                  </Row>

                  <Row
                    icon={Sparkles}
                    title={t.matches}
                    description={t.matchesDesc}
                  >
                    <Toggle
                      checked={matches}
                      label={t.matches}
                      onChange={(value) => {
                        setMatches(value);
                        saveValue("egelove-notify-matches", value);
                      }}
                    />
                  </Row>

                  <Row
                    icon={Volume2}
                    title={t.sounds}
                    description={t.soundsDesc}
                  >
                    <Toggle
                      checked={sounds}
                      label={t.sounds}
                      onChange={(value) => {
                        setSounds(value);
                        saveValue("egelove-notify-sounds", value);
                      }}
                    />
                  </Row>
                </Section>

                <Section
                  icon={ShieldCheck}
                  title={t.privacy}
                  description={t.privacyDesc}
                >
                  <Row
                    icon={Eye}
                    title={t.online}
                    description={t.onlineDesc}
                  >
                    <Toggle
                      checked={online}
                      label={t.online}
                      onChange={(value) => {
                        setOnline(value);
                        saveValue("egelove-show-online", value);
                      }}
                    />
                  </Row>

                  <Row
                    icon={MessageCircle}
                    title={t.read}
                    description={t.readDesc}
                  >
                    <Toggle
                      checked={readReceipts}
                      label={t.read}
                      onChange={(value) => {
                        setReadReceipts(value);
                        saveValue("egelove-read-receipts", value);
                      }}
                    />
                  </Row>

                  <Row
                    icon={Lock}
                    title={t.security}
                    description={t.securityDesc}
                  >
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-3 py-1.5 text-xs font-bold text-emerald-300">
                      <Check className="h-3.5 w-3.5" />
                      {t.active}
                    </span>
                  </Row>
                </Section>

                <Section
                  icon={UserRound}
                  title={t.account}
                  description={t.accountDesc}
                >
                  <Row
                    icon={UserRound}
                    title={t.profile}
                    description={t.profileDesc}
                  >
                    <Link
                      href="/profile/edit"
                      className="inline-flex items-center gap-2 rounded-xl border border-pink-400/20 bg-pink-500/[0.08] px-4 py-2.5 text-xs font-black text-pink-200 transition hover:bg-pink-500/[0.14]"
                    >
                      {t.editProfile}
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Row>

                  <Row
                    icon={ShieldCheck}
                    title={t.secure}
                    description={t.secureDesc}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                  </Row>

                  <Row
                    icon={Sparkles}
                    title={t.premium}
                    description={t.premiumDesc}
                  >
                    <Link
                      href="/premium"
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-blue-500 px-4 py-2.5 text-xs font-black text-white shadow-[0_12px_30px_rgba(168,85,247,0.2)] transition hover:-translate-y-0.5"
                    >
                      {t.premiumCta}
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Row>

                  <div className="py-5">
                    <Link
                      href="/help"
                      className="group flex items-center justify-between rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 py-3.5 transition hover:border-white/15 hover:bg-white/[0.05]"
                    >
                      <span className="text-sm font-bold text-slate-300 group-hover:text-white">
                        {t.help}
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-pink-300" />
                    </Link>
                  </div>
                </Section>
              </div>

              <div className="mt-5 flex items-center justify-center gap-2 pb-5 text-xs text-slate-600">
                <Lock className="h-3.5 w-3.5" />
                EgeLove • Güvenli ve kişisel deneyim
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function SettingsIcon() {
  return <Palette className="h-3.5 w-3.5" />;
}
