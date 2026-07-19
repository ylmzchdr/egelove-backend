"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  Loader2,
  Save,
  Sparkles,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthDialog from "@/components/AuthDialog";
import ProfilePhotoUpload from "@/components/ProfilePhotoUpload";
import { api } from "@/lib/api";
import { useI18n } from "@/lib/i18n-context";

type LangKey = "TR" | "EN" | "RU" | "AR";
type AuthTab = "login" | "register" | null;

type Option = {
  value: string;
  labels: Record<LangKey, string>;
};

const TEXT = {
  TR: {
    loading: "Profilin hazırlanıyor...",
    badge: "EGELOVE PROFİL V2",
    title: "Profilini Düzenle",
    subtitle:
      "Profil bilgilerini güncel tutarak daha güvenilir ve doğru eşleşmeler elde et.",
    back: "Profile Dön",
    viewProfile: "Profili Görüntüle",
    completion: "Profil Tamamlama",
    completionDesc: "Dolu alanlara göre otomatik hesaplanır.",
    photos: "Fotoğraflar",
    photosDesc:
      "Net ve güncel fotoğraflar profilinin daha fazla ilgi görmesine yardımcı olur.",
    basicInfo: "Temel Bilgiler",
    basicInfoDesc: "Seni tanımak için gerekli temel profil bilgileri.",
    details: "Detaylı Bilgiler",
    detailsDesc: "Eşleşme kalitesini artıran ek bilgiler.",
    about: "Hakkımda",
    aboutDesc: "Kendini ve aradığın kişiyi doğal bir dille anlat.",
    name: "Ad",
    surname: "Soyad",
    gender: "Cinsiyet",
    phone: "Telefon",
    birthDate: "Doğum Tarihi",
    city: "İl",
    district: "İlçe",
    height: "Boy (cm)",
    weight: "Kilo (kg)",
    education: "Eğitim",
    occupation: "Meslek",
    income: "Gelir",
    maritalStatus: "Medeni Durum",
    children: "Çocuk",
    smoking: "Sigara",
    alcohol: "Alkol",
    religion: "Din",
    bodyType: "Vücut Tipi",
    hairColor: "Saç Rengi",
    eyeColor: "Göz Rengi",
    bloodType: "Kan Grubu",
    hobbies: "Hobiler",
    hobbiesHint: "Hobileri virgülle ayır.",
    hobbiesPlaceholder: "Yüzme, kitap okuma, seyahat",
    aboutPlaceholder: "Kendinden bahset...",
    lookingFor: "Aradığın özellikler",
    lookingForPlaceholder: "Partnerinde aradığın özellikleri anlat...",
    select: "Seçin",
    selectCityFirst: "Önce il seçin",
    save: "Profili Kaydet",
    saving: "Kaydediliyor...",
    saved: "Profil başarıyla güncellendi!",
    loadError: "Profil yüklenemedi.",
    saveError: "Kaydedilirken bir hata oluştu.",
    recommendation: "Profilini güçlendir",
    recommendationDesc:
      "Fotoğraf, hakkında yazısı ve temel bilgileri tamamlamak görünürlüğünü artırır.",
    secure: "Bilgilerin güvenle saklanır.",
  },
  EN: {
    loading: "Preparing your profile...",
    badge: "EGELOVE PROFILE V2",
    title: "Edit Your Profile",
    subtitle:
      "Keep your profile up to date to receive more accurate and trustworthy matches.",
    back: "Back to Profile",
    viewProfile: "View Profile",
    completion: "Profile Completion",
    completionDesc: "Calculated automatically from completed fields.",
    photos: "Photos",
    photosDesc:
      "Clear and recent photos help your profile receive more attention.",
    basicInfo: "Basic Information",
    basicInfoDesc: "Essential profile details that help members know you.",
    details: "Detailed Information",
    detailsDesc: "Additional information that improves match quality.",
    about: "About Me",
    aboutDesc: "Describe yourself and the person you are looking for naturally.",
    name: "First Name",
    surname: "Last Name",
    gender: "Gender",
    phone: "Phone",
    birthDate: "Date of Birth",
    city: "Province",
    district: "District",
    height: "Height (cm)",
    weight: "Weight (kg)",
    education: "Education",
    occupation: "Occupation",
    income: "Income",
    maritalStatus: "Marital Status",
    children: "Children",
    smoking: "Smoking",
    alcohol: "Alcohol",
    religion: "Religion",
    bodyType: "Body Type",
    hairColor: "Hair Color",
    eyeColor: "Eye Color",
    bloodType: "Blood Type",
    hobbies: "Interests",
    hobbiesHint: "Separate interests with commas.",
    hobbiesPlaceholder: "Swimming, reading, travelling",
    aboutPlaceholder: "Tell us about yourself...",
    lookingFor: "What You Are Looking For",
    lookingForPlaceholder: "Describe the qualities you seek in a partner...",
    select: "Select",
    selectCityFirst: "Select a province first",
    save: "Save Profile",
    saving: "Saving...",
    saved: "Your profile has been updated successfully!",
    loadError: "Your profile could not be loaded.",
    saveError: "An error occurred while saving.",
    recommendation: "Strengthen your profile",
    recommendationDesc:
      "Adding photos, an about section and basic details improves your visibility.",
    secure: "Your information is stored securely.",
  },
  RU: {
    loading: "Подготовка профиля...",
    badge: "ПРОФИЛЬ EGELOVE V2",
    title: "Редактировать профиль",
    subtitle:
      "Поддерживайте профиль в актуальном состоянии для более точных и надёжных совпадений.",
    back: "Назад к профилю",
    viewProfile: "Посмотреть профиль",
    completion: "Заполнение профиля",
    completionDesc: "Рассчитывается автоматически по заполненным полям.",
    photos: "Фотографии",
    photosDesc:
      "Чёткие и актуальные фотографии помогают привлечь больше внимания.",
    basicInfo: "Основная информация",
    basicInfoDesc: "Основные данные, которые помогают другим узнать вас.",
    details: "Подробная информация",
    detailsDesc: "Дополнительные сведения для более качественных совпадений.",
    about: "О себе",
    aboutDesc: "Расскажите о себе и о человеке, которого вы ищете.",
    name: "Имя",
    surname: "Фамилия",
    gender: "Пол",
    phone: "Телефон",
    birthDate: "Дата рождения",
    city: "Область",
    district: "Район",
    height: "Рост (см)",
    weight: "Вес (кг)",
    education: "Образование",
    occupation: "Профессия",
    income: "Доход",
    maritalStatus: "Семейное положение",
    children: "Дети",
    smoking: "Курение",
    alcohol: "Алкоголь",
    religion: "Религия",
    bodyType: "Телосложение",
    hairColor: "Цвет волос",
    eyeColor: "Цвет глаз",
    bloodType: "Группа крови",
    hobbies: "Интересы",
    hobbiesHint: "Разделяйте интересы запятыми.",
    hobbiesPlaceholder: "Плавание, чтение, путешествия",
    aboutPlaceholder: "Расскажите о себе...",
    lookingFor: "Кого вы ищете",
    lookingForPlaceholder: "Опишите качества желаемого партнёра...",
    select: "Выберите",
    selectCityFirst: "Сначала выберите область",
    save: "Сохранить профиль",
    saving: "Сохранение...",
    saved: "Профиль успешно обновлён!",
    loadError: "Не удалось загрузить профиль.",
    saveError: "Произошла ошибка при сохранении.",
    recommendation: "Улучшите свой профиль",
    recommendationDesc:
      "Фотографии, описание и основные данные повышают видимость профиля.",
    secure: "Ваши данные хранятся безопасно.",
  },
  AR: {
    loading: "جارٍ تجهيز ملفك الشخصي...",
    badge: "ملف EGELOVE V2",
    title: "تعديل الملف الشخصي",
    subtitle:
      "حافظ على تحديث ملفك للحصول على اقتراحات أكثر دقة وموثوقية.",
    back: "العودة إلى الملف",
    viewProfile: "عرض الملف الشخصي",
    completion: "اكتمال الملف الشخصي",
    completionDesc: "يتم حسابه تلقائياً حسب الحقول المكتملة.",
    photos: "الصور",
    photosDesc:
      "الصور الواضحة والحديثة تساعد ملفك في الحصول على اهتمام أكبر.",
    basicInfo: "المعلومات الأساسية",
    basicInfoDesc: "المعلومات الأساسية التي تساعد الأعضاء على التعرف إليك.",
    details: "المعلومات التفصيلية",
    detailsDesc: "معلومات إضافية تساعد على تحسين جودة التوافق.",
    about: "نبذة عني",
    aboutDesc: "عرّف بنفسك وبالشخص الذي تبحث عنه بأسلوب طبيعي.",
    name: "الاسم",
    surname: "اسم العائلة",
    gender: "الجنس",
    phone: "الهاتف",
    birthDate: "تاريخ الميلاد",
    city: "المحافظة",
    district: "المنطقة",
    height: "الطول (سم)",
    weight: "الوزن (كغ)",
    education: "التعليم",
    occupation: "المهنة",
    income: "الدخل",
    maritalStatus: "الحالة الاجتماعية",
    children: "الأطفال",
    smoking: "التدخين",
    alcohol: "الكحول",
    religion: "التدين",
    bodyType: "نوع الجسم",
    hairColor: "لون الشعر",
    eyeColor: "لون العينين",
    bloodType: "فصيلة الدم",
    hobbies: "الاهتمامات",
    hobbiesHint: "افصل الاهتمامات بفواصل.",
    hobbiesPlaceholder: "السباحة، القراءة، السفر",
    aboutPlaceholder: "تحدث عن نفسك...",
    lookingFor: "الصفات التي تبحث عنها",
    lookingForPlaceholder: "صف الصفات التي تبحث عنها في شريكك...",
    select: "اختر",
    selectCityFirst: "اختر المحافظة أولاً",
    save: "حفظ الملف الشخصي",
    saving: "جارٍ الحفظ...",
    saved: "تم تحديث ملفك الشخصي بنجاح!",
    loadError: "تعذر تحميل الملف الشخصي.",
    saveError: "حدث خطأ أثناء الحفظ.",
    recommendation: "عزّز ملفك الشخصي",
    recommendationDesc:
      "إضافة الصور والنبذة والمعلومات الأساسية تزيد من ظهور ملفك.",
    secure: "يتم حفظ معلوماتك بأمان.",
  },
} as const;

const OPTIONS = {
  education: [
    option("PRIMARY", "İlkokul", "Primary School", "Начальная школа", "الابتدائية"),
    option("HIGH_SCHOOL", "Lise", "High School", "Средняя школа", "الثانوية"),
    option("ASSOCIATE", "Ön Lisans", "Associate Degree", "Колледж", "دبلوم"),
    option("BACHELOR", "Lisans", "Bachelor's Degree", "Бакалавриат", "بكالوريوس"),
    option("MASTER", "Yüksek Lisans", "Master's Degree", "Магистратура", "ماجستير"),
    option("DOCTORATE", "Doktora", "Doctorate", "Докторантура", "دكتوراه"),
  ],
  income: [
    option("VERY_LOW", "Düşük", "Low", "Низкий", "منخفض"),
    option("LOW", "Orta-alt", "Lower middle", "Ниже среднего", "أقل من المتوسط"),
    option("MEDIUM", "Orta", "Middle", "Средний", "متوسط"),
    option("HIGH", "Yüksek", "High", "Высокий", "مرتفع"),
    option("VERY_HIGH", "Çok yüksek", "Very high", "Очень высокий", "مرتفع جداً"),
  ],
  marital: [
    option("NEVER_MARRIED", "Bekar", "Never married", "Не состоял(а) в браке", "أعزب"),
    option("DIVORCED", "Boşanmış", "Divorced", "В разводе", "مطلق"),
    option("WIDOWED", "Eşi vefat etmiş", "Widowed", "Вдовец / вдова", "أرمل"),
    option("SEPARATED", "Ayrı yaşıyor", "Separated", "Живёт отдельно", "منفصل"),
  ],
  children: [
    option("NONE", "Yok", "None", "Нет", "لا يوجد"),
    option("HAS_LIVING_WITH", "Var, benimle yaşıyor", "Yes, living with me", "Есть, живут со мной", "يوجد ويعيشون معي"),
    option("HAS_NOT_LIVING", "Var, benimle yaşamıyor", "Yes, not living with me", "Есть, живут отдельно", "يوجد ولا يعيشون معي"),
  ],
  smoking: [
    option("NEVER", "İçmiyorum", "Never", "Не курю", "لا أدخن"),
    option("QUIT", "Bıraktım", "Quit", "Бросил(а)", "أقلعت"),
    option("OCCASIONAL", "Ara sıra", "Occasionally", "Иногда", "أحياناً"),
    option("REGULAR", "Düzenli", "Regularly", "Регулярно", "بانتظام"),
  ],
  alcohol: [
    option("NEVER", "Kullanmıyorum", "Never", "Не употребляю", "لا أستخدم"),
    option("QUIT", "Bıraktım", "Quit", "Перестал(а)", "أقلعت"),
    option("OCCASIONAL", "Sosyal", "Socially", "Иногда", "اجتماعياً"),
    option("REGULAR", "Düzenli", "Regularly", "Регулярно", "بانتظام"),
  ],
  religion: [
    option("VERY_RELIGIOUS", "Çok dindar", "Very religious", "Очень религиозный", "متدين جداً"),
    option("RELIGIOUS", "Dindar", "Religious", "Религиозный", "متدين"),
    option("MODERATE", "Orta", "Moderate", "Умеренный", "معتدل"),
    option("NOT_RELIGIOUS", "Dindar değil", "Not religious", "Нерелигиозный", "غير متدين"),
    option("ATHEIST", "Ateist", "Atheist", "Атеист", "ملحد"),
  ],
  bodyType: [
    option("SLIM", "Zayıf", "Slim", "Стройное", "نحيف"),
    option("ATHLETIC", "Atletik", "Athletic", "Спортивное", "رياضي"),
    option("NORMAL", "Normal", "Average", "Среднее", "عادي"),
    option("CURVY", "Dolgun", "Curvy", "Пышное", "ممتلئ"),
    option("PLUS", "Kilolu", "Plus size", "Полное", "وزن زائد"),
  ],
  hairColor: [
    option("BLACK", "Siyah", "Black", "Чёрный", "أسود"),
    option("BROWN", "Kahverengi", "Brown", "Каштановый", "بني"),
    option("BLOND", "Sarı", "Blond", "Светлый", "أشقر"),
    option("RED", "Kızıl", "Red", "Рыжий", "أحمر"),
    option("WHITE", "Beyaz", "White / Grey", "Седой", "أبيض"),
    option("BALD", "Kel", "Bald", "Лысый", "أصلع"),
    option("OTHER", "Diğer", "Other", "Другой", "آخر"),
  ],
  eyeColor: [
    option("BROWN", "Kahverengi", "Brown", "Карие", "بني"),
    option("BLUE", "Mavi", "Blue", "Голубые", "أزرق"),
    option("GREEN", "Yeşil", "Green", "Зелёные", "أخضر"),
    option("HAZEL", "Ela", "Hazel", "Ореховые", "عسلي"),
    option("BLACK", "Siyah", "Black", "Чёрные", "أسود"),
    option("OTHER", "Diğer", "Other", "Другие", "آخر"),
  ],
  bloodType: [
    option("A_POSITIVE", "A+", "A+", "A+", "A+"),
    option("A_NEGATIVE", "A-", "A-", "A-", "A-"),
    option("B_POSITIVE", "B+", "B+", "B+", "B+"),
    option("B_NEGATIVE", "B-", "B-", "B-", "B-"),
    option("AB_POSITIVE", "AB+", "AB+", "AB+", "AB+"),
    option("AB_NEGATIVE", "AB-", "AB-", "AB-", "AB-"),
    option("ZERO_POSITIVE", "0+", "O+", "O+", "O+"),
    option("ZERO_NEGATIVE", "0-", "O-", "O-", "O-"),
  ],
  gender: [
    option("MALE", "Erkek", "Man", "Мужчина", "رجل"),
    option("FEMALE", "Kadın", "Woman", "Женщина", "امرأة"),
    option("OTHER", "Diğer", "Other", "Другое", "آخر"),
  ],
};

function option(
  value: string,
  TR: string,
  EN: string,
  RU: string,
  AR: string,
): Option {
  return { value, labels: { TR, EN, RU, AR } };
}

interface District {
  id: number;
  name: string;
}

interface City {
  id: number;
  name: string;
  districts?: District[];
}
type PhotoItem = {
  id: string;
  url: string;
  status?: string;
  isMain?: boolean;
};
interface ProfileData {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone?: string;
  birthDate: string;
  gender: string;
  cityId: number;
  districtId: number;
  bio?: string;
  aboutMe?: string;
  lookingFor?: string;
  education?: string;
  income?: string;
  religion?: string;
  smoking?: string;
  alcohol?: string;
  children?: string;
  bodyType?: string;
  maritalStatus?: string;
  height?: number;
  weight?: number;
  eyeColor?: string;
  hairColor?: string;
  bloodType?: string;
  occupation?: string;
  hobbies?: string[];
photos?: PhotoItem[];
  privacySettings?: Record<string, boolean>;
  matchingPreferences?: Record<string, unknown>;
}

const EMPTY_PROFILE: ProfileData = {
  id: "",
  name: "",
  surname: "",
  email: "",
  phone: "",
  birthDate: "",
  gender: "",
  cityId: 0,
  districtId: 0,
  bio: "",
  aboutMe: "",
  lookingFor: "",
  education: "",
  income: "",
  religion: "",
  smoking: "",
  alcohol: "",
  children: "",
  bodyType: "",
  maritalStatus: "",
  height: 0,
  weight: 0,
  eyeColor: "",
  hairColor: "",
  bloodType: "",
  occupation: "",
  hobbies: [],
  photos: [],
  privacySettings: {},
  matchingPreferences: {},
};

export default function ProfileEditPage() {
  const { lang } = useI18n();

const normalizedLang = String(lang || "TR").toUpperCase();

const currentLang: LangKey = (
  ["TR", "EN", "RU", "AR"].includes(normalizedLang)
    ? normalizedLang
    : "TR"
) as LangKey;
  const tx = TEXT[currentLang];
  const isRtl = currentLang === "AR";

  const [authTab, setAuthTab] = useState<AuthTab>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [hobbiesInput, setHobbiesInput] = useState("");
  const [form, setForm] = useState<ProfileData>(EMPTY_PROFILE);

  const updateField = <K extends keyof ProfileData>(
    key: K,
    value: ProfileData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setAuthTab("login");
      setLoading(false);
      return;
    }

    Promise.all([
      api.users.me() as Promise<ProfileData>,
      api.cities.list() as Promise<City[]>,
    ])
      .then(([profile, cityList]) => {
        setForm((prev) => ({
          ...prev,
          ...profile,
          birthDate: profile.birthDate?.split("T")[0] || "",
        }));

        setCities(cityList);

        const selectedCity = cityList.find(
          (city) => city.id === profile.cityId,
        );

        if (selectedCity?.districts?.length) {
          setDistricts(selectedCity.districts);
        } else if (profile.cityId) {
          api.cities
            .districts(profile.cityId)
            .then(setDistricts)
            .catch(() => setDistricts([]));
        }

        setHobbiesInput(
          Array.isArray(profile.hobbies)
            ? profile.hobbies.join(", ")
            : "",
        );
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : tx.loadError;
        setError(message || tx.loadError);
      })
      .finally(() => setLoading(false));
  }, [tx.loadError]);

  const handleCityChange = useCallback(
    (cityIdValue: string) => {
      const cityId = Number.parseInt(cityIdValue, 10);

      setForm((prev) => ({
        ...prev,
        cityId,
        districtId: 0,
      }));

      const selectedCity = cities.find((city) => city.id === cityId);

      if (selectedCity?.districts?.length) {
        setDistricts(selectedCity.districts);
        return;
      }

      setDistricts([]);

      if (cityId) {
        api.cities
          .districts(cityId)
          .then(setDistricts)
          .catch(() => setDistricts([]));
      }
    },
    [cities],
  );

  const completion = useMemo(() => {
    const checks = [
      Boolean(form.name?.trim()),
      Boolean(form.birthDate),
      Boolean(form.gender),
      Boolean(form.cityId),
      Boolean(form.districtId),
      Boolean(form.education),
      Boolean(form.occupation?.trim()),
      Boolean(form.aboutMe?.trim()),
      Boolean(form.lookingFor?.trim()),
      Boolean(hobbiesInput.trim()),
      Boolean(form.photos?.length),
    ];

    return Math.round(
      (checks.filter(Boolean).length / checks.length) * 100,
    );
  }, [form, hobbiesInput]);

  const handleSubmit = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload: Record<string, unknown> = {
        name: form.name,
        surname: form.surname,
        phone: form.phone || undefined,
        birthDate: form.birthDate || undefined,
        gender: form.gender || undefined,
        cityId: form.cityId || undefined,
        districtId: form.districtId || undefined,
        bio: form.bio || undefined,
        aboutMe: form.aboutMe || undefined,
        lookingFor: form.lookingFor || undefined,
        education: form.education || undefined,
        income: form.income || undefined,
        religion: form.religion || undefined,
        smoking: form.smoking || undefined,
        alcohol: form.alcohol || undefined,
        children: form.children || undefined,
        bodyType: form.bodyType || undefined,
        maritalStatus: form.maritalStatus || undefined,
        height: form.height || undefined,
        weight: form.weight || undefined,
        eyeColor: form.eyeColor || undefined,
        hairColor: form.hairColor || undefined,
        bloodType: form.bloodType || undefined,
        occupation: form.occupation || undefined,
        hobbies: hobbiesInput
          .split(",")
          .map((hobby) => hobby.trim())
          .filter(Boolean),
      };

      Object.keys(payload).forEach((key) => {
        const value = payload[key];

        if (
          value === undefined ||
          value === null ||
          value === "" ||
          value === 0 ||
          (Array.isArray(value) && value.length === 0)
        ) {
          delete payload[key];
        }
      });

      await api.users.update(payload);
      setSuccess(tx.saved);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      console.error("PROFILE UPDATE ERROR:", err);
      const message = err instanceof Error ? err.message : tx.saveError;
      setError(message || tx.saveError);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-[#090914] text-white"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-pink-400" />
          <p className="text-sm text-white/60">{tx.loading}</p>
        </div>
      </div>
    );
  }

  const glassCard =
    "rounded-[28px] border border-white/10 bg-white/[0.055] shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-2xl";
  const fieldClass =
    "h-12 rounded-2xl border-white/10 bg-black/20 text-white placeholder:text-white/30 focus-visible:ring-pink-500";
  const textareaClass =
    "min-h-[130px] w-full resize-y rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-pink-400/50 focus:ring-2 focus:ring-pink-500/20";

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#090914] text-white"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-24 top-20 h-80 w-80 rounded-full bg-fuchsia-600/20 blur-[110px]" />
        <div className="absolute right-[-120px] top-[28%] h-96 w-96 rounded-full bg-violet-600/15 blur-[130px]" />
        <div className="absolute bottom-[-160px] left-[35%] h-[420px] w-[420px] rounded-full bg-pink-500/10 blur-[150px]" />
      </div>

      <div className="relative z-10">
        <Header
          onOpenLogin={() => setAuthTab("login")}
          onOpenRegister={() => setAuthTab("register")}
        />

        <main className="pb-32 pt-8 sm:pt-12">
          <div className="mx-auto max-w-[1380px] px-3 sm:px-5 lg:px-8">
            <section
              className={`${glassCard} relative overflow-hidden p-5 sm:p-7 lg:p-9`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 via-transparent to-violet-600/15" />

              <div className="relative flex flex-col gap-7 xl:flex-row xl:items-center xl:justify-between">
                <div className="max-w-3xl">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-pink-400/20 bg-pink-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-pink-200">
                    <Sparkles className="h-3.5 w-3.5" />
                    {tx.badge}
                  </div>

                  <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                    {tx.title}
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
                    {tx.subtitle}
                  </p>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/profile"
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-bold text-white/80 transition hover:bg-white/10"
                    >
                      <ArrowLeft
                        className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`}
                      />
                      {tx.back}
                    </Link>

                    <Link
                      href="/profile"
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-black text-fuchsia-700 transition hover:bg-pink-50"
                    >
                      <Eye className="h-4 w-4" />
                      {tx.viewProfile}
                    </Link>
                  </div>
                </div>

                <div className="w-full max-w-sm rounded-[26px] border border-white/10 bg-black/20 p-5 backdrop-blur-xl">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold">{tx.completion}</p>
                      <p className="mt-1 text-xs leading-5 text-white/45">
                        {tx.completionDesc}
                      </p>
                    </div>
                    <span className="text-3xl font-black text-pink-300">
                      %{completion}
                    </span>
                  </div>

                  <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 transition-all duration-500"
                      style={{ width: `${completion}%` }}
                    />
                  </div>
                </div>
              </div>
            </section>

            {error && (
              <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                {success}
              </div>
            )}

            <div className="mt-7 grid gap-7 xl:grid-cols-[minmax(0,1fr)_330px]">
              <div className="space-y-7">
                <SectionCard
                  title={tx.photos}
                  description={tx.photosDesc}
                  className={glassCard}
                >
                  <ProfilePhotoUpload
                    initialPhotos={form.photos || []}
                    isOwner
                  />
                </SectionCard>

                <SectionCard
                  title={tx.basicInfo}
                  description={tx.basicInfoDesc}
                  className={glassCard}
                >
                  <div className="grid gap-5 md:grid-cols-2">
                    <Field label={tx.name}>
                      <Input
                        className={fieldClass}
                        value={form.name}
                        onChange={(event) =>
                          updateField("name", event.target.value)
                        }
                      />
                    </Field>

                    <Field label={tx.surname}>
                      <Input
                        className={fieldClass}
                        value={form.surname}
                        onChange={(event) =>
                          updateField("surname", event.target.value)
                        }
                      />
                    </Field>

                    <Field label={tx.gender}>
                      <LocalizedSelect
                        value={form.gender}
                        options={OPTIONS.gender}
                        lang={currentLang}
                        placeholder={tx.select}
                        className={fieldClass}
                        onChange={(value) => updateField("gender", value)}
                      />
                    </Field>

                    <Field label={tx.phone}>
                      <Input
                        className={fieldClass}
                        value={form.phone || ""}
                        onChange={(event) =>
                          updateField("phone", event.target.value)
                        }
                      />
                    </Field>

                    <Field label={tx.birthDate}>
                      <Input
                        type="date"
                        className={fieldClass}
                        value={form.birthDate}
                        onChange={(event) =>
                          updateField("birthDate", event.target.value)
                        }
                      />
                    </Field>

                    <Field label={tx.city}>
                      <Select
                        value={form.cityId ? String(form.cityId) : ""}
                        onValueChange={handleCityChange}
                      >
                        <SelectTrigger className={fieldClass}>
                          <SelectValue placeholder={tx.select} />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem
                              key={city.id}
                              value={String(city.id)}
                            >
                              {city.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>

                    <Field label={tx.district}>
                      <Select
                        value={
                          form.districtId ? String(form.districtId) : ""
                        }
                        onValueChange={(value) =>
                          updateField(
                            "districtId",
                            Number.parseInt(value, 10),
                          )
                        }
                      >
                        <SelectTrigger className={fieldClass}>
                          <SelectValue
                            placeholder={
                              form.cityId ? tx.select : tx.selectCityFirst
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {districts.map((district) => (
                            <SelectItem
                              key={district.id}
                              value={String(district.id)}
                            >
                              {district.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>

                    <Field label={tx.height}>
                      <Input
                        type="number"
                        className={fieldClass}
                        value={form.height || ""}
                        onChange={(event) =>
                          updateField(
                            "height",
                            event.target.value
                              ? Number.parseInt(event.target.value, 10)
                              : 0,
                          )
                        }
                      />
                    </Field>

                    <Field label={tx.weight}>
                      <Input
                        type="number"
                        className={fieldClass}
                        value={form.weight || ""}
                        onChange={(event) =>
                          updateField(
                            "weight",
                            event.target.value
                              ? Number.parseInt(event.target.value, 10)
                              : 0,
                          )
                        }
                      />
                    </Field>
                  </div>
                </SectionCard>

                <SectionCard
                  title={tx.details}
                  description={tx.detailsDesc}
                  className={glassCard}
                >
                  <div className="grid gap-5 md:grid-cols-2">
                    <SelectField
                      label={tx.education}
                      field="education"
                      value={form.education || ""}
                      options={OPTIONS.education}
                      lang={currentLang}
                      placeholder={tx.select}
                      className={fieldClass}
                      updateField={updateField}
                    />

                    <Field label={tx.occupation}>
                      <Input
                        className={fieldClass}
                        value={form.occupation || ""}
                        onChange={(event) =>
                          updateField("occupation", event.target.value)
                        }
                      />
                    </Field>

                    <SelectField
                      label={tx.income}
                      field="income"
                      value={form.income || ""}
                      options={OPTIONS.income}
                      lang={currentLang}
                      placeholder={tx.select}
                      className={fieldClass}
                      updateField={updateField}
                    />

                    <SelectField
                      label={tx.maritalStatus}
                      field="maritalStatus"
                      value={form.maritalStatus || ""}
                      options={OPTIONS.marital}
                      lang={currentLang}
                      placeholder={tx.select}
                      className={fieldClass}
                      updateField={updateField}
                    />

                    <SelectField
                      label={tx.children}
                      field="children"
                      value={form.children || ""}
                      options={OPTIONS.children}
                      lang={currentLang}
                      placeholder={tx.select}
                      className={fieldClass}
                      updateField={updateField}
                    />

                    <SelectField
                      label={tx.smoking}
                      field="smoking"
                      value={form.smoking || ""}
                      options={OPTIONS.smoking}
                      lang={currentLang}
                      placeholder={tx.select}
                      className={fieldClass}
                      updateField={updateField}
                    />

                    <SelectField
                      label={tx.alcohol}
                      field="alcohol"
                      value={form.alcohol || ""}
                      options={OPTIONS.alcohol}
                      lang={currentLang}
                      placeholder={tx.select}
                      className={fieldClass}
                      updateField={updateField}
                    />

                    <SelectField
                      label={tx.religion}
                      field="religion"
                      value={form.religion || ""}
                      options={OPTIONS.religion}
                      lang={currentLang}
                      placeholder={tx.select}
                      className={fieldClass}
                      updateField={updateField}
                    />

                    <SelectField
                      label={tx.bodyType}
                      field="bodyType"
                      value={form.bodyType || ""}
                      options={OPTIONS.bodyType}
                      lang={currentLang}
                      placeholder={tx.select}
                      className={fieldClass}
                      updateField={updateField}
                    />

                    <SelectField
                      label={tx.hairColor}
                      field="hairColor"
                      value={form.hairColor || ""}
                      options={OPTIONS.hairColor}
                      lang={currentLang}
                      placeholder={tx.select}
                      className={fieldClass}
                      updateField={updateField}
                    />

                    <SelectField
                      label={tx.eyeColor}
                      field="eyeColor"
                      value={form.eyeColor || ""}
                      options={OPTIONS.eyeColor}
                      lang={currentLang}
                      placeholder={tx.select}
                      className={fieldClass}
                      updateField={updateField}
                    />

                    <SelectField
                      label={tx.bloodType}
                      field="bloodType"
                      value={form.bloodType || ""}
                      options={OPTIONS.bloodType}
                      lang={currentLang}
                      placeholder={tx.select}
                      className={fieldClass}
                      updateField={updateField}
                    />

                    <div className="md:col-span-2">
                      <Field
                        label={tx.hobbies}
                        hint={tx.hobbiesHint}
                      >
                        <Input
                          className={fieldClass}
                          value={hobbiesInput}
                          onChange={(event) =>
                            setHobbiesInput(event.target.value)
                          }
                          placeholder={tx.hobbiesPlaceholder}
                        />
                      </Field>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard
                  title={tx.about}
                  description={tx.aboutDesc}
                  className={glassCard}
                >
                  <div className="space-y-5">
                    <Field label={tx.about}>
                      <textarea
                        className={textareaClass}
                        placeholder={tx.aboutPlaceholder}
                        value={form.aboutMe || ""}
                        onChange={(event) =>
                          updateField("aboutMe", event.target.value)
                        }
                      />
                    </Field>

                    <Field label={tx.lookingFor}>
                      <textarea
                        className={textareaClass}
                        placeholder={tx.lookingForPlaceholder}
                        value={form.lookingFor || ""}
                        onChange={(event) =>
                          updateField("lookingFor", event.target.value)
                        }
                      />
                    </Field>
                  </div>
                </SectionCard>
              </div>

              <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
                <div className={`${glassCard} p-6`}>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-500/10 text-pink-300">
                    <UserRound className="h-5 w-5" />
                  </span>

                  <h2 className="mt-5 text-xl font-black">
                    {tx.recommendation}
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-white/55">
                    {tx.recommendationDesc}
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-xs text-emerald-300">
                    <CheckCircle2 className="h-4 w-4" />
                    {tx.secure}
                  </div>
                </div>

                <Button
                  type="button"
                  className="h-14 w-full rounded-2xl bg-gradient-to-r from-pink-600 via-fuchsia-600 to-violet-600 text-base font-black text-white shadow-[0_18px_45px_rgba(219,39,119,0.28)] transition hover:scale-[1.01]"
                  onClick={handleSubmit}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="me-2 h-5 w-5 animate-spin" />
                      {tx.saving}
                    </>
                  ) : (
                    <>
                      <Save className="me-2 h-5 w-5" />
                      {tx.save}
                    </>
                  )}
                </Button>
              </aside>
            </div>
          </div>
        </main>

        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#090914]/90 p-3 backdrop-blur-2xl xl:hidden">
          <div className="mx-auto max-w-[1380px]">
            <Button
              type="button"
              className="h-13 w-full rounded-2xl bg-gradient-to-r from-pink-600 via-fuchsia-600 to-violet-600 font-black text-white"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="me-2 h-5 w-5 animate-spin" />
                  {tx.saving}
                </>
              ) : (
                <>
                  <Save className="me-2 h-5 w-5" />
                  {tx.save}
                </>
              )}
            </Button>
          </div>
        </div>

        <Footer />
        <AuthDialog
          activeTab={authTab}
          onClose={() => setAuthTab(null)}
        />
      </div>
    </div>
  );
}

function SectionCard({
  title,
  description,
  className,
  children,
}: {
  title: string;
  description: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`${className} p-5 sm:p-7`}>
      <div className="mb-6">
        <h2 className="text-xl font-black sm:text-2xl">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-white/50">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-bold text-white/80">{label}</Label>
      {children}
      {hint && <p className="text-xs text-white/35">{hint}</p>}
    </div>
  );
}

function LocalizedSelect({
  value,
  options,
  lang,
  placeholder,
  className,
  onChange,
}: {
  value: string;
  options: Option[];
  lang: LangKey;
  placeholder: string;
  className: string;
  onChange: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.labels[lang]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function SelectField<K extends keyof ProfileData>({
  label,
  field,
  value,
  options,
  lang,
  placeholder,
  className,
  updateField,
}: {
  label: string;
  field: K;
  value: string;
  options: Option[];
  lang: LangKey;
  placeholder: string;
  className: string;
  updateField: <T extends keyof ProfileData>(
    key: T,
    value: ProfileData[T],
  ) => void;
}) {
  return (
    <Field label={label}>
      <LocalizedSelect
        value={value}
        options={options}
        lang={lang}
        placeholder={placeholder}
        className={className}
        onChange={(nextValue) =>
          updateField(field, nextValue as ProfileData[K])
        }
      />
    </Field>
  );
}