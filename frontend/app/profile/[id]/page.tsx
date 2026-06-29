"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapPin, Calendar, ArrowLeft, Heart, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n-context";
import { api } from "@/lib/api";
import EgeMatchAICard from "@/components/EgeMatchAICard";

const API_URL = "/api";

type LangKey = "TR" | "EN" | "RU" | "AR";

const TEXT: Record<LangKey, Record<string, string>> = {
  TR: {
    loading: "Profil yükleniyor...",
    notFound: "Profil bulunamadı",
    back: "Geri Dön",
    like: "Beğen",
    message: "Mesaj",
    online: "Çevrimiçi",
    about: "Hakkımda",
    lookingFor: "Aradığım Kişi",
    info: "Profil Bilgileri",
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
    liked: "Beğeni gönderildi ❤️",
    likeFailed: "Beğeni gönderilemedi",
    serverError: "Sunucu hatası",
  },
  EN: {
    loading: "Loading profile...",
    notFound: "Profile not found",
    back: "Go Back",
    like: "Like",
    message: "Message",
    online: "Online",
    about: "About Me",
    lookingFor: "Looking For",
    info: "Profile Information",
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
    liked: "Like sent ❤️",
    likeFailed: "Could not send like",
    serverError: "Server error",
  },
  RU: {
    loading: "Профиль загружается...",
    notFound: "Профиль не найден",
    back: "Назад",
    like: "Нравится",
    message: "Сообщение",
    online: "Онлайн",
    about: "О себе",
    lookingFor: "Кого ищу",
    info: "Информация профиля",
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
    liked: "Лайк отправлен ❤️",
    likeFailed: "Не удалось отправить лайк",
    serverError: "Ошибка сервера",
  },
  AR: {
    loading: "جارٍ تحميل الملف...",
    notFound: "لم يتم العثور على الملف",
    back: "رجوع",
    like: "إعجاب",
    message: "رسالة",
    online: "متصل",
    about: "نبذة عني",
    lookingFor: "أبحث عن",
    info: "معلومات الملف الشخصي",
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
    liked: "تم إرسال الإعجاب ❤️",
    likeFailed: "تعذر إرسال الإعجاب",
    serverError: "خطأ في الخادم",
  },
};

const OPTION_MAP: Record<LangKey, Record<string, string>> = {
  TR: {
    ASSOCIATE: "Ön lisans",
    BACHELOR: "Lisans",
    MASTER: "Yüksek lisans",
    DOCTORATE: "Doktora",
    HIGH_SCHOOL: "Lise",
    PRIMARY: "İlköğretim",
    MEDIUM: "Orta",
    LOW: "Düşük",
    HIGH: "Yüksek",
    DIVORCED: "Boşanmış",
    SINGLE: "Bekar",
    MARRIED: "Evli",
    NONE: "Yok",
    YES: "Var",
    NO: "Yok",
    HAZEL: "Ela",
    BLACK: "Siyah",
    BROWN: "Kahverengi",
    BLUE: "Mavi",
    GREEN: "Yeşil",
    BLONDE: "Sarı",
    RED: "Kızıl",
    GRAY: "Gri",
    WHITE: "Beyaz",
    emekli: "Emekli",
    hemşire: "Hemşire",
  },
  EN: {
    ASSOCIATE: "Associate",
    BACHELOR: "Bachelor",
    MASTER: "Master",
    DOCTORATE: "Doctorate",
    HIGH_SCHOOL: "High school",
    PRIMARY: "Primary school",
    MEDIUM: "Medium",
    LOW: "Low",
    HIGH: "High",
    DIVORCED: "Divorced",
    SINGLE: "Single",
    MARRIED: "Married",
    NONE: "None",
    YES: "Yes",
    NO: "No",
    HAZEL: "Hazel",
    BLACK: "Black",
    BROWN: "Brown",
    BLUE: "Blue",
    GREEN: "Green",
    BLONDE: "Blonde",
    RED: "Red",
    GRAY: "Gray",
    WHITE: "White",
    emekli: "Retired",
    hemşire: "Nurse",
  },
  RU: {
    ASSOCIATE: "Среднее специальное",
    BACHELOR: "Бакалавр",
    MASTER: "Магистр",
    DOCTORATE: "Докторантура",
    HIGH_SCHOOL: "Средняя школа",
    PRIMARY: "Начальная школа",
    MEDIUM: "Средний",
    LOW: "Низкий",
    HIGH: "Высокий",
    DIVORCED: "В разводе",
    SINGLE: "Холост/не замужем",
    MARRIED: "В браке",
    NONE: "Нет",
    YES: "Есть",
    NO: "Нет",
    HAZEL: "Ореховый",
    BLACK: "Черный",
    BROWN: "Коричневый",
    BLUE: "Голубой",
    GREEN: "Зеленый",
    BLONDE: "Блонд",
    RED: "Рыжий",
    GRAY: "Серый",
    WHITE: "Белый",
    emekli: "Пенсионер",
    hemşire: "Медсестра",
  },
  AR: {
    ASSOCIATE: "دبلوم",
    BACHELOR: "بكالوريوس",
    MASTER: "ماجستير",
    DOCTORATE: "دكتوراه",
    HIGH_SCHOOL: "ثانوي",
    PRIMARY: "ابتدائي",
    MEDIUM: "متوسط",
    LOW: "منخفض",
    HIGH: "مرتفع",
    DIVORCED: "مطلق",
    SINGLE: "أعزب",
    MARRIED: "متزوج",
    NONE: "لا يوجد",
    YES: "نعم",
    NO: "لا",
    HAZEL: "عسلي",
    BLACK: "أسود",
    BROWN: "بني",
    BLUE: "أزرق",
    GREEN: "أخضر",
    BLONDE: "أشقر",
    RED: "أحمر",
    GRAY: "رمادي",
    WHITE: "أبيض",
    emekli: "متقاعد",
    hemşire: "ممرضة",
  },
};

function normalizeArrayText(value: any) {
  if (!value) return "-";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "-";
  if (typeof value === "string") {
    return value
      .replace(/[{}"]/g, "")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean)
      .join(", ") || "-";
  }
  return "-";
}

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { lang } = useI18n();

  const currentLang: LangKey = ["TR", "EN", "RU", "AR"].includes(lang)
    ? (lang as LangKey)
    : "TR";
    console.log("LANG =", lang);
console.log("CURRENT LANG =", currentLang);

  const tx = TEXT[currentLang];
  const isRtl = currentLang === "AR";
  const id = params?.id as string;

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [compatibility, setCompatibility] = useState<any>(null);
const [compatLoading, setCompatLoading] = useState(false);
const [egematch, setEgematch] = useState<any | null>(null);
  

 function trOpt(value: string | null | undefined) {
  if (!value) return "-";

  const key = String(value).trim().toUpperCase();

  const hardMap: any = {
    WHITE: {
      TR: "Beyaz",
      EN: "White",
      RU: "Белый",
      AR: "أبيض",
    },
    RED: {
      TR: "Kızıl",
      EN: "Red",
      RU: "Рыжий",
      AR: "أحمر",
    },
    BLACK: {
      TR: "Siyah",
      EN: "Black",
      RU: "Черный",
      AR: "أسود",
    },
    HAZEL: {
      TR: "Ela",
      EN: "Hazel",
      RU: "Ореховый",
      AR: "عسلي",
    },
  };

  if (hardMap[key]) {
    return hardMap[key][currentLang] || hardMap[key].EN;
  }

  return OPTION_MAP[currentLang]?.[key] || value;
}

  useEffect(() => {
    if (!id) return;

    const loadProfile = async () => {
  try {
    const res = await fetch(`${API_URL}/users/${id}`);

    if (!res.ok) {
      setProfile(null);
      return;
    }

    const data = await res.json();
    setProfile(data);

    try {
      const ai = await api.ai.egematchUser(id);
      setEgematch(ai);
    } catch (err) {
      console.error("EgeMatch AI yüklenemedi:", err);
    }
  } catch (error) {
    console.error("Profil yüklenemedi:", error);
    setProfile(null);
  } finally {
    setLoading(false);
  }
};
    loadProfile();
    const loadCompatibility = async () => {
  if (!id) return;

  try {
    setCompatLoading(true);

    const data = await api.ai.egematchUser(id);

    setCompatibility(data);
  } catch (e) {
    console.error("EgeMatch AI yüklenemedi:", e);
  } finally {
    setCompatLoading(false);
  }
};

loadCompatibility();
  }, [id]);

  const getPhotoUrl = (url?: string) => {
    if (!url) return null;
    return url.startsWith("http") ? url : `${API_URL}${url}`;
  };

 console.log("HAIR =", profile?.hairColor);
  const photos = (profile?.photos || []).filter((p: any) => {
    const url = p?.url || "";
    return url && !url.includes("/uploads/photos/");
  });

  const mainPhoto =
    photos.find((p: any) => p.isMain)?.url || photos[0]?.url || null;

  if (loading) {
    return (
      <>
        <Header />
        <main
          className="min-h-screen bg-[#210014] text-white pt-28 px-6"
          dir={isRtl ? "rtl" : "ltr"}
        >
          <div className="max-w-5xl mx-auto">{tx.loading}</div>
        </main>
        <Footer />
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Header />
        <main
          className="min-h-screen bg-[#210014] text-white pt-28 px-6"
          dir={isRtl ? "rtl" : "ltr"}
        >
          <div className="max-w-5xl mx-auto">
            <Button onClick={() => router.back()} className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {tx.back}
            </Button>
            <h1 className="text-3xl font-bold">{tx.notFound}</h1>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main
        className="min-h-screen bg-[#210014] text-white pt-28 pb-16 px-6"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <div className="max-w-6xl mx-auto">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="mb-6 border-white/20 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {tx.back}
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <section className="lg:col-span-1 rounded-3xl border border-white/30 p-4 bg-white/5">
              <div
                className="aspect-[4/5] rounded-2xl overflow-hidden bg-black/30 cursor-pointer"
                onClick={() => mainPhoto && setSelectedPhoto(getPhotoUrl(mainPhoto))}
              >
                {mainPhoto ? (
                  <img
                    src={getPhotoUrl(mainPhoto) || ""}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl font-bold">
                    {profile.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}
              </div>

              {photos.length > 1 && (
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {photos.map((p: any) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPhoto(getPhotoUrl(p.url))}
                      className="aspect-square rounded-xl overflow-hidden border border-white/20"
                    >
                      <img
                        src={getPhotoUrl(p.url) || ""}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              <div className="flex gap-3 mt-5">
                <Button
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem("accessToken");

                      const res = await fetch(
                        `${API_URL}/matches/like/${profile.id}`,
                        {
                          method: "POST",
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        },
                      );

                      const data = await res.json();

                      if (res.ok) {
                        alert(tx.liked);
                      } else {
                        alert(data.message || tx.likeFailed);
                      }
                    } catch (err) {
                      console.error(err);
                      alert(tx.serverError);
                    }
                  }}
                  className="flex-1 bg-pink-600 hover:bg-pink-700"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  {tx.like}
                </Button>

                <Button
                  onClick={() => router.push(`/messages?userId=${profile.id}`)}
                  variant="outline"
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {tx.message}
                </Button>
              </div>
            </section>
            <section className="lg:col-span-1 rounded-3xl border border-pink-400/40 p-5 bg-gradient-to-br from-pink-950 via-purple-950 to-black shadow-2xl shadow-pink-900/30">
  <div className="flex items-center justify-between mb-4">
    <div>
      <h2 className="text-2xl font-black text-pink-200">
        ❤️ EgeMatch AI™
      </h2>
      <p className="text-xs text-white/60 mt-1">
        Aşk tesadüf olabilir... uyum değildir.
      </p>
    </div>

    <div className="text-xs px-3 py-1 rounded-full bg-pink-500/20 border border-pink-300/30 text-pink-100">
      BETA
    </div>
  </div>

  {compatLoading && (
    <div className="py-8 text-center">
      <div className="mx-auto mb-4 w-16 h-16 rounded-full border-4 border-pink-400/30 border-t-pink-400 animate-spin" />
      <p className="text-pink-100 font-semibold">AI analiz ediyor...</p>
      <p className="text-white/50 text-sm mt-1">Profil uyumu hesaplanıyor</p>
    </div>
  )}

  {!compatLoading && compatibility && (
    <div>
      <div className="flex items-end justify-center gap-2 my-4">
        <span className="text-6xl font-black text-white drop-shadow-lg">
          %{compatibility.score}
        </span>
      </div>

      <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400 rounded-full transition-all duration-1000"
          style={{ width: `${compatibility.score}%` }}
        />
      </div>

      <div className="text-center mb-5">
        <div className="inline-flex px-4 py-2 rounded-full bg-white/10 border border-white/20 text-pink-100 font-bold">
          {compatibility.summary}
        </div>
      </div>

      <div className="space-y-2">
        {(compatibility.reasons || []).map((reason: string, i: number) => (
          <div
            key={i}
            className="flex items-start gap-2 text-sm text-white/85 bg-white/5 rounded-xl p-3 border border-white/10"
          >
            <span className="text-pink-300">✔</span>
            <span>{reason}</span>
          </div>
        ))}
      </div>

     <div className="mt-5 space-y-3">
  {compatibility.strengths?.length > 0 && (
    <div className="rounded-2xl bg-emerald-500/10 border border-emerald-300/20 p-4">
      <p className="mb-2 text-sm font-bold text-emerald-200">
        ✅ Güçlü Yönler
      </p>
      <div className="space-y-2">
        {compatibility.strengths.map((item: string, i: number) => (
          <p key={i} className="text-sm text-white/80 leading-relaxed">
            • {item}
          </p>
        ))}
      </div>
    </div>
  )}

  {compatibility.risks?.length > 0 && (
    <div className="rounded-2xl bg-yellow-500/10 border border-yellow-300/20 p-4">
      <p className="mb-2 text-sm font-bold text-yellow-200">
        ⚠️ Dikkat Edilecekler
      </p>
      <div className="space-y-2">
        {compatibility.risks.map((item: string, i: number) => (
          <p key={i} className="text-sm text-white/80 leading-relaxed">
            • {item}
          </p>
        ))}
      </div>
    </div>
  )}

  {compatibility.suggestions?.length > 0 && (
    <div className="rounded-2xl bg-sky-500/10 border border-sky-300/20 p-4">
      <p className="mb-2 text-sm font-bold text-sky-200">
        💡 AI Önerisi
      </p>
      <div className="space-y-2">
        {compatibility.suggestions.map((item: string, i: number) => (
          <p key={i} className="text-sm text-white/80 leading-relaxed">
            • {item}
          </p>
        ))}
      </div>
    </div>
  )}

  {compatibility.commonHobbies?.length > 0 && (
    <div className="rounded-2xl bg-pink-500/10 border border-pink-300/20 p-4">
      <p className="mb-2 text-sm font-bold text-pink-200">
        🎯 Ortak İlgi Alanları
      </p>
      <div className="flex flex-wrap gap-2">
        {compatibility.commonHobbies.map((item: string, i: number) => (
          <span
            key={i}
            className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/85"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )}
</div>

      <Button
        onClick={() => router.push(`/messages?userId=${profile.id}`)}
        className="w-full mt-5 bg-pink-600 hover:bg-pink-700"
      >
        💬 Uyumlu Sohbet Başlat
      </Button>
    </div>
  )}

  {!compatLoading && !compatibility && (
    <div className="py-6 text-center text-white/60">
      EgeMatch AI analizi için giriş yapmalısın.
    </div>
  )}
</section>

            <section className="lg:col-span-2 space-y-6">
              <div className="rounded-3xl border border-white/30 p-8 bg-white/5">
                <h1 className="text-4xl font-bold">
                  {profile.name} {profile.surname}
                </h1>

                <div className="flex flex-wrap gap-4 mt-4 text-white/70">
                  {profile.age && (
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {profile.age}
                    </span>
                  )}

                  {(profile.city?.name || profile.district?.name) && (
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {profile.district?.name}, {profile.city?.name}
                    </span>
                  )}

                  <span className="text-green-400">● {tx.online}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoBox title={tx.about} value={profile.aboutMe || profile.bio || "-"} />
                <InfoBox title={tx.lookingFor} value={profile.lookingFor || "-"} />
              </div>

              <div className="rounded-3xl border border-white/30 p-8 bg-white/5">
                <h2 className="text-2xl font-bold mb-5">{tx.info}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                  <InfoRow label={tx.city} value={profile.city?.name} />
                  <InfoRow label={tx.district} value={profile.district?.name} />
                  <InfoRow label={tx.occupation} value={trOpt(profile.occupation)} />
                  <InfoRow label={tx.education} value={trOpt(profile.education)} />
                  <InfoRow label={tx.income} value={trOpt(profile.income)} />
                  <InfoRow label={tx.maritalStatus} value={trOpt(profile.maritalStatus)} />
                  <InfoRow label={tx.children} value={trOpt(profile.children)} />
                  <InfoRow label={tx.height} value={profile.height ? `${profile.height} cm` : ""} />
                  <InfoRow label={tx.weight} value={profile.weight ? `${profile.weight} kg` : ""} />
                  <InfoRow label={tx.eyeColor} value={trOpt(profile.eyeColor)} />
               <InfoRow
  label={tx.hairColor}
  value={trOpt(profile.hairColor)}
/>
                  <InfoRow label={tx.hobbies} value={normalizeArrayText(profile.hobbies)} />
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            className="absolute top-6 right-8 text-white text-4xl"
            onClick={() => setSelectedPhoto(null)}
          >
            ×
          </button>

          <img
            src={selectedPhoto}
            alt=""
            className="max-w-[95vw] max-h-[90vh] object-contain rounded-2xl"
          />
        </div>
      )}

      <Footer />
    </>
  );
}

function InfoBox({ title, value }: { title: string; value?: string }) {
  return (
    <div className="rounded-3xl border border-white/30 p-6 bg-white/5 min-h-[150px]">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <p className="text-white/80 leading-relaxed whitespace-pre-line">{value || "-"}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: any }) {
  return (
    <div className="flex justify-between gap-4 border-b border-white/30 py-3">
      <span className="text-white/60">{label}</span>
      <span className="font-semibold text-right">{value || "-"}</span>
    </div>
  );
}