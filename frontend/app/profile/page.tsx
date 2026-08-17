"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  Pencil,
  UserCircle,
  MapPin,
  Calendar,
  ShieldCheck,
  Camera,
  Heart,
  Eye,
  Star,
  Sparkles,
  Crown,
  Images,
  MessageCircle,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthDialog from "@/components/AuthDialog";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useI18n } from "@/lib/i18n-context";
import EgeMatchAICard from "@/components/EgeMatchAICard";

type CurrentUser = {
  id: string;
  email?: string;
  name?: string;
  surname?: string;
  birthDate?: string;
  city?: { name?: string };
  district?: { name?: string };
  bio?: string;
  aboutMe?: string;
  lookingFor?: string;
  avatar?: string | null;
  photos?: {
    id?: string;
    url: string;
    isMain?: boolean;
    status?: string;
  }[];

  isVerified?: boolean;
  occupation?: string;
  education?: string;
  income?: string;
  maritalStatus?: string;
  children?: string;
  height?: number;
  weight?: number;
  eyeColor?: string;
  hairColor?: string;
  hobbies?: string[] | string;
  languages?: string[] | string;
};

type LangKey = "TR" | "EN" | "RU" | "AR";

const TEXT: Record<LangKey, Record<string, string>> = {
  TR: {
    myProfile: "Profilim",
    previewDesc:
      "Profilinin diğer kullanıcılara nasıl göründüğünü buradan kontrol et.",
    editProfile: "Profili Düzenle",
    mustLogin: "Önce giriş yapmalısın",
    login: "Giriş Yap",
    info: "Profil Bilgileri",
    about: "Hakkımda",
    lookingFor: "Aradığım Kişi",
    photos: "Fotoğraflar",
    addPhoto: "Fotoğraf ekle, profil ziyaretini artır!",
    email: "E-posta",
    age: "Yaş",
    city: "Şehir",
    district: "İlçe",
    occupation: "Meslek",
    education: "Eğitim",
    income: "Gelir",
    maritalStatus: "Medeni Durum",
    children: "Çocuk",
    height: "Boy",
    weight: "Kilo",
    eyeColor: "Göz Rengi",
    hairColor: "Saç Rengi",
    hobbies: "İlgi Alanları",
    languages: "Diller",
    verified: "Doğrulanmış Profil",
    online: "Çevrimiçi",
    favorite: "Favori Yap",
    wink: "Göz Kırp",
    visitors: "Profil Ziyaretleri",
    member: "Egelove Üyesi",
    visitedProfile: "Profilini ziyaret etti",
    premium: "Premium",
    premiumDescription:
      "Profil ziyaretlerini, favorileri ve daha fazlasını öne çıkar.",
    userFallback: "Kullanıcı",
  },
  EN: {
    myProfile: "My Profile",
    previewDesc: "Preview how other users see your profile.",
    editProfile: "Edit Profile",
    mustLogin: "You must log in first",
    login: "Log In",
    info: "Profile Information",
    about: "About Me",
    lookingFor: "Looking For",
    photos: "Photos",
    addPhoto: "Add photos and increase profile visits!",
    email: "Email",
    age: "Age",
    city: "City",
    district: "District",
    occupation: "Occupation",
    education: "Education",
    income: "Income",
    maritalStatus: "Marital Status",
    children: "Children",
    height: "Height",
    weight: "Weight",
    eyeColor: "Eye Color",
    hairColor: "Hair Color",
    hobbies: "Interests",
    languages: "Languages",
    verified: "Verified Profile",
    online: "Online",
    favorite: "Add Favorite",
    wink: "Wink",
    visitors: "Profile Visitors",
    member: "Egelove Member",
    visitedProfile: "Visited your profile",
    premium: "Premium",
    premiumDescription: "Highlight profile visits, favorites and more.",
    userFallback: "User",
  },
  RU: {
    myProfile: "Мой профиль",
    previewDesc: "Посмотрите, как другие пользователи видят ваш профиль.",
    editProfile: "Редактировать профиль",
    mustLogin: "Сначала войдите в аккаунт",
    login: "Войти",
    info: "Информация профиля",
    about: "О себе",
    lookingFor: "Кого ищу",
    photos: "Фотографии",
    addPhoto: "Добавьте фото и увеличьте просмотры профиля!",
    email: "Эл. почта",
    age: "Возраст",
    city: "Город",
    district: "Район",
    occupation: "Профессия",
    education: "Образование",
    income: "Доход",
    maritalStatus: "Семейное положение",
    children: "Дети",
    height: "Рост",
    weight: "Вес",
    eyeColor: "Цвет глаз",
    hairColor: "Цвет волос",
    hobbies: "Интересы",
    languages: "Языки",
    verified: "Проверенный профиль",
    online: "Онлайн",
    favorite: "В избранное",
    wink: "Подмигнуть",
    visitors: "Посетители профиля",
    member: "Участник Egelove",
    visitedProfile: "Посетил ваш профиль",
    premium: "Премиум",
    premiumDescription:
      "Выделите посещения профиля, избранное и многое другое.",
    userFallback: "Пользователь",
  },
  AR: {
    myProfile: "ملفي الشخصي",
    previewDesc: "اعرض كيف يرى المستخدمون الآخرون ملفك الشخصي.",
    editProfile: "تعديل الملف الشخصي",
    mustLogin: "يجب تسجيل الدخول أولاً",
    login: "تسجيل الدخول",
    info: "معلومات الملف الشخصي",
    about: "نبذة عني",
    lookingFor: "أبحث عن",
    photos: "الصور",
    addPhoto: "أضف صوراً وزد زيارات ملفك!",
    email: "البريد الإلكتروني",
    age: "العمر",
    city: "المدينة",
    district: "المنطقة",
    occupation: "المهنة",
    education: "التعليم",
    income: "الدخل",
    maritalStatus: "الحالة الاجتماعية",
    children: "الأطفال",
    height: "الطول",
    weight: "الوزن",
    eyeColor: "لون العين",
    hairColor: "لون الشعر",
    hobbies: "الاهتمامات",
    languages: "اللغات",
    verified: "ملف موثق",
    online: "متصل",
    favorite: "إضافة للمفضلة",
    wink: "غمزة",
    visitors: "زوار الملف",
    member: "عضو Egelove",
    visitedProfile: "قام بزيارة ملفك الشخصي",
    premium: "بريميوم",
    premiumDescription: "قم بإبراز زيارات الملف الشخصي والمفضلة والمزيد.",
    userFallback: "مستخدم",
  },
};

function calculateAge(birthDate?: string) {
  if (!birthDate) return undefined;
  const birth = new Date(birthDate);
  const today = new Date();
  if (Number.isNaN(birth.getTime())) return undefined;

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

function toText(value?: string[] | string) {
  if (!value) return "-";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "-";
  return value || "-";
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 py-3">
      <span className="text-base text-white/55">{label}</span>
      <span className="text-base font-semibold text-white text-right">
        {value || "-"}
      </span>
    </div>
  );
}

export default function ProfilePage() {
  const { lang } = useI18n();
  console.log("PROFILE LANG:", lang);

  const currentLang: LangKey = ["TR", "EN", "RU", "AR"].includes(lang)
    ? (lang as LangKey)
    : "TR";

  const tx = TEXT[currentLang];
  const isRtl = currentLang === "AR";

  const [authTab, setAuthTab] = useState<"login" | "register" | null>(null);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [egematch, setEgematch] = useState<{
    score: number;
    energy: number;
    interest: number;
    love: number;
    label: string;
    summary: string;
  } | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        if (!token) {
          setLoading(false);
          return;
        }

        const me = await api.users.me();
        setUser(me as CurrentUser);
      } catch (error) {
        console.error(error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const fullName =
    user?.name && user.name.trim() !== ""
      ? `${user.name} ${user.surname || ""}`.trim()
      : user?.email?.split("@")[0] || tx.userFallback;

  const cityName = user?.city?.name || "";
  const districtName = user?.district?.name || "";
  const age = calculateAge(user?.birthDate);
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://egelove-backend.onrender.com";

  const normalizePhotoUrl = (url?: string | null) => {
    if (!url) return "";

    if (url.startsWith("http")) return url;

    const cleanUrl = url.startsWith("/") ? url : `/${url}`;

    return `${API_URL}${cleanUrl}`;
  };
  const sortedPhotos = [...(user?.photos || [])].sort((a, b) => {
    if (a.isMain && !b.isMain) return -1;
    if (!a.isMain && b.isMain) return 1;
    return 0;
  });

  const avatar =
    normalizePhotoUrl(sortedPhotos[0]?.url || user?.avatar) ||
    "/images/default-avatar.png";

  const optionMap: Record<string, Record<string, string>> = {
    TR: {
      PRIMARY: "İlkokul",
      SECONDARY: "Ortaokul",
      HIGH_SCHOOL: "Lise",
      ASSOCIATE: "Ön Lisans",
      BACHELOR: "Lisans",
      MASTER: "Yüksek Lisans",
      DOCTORATE: "Doktora",

      VERY_LOW: "Çok Düşük",
      LOW: "Düşük",
      MEDIUM: "Orta",
      HIGH: "Yüksek",
      VERY_HIGH: "Çok Yüksek",

      NEVER_MARRIED: "Hiç Evlenmedi",
      DIVORCED: "Boşanmış",
      WIDOWED: "Dul",
      SEPARATED: "Ayrı Yaşıyor",

      HAS_LIVING_WITH: "Var (Birlikte Yaşıyor)",
      HAS_NOT_LIVING: "Var (Birlikte Yaşamıyor)",
      NONE: "Yok",

      VERY_RELIGIOUS: "Çok Dindar",
      RELIGIOUS: "Dindar",
      MODERATE: "Orta",
      NOT_RELIGIOUS: "Dindar Değil",
      ATHEIST: "Ateist",

      NEVER: "Hiç",
      QUIT: "Bıraktı",
      OCCASIONAL: "Ara Sıra",
      REGULAR: "Düzenli",

      SLIM: "Zayıf",
      ATHLETIC: "Atletik",
      NORMAL: "Normal",
      CURVY: "Kıvrımlı",
      PLUS: "Balık Etli",

      BROWN: "Kahverengi",
      BLUE: "Mavi",
      GREEN: "Yeşil",
      HAZEL: "Ela",
      BLACK: "Siyah",
      OTHER: "Diğer",

      BLOND: "Sarı",
      RED: "Kızıl",
      WHITE: "Beyaz",
      BALD: "Kel",

      A_POSITIVE: "A+",
      A_NEGATIVE: "A-",
      B_POSITIVE: "B+",
      B_NEGATIVE: "B-",
      AB_POSITIVE: "AB+",
      AB_NEGATIVE: "AB-",
      ZERO_POSITIVE: "0+",
      ZERO_NEGATIVE: "0-",

      EMEKLI: "Emekli",
      emekli: "Emekli",
    },

    EN: {
      PRIMARY: "Primary School",
      SECONDARY: "Secondary School",
      HIGH_SCHOOL: "High School",
      ASSOCIATE: "Associate Degree",
      BACHELOR: "Bachelor's Degree",
      MASTER: "Master's Degree",
      DOCTORATE: "Doctorate",

      VERY_LOW: "Very Low",
      LOW: "Low",
      MEDIUM: "Medium",
      HIGH: "High",
      VERY_HIGH: "Very High",

      NEVER_MARRIED: "Never Married",
      DIVORCED: "Divorced",
      WIDOWED: "Widowed",
      SEPARATED: "Separated",

      HAS_LIVING_WITH: "Has Children (Living Together)",
      HAS_NOT_LIVING: "Has Children (Living Separately)",
      NONE: "None",

      VERY_RELIGIOUS: "Very Religious",
      RELIGIOUS: "Religious",
      MODERATE: "Moderate",
      NOT_RELIGIOUS: "Not Religious",
      ATHEIST: "Atheist",

      NEVER: "Never",
      QUIT: "Quit",
      OCCASIONAL: "Occasionally",
      REGULAR: "Regularly",

      SLIM: "Slim",
      ATHLETIC: "Athletic",
      NORMAL: "Average",
      CURVY: "Curvy",
      PLUS: "Plus Size",

      BROWN: "Brown",
      BLUE: "Blue",
      GREEN: "Green",
      HAZEL: "Hazel",
      BLACK: "Black",
      OTHER: "Other",

      BLOND: "Blonde",
      RED: "Red",
      WHITE: "White",
      BALD: "Bald",

      A_POSITIVE: "A+",
      A_NEGATIVE: "A-",
      B_POSITIVE: "B+",
      B_NEGATIVE: "B-",
      AB_POSITIVE: "AB+",
      AB_NEGATIVE: "AB-",
      ZERO_POSITIVE: "O+",
      ZERO_NEGATIVE: "O-",

      EMEKLI: "Retired",
      emekli: "Retired",
    },

    RU: {
      PRIMARY: "Начальная школа",
      SECONDARY: "Средняя школа",
      HIGH_SCHOOL: "Старшая школа",
      ASSOCIATE: "Колледж",
      BACHELOR: "Бакалавр",
      MASTER: "Магистр",
      DOCTORATE: "Докторантура",

      VERY_LOW: "Очень низкий",
      LOW: "Низкий",
      MEDIUM: "Средний",
      HIGH: "Высокий",
      VERY_HIGH: "Очень высокий",

      NEVER_MARRIED: "Никогда не состоял(а) в браке",
      DIVORCED: "В разводе",
      WIDOWED: "Вдовец / Вдова",
      SEPARATED: "Живёт отдельно",

      HAS_LIVING_WITH: "Есть дети (живут вместе)",
      HAS_NOT_LIVING: "Есть дети (живут отдельно)",
      NONE: "Нет",

      VERY_RELIGIOUS: "Очень религиозный",
      RELIGIOUS: "Религиозный",
      MODERATE: "Умеренный",
      NOT_RELIGIOUS: "Нерелигиозный",
      ATHEIST: "Атеист",

      NEVER: "Никогда",
      QUIT: "Бросил(а)",
      OCCASIONAL: "Иногда",
      REGULAR: "Регулярно",

      SLIM: "Стройный",
      ATHLETIC: "Спортивный",
      NORMAL: "Обычный",
      CURVY: "Пышный",
      PLUS: "Полный",

      BROWN: "Карий",
      BLUE: "Голубой",
      GREEN: "Зелёный",
      HAZEL: "Ореховый",
      BLACK: "Чёрный",
      OTHER: "Другое",

      BLOND: "Блондин",
      RED: "Рыжий",
      WHITE: "Белый",
      BALD: "Лысый",

      A_POSITIVE: "A+",
      A_NEGATIVE: "A-",
      B_POSITIVE: "B+",
      B_NEGATIVE: "B-",
      AB_POSITIVE: "AB+",
      AB_NEGATIVE: "AB-",
      ZERO_POSITIVE: "O+",
      ZERO_NEGATIVE: "O-",

      EMEKLI: "Пенсионер",
      emekli: "Пенсионер",
    },

    AR: {
      PRIMARY: "ابتدائي",
      SECONDARY: "إعدادي",
      HIGH_SCHOOL: "ثانوي",
      ASSOCIATE: "دبلوم",
      BACHELOR: "بكالوريوس",
      MASTER: "ماجستير",
      DOCTORATE: "دكتوراه",

      VERY_LOW: "منخفض جداً",
      LOW: "منخفض",
      MEDIUM: "متوسط",
      HIGH: "مرتفع",
      VERY_HIGH: "مرتفع جداً",

      NEVER_MARRIED: "لم يسبق له الزواج",
      DIVORCED: "مطلق",
      WIDOWED: "أرمل",
      SEPARATED: "منفصل",

      HAS_LIVING_WITH: "لديه أطفال ويعيشون معه",
      HAS_NOT_LIVING: "لديه أطفال ولا يعيشون معه",
      NONE: "لا يوجد",

      VERY_RELIGIOUS: "متدين جداً",
      RELIGIOUS: "متدين",
      MODERATE: "معتدل",
      NOT_RELIGIOUS: "غير متدين",
      ATHEIST: "ملحد",

      NEVER: "أبداً",
      QUIT: "أقلع",
      OCCASIONAL: "أحياناً",
      REGULAR: "بانتظام",

      SLIM: "نحيف",
      ATHLETIC: "رياضي",
      NORMAL: "عادي",
      CURVY: "ممتلئ",
      PLUS: "وزن زائد",

      BROWN: "بني",
      BLUE: "أزرق",
      GREEN: "أخضر",
      HAZEL: "عسلي",
      BLACK: "أسود",
      OTHER: "آخر",

      BLOND: "أشقر",
      RED: "أحمر",
      WHITE: "أبيض",
      BALD: "أصلع",

      A_POSITIVE: "A+",
      A_NEGATIVE: "A-",
      B_POSITIVE: "B+",
      B_NEGATIVE: "B-",
      AB_POSITIVE: "AB+",
      AB_NEGATIVE: "AB-",
      ZERO_POSITIVE: "O+",
      ZERO_NEGATIVE: "O-",

      EMEKLI: "متقاعد",
      emekli: "متقاعد",
    },
  };

  function trOpt(value: string | null | undefined) {
    if (!value) return "-";

    const key = String(value).trim().toUpperCase();

    return optionMap[currentLang]?.[key] || value;
  }
  const glassCard =
    "rounded-[28px] border border-white/10 bg-white/[0.055] shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-2xl";

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#090914] text-white"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-24 top-20 h-80 w-80 rounded-full bg-fuchsia-600/20 blur-[110px]" />
        <div className="absolute right-[-120px] top-[28%] h-96 w-96 rounded-full bg-violet-600/15 blur-[130px]" />
        <div className="absolute bottom-[-160px] left-[35%] h-[420px] w-[420px] rounded-full bg-pink-500/10 blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.045),transparent_34%)]" />
      </div>

      <div className="relative z-10">
        <Header
          onOpenLogin={() => setAuthTab("login")}
          onOpenRegister={() => setAuthTab("register")}
        />

        <section className="pb-16 pt-8 sm:pb-20 sm:pt-12">
          <div className="mx-auto max-w-[1480px] px-3 sm:px-5 lg:px-8">
            <div className="mb-7 flex flex-col gap-4 sm:mb-9 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-pink-400/20 bg-pink-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-pink-200">
                  <Sparkles className="h-3.5 w-3.5" />
                  EGELOVE PROFILE V2
                </div>
                <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                  {tx.myProfile}
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-6 text-white/55 sm:text-base">
                  {tx.previewDesc}
                </p>
              </div>

              {user && (
                <Link href="/profile/edit" className="w-full sm:w-auto">
                  <Button className="h-12 w-full rounded-2xl border border-pink-300/20 bg-gradient-to-r from-pink-600 to-fuchsia-600 px-6 font-bold shadow-[0_14px_35px_rgba(219,39,119,0.28)] transition hover:scale-[1.02] hover:from-pink-500 hover:to-fuchsia-500 sm:w-auto">
                    <Pencil className="mr-2 h-4 w-4" />
                    {tx.editProfile}
                  </Button>
                </Link>
              )}
            </div>

            {loading ? (
              <div
                className={`${glassCard} flex min-h-[420px] items-center justify-center`}
              >
                <div className="text-center">
                  <Loader2 className="mx-auto h-11 w-11 animate-spin text-pink-400" />
                  <p className="mt-4 text-base text-white/45">EGELOVE</p>
                </div>
              </div>
            ) : !user ? (
              <div className={`${glassCard} py-24 text-center`}>
                <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5">
                  <UserCircle className="h-16 w-16 text-white/35" />
                </div>
                <p className="mb-6 text-white/60">{tx.mustLogin}</p>
                <Button
                  onClick={() => setAuthTab("login")}
                  className="h-12 rounded-2xl bg-gradient-to-r from-pink-600 to-fuchsia-600 px-8 font-bold"
                >
                  {tx.login}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div
                  className={`${glassCard} relative overflow-hidden p-4 sm:p-6 lg:p-8`}
                >
                  <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-r from-pink-600/25 via-fuchsia-500/15 to-violet-600/20" />
                  <div className="absolute right-[-70px] top-[-90px] h-64 w-64 rounded-full bg-pink-500/20 blur-3xl" />

                  <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end">
                    <button
                      type="button"
                      onClick={() => setSelectedPhoto(avatar)}
                      className="group relative mx-auto h-44 w-44 shrink-0 overflow-hidden rounded-[32px] border-4 border-[#11111d] bg-black/40 shadow-[0_24px_70px_rgba(0,0,0,0.5)] lg:mx-0 lg:h-52 lg:w-52"
                    >
                      <img
                        src={avatar}
                        alt={fullName}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/65 via-transparent to-transparent pb-4 opacity-0 transition group-hover:opacity-100">
                        <Camera className="h-6 w-6" />
                      </div>
                    </button>

                    <div className="min-w-0 flex-1 text-center lg:text-left rtl:lg:text-right">
                      <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start rtl:lg:justify-end">
                        <h2 className="break-words text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                          {fullName}
                        </h2>
                        {user.isVerified && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-bold text-emerald-300">
                            <ShieldCheck className="h-4 w-4" />
                            {tx.verified}
                          </span>
                        )}
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-base text-white/60 lg:justify-start rtl:lg:justify-end">
                        <span className="inline-flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-pink-300" />
                          {age ?? "-"}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-pink-300" />
                          {[districtName, cityName]
                            .filter(Boolean)
                            .join(", ") || "-"}
                        </span>
                        <span className="inline-flex items-center gap-2 font-semibold text-emerald-300">
                          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.9)]" />
                          {tx.online}
                        </span>
                      </div>

                      <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-white/65 lg:mx-0">
                        {user.aboutMe || user.bio || tx.member}
                      </p>
                    </div>

                    <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:flex-col">
                      <Link href="/profile/edit" className="flex-1">
                        <Button className="h-12 w-full rounded-2xl bg-white text-[#11111d] font-bold hover:bg-white/90">
                          <Pencil className="mr-2 h-4 w-4" />
                          {tx.editProfile}
                        </Button>
                      </Link>
                      <Link href="/premium" className="flex-1">
                        <Button className="h-12 w-full rounded-2xl border border-amber-300/25 bg-amber-400/10 font-bold text-amber-200 hover:bg-amber-400/20">
                          <Crown className="mr-2 h-4 w-4" />
                          {tx.premium}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                 {[
  { icon: Heart, label: tx.favorite, value: "—" },
  { icon: Eye, label: tx.visitors, value: "—" },
  { icon: MessageCircle, label: tx.member, value: "—" },
  {
    icon: Images,
    label: tx.photos,
    value: String(sortedPhotos.length),
  },
].map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      className={`${glassCard} group p-4 transition duration-300 hover:-translate-y-1 hover:border-pink-400/25 sm:p-5`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-pink-300/15 bg-pink-500/10 text-pink-300">
                          <Icon className="h-5 w-5" />
                        </div>
                       <span className="text-2xl font-black text-white transition duration-300 group-hover:scale-110 group-hover:text-pink-200">
  {value}
</span>
                      </div>
                      <p className="mt-4 truncate text-xs font-semibold uppercase tracking-[0.12em] text-white/40 sm:text-base">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[330px_minmax(0,1fr)_300px]">
                  <aside className="space-y-6">
                    <div className={`${glassCard} p-4`}>
                      <div className="mb-4 flex items-center justify-between px-1">
                        <h3 className="flex items-center gap-2 font-bold">
                          <Images className="h-5 w-5 text-pink-300" />
                          {tx.photos}
                        </h3>
                        <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-white/45">
                          {sortedPhotos.length}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {(sortedPhotos.length
                          ? sortedPhotos
                          : [{ url: avatar }]
                        )
                          .slice(0, 6)
                          .map((photo, index) => {
                            const src = normalizePhotoUrl(photo.url);
                            return (
                              <button
                                type="button"
                                key={photo.id || index}
                                onClick={() => setSelectedPhoto(src)}
                                className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-black/30 ${index === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"}`}
                              >
                                <img
                                  src={src}
                                  alt=""
                                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />
                              </button>
                            );
                          })}
                      </div>

                      <Link href="/profile/edit">
                        <Button
                          variant="outline"
                          className="mt-4 h-11 w-full rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10"
                        >
                          <Camera className="mr-2 h-4 w-4" />
                          {tx.addPhoto}
                        </Button>
                      </Link>
                    </div>

                    <div className={`${glassCard} grid grid-cols-2 gap-3 p-4`}>
                      <button className="flex items-center justify-center gap-2 rounded-2xl border border-pink-400/25 bg-pink-500/10 py-3 text-base font-bold text-pink-200 transition hover:bg-pink-500/20">
                        <Heart className="h-4 w-4" />
                        {tx.wink}
                      </button>
                      <button className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-3 text-base font-bold text-white/75 transition hover:bg-white/10">
                        <Star className="h-4 w-4" />
                        {tx.favorite}
                      </button>
                    </div>
                  </aside>

                  <main className="min-w-0 space-y-6">
                    <div className={`${glassCard} overflow-hidden p-4 sm:p-6`}>
                      <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500/25 to-violet-500/20 text-pink-200">
                          <Sparkles className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-bold">EgeMatch AI</h3>
                          <p className="text-xs text-white/40">
                            EGELOVE intelligent compatibility
                          </p>
                        </div>
                      </div>
                      <EgeMatchAICard
                        key={egematch?.score ?? 87}
                        score={egematch?.score ?? 87}
                        energy={egematch?.energy ?? 92}
                        interest={egematch?.interest ?? 84}
                        love={egematch?.love ?? 89}
                        label={egematch?.label}
                        summary={egematch?.summary}
                        name={fullName}
                      />
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                      <div className={`${glassCard} p-5 sm:p-7`}>
                        <h3 className="mb-5 text-lg font-black">{tx.about}</h3>
                        <p className="whitespace-pre-line text-base leading-8 text-white/68 sm:text-base">
                          {user.aboutMe || user.bio || "-"}
                        </p>
                      </div>

                      <div className={`${glassCard} p-5 sm:p-7`}>
                        <h3 className="mb-5 text-lg font-black">
                          {tx.lookingFor}
                        </h3>
                        <p className="whitespace-pre-line text-base leading-8 text-white/68 sm:text-base">
                          {user.lookingFor || "-"}
                        </p>
                      </div>
                    </div>

                    <div className={`${glassCard} p-5 sm:p-7`}>
                      <h3 className="mb-5 text-lg font-black">{tx.info}</h3>
                      <div className="grid gap-x-8 md:grid-cols-2">
                        <div>
                          <InfoRow label={tx.age} value={age} />
                          <InfoRow label={tx.city} value={cityName} />
                          <InfoRow label={tx.district} value={districtName} />
                          <InfoRow
                            label={tx.occupation}
                            value={trOpt(user.occupation)}
                          />
                          <InfoRow
                            label={tx.education}
                            value={trOpt(user.education)}
                          />
                          <InfoRow
                            label={tx.income}
                            value={trOpt(user.income)}
                          />
                          <InfoRow
                            label={tx.maritalStatus}
                            value={trOpt(user.maritalStatus)}
                          />
                        </div>
                        <div>
                          <InfoRow
                            label={tx.children}
                            value={trOpt(user.children)}
                          />
                          <InfoRow
                            label={tx.height}
                            value={user.height ? `${user.height} cm` : "-"}
                          />
                          <InfoRow
                            label={tx.weight}
                            value={user.weight ? `${user.weight} kg` : "-"}
                          />
                          <InfoRow
                            label={tx.eyeColor}
                            value={trOpt(user.eyeColor)}
                          />
                          <InfoRow
                            label={tx.hairColor}
                            value={trOpt(user.hairColor)}
                          />
                          <InfoRow
                            label={tx.hobbies}
                            value={toText(user.hobbies)}
                          />
                          <InfoRow
                            label={tx.languages}
                            value={toText(user.languages)}
                          />
                        </div>
                      </div>
                    </div>
                  </main>

                  <aside className="space-y-6">
                    <div className={`${glassCard} p-5`}>
                      <h3 className="mb-4 flex items-center gap-2 text-lg font-black">
                        <Eye className="h-5 w-5 text-pink-300" />
                        {tx.visitors}
                      </h3>
                      <div className="space-y-3">
                        {[1, 2, 3, 4].map((item) => (
                          <div
                            key={item}
                            className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.035] p-3 transition hover:bg-white/[0.07]"
                          >
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500/30 to-violet-500/20">
                              <UserCircle className="h-6 w-6 text-white/55" />
                            </div>
                            <div className="min-w-0">
                              <div className="truncate text-base font-bold">
                                {tx.member}
                              </div>
                              <div className="truncate text-xs text-white/40">
                                {tx.visitedProfile}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="relative overflow-hidden rounded-[28px] border border-amber-300/20 bg-gradient-to-br from-amber-400/15 via-orange-400/8 to-pink-500/10 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
                      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-300/20 blur-3xl" />
                      <div className="relative">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-200/20 bg-amber-300/15 text-amber-200">
                          <Crown className="h-6 w-6" />
                        </div>
                        <h3 className="mb-2 text-xl font-black text-amber-100">
                          {tx.premium}
                        </h3>
                        <p className="mb-5 text-base leading-6 text-white/60">
                          {tx.premiumDescription}
                        </p>
                        <Link href="/premium">
                          <Button className="h-11 w-full rounded-2xl bg-gradient-to-r from-amber-300 to-orange-400 font-black text-[#211300] hover:from-amber-200 hover:to-orange-300">
                            <Crown className="mr-2 h-4 w-4" />
                            {tx.premium}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </aside>
                </div>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            type="button"
            aria-label="Close"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-2xl font-bold text-white transition hover:bg-white/20"
            onClick={() => setSelectedPhoto(null)}
          >
            ×
          </button>
          <img
            src={selectedPhoto}
            alt=""
            className="max-h-[88vh] max-w-[94vw] rounded-3xl object-contain shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}

      <AuthDialog activeTab={authTab} onClose={() => setAuthTab(null)} />
    </div>
  );
}