"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Check,
  ChevronDown,
  ChevronRight,
  Heart,
  Home,
  Languages,
  Loader2,
  MapPin,
  MessageCircle,
  Search,
  Settings,
  Sparkles,
  ThumbsUp,
  User,
  Users,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import AuthDialog from "@/components/AuthDialog";
import { api } from "@/lib/api";
import { useI18n } from "@/lib/i18n-context";

type TabType = "received" | "sent";

function calcAge(birthDate: string): number {
  const bd = new Date(birthDate);
  const today = new Date();

  let age = today.getFullYear() - bd.getFullYear();
  const month = today.getMonth() - bd.getMonth();

  if (month < 0 || (month === 0 && today.getDate() < bd.getDate())) {
    age--;
  }

  return age;
}

function getOtherUser(match: any, myId: string | null) {
  if (!match || !myId) return null;

  const senderId = String(match.senderId ?? "");
  const receiverId = String(match.receiverId ?? "");
  const currentId = String(myId);

  if (senderId === currentId) {
    return (
      match.receiver ||
      match.receiverUser ||
      match.likedUser ||
      match.user ||
      null
    );
  }

  if (receiverId === currentId) {
    return (
      match.sender || match.senderUser || match.user || match.likedUser || null
    );
  }

  return (
    match.receiver || match.sender || match.user || match.likedUser || null
  );
}

function getAvatar(user: any): string | undefined {
  return (
    user?.avatar ||
    user?.profileImage ||
    user?.photoUrl ||
    user?.photos?.find((p: any) => p?.isMain)?.url ||
    user?.photos?.[0]?.url ||
    undefined
  );
}

function getInitials(user: any): string {
  const first = user?.name?.charAt(0) || "";
  const last = user?.surname?.charAt(0) || "";

  const initials = `${first}${last}`.trim();

  return initials || "?";
}

function getFullName(user: any): string {
  const name = user?.name || "";
  const surname = user?.surname || "";

  return `${name} ${surname}`.trim() || "EgeLove Üyesi";
}

function getCity(user: any): string {
  return user?.city?.name || user?.cityName || user?.location?.city || "";
}

function getDistrict(user: any): string {
  return (
    user?.district?.name || user?.districtName || user?.location?.district || ""
  );
}

export default function LikesPage() {
  const [searchText, setSearchText] = useState("");
  const router = useRouter();
  const { lang, setLang } = useI18n();

  const [authTab, setAuthTab] = useState<"login" | "register" | null>(null);

  const [tab, setTab] = useState<TabType>("received");
  const [matches, setMatches] = useState<any[]>([]);
  const [myId, setMyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [likingId, setLikingId] = useState<string | null>(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);

  const t = useMemo(() => {
    const translations: Record<string, Record<string, string>> = {
      TR: {
        likes: "Beğeniler",
        subtitle: "Seni beğenenler ve senin beğendiklerin",
        likedYou: "Seni Beğenenler",
        youLiked: "Beğendiklerin",
        noOneLiked: "Henüz seni beğenen yok",
        noOneLikedDesc:
          "Profilini tamamla ve EgeLove'da daha fazla kişiye görün.",
        youLikedNobody: "Henüz kimseyi beğenmedin",
        youLikedNobodyDesc:
          "Sana uygun kişileri bul ve ilgini çeken profillere göz at.",
        explore: "Sana Uygun Kişiyi Bul",
        editProfile: "Profilimi Düzenle",
        profile: "Profili Gör",
        respond: "Karşılık Ver",
        mutual: "Eşleştiniz!",
        sendMessage: "Mesaj Gönder",
        online: "Çevrimiçi",
        home: "Ana Sayfa",
        discover: "Sana Uygun Kişiyi Bul",
        likesMenu: "Beğeniler",
        messages: "Mesajlar",
        premium: "Premium",
        myProfile: "Profilim",
        settings: "Ayarlar",
        notifications: "Bildirimler",
        search: "İsim, şehir veya kullanıcı adı ara...",
        login: "Giriş Yap",
        register: "Kayıt Ol",
        logout: "Çıkış Yap",
        welcome: "Hoş geldin",
        members: "üye",
        location: "Konum",
      },

      EN: {
        likes: "Likes",
        subtitle: "People who liked you and people you liked",
        likedYou: "Liked You",
        youLiked: "You Liked",
        noOneLiked: "No one has liked you yet",
        noOneLikedDesc:
          "Complete your profile and become more visible on EgeLove.",
        youLikedNobody: "You haven't liked anyone yet",
        youLikedNobodyDesc:
          "Discover new people and explore profiles that interest you.",
        explore: "Discover Members",
        editProfile: "Edit My Profile",
        profile: "View Profile",
        respond: "Like Back",
        mutual: "It's a Match!",
        sendMessage: "Send Message",
        online: "Online",
        home: "Home",
        discover: "Discover",
        likesMenu: "Likes",
        messages: "Messages",
        premium: "Premium",
        myProfile: "My Profile",
        settings: "Settings",
        notifications: "Notifications",
        search: "Search name, city or username...",
        login: "Log In",
        register: "Register",
        logout: "Log Out",
        welcome: "Welcome",
        members: "members",
        location: "Location",
      },

      RU: {
        likes: "Нравится",
        subtitle: "Кто лайкнул вас и кого лайкнули вы",
        likedYou: "Лайкнули вас",
        youLiked: "Вы лайкнули",
        noOneLiked: "Вас пока никто не лайкнул",
        noOneLikedDesc: "Заполните профиль и станьте заметнее на EgeLove.",
        youLikedNobody: "Вы пока никого не лайкнули",
        youLikedNobodyDesc:
          "Откройте для себя новых людей и интересные профили.",
        explore: "Найти участников",
        editProfile: "Изменить профиль",
        profile: "Смотреть профиль",
        respond: "Ответить лайком",
        mutual: "У вас взаимная симпатия!",
        sendMessage: "Написать сообщение",
        online: "В сети",
        home: "Главная",
        discover: "Обзор",
        likesMenu: "Нравится",
        messages: "Сообщения",
        premium: "Premium",
        myProfile: "Мой профиль",
        settings: "Настройки",
        notifications: "Уведомления",
        search: "Имя, город или имя пользователя...",
        login: "Войти",
        register: "Регистрация",
        logout: "Выйти",
        welcome: "Добро пожаловать",
        members: "участников",
        location: "Местоположение",
      },

      AR: {
        likes: "الإعجابات",
        subtitle: "من أعجبوا بك ومن أعجبت بهم",
        likedYou: "من أعجبوا بك",
        youLiked: "من أعجبت بهم",
        noOneLiked: "لم يعجب بك أحد بعد",
        noOneLikedDesc: "أكمل ملفك الشخصي وكن أكثر ظهورًا على EgeLove.",
        youLikedNobody: "لم تعجب بأحد بعد",
        youLikedNobodyDesc: "اكتشف أشخاصًا جدد وتصفح الملفات التي تهمك.",
        explore: "اكتشف الأعضاء",
        editProfile: "تعديل الملف الشخصي",
        profile: "عرض الملف",
        respond: "الإعجاب بالمقابل",
        mutual: "إنها مطابقة!",
        sendMessage: "إرسال رسالة",
        online: "متصل",
        home: "الرئيسية",
        discover: "اكتشف",
        likesMenu: "الإعجابات",
        messages: "الرسائل",
        premium: "Premium",
        myProfile: "ملفي الشخصي",
        settings: "الإعدادات",
        notifications: "الإشعارات",
        search: "ابحث بالاسم أو المدينة أو اسم المستخدم...",
        login: "تسجيل الدخول",
        register: "إنشاء حساب",
        logout: "تسجيل الخروج",
        welcome: "مرحبًا",
        members: "عضو",
        location: "الموقع",
      },
    };

    return translations[lang] || translations.TR;
  }, [lang]);
  const load = async () => {
    setLoading(true);

    try {
      // Giriş yapan gerçek kullanıcıyı API'den al
      const me: any = await api.users.me();

      const uid = me?.id ?? me?.user?.id ?? me?.data?.id ?? null;

      setMyId(uid ? String(uid) : null);

      if (!uid) {
        setMatches([]);
        return;
      }

      const data: any = await api.matches.list();

      const list = Array.isArray(data)
        ? data
        : (data?.matches ?? data?.data ?? []);

      setMatches(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Likes yüklenemedi:", error);
      setMatches([]);
      setMyId(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleLike = async (userId: string) => {
    if (likingId) return;

    try {
      setLikingId(userId);

      await api.matches.like(userId);

      await load();
    } catch (error) {
      console.error("Beğeni gönderilemedi:", error);
      alert(
        lang === "TR"
          ? "Beğeni gönderilemedi."
          : lang === "EN"
            ? "Like could not be sent."
            : lang === "RU"
              ? "Не удалось отправить лайк."
              : "تعذر إرسال الإعجاب.",
      );
    } finally {
      setLikingId(null);
    }
  };

  const safeMatches = Array.isArray(matches) ? matches : [];

  const received = safeMatches.filter(
    (match) => String(match?.receiverId ?? "") === String(myId ?? ""),
  );

  const sent = safeMatches.filter(
    (match) => String(match?.senderId ?? "") === String(myId ?? ""),
  );

  const visibleMatches = tab === "received" ? received : sent;

  const navigate = (url: string) => {
    window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-[#070b15] text-white">
      {/* MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <aside
            className="h-full w-[280px] bg-[#090d19] border-r border-white/10 p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center">
                  <Heart className="w-5 h-5 fill-white" />
                </div>

                <div>
                  <div className="font-black text-lg">
                    EGE<span className="text-pink-400">LOVE</span>
                  </div>

                  <div className="text-[8px] tracking-[3px] text-white/30">
                    EGE & AKDENİZ
                  </div>
                </div>
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <SidebarLinks t={t} active="likes" navigate={navigate} />
          </aside>
        </div>
      )}

      <div className="flex min-h-screen">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden md:flex fixed left-0 top-0 bottom-0 z-50 w-[282px] flex-col bg-[#080c17] border-r border-white/10">
          {/* LOGO */}
          <div className="h-[134px] flex items-center px-7 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-orange-400 flex items-center justify-center shadow-lg shadow-pink-500/20">
                  <Heart className="w-6 h-6 fill-white text-white" />
                </div>

                <span className="absolute -right-1 -top-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#080c17]" />
              </div>

              <div>
                <div className="text-xl font-black tracking-tight">
                  EGE<span className="text-pink-400">LOVE</span>
                </div>

                <div className="text-[9px] tracking-[3px] text-white/25 mt-1">
                  EGE & AKDENİZ
                </div>
              </div>
            </div>
          </div>

          {/* MENU */}
          <div className="flex-1 px-4 py-7 overflow-y-auto">
            <div className="px-4 mb-4 text-[10px] tracking-[3px] text-white/25 uppercase">
              Menü
            </div>

            <SidebarLinks t={t} active="likes" navigate={navigate} />

            <div className="px-4 mt-9 mb-4 text-[10px] tracking-[3px] text-white/25 uppercase">
              Hesabım
            </div>

            <button
              onClick={() => navigate("/profile")}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition"
            >
              <User className="w-5 h-5" />
              <span className="text-sm font-medium">{t.myProfile}</span>
            </button>

            <button
              onClick={() => navigate("/settings")}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition"
            >
              <Settings className="w-5 h-5" />
              <span className="text-sm font-medium">{t.settings}</span>
            </button>
          </div>

          {/* LOGOUT */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={() => {
                localStorage.removeItem("accessToken");
                navigate("/");
              }}
              className="w-full flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] py-3 text-sm text-white/60 hover:text-white transition"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              {t.logout}
            </button>

            <div className="text-center text-[9px] text-white/20 mt-4 tracking-widest">
              EGELOVE © 2026
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 md:ml-[282px] min-w-0">
          {/* TOP BAR */}
          <header className="sticky top-0 z-[100] px-4 md:px-8 pt-4 pointer-events-auto">
            <div className="h-[70px] rounded-2xl border border-white/15 bg-[#0c111d]/90 backdrop-blur-xl flex items-center gap-3 px-3 md:px-5 shadow-2xl shadow-black/20">
              {/* MOBILE MENU */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden shrink-0 w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-white/60 hover:text-white"
              >
                <Users className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 ml-auto">
                {/* LANGUAGES */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setLang("TR")}
                    className={`h-10 px-3 rounded-xl border text-xs font-bold transition ${
                      lang === "TR"
                        ? "border-pink-400/40 bg-pink-500/15 text-pink-300"
                        : "border-white/10 bg-white/[0.02] text-white/50 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    🇹🇷 TR
                  </button>

                  <button
                    type="button"
                    onClick={() => setLang("EN")}
                    className={`h-10 px-3 rounded-xl border text-xs font-bold transition ${
                      lang === "EN"
                        ? "border-pink-400/40 bg-pink-500/15 text-pink-300"
                        : "border-white/10 bg-white/[0.02] text-white/50 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    🇬🇧 EN
                  </button>

                  <button
                    type="button"
                    onClick={() => setLang("RU")}
                    className={`h-10 px-3 rounded-xl border text-xs font-bold transition ${
                      lang === "RU"
                        ? "border-pink-400/40 bg-pink-500/15 text-pink-300"
                        : "border-white/10 bg-white/[0.02] text-white/50 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    🇷🇺 RU
                  </button>

                  <button
                    type="button"
                    onClick={() => setLang("AR")}
                    className={`h-10 px-3 rounded-xl border text-xs font-bold transition ${
                      lang === "AR"
                        ? "border-pink-400/40 bg-pink-500/15 text-pink-300"
                        : "border-white/10 bg-white/[0.02] text-white/50 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    🇸🇦 AR
                  </button>
                </div>

                {/* NOTIFICATION */}
                <button
                  onClick={() => navigate("/notifications")}
                  className="relative w-11 h-11 rounded-xl border border-white/10 flex items-center justify-center text-white/55 hover:text-white hover:bg-white/5 transition"
                >
                  <Bell className="w-5 h-5" />

                  <span className="absolute right-2 top-2 w-2 h-2 rounded-full bg-pink-400" />
                </button>

                {/* PROFILE */}
                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-2 h-11 rounded-xl border border-white/10 px-2 md:px-3 hover:bg-white/5 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center text-xs font-bold">
                    {getInitials({
                      name: "y",
                      surname: "l",
                    })}
                  </div>

                  <span className="hidden md:block text-sm font-semibold">
                    yılmaz
                  </span>

                  <ChevronRight className="hidden md:block w-4 h-4 rotate-90 text-white/40" />
                </button>
              </div>
            </div>
          </header>

          {/* PAGE CONTENT */}
          <section className="px-4 md:px-8 py-8 md:py-10">
            <div className="max-w-[1280px] mx-auto">
              {/* PAGE TITLE */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-pink-500/10 border border-pink-400/20 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-pink-400" />
                  </div>

                  <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                      {t.likes}
                    </h1>

                    <p className="text-sm text-white/40 mt-1">{t.subtitle}</p>
                  </div>
                </div>
              </div>

              {/* STAT / INTRO CARD */}
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#15182a] via-[#101524] to-[#171126] p-6 md:p-7 mb-7">
                <div className="absolute -right-20 -top-24 w-72 h-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
                <div className="absolute -left-20 -bottom-28 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl" />

                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-pink-400/20 bg-pink-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-pink-300">
                      <Sparkles className="w-3.5 h-3.5" />
                      EgeLove
                    </div>

                    <h2 className="mt-4 text-xl md:text-2xl font-bold">
                      {tab === "received" ? t.likedYou : t.youLiked}
                    </h2>

                    <p className="text-sm text-white/40 mt-1">
                      {tab === "received"
                        ? `${received.length} ${t.members}`
                        : `${sent.length} ${t.members}`}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate("/search")}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-pink-500 px-5 py-3 text-sm font-bold shadow-lg shadow-pink-500/20 hover:scale-[1.02] transition"
                  >
                    <Search className="w-4 h-4" />
                    {t.explore}
                  </button>
                </div>
              </div>

              {/* TABS */}
              <div className="border-b border-white/10 mb-8">
                <div className="flex gap-7">
                  <button
                    onClick={() => setTab("received")}
                    className={`relative flex items-center gap-2 pb-4 text-sm font-semibold transition ${
                      tab === "received"
                        ? "text-white"
                        : "text-white/35 hover:text-white/70"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        tab === "received" ? "text-pink-400" : ""
                      }`}
                    />

                    {t.likedYou}

                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] ${
                        tab === "received"
                          ? "bg-pink-500/15 text-pink-300"
                          : "bg-white/5 text-white/30"
                      }`}
                    >
                      {received.length}
                    </span>

                    {tab === "received" && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-500" />
                    )}
                  </button>

                  <button
                    onClick={() => setTab("sent")}
                    className={`relative flex items-center gap-2 pb-4 text-sm font-semibold transition ${
                      tab === "sent"
                        ? "text-white"
                        : "text-white/35 hover:text-white/70"
                    }`}
                  >
                    <ThumbsUp
                      className={`w-4 h-4 ${
                        tab === "sent" ? "text-cyan-400" : ""
                      }`}
                    />

                    {t.youLiked}

                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] ${
                        tab === "sent"
                          ? "bg-cyan-500/15 text-cyan-300"
                          : "bg-white/5 text-white/30"
                      }`}
                    >
                      {sent.length}
                    </span>

                    {tab === "sent" && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                    )}
                  </button>
                </div>
              </div>

              {/* LOADING */}
              {loading && (
                <div className="py-24 flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-pink-500/10 border border-pink-400/20 flex items-center justify-center mb-4">
                    <Loader2 className="w-7 h-7 text-pink-400 animate-spin" />
                  </div>

                  <p className="text-sm text-white/30">
                    {lang === "TR"
                      ? "Beğeniler yükleniyor..."
                      : lang === "EN"
                        ? "Loading likes..."
                        : lang === "RU"
                          ? "Загрузка лайков..."
                          : "جاري تحميل الإعجابات..."}
                  </p>
                </div>
              )}

              {/* NOT LOGGED IN */}
              {!loading && !myId && (
                <EmptyState
                  icon={<Heart className="w-10 h-10 text-pink-400" />}
                  title={
                    lang === "TR"
                      ? "Giriş yapmalısın"
                      : lang === "EN"
                        ? "You must log in"
                        : lang === "RU"
                          ? "Необходимо войти"
                          : "يجب تسجيل الدخول"
                  }
                  description={
                    lang === "TR"
                      ? "Beğenilerini görmek için hesabına giriş yap."
                      : lang === "EN"
                        ? "Log in to see your likes."
                        : lang === "RU"
                          ? "Войдите, чтобы увидеть свои лайки."
                          : "سجل الدخول لرؤية إعجاباتك."
                  }
                  buttonText={t.login}
                  onClick={() => setAuthTab("login")}
                />
              )}

              {/* EMPTY RECEIVED */}
              {!loading &&
                myId &&
                tab === "received" &&
                received.length === 0 && (
                  <EmptyState
                    icon={<Heart className="w-10 h-10 text-pink-400" />}
                    title={t.noOneLiked}
                    description={t.noOneLikedDesc}
                    buttonText={t.editProfile}
                    onClick={() => navigate("/profile")}
                  />
                )}

              {/* EMPTY SENT */}
              {!loading && myId && tab === "sent" && sent.length === 0 && (
                <EmptyState
                  icon={<Search className="w-10 h-10 text-cyan-400" />}
                  title={t.youLikedNobody}
                  description={t.youLikedNobodyDesc}
                  buttonText={t.explore}
                  onClick={() => navigate("/search")}
                />
              )}

              {/* PROFILE GRID */}
              {!loading && myId && visibleMatches.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                  {visibleMatches.map((match) => {
                    const other = getOtherUser(match, myId);

                    if (!other?.id) return null;

                    const avatar = getAvatar(other);
                    const name = getFullName(other);
                    const age = other.birthDate
                      ? calcAge(other.birthDate)
                      : undefined;

                    const city = getCity(other);
                    const district = getDistrict(other);

                    const location =
                      city && district
                        ? `${city} • ${district}`
                        : city || district || "";

                    const isMutual =
                      match?.isMutual === true || match?.mutual === true;

                    return (
                      <article
                        key={match.id}
                        className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1422] hover:border-pink-400/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-pink-500/10"
                      >
                        {/* IMAGE */}
                        <button
                          onClick={() => navigate(`/profile/${other.id}`)}
                          className="relative block w-full aspect-[4/4.2] overflow-hidden bg-gradient-to-br from-[#172035] to-[#101522]"
                        >
                          {avatar ? (
                            <img
                              src={avatar}
                              alt={name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-500/20 via-purple-500/10 to-cyan-500/10">
                              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center text-3xl font-black shadow-xl">
                                {getInitials(other)}
                              </div>
                            </div>
                          )}

                          {/* GRADIENT */}
                          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />

                          {/* VERIFIED */}
                          {other?.isVerified && (
                            <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center border-2 border-white/30 shadow-lg">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}

                          {/* ONLINE */}
                          {other?.isOnline && (
                            <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur-md px-2.5 py-1.5 border border-white/10">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

                              <span className="text-[9px] font-semibold text-white/80">
                                {t.online}
                              </span>
                            </div>
                          )}
                        </button>

                        {/* CONTENT */}
                        <div className="p-5">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h3 className="text-lg font-bold truncate">
                                {name}
                                {age !== undefined && (
                                  <span className="text-cyan-400 ml-1">
                                    {age}
                                  </span>
                                )}
                              </h3>

                              {location && (
                                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-white/35">
                                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                                  <span className="truncate">{location}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {other?.bio && (
                            <p className="text-xs text-white/35 line-clamp-2 mt-3 min-h-[32px]">
                              {other.bio}
                            </p>
                          )}

                          {/* ACTIONS */}
                          <div className="mt-5 flex gap-2">
                            <button
                              onClick={() => navigate(`/profile/${other.id}`)}
                              className="flex-1 h-10 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] text-xs font-semibold text-white/70 hover:text-white transition"
                            >
                              {t.profile}
                            </button>

                            {tab === "received" && !isMutual && (
                              <button
                                disabled={likingId === String(other.id)}
                                onClick={() => handleLike(String(other.id))}
                                className="flex-1 h-10 rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:from-pink-400 hover:to-fuchsia-400 text-xs font-bold transition shadow-lg shadow-pink-500/10 disabled:opacity-50 flex items-center justify-center gap-1.5"
                              >
                                {likingId === String(other.id) ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Heart className="w-3.5 h-3.5 fill-white" />
                                )}

                                {t.respond}
                              </button>
                            )}

                            {isMutual && (
                              <button
                                onClick={() =>
                                navigate(`/messages/direct?userId=${other.id}`)

                                }
                                className="flex-1 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-xs font-bold transition shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-1.5"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                {t.sendMessage}
                              </button>
                            )}
                          </div>

                          {/* MUTUAL LABEL */}
                          {isMutual && (
                            <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                              <Heart className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                              {t.mutual}
                            </div>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      <AuthDialog activeTab={authTab} onClose={() => setAuthTab(null)} />
    </div>
  );
}

/* -------------------------------------------------------
   SIDEBAR
------------------------------------------------------- */

function SidebarLinks({
  t,
  active,
  navigate,
}: {
  t: Record<string, string>;
  active: string;
  navigate: (url: string) => void;
}) {
  const items = [
    {
      id: "home",
      label: t.home,
      icon: Home,
      url: "/dashboard",
    },
    {
      id: "discover",
      label: t.discover,
      icon: Search,
      url: "/search",
    },
    {
      id: "likes",
      label: t.likesMenu,
      icon: Heart,
      url: "/likes",
    },
    {
      id: "messages",
      label: t.messages,
      icon: MessageCircle,
      url: "/messages",
    },
    {
      id: "premium",
      label: t.premium,
      icon: Sparkles,
      url: "/premium",
    },
  ];

  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id;

        return (
          <button
            key={item.id}
            onClick={() => navigate(item.url)}
            className={`relative w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${
              isActive
                ? "bg-gradient-to-r from-pink-500/15 via-purple-500/10 to-transparent text-white"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            {isActive && (
              <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-gradient-to-b from-pink-400 to-purple-500" />
            )}

            <Icon className={`w-5 h-5 ${isActive ? "text-pink-400" : ""}`} />

            <span className="text-sm font-semibold">{item.label}</span>

            {isActive && (
              <ChevronRight className="w-4 h-4 ml-auto text-pink-400" />
            )}
          </button>
        );
      })}
    </nav>
  );
}

/* -------------------------------------------------------
   EMPTY STATE
------------------------------------------------------- */

function EmptyState({
  icon,
  title,
  description,
  buttonText,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#101827] to-[#0b111d] min-h-[360px] flex items-center justify-center px-6">
      <div className="absolute w-80 h-80 rounded-full bg-pink-500/5 blur-3xl -top-40 left-1/2 -translate-x-1/2" />

      <div className="relative text-center max-w-md">
        <div className="w-20 h-20 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto mb-6">
          {icon}
        </div>

        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>

        <p className="text-sm leading-6 text-white/35 mb-7">{description}</p>

        <button
          onClick={onClick}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-500 px-5 py-3 text-sm font-bold shadow-lg shadow-pink-500/15 hover:scale-[1.02] transition"
        >
          {buttonText}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
