"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import OnlineUsers from "../../components/OnlineUsers";
import {
  Camera,
  ChevronRight,
  Download,
  Heart,
  Loader2,
  MessageCircle,
  Search,
  Share2,
  Smartphone,
  User,
  X,
} from "lucide-react";

import Topbar from "@/components/dashboard/Topbar";
import Sidebar from "./Sidebar";
import { useI18n } from "@/lib/i18n-context";
import { api } from "@/lib/api";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

export default function DashboardPage() {
  const [isClient, setIsClient] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showInstallHelp, setShowInstallHelp] = useState(false);
  const [installMessage, setInstallMessage] = useState("");

  const { t, lang } = useI18n();

  const pwaText: Record<string, string> = ({
    TR: {
      installed: "senveben telefonuna başarıyla yüklendi.",
      alreadyInstalled: "senveben zaten telefonunda yüklü.",
      installing: "senveben yükleniyor...",
      cancelled: "Kurulum iptal edildi. İstersen daha sonra tekrar deneyebilirsin.",
      onPhone: "TELEFONUNDA YÜKLÜ",
      onPhoneText: "senveben Telefonunda",
      iosTitle: "iPhone'a senveben Nasıl Eklenir?",
      otherTitle: "senveben'ı Ana Ekrana Ekle",
      iosHelp: "Safari'de alttaki Paylaş simgesine dokun. Açılan menüden Ana Ekrana Ekle seçeneğini seç ve ardından Ekle butonuna dokun.",
      otherHelp: "Tarayıcının menüsünü aç ve Uygulamayı yükle veya Ana ekrana ekle seçeneğini kullan. Kurulum seçeneği görünmüyorsa sayfayı normal tarayıcı sekmesinde açıp tekrar dene.",
      closeHelp: "Kurulum yardımını kapat"
    },
    AZ: {
      installed: "senveben telefonunuza uğurla quraşdırıldı.",
      alreadyInstalled: "senveben artıq telefonunuzda quraşdırılıb.",
      installing: "senveben quraşdırılır...",
      cancelled: "Quraşdırma ləğv edildi. İstəsəniz daha sonra yenidən cəhd edə bilərsiniz.",
      onPhone: "TELEFONUNUZDA QURAŞDIRILIB",
      onPhoneText: "senveben Telefonunuzda",
      iosTitle: "senveben iPhone-a necə əlavə edilir?",
      otherTitle: "senveben-i Ana Ekrana Əlavə Et",
      iosHelp: "Safari-də aşağıdakı Paylaş işarəsinə toxunun. Açılan menyudan Ana Ekrana Əlavə Et seçimini seçin və sonra Əlavə Et düyməsinə toxunun.",
      otherHelp: "Brauzerin menyusunu açın və Tətbiqi quraşdır və ya Ana ekrana əlavə et seçimini istifadə edin. Quraşdırma seçimi görünmürsə, səhifəni adi brauzer bölməsində açıb yenidən cəhd edin.",
      closeHelp: "Quraşdırma köməyini bağla"
    },
    EN: {
      installed: "senveben was successfully installed on your phone.",
      alreadyInstalled: "senveben is already installed on your phone.",
      installing: "senveben is installing...",
      cancelled: "Installation was cancelled. You can try again later.",
      onPhone: "INSTALLED ON YOUR PHONE",
      onPhoneText: "senveben is on your phone",
      iosTitle: "How to Add senveben to iPhone?",
      otherTitle: "Add senveben to Home Screen",
      iosHelp: "In Safari, tap the Share icon below. Select Add to Home Screen from the menu, then tap Add.",
      otherHelp: "Open your browser menu and select Install app or Add to Home screen. If the installation option is not visible, open the page in a normal browser tab and try again.",
      closeHelp: "Close installation help"
    },
    RU: {
      installed: "senveben успешно установлен на ваш телефон.",
      alreadyInstalled: "senveben уже установлен на вашем телефоне.",
      installing: "senveben устанавливается...",
      cancelled: "Установка отменена. Вы можете повторить попытку позже.",
      onPhone: "УСТАНОВЛЕНО НА ТЕЛЕФОНЕ",
      onPhoneText: "senveben на вашем телефоне",
      iosTitle: "Как добавить senveben на iPhone?",
      otherTitle: "Добавить senveben на главный экран",
      iosHelp: "В Safari нажмите значок «Поделиться» внизу. В открывшемся меню выберите «На экран Домой», затем нажмите «Добавить».",
      otherHelp: "Откройте меню браузера и выберите «Установить приложение» или «Добавить на главный экран». Если пункт установки не отображается, откройте страницу в обычной вкладке браузера и попробуйте снова.",
      closeHelp: "Закрыть помощь по установке"
    },
    AR: {
      installed: "تم تثبيت senveben على هاتفك بنجاح.",
      alreadyInstalled: "senveben مثبت بالفعل على هاتفك.",
      installing: "جارٍ تثبيت senveben...",
      cancelled: "تم إلغاء التثبيت. يمكنك المحاولة مرة أخرى لاحقًا.",
      onPhone: "مثبت على هاتفك",
      onPhoneText: "senveben على هاتفك",
      iosTitle: "كيفية إضافة senveben إلى iPhone؟",
      otherTitle: "إضافة senveben إلى الشاشة الرئيسية",
      iosHelp: "في Safari، اضغط على أيقونة المشاركة في الأسفل. اختر إضافة إلى الشاشة الرئيسية من القائمة، ثم اضغط على إضافة.",
      otherHelp: "افتح قائمة المتصفح واختر تثبيت التطبيق أو إضافة إلى الشاشة الرئيسية. إذا لم يظهر خيار التثبيت، افتح الصفحة في علامة تبويب عادية وحاول مرة أخرى.",
      closeHelp: "إغلاق تعليمات التثبيت"
    }
  } as Record<string, Record<string, string>>)[lang];


  const [user, setUser] = useState({
    name: "Üye",
    city: "Türkiye",
    profilePhoto: null as string | null,
  });

  useEffect(() => {
    const loadUser = async () => {
      setIsClient(true);

      try {
        const me: any = await api.users.me();

        localStorage.setItem("user", JSON.stringify(me));

        setUser({
          name: me.name || me.username || "Üye",
          city: me.city?.name || me.city || "Türkiye",
          profilePhoto:
            me.profilePhoto ||
            me.profileImage ||
            me.avatar ||
            null,
        });
      } catch (error) {
        console.log("Kullanıcı alınamadı:", error);

        try {
          const rawUser = localStorage.getItem("user");

          if (!rawUser) return;

          const parsed = JSON.parse(rawUser);

          setUser({
            name: parsed.name || parsed.username || "Üye",
            city: parsed.city?.name || parsed.city || "Türkiye",
            profilePhoto:
              parsed.profilePhoto ||
              parsed.profileImage ||
              parsed.avatar ||
              null,
          });
        } catch {
          // localStorage verisi bozuksa sessizce devam et.
        }
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const navigatorWithStandalone = navigator as Navigator & {
      standalone?: boolean;
    };

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      navigatorWithStandalone.standalone === true;

    const userAgent = navigator.userAgent.toLowerCase();

    const isiPhoneOrIPad =
      /iphone|ipad|ipod/.test(userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    setIsStandalone(standalone);
    setIsIOS(isiPhoneOrIPad);

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();

      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setInstallMessage("");
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
      setShowInstallHelp(false);
      setInstallMessage(pwaText.installed);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );

      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isStandalone) {
      setInstallMessage(pwaText.alreadyInstalled);
      return;
    }

    if (isIOS) {
      setShowInstallHelp(true);
      setInstallMessage("");
      return;
    }

    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();

        const choice = await deferredPrompt.userChoice;

        setDeferredPrompt(null);

        if (choice.outcome === "accepted") {
          setInstallMessage(pwaText.installing);
        } else {
          setInstallMessage(
            pwaText.cancelled
          );
        }
      } catch (error) {
        console.log("PWA kurulum hatası:", error);

        setShowInstallHelp(true);
        setInstallMessage("");
      }

      return;
    }

    setShowInstallHelp(true);
    setInstallMessage("");
  };

  if (!isClient) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#310D0C]">
        <Loader2 className="h-8 w-8 animate-spin text-[#F6BA48]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#F8D290] text-[#F8D290]">
      <div className="flex min-h-screen w-full">

        {/* SOL SIDEBAR */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-[286px] shrink-0 bg-gradient-to-b from-[#310D0C] to-[#512510] transition-transform duration-300 lg:sticky lg:top-0 lg:block lg:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        </aside>

        {/* SAĞ ANA İÇERİK */}
        <main className="min-h-screen min-w-0 flex-1 overflow-x-hidden bg-gradient-to-br from-[#F8D290] via-[#F6BA48] to-[#CF7526]">
          <div className="w-full pl-0 pr-4 pb-10 pt-4 sm:pr-5 md:pr-6 lg:pr-7 xl:pr-8">

           {/* =====================================================
    SENveBEN HERO BANNER
===================================================== */}
<div className="mb-4 w-full overflow-hidden rounded-3xl border border-[#F6BA48]/70 shadow-[0_18px_45px_rgba(49,13,12,0.28)]">
  <div
    className="relative min-h-[150px] w-full bg-cover bg-center bg-no-repeat sm:min-h-[180px] md:min-h-[210px] lg:min-h-[230px]"
    style={{
      backgroundImage: "url('/senveben-hero-banner.png')",
    }}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-[#310D0C]/15 via-transparent to-[#310D0C]/10" />

   
  </div>
</div>

            <div className="mb-6 w-full">
              <Topbar
                userName={user.name}
                userCity={user.city}
                profilePhoto={user.profilePhoto}
                onOpenMobileMenu={() => setIsSidebarOpen(true)}
              />
            </div>

            <OnlineUsers />

            <section className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">

              {/* PROFİLİM */}
              <Link href="/profile/edit" className="group min-w-0">
                <div className="h-full rounded-2xl border border-[#F6BA48]/70 bg-gradient-to-br from-[#683312] to-[#7E4114] p-5 shadow-lg shadow-[#310D0C]/20 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#F8D290] hover:shadow-xl hover:shadow-[#310D0C]/30">
                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#F6BA48]/70 bg-[#512510] shadow-inner">
                      <User className="h-6 w-6 text-[#F6BA48]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="text-base font-black text-[#F8D290] md:text-lg">
                        {t.dashboard.profileTitle}
                      </h2>

                      <p className="mt-1 text-xs text-[#F8D290]/75 md:text-sm">
                        {t.dashboard.profileDesc}
                      </p>
                    </div>

                    <ChevronRight className="h-5 w-5 shrink-0 text-[#F6BA48] transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>

              {/* BİRİNİ BUL */}
              <Link href="/search" className="group min-w-0">
                <div className="h-full rounded-2xl border border-[#F6BA48]/70 bg-gradient-to-br from-[#7E4114] to-[#964F1C] p-5 shadow-lg shadow-[#310D0C]/20 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#F8D290] hover:shadow-xl hover:shadow-[#310D0C]/30">
                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#F6BA48]/70 bg-[#512510]">
                      <Search className="h-6 w-6 text-[#F6BA48]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="text-base font-black text-[#F8D290] md:text-lg">
                        {t.dashboard.find}
                      </h2>

                      <p className="mt-1 truncate text-xs text-[#F8D290]/75 md:text-sm">
                        {t.dashboard.findProfileDesc}
                      </p>
                    </div>

                    <ChevronRight className="h-5 w-5 shrink-0 text-[#F6BA48] transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>

            </section>

            <section className="mt-6 grid w-full grid-cols-1 gap-6 md:grid-cols-2">

              {/* CANLI SOHBET */}
              <Link href="/messages" className="group block min-w-0">
                <div className="relative h-full overflow-hidden rounded-3xl border border-[#F6BA48]/70 bg-gradient-to-br from-[#683312] via-[#7E4114] to-[#512510] p-6 shadow-xl shadow-[#310D0C]/25 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-[#F8D290]">

                  <div className="absolute right-0 top-0 -mr-10 -mt-10 h-32 w-32 rounded-full bg-[#EF912C]/20 blur-3xl transition-all duration-500 group-hover:bg-[#F6BA48]/25" />

                  <div className="relative mb-4 flex items-center gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-[#F6BA48]/60 bg-[#310D0C]">
                      <Camera className="h-5 w-5 animate-pulse text-[#F6BA48]" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-sm font-bold tracking-wide text-[#F8D290] md:text-base">
                        {t.dashboard.liveChatTitle}
                      </h3>

                      <span className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-[#F6BA48]/50 bg-[#F6BA48]/10 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-[#F6BA48]">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#3FB36E]" />
                        {t.dashboard.liveChatStatus}
                      </span>
                    </div>

                  </div>

                  <p className="relative text-xs leading-relaxed tracking-wide text-[#F8D290]/75 md:text-sm">
                    {t.dashboard.liveChatDesc}
                  </p>

                </div>
              </Link>

              {/* TELEFONA YÜKLE */}
              <div className="relative h-full min-w-0 overflow-hidden rounded-3xl border border-[#F6BA48]/70 bg-gradient-to-br from-[#7E4114] via-[#683312] to-[#512510] p-6 shadow-xl shadow-[#310D0C]/25 backdrop-blur-xl">

                <div className="absolute right-0 top-0 -mr-10 -mt-10 h-32 w-32 rounded-full bg-[#F6BA48]/20 blur-3xl" />

                <div className="relative flex h-full flex-col">

                  <div className="mb-4 flex items-center gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#F6BA48]/70 bg-[#310D0C]">
                      <Smartphone className="h-5 w-5 text-[#F6BA48]" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-sm font-bold tracking-wide text-[#F8D290] md:text-base">
                        {t.dashboard.installPhoneTitle}
                      </h3>

                      <span
                        className={`mt-1 inline-block rounded-md border px-2 py-1 text-[9px] font-bold tracking-wider ${
                          isStandalone
                            ? "border-[#3FB36E]/50 bg-[#3FB36E]/10 text-[#3FB36E]"
                            : "border-[#F6BA48] bg-[#F6BA48] text-[#310D0C]"
                        }`}
                      >
                        {isStandalone ? pwaText.onPhone : t.dashboard.free}
                      </span>
                    </div>

                  </div>

                  <p className="relative mb-4 text-xs leading-relaxed tracking-wide text-[#F8D290]/75 md:text-sm">
                    {t.dashboard.installPhoneDesc}
                  </p>

                  {!isStandalone && (
                    <button
                      type="button"
                      onClick={handleInstallClick}
                      className="relative mt-auto flex w-full items-center justify-center gap-2 rounded-xl border border-[#F6BA48] bg-gradient-to-r from-[#F6BA48] to-[#EF912C] px-4 py-3 text-sm font-black text-[#310D0C] shadow-md shadow-[#310D0C]/20 transition-all hover:from-[#F8D290] hover:to-[#F6BA48] active:scale-[0.99]"
                    >
                      <Download className="h-4 w-4" />
                      {t.dashboard.installPhoneButton}
                    </button>
                  )}

                  {isStandalone && (
                    <div className="relative mt-auto flex w-full items-center justify-center gap-2 rounded-xl border border-[#3FB36E]/50 bg-[#3FB36E]/10 px-4 py-3 text-sm font-bold text-[#3FB36E]">
                      <Smartphone className="h-4 w-4" />
                      {pwaText.onPhoneText}
                    </div>
                  )}

                  {installMessage && (
                    <p className="mt-3 text-xs leading-relaxed text-[#F6BA48]">
                      {installMessage}
                    </p>
                  )}

                </div>
              </div>

            </section>

            {/* PWA KURULUM YARDIMI */}
            {showInstallHelp && !isStandalone && (
              <div className="mt-4 overflow-hidden rounded-2xl border border-[#F6BA48]/70 bg-gradient-to-br from-[#683312] to-[#512510] shadow-xl shadow-[#310D0C]/25">

                <div className="flex items-start justify-between gap-4 p-5">

                  <div className="flex min-w-0 gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#F6BA48]/70 bg-[#310D0C]">
                      <Share2 className="h-5 w-5 text-[#F6BA48]" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-sm font-black text-[#F8D290]">
                        {isIOS
                          ? pwaText.iosTitle
                          : pwaText.otherTitle}
                      </h3>

                      {isIOS ? (
                        <p className="mt-2 text-xs leading-6 text-[#F8D290]/75 md:text-sm">
                          {pwaText.iosHelp}
                        </p>
                      ) : (
                        <p className="mt-2 text-xs leading-6 text-[#F8D290]/75 md:text-sm">
                          {pwaText.otherHelp}
                        </p>
                      )}
                    </div>

                  </div>

                  <button
                    type="button"
                    aria-label={pwaText.closeHelp}
                    onClick={() => setShowInstallHelp(false)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#F6BA48]/60 bg-[#310D0C] text-[#F6BA48] transition hover:bg-[#512510] hover:text-[#F8D290]"
                  >
                    <X className="h-4 w-4" />
                  </button>

                </div>
              </div>
            )}

            {/* =====================================================
                ALT KARTLAR
            ===================================================== */}
            <section className="mt-6 grid w-full grid-cols-2 gap-4 md:grid-cols-2">

              {/* YENİ BEĞENİ */}
              <Link
                href="/likes"
                className="flex h-28 min-w-0 flex-col justify-between rounded-2xl border border-[#F6BA48]/70 bg-gradient-to-br from-[#683312] to-[#7E4114] p-4 shadow-lg shadow-[#310D0C]/20 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#F8D290]"
              >
                <Heart className="h-4 w-4 text-[#F6BA48]" />

                <div>
                  <span className="block text-xs font-bold text-[#F8D290]">
                    {t.dashboard.newLike}
                  </span>

                  <span className="mt-0.5 block text-[10px] font-semibold text-[#F6BA48]">
                    <span className="text-[#3FB36E]">●</span>{" "}
                    {t.dashboard.active}
                  </span>
                </div>
              </Link>

              {/* MESAJLAR */}
              <Link
                href="/messages"
                className="flex h-28 min-w-0 flex-col justify-between rounded-2xl border border-[#F6BA48]/70 bg-gradient-to-br from-[#7E4114] to-[#964F1C] p-4 shadow-lg shadow-[#310D0C]/20 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#F8D290]"
              >
                <MessageCircle className="h-4 w-4 text-[#F6BA48]" />

                <div>
                  <span className="block text-xs font-bold text-[#F8D290]">
                    {t.dashboard.messages}
                  </span>

                  <span className="mt-0.5 block text-[10px] font-medium text-[#F8D290]/65">
                    {t.dashboard.openChats}
                  </span>
                </div>
              </Link>

            </section>

            {/* ALT BOŞLUK */}
            <div className="h-10" />

          </div>
        </main>
      </div>
    </div>
  );
}