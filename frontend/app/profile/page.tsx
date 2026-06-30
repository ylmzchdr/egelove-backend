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
    previewDesc: "Profilinin diğer kullanıcılara nasıl göründüğünü buradan kontrol et.",
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
premiumDescription: "Profil ziyaretlerini, favorileri ve daha fazlasını öne çıkar.",
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
premiumDescription: "Выделите посещения профиля, избранное и многое другое.",
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

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 py-3">
      <span className="text-sm text-white/55">{label}</span>
      <span className="text-sm font-semibold text-white text-right">{value || "-"}</span>
    </div>
  );
}

export default function ProfilePage() {
  const { lang } = useI18n();

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
  process.env.NEXT_PUBLIC_API_URL ||
  "https://egelove-backend.onrender.com";

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

  return (
    optionMap[currentLang]?.[key] ||
    value
  );
}
  return (
    <div className="min-h-screen bg-[#160012] text-white" dir={isRtl ? "rtl" : "ltr"}>
      <Header
        onOpenLogin={() => setAuthTab("login")}
        onOpenRegister={() => setAuthTab("register")}
      />

      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-3 sm:px-4">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">{tx.myProfile}</h1>
              <p className="mt-2 text-white/60">{tx.previewDesc}</p>
            </div>

            <Link href="/profile/edit" className="w-full sm:w-auto">
              <Button className="w-full bg-pink-600 hover:bg-pink-700 sm:w-auto">
                <Pencil className="mr-2 h-4 w-4" />
                {tx.editProfile}
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-pink-400" />
            </div>
          ) : !user ? (
            
            <div className="rounded-3xl border border-white/10 bg-white/5 py-20 text-center">
              <UserCircle className="mx-auto mb-4 h-20 w-20 text-white/40" />
              <p className="mb-4 text-white/60">{tx.mustLogin}</p>
            
              <Button
                onClick={() => setAuthTab("login")}
                className="bg-pink-600 hover:bg-pink-700"
              >
                {tx.login}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr_300px]">
              <aside className="space-y-5">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl">
                  <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-black/30">
                    <img
                      src={avatar}
                      alt={fullName}
                      className="h-full w-full object-cover"
                    />
                    {sortedPhotos.length > 1 && (
  <div className="mt-3 grid grid-cols-4 gap-2">
    {sortedPhotos.map((photo) => (
      <button
        key={photo.id}
        type="button"
        onClick={() =>
          window.open(normalizePhotoUrl(photo.url), "_blank")
        }
        className="aspect-square overflow-hidden rounded-xl border border-white/10"
      >
        <img
          src={normalizePhotoUrl(photo.url)}
          alt=""
          className="h-full w-full object-cover"
        />
      </button>
    ))}
  </div>
)}
                  </div>
            

                <div className="mt-3 grid grid-cols-4 gap-2">
  {(sortedPhotos.length ? sortedPhotos : [{ url: avatar }])
    .slice(0, 4)
    .map((photo, index) => {
      const src = normalizePhotoUrl(photo.url);

      return (
        <button
          type="button"
          key={photo.id || index}
          onClick={() => setSelectedPhoto(src)}
          className="aspect-square cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-black/30 transition hover:scale-105 hover:border-pink-400"
        >
          <img src={src} alt="" className="h-full w-full object-cover" />
        </button>
      );
    })}
</div>

                  <Link href="/profile/edit">
                    <Button
                      variant="outline"
                      className="mt-4 w-full border-white/20 bg-white/5 text-white hover:bg-white/10"
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      {tx.addPhoto}
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-3 rounded-3xl border border-white/10 bg-white/5 p-5">
                  <button className="flex items-center justify-center gap-2 rounded-2xl border border-pink-400/40 py-3 text-pink-300">
                    <Heart className="h-4 w-4" />
                    {tx.wink}
                  </button>
                  <button className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 py-3 text-white/80">
                    <Star className="h-4 w-4" />
                    {tx.favorite}
                  </button>
                </div>
              </aside>

              <main className="space-y-6">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-7">
                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-3xl font-bold">{fullName}</h2>
                        {user.isVerified && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-300">
                            <ShieldCheck className="h-4 w-4" />
                            {tx.verified}
                          </span>
                        )}
                      </div>

                      <div className="mt-3 flex flex-wrap gap-3 text-sm text-white/60">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {age ?? "-"}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {districtName || "-"}, {cityName || "-"}
                        </span>
                        <span className="text-emerald-300">● {tx.online}</span>
                      </div>
                    </div>

                    <Link href="/profile/edit">
                      <Button className="bg-pink-600 hover:bg-pink-700">
                        <Pencil className="mr-2 h-4 w-4" />
                        {tx.editProfile}
                      </Button>
                    </Link>
                  </div>
                </div>
              

               <div className="mb-6">
                <p className="text-red-500 text-3xl font-bold">
  SCORE = {egematch?.score}
</p>
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
                <div className="grid gap-6 xl:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-7">
                    <h3 className="mb-5 text-lg font-bold">{tx.info}</h3>
                  
                    <InfoRow label={tx.age} value={age} />
                    <InfoRow label={tx.city} value={cityName} />
                    <InfoRow label={tx.district} value={districtName} />
                   <InfoRow label={tx.occupation} value={trOpt(user.occupation)} />
                   <InfoRow label={tx.education} value={trOpt(user.education)} />
<InfoRow label={tx.income} value={trOpt(user.income)} />
<InfoRow label={tx.maritalStatus} value={trOpt(user.maritalStatus)} />
<InfoRow label={tx.children} value={trOpt(user.children)} />
<InfoRow label={tx.height} value={user.height ? `${user.height} cm` : "-"} />
<InfoRow label={tx.weight} value={user.weight ? `${user.weight} kg` : "-"} />
<InfoRow label={tx.eyeColor} value={trOpt(user.eyeColor)} />
<InfoRow label={tx.hairColor} value={trOpt(user.hairColor)} />
                    <InfoRow label={tx.hobbies} value={toText(user.hobbies)} />
                    <InfoRow label={tx.languages} value={toText(user.languages)} />
                  </div>

                  <div className="space-y-6">
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-7">
                      <h3 className="mb-4 text-lg font-bold">{tx.about}</h3>
                      <p className="leading-8 text-white/80">
                        {user.aboutMe || user.bio || "-"}
                      </p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-7">
                      <h3 className="mb-4 text-lg font-bold">{tx.lookingFor}</h3>
                      <p className="leading-8 text-white/80">
                        {user.lookingFor || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </main>

              <aside className="space-y-5">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
                    <Eye className="h-5 w-5 text-pink-300" />
                    {tx.visitors}
                  </h3>

                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-3 rounded-2xl bg-white/5 p-3"
                      >
                        <div className="h-10 w-10 rounded-full bg-pink-500/30" />
                        <div>
                          <div className="text-sm font-semibold">{tx.member}</div>
<div className="text-xs text-white/45">{tx.visitedProfile}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

               <div className="rounded-3xl border border-pink-400/20 bg-pink-600/15 p-5">
  <h3 className="mb-2 text-lg font-bold">{tx.premium}</h3>

  <p className="mb-4 text-sm text-white/65">
    {tx.premiumDescription}
  </p>

  <Link href="/premium">
    <Button className="w-full bg-pink-600 hover:bg-pink-700">
      {tx.premium}
    </Button>
  </Link>
</div>
              </aside>
            </div>
          )}
        </div>
      </section>

      <Footer />
      {selectedPhoto && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
    onClick={() => setSelectedPhoto(null)}
  >
    <button
      type="button"
      className="absolute right-5 top-5 text-3xl font-bold text-white"
      onClick={() => setSelectedPhoto(null)}
    >
      ×
    </button>

    <img
      src={selectedPhoto}
      alt=""
      className="max-h-[85vh] max-w-[92vw] rounded-2xl object-contain shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    />
  </div>
)}

<AuthDialog activeTab={authTab} onClose={() => setAuthTab(null)} />
</div>
);
}