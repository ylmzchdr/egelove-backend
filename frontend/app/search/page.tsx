
"use client";
const searchTranslations = {
  tr: {
    title: "Yeni insanları keşfetmeye başla.",
    subtitle: "Ege'nin sıcaklığı, Akdeniz'in özgürlüğü. Sana uygun profiller, yeni üyeler ve çevrimiçi kişiler burada.",
    exploreBtn: "Üyeleri Keşfet",
    filterBtn: "Gelişmiş Filtreler",
    online: "Çevrimiçi",
    specialForYou: "Sana özel",
    newMembers: "Yeni / Bugün katılanlar",
    premium: "Premium / Özel profiller",
    flightMode: "Uçak modu açık"
  },
  en: {
    title: "Start discovering new people.",
    subtitle: "The warmth of the Aegean, the freedom of the Mediterranean. Profiles suitable for you, new members and online people are here.",
    exploreBtn: "Explore Members",
    filterBtn: "Advanced Filters",
    online: "Online",
    specialForYou: "Special for you",
    newMembers: "New / Joined today",
    premium: "Premium / Special profiles",
    flightMode: "Airplane mode is on"
  },
  ru: {
    title: "Начните знакомиться с новыми людьми.",
    subtitle: "Тепло Эгейского моря, свобода Средиземноморья. Подходящие вам профили, новые участники и люди онлайн здесь.",
    exploreBtn: "Исследовать участников",
    filterBtn: "Расширенные фильтры",
    online: "В сети",
    specialForYou: "Специально для вас",
    newMembers: "Новые / Присоединились сегодня",
    premium: "Премиум / Особые профили",
    flightMode: "Авиарежим включен"
  },
  ar: {
    title: "ابدأ في اكتشاف أشخاص جدد.",
    subtitle: "دفء إيجة، حرية البحر الأبيض المتوسط. تتوفر هنا الملفات الشخصية المناسبة لك، والأعضاء الجدد والأشخاص المتصلون بالإنترنت.",
    exploreBtn: "اكتشف الأعضاء",
    filterBtn: "مرشحات متقدمة",
    online: "متصل",
    specialForYou: "خاص لك",
    newMembers: "جديد / انضم اليوم",
    premium: "بريميوم / ملفات شخصية مميزة",
    flightMode: "وضع الطيران مفعّل"
  }
};


import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import {
 
  Check,
  ChevronRight,
  Compass,
  Filter,
  Flame,
  Heart,
 
  Loader2,
  MapPin,
  RefreshCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthDialog from "@/components/AuthDialog";
import ProfileCard from "@/components/ProfileCard";


import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


import { api } from "@/lib/api";
import { useI18n } from "@/lib/i18n-context";

const GENDER_OPTIONS = [
  { value: "MALE", label: "Erkek" },
  { value: "FEMALE", label: "Kadın" },
];

const EDUCATION_OPTIONS = [
  { value: "PRIMARY", label: "İlköğretim" },
  { value: "SECONDARY", label: "Ortaöğretim" },
  { value: "HIGH_SCHOOL", label: "Lise" },
  { value: "ASSOCIATE", label: "Ön Lisans" },
  { value: "BACHELOR", label: "Lisans" },
  { value: "MASTER", label: "Yüksek Lisans" },
  { value: "DOCTORATE", label: "Doktora" },
];

const MARITAL_OPTIONS = [
  { value: "NEVER_MARRIED", label: "Hiç evlenmedi" },
  { value: "DIVORCED", label: "Boşandı" },
  { value: "WIDOWED", label: "Eşi vefat etti" },
  { value: "SEPARATED", label: "Ayrı yaşıyor" },
];

const SMOKING_OPTIONS = [
  { value: "NEVER", label: "İçmiyorum" },
  { value: "QUIT", label: "Bıraktım" },
  { value: "OCCASIONAL", label: "Ara sıra" },
  { value: "REGULAR", label: "İçiyorum" },
];

const ALCOHOL_OPTIONS = [
  { value: "NEVER", label: "Kullanmıyorum" },
  { value: "QUIT", label: "Bıraktım" },
  { value: "OCCASIONAL", label: "Sosyal içici" },
  { value: "REGULAR", label: "Kullanıyorum" },
];

const RELIGION_OPTIONS = [
  { value: "VERY_RELIGIOUS", label: "Çok dindar" },
  { value: "RELIGIOUS", label: "Dindar" },
  { value: "MODERATE", label: "Orta" },
  { value: "NOT_RELIGIOUS", label: "Dindar değil" },
  { value: "ATHEIST", label: "Ateist" },
];

const CHILDREN_OPTIONS = [
  { value: "NONE", label: "Yok" },
  { value: "HAS_LIVING_WITH", label: "Var (yanımda)" },
  { value: "HAS_NOT_LIVING", label: "Var (yanımda değil)" },
];

const BODY_TYPE_OPTIONS = [
  { value: "SLIM", label: "Zayıf" },
  { value: "ATHLETIC", label: "Atletik" },
  { value: "NORMAL", label: "Normal" },
  { value: "CURVY", label: "Tombul" },
  { value: "PLUS", label: "Kilolu" },
];

const INCOME_OPTIONS = [
  { value: "VERY_LOW", label: "Asgari ücret" },
  { value: "LOW", label: "10-20 bin TL" },
  { value: "MEDIUM", label: "20-40 bin TL" },
  { value: "HIGH", label: "40-70 bin TL" },
  { value: "VERY_HIGH", label: "70 bin TL üzeri" },
];

interface FilterState {
  gender: string;
  cityId: string;
  districtId: string;
  minAge: string;
  maxAge: string;
  education: string;
  smoking: string;
  alcohol: string;
  maritalStatus: string;
  children: string;
  religion: string;
  bodyType: string;
  income: string;
  minHeight: string;
  maxHeight: string;
  minWeight: string;
  maxWeight: string;
  occupation: string;
  username: string;
  hasPhotos: boolean;
  isOnline: boolean;
  isNewMember: boolean;
}

interface City {
  id: number;
  name: string;
}

interface District {
  id: number;
  name: string;
}

interface ProfileResult {
  id: string;
  name: string;
  surname?: string;
  age: number;
  gender: string;
  city?: City;
  district?: District;
  bio?: string;
  aboutMe?: string;
  avatar?: string;
  isVerified: boolean;
  occupation?: string;
  photos?: Array<{
    url?: string;
  }>;
}

interface SearchResponse {
  users?: ProfileResult[];
}

interface SelectOption {
  value: string;
  label: string;
}

const EMPTY_FILTERS: FilterState = {
  gender: "",
  cityId: "",
  districtId: "",
  minAge: "",
  maxAge: "",
  education: "",
  smoking: "",
  alcohol: "",
  maritalStatus: "",
  children: "",
  religion: "",
  bodyType: "",
  income: "",
  minHeight: "",
  maxHeight: "",
  minWeight: "",
  maxWeight: "",
  occupation: "",
  username: "",
  hasPhotos: false,
  isOnline: false,
  isNewMember: false,
};

function normalizeProfiles(data: unknown): ProfileResult[] {
  const response = data as SearchResponse;

  const list = Array.isArray(data)
    ? (data as ProfileResult[])
    : response?.users ?? [];

  return Array.from(
    new Map(list.map((profile) => [profile.id, profile])).values()
  );
}

export default function SearchPage() {
  console.log("SEARCH PAGE LOADED");
  const [authTab, setAuthTab] = useState<"login" | "register" | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [results, setResults] = useState<ProfileResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searched, setSearched] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
const { lang, t } = useI18n();

console.log("SEARCH LANG =>", lang);
console.log(
  "SEARCH RECOMMENDATION =>",
  t.search.recommendationsTitle
);
  


  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

const buildParams = useCallback(() => {
  const params: Record<string, any> = {};

  if (filters.gender)
    params.gender = filters.gender;
if (filters.cityId)
  params.cityId = Number(filters.cityId);

if (filters.districtId)
  params.districtId = Number(filters.districtId);
  if (filters.minAge)
    params.minAge = Number(filters.minAge);

  if (filters.maxAge)
    params.maxAge = Number(filters.maxAge);

  if (filters.education)
    params.education = filters.education;

  if (filters.smoking)
    params.smoking = filters.smoking;

  if (filters.alcohol)
    params.alcohol = filters.alcohol;

  if (filters.maritalStatus)
    params.maritalStatus = filters.maritalStatus;

  if (filters.children)
    params.children = filters.children;

  if (filters.religion)
    params.religion = filters.religion;

  if (filters.bodyType)
    params.bodyType = filters.bodyType;

  if (filters.income)
    params.income = filters.income;

  if (filters.minHeight)
    params.minHeight = Number(filters.minHeight);

  if (filters.maxHeight)
    params.maxHeight = Number(filters.maxHeight);

  if (filters.minWeight)
    params.minWeight = Number(filters.minWeight);

  if (filters.maxWeight)
    params.maxWeight = Number(filters.maxWeight);

  if (filters.occupation)
    params.occupation = filters.occupation;

  if (filters.username)
    params.username = filters.username;

  if (filters.hasPhotos)
  params.hasPhoto = true;

 

  if (filters.isNewMember)
    params.isNewMember = true;

  params.page = 1;
  params.limit = 20;

  console.log("🔎 FİLTRE PARAMETRELERİ =", params);

  return params;
}, [filters]);

  const loadProfiles = useCallback(
    async (params: Record<string, string>, markAsSearch: boolean) => {
      setLoading(true);

      if (markAsSearch) {
        setSearched(true);
      }

      try {
        const data = await api.users.search(params);
        const uniqueProfiles = normalizeProfiles(data);
        setResults(uniqueProfiles);
      } catch (error) {
        console.error("Profil arama hatası:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleSearch = async () => {
    await loadProfiles(buildParams(), true);
    setFilterOpen(false);
  };

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setDistricts([]);
  };

  const clearAndSearch = async () => {
    setFilters(EMPTY_FILTERS);
    setDistricts([]);
    setFilterOpen(false);
    await loadProfiles({}, false);
  };

  useEffect(() => {
  api.cities
    .list()
    .then((data: City[]) => {
      console.log("ŞEHİRLER GELDİ:", data);
console.log("ŞEHİR SAYISI:", data.length);
      console.log("ŞEHİRLER GELDİ:", data);
      setCities(data);
    })
    .catch((error: unknown) => {
      console.error("Şehirler yüklenemedi:", error);
    });
}, []);

 useEffect(() => {
  console.log("CITY ID =", filters.cityId);

  if (!filters.cityId) {
    setDistricts([]);
    return;
  }

  api.cities
    .districts(Number.parseInt(filters.cityId, 10))
    .then((data: District[]) => {
      console.log("DISTRICTS =", data);

      setDistricts(
        data.map((district) => ({
          id: district.id,
          name: district.name,
        }))
      );
    })
    .catch((error) => {
      console.error("ERROR =", error);
      setDistricts([]);
    });
}, [filters.cityId]);

  useEffect(() => {
    void loadProfiles({}, false);
  }, [loadProfiles]);

  useEffect(() => {
    if (!filterOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [filterOpen]);

  const activeFilterCount = useMemo(
    () =>
      Object.values(filters).filter(
        (value) => value !== "" && value !== false
      ).length,
    [filters]
  );

  const onlineCount = Math.max(24, results.length * 7 + 86);

  const featuredProfiles = useMemo(() => results.slice(0, 8), [results]);
  const newProfiles = useMemo(() => results.slice(8, 16), [results]);
  const moreProfiles = useMemo(() => results.slice(16), [results]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#06182a] text-white">

  {/* Background Glow */}
  <div className="pointer-events-none absolute inset-0 overflow-hidden">

    <div className="absolute -left-40 top-0 h-[550px] w-[550px] rounded-full bg-cyan-500/10 blur-[180px]" />

    <div className="absolute right-[-120px] top-[180px] h-[520px] w-[520px] rounded-full bg-fuchsia-500/10 blur-[180px]" />

    <div className="absolute bottom-[-150px] left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-amber-400/5 blur-[180px]" />

  </div>
      <Header
        onOpenLogin={() => setAuthTab("login")}
        onOpenRegister={() => setAuthTab("register")}
      />

      <main>
        <section className="relative isolate min-h-[560px] overflow-hidden border-b border-white/10">
          <div
            className="absolute inset-0 -z-30 scale-105 bg-cover bg-center transition-transform duration-[12000ms] ease-out hover:scale-110"
            style={{
              backgroundImage:
                "url('/backgrounds/search/antalya-cliffs.webp')",
            }}
          />

          <div className="absolute inset-0 -z-20 bg-gradient-to-r from-[#031426]/95 via-[#05243c]/80 to-[#06182a]/35" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#06182a] via-transparent to-[#031426]/25" />

          <div className="absolute -left-24 top-20 h-80 w-80 animate-pulse rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute right-8 top-12 h-72 w-72 animate-pulse rounded-full bg-amber-300/10 blur-3xl [animation-delay:900ms]" />

          <div className="mx-auto flex min-h-[560px] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid w-full items-end gap-10 lg:grid-cols-[1fr_360px]">
              <div className="max-w-3xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100 backdrop-blur-xl">
                  <Sparkles className="h-4 w-4 animate-pulse text-cyan-300" />
                  Bugün senin için seçildi
                </div>

              <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl drop-shadow-[0_0_35px_rgba(255,255,255,.12)]">
  {t.search.heroTitle}
</h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">
 {t.search.heroSubtitle}
</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => {
                      document.getElementById("profiles")?.scrollIntoView({
                        behavior: "smooth",
                      });
                    }}
                   className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-fuchsia-500 px-7 font-black text-white shadow-[0_0_35px_rgba(0,255,255,.25)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_0_45px_rgba(0,255,255,.45)]"
                  >
                    <Compass className="h-5 w-5" />
                    Üyeleri Keşfet
                    <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setFilterOpen(true)}
                   className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-cyan-400/30 bg-gradient-to-r from-[#13283f]/90 to-[#0b1f34]/90 px-7 font-bold text-cyan-100 backdrop-blur-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:shadow-[0_0_30px_rgba(0,255,255,.20)]"
                  >
                    <SlidersHorizontal className="h-5 w-5 text-cyan-300" />
                    Gelişmiş Filtreler

                    {activeFilterCount > 0 && (
                      <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-cyan-300 px-2 text-xs font-black text-slate-950">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <HeroStatCard
                  icon={<Users className="h-5 w-5" />}
                  value={`${onlineCount}+`}
                  label="Çevrimiçi"
                  pulse
                />

                <HeroStatCard
                  icon={<Heart className="h-5 w-5" />}
                  value={`${results.length}`}
                  label="Sana özel"
                />

                <HeroStatCard
                  icon={<Flame className="h-5 w-5" />}
                  value="Yeni"
                  label="Bugün katılanlar"
                />

                <HeroStatCard
                  icon={<Star className="h-5 w-5" />}
                  value="Premium"
                  label="Özel profiller"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="profiles" className="relative py-12 sm:py-16">
          <div className="pointer-events-none absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-400/5 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">
                  <Heart className="h-4 w-4 fill-current" />
                  Sana özel üyeler
                </div>
<h2 className="text-3xl font-black sm:text-4xl">
  {t.search.recommendationsTitle}
</h2>

                <p className="mt-2 max-w-2xl text-white/55">
  {t.search.recommendationsSubtitle}
</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setFilterOpen(true)}
                 className="
inline-flex
h-12
items-center
gap-2
rounded-2xl
border
border-cyan-400/20
bg-gradient-to-r
from-[#13283f]
to-[#0d2034]
px-5
font-bold
text-cyan-100
shadow-lg
shadow-cyan-900/20
transition-all
duration-300
hover:-translate-y-1
hover:border-cyan-300/60
hover:shadow-[0_0_25px_rgba(0,255,255,.25)]
"
                >
                  <Filter className="h-4 w-4 text-cyan-300" />
                  Filtreler

                  {activeFilterCount > 0 && (
                    <span className="rounded-full bg-cyan-300 px-2 py-0.5 text-xs font-black text-slate-950">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => void loadProfiles(buildParams(), searched)}
                  disabled={loading}
                 className="inline-flex h-12 items-center gap-2 rounded-2xl border border-fuchsia-400/20 bg-gradient-to-r from-[#1b2238] to-[#13283f] px-5 font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-fuchsia-400/50 hover:shadow-[0_0_25px_rgba(255,0,255,.18)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <RefreshCcw
                    className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                  />
                  Yenile
                </button>
              </div>
            </div>

            {activeFilterCount > 0 && (
              <div className="mb-8 flex flex-wrap items-center gap-3 rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.07] px-4 py-3 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-sm font-bold text-cyan-100">
                  <Check className="h-4 w-4" />
                  {activeFilterCount} filtre uygulanıyor
                </div>

                <button
                  type="button"
                  onClick={() => void clearAndSearch()}
                  className="ml-auto text-sm font-bold text-white/60 underline-offset-4 transition hover:text-white hover:underline"
                >
                  Tümünü temizle
                </button>
              </div>
            )}

            {loading ? (
              <LoadingState />
            ) : results.length > 0 ? (
              <div className="space-y-16">
                <ProfileSection
                  eyebrow="Senin için seçildi"
                  title="Sana Özel"
                  description={`${results.length} profil arasından sana uygun olabilecek üyeler.`}
                  icon={<Heart className="h-5 w-5 fill-current" />}
                  profiles={featuredProfiles.length > 0 ? featuredProfiles : results}
                />

                {newProfiles.length > 0 && (
                  <ProfileSection
                    eyebrow="Aramıza yeni katıldılar"
                    title="Yeni Üyeler"
                    description="EGELOVE ailesine yakın zamanda katılan profilleri keşfet."
                    icon={<Flame className="h-5 w-5" />}
                    profiles={newProfiles}
                  />
                )}

                {moreProfiles.length > 0 && (
                  <ProfileSection
                    eyebrow="Keşfetmeye devam et"
                    title="Daha Fazla Profil"
                    description="Yeni insanlarla tanışmak için daha fazla profile göz at."
                    icon={<Compass className="h-5 w-5" />}
                    profiles={moreProfiles}
                  />
                )}
              </div>
            ) : searched ? (
              <EmptySearchState onReset={() => void clearAndSearch()} />
            ) : (
              <InitialEmptyState text={t.search.startSearch} />
            )}
          </div>
        </section>
      </main>

      <Footer />

      <AuthDialog activeTab={authTab} onClose={() => setAuthTab(null)} />

      {filterOpen && (
        <FilterDrawer
          filters={filters}
          cities={cities}
          districts={districts}
          activeFilterCount={activeFilterCount}
          loading={loading}
          t={t}
          onClose={() => setFilterOpen(false)}
          onClear={clearFilters}
          onSearch={() => void handleSearch()}
          updateFilter={updateFilter}
        />
      )}
    </div>
  );
}

interface HeroStatCardProps {
  icon: ReactNode;
  value: string;
  label: string;
  pulse?: boolean;
}

function HeroStatCard({
  icon,
  value,
  label,
  pulse = false,
}: HeroStatCardProps) {
  return (
    <div className="group rounded-2xl border border-white/15 bg-slate-950/30 p-4 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-slate-950/45">
      <div className="flex items-center justify-between">
        <span className="text-cyan-300">{icon}</span>

        {pulse && (
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400" />
          </span>
        )}
      </div>

      <p className="mt-5 text-xl font-black">{value}</p>
      <p className="mt-1 text-xs font-medium text-white/50">{label}</p>
    </div>
  );
}

interface ProfileSectionProps {
  eyebrow: string;
  title: string;
  description: string;
  icon: ReactNode;
  profiles: ProfileResult[];
}

function ProfileSection({
  eyebrow,
  title,
  description,
  icon,
  profiles,
}: ProfileSectionProps) {
  return (
    <section className="relative">

      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-20 top-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute right-10 bottom-10 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-[120px]" />
      </div>
      <div className="mb-6 flex items-end justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-cyan-300">
            {icon}
            {eyebrow}
          </div>

          <h3 className="mt-2 text-2xl font-black sm:text-3xl">{title}</h3>
          <p className="mt-2 text-sm text-white/45">{description}</p>
        </div>

        <div className="hidden items-center gap-2 text-sm font-semibold text-white/35 sm:flex">
          <MapPin className="h-4 w-4" />
          Türkiye
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {profiles.map((profile, index) => {
          const mainPhoto = profile.photos?.[0]?.url || profile.avatar;

          return (
           <div
  key={profile.id}
  className="group relative animate-[fadeInUp_500ms_ease-out_both] transition-all duration-500 hover:-translate-y-2"
  style={{
    animationDelay: `${index * 70}ms`,
  }}
>
  <div
    className="
      pointer-events-none
      absolute
      -inset-2
      rounded-[30px]
      bg-gradient-to-br
      from-cyan-400/0
      via-fuchsia-400/0
      to-amber-300/0
      blur-2xl
      transition-all
      duration-500
      group-hover:from-cyan-400/20
      group-hover:via-fuchsia-400/15
      group-hover:to-amber-300/20
    "
  />

  <div
    className="
      relative
      overflow-hidden
      rounded-3xl
      border
      border-white/10
      bg-white/[0.03]
      backdrop-blur-xl
      transition-all
      duration-500
      group-hover:border-cyan-400/35
      group-hover:shadow-[0_0_40px_rgba(0,255,255,.18)]
    "
  >
    <ProfileCard
      id={profile.id}
      name={`${profile.name}${profile.surname ? ` ${profile.surname}` : ""}`}
      age={profile.age}
      city={profile.city?.name || ""}
      district={profile.district?.name || ""}
      bio={profile.aboutMe || profile.bio || ""}
      verified={profile.isVerified}
      avatar={mainPhoto}
    />
  </div>
</div>
          );
        })}
      </div>
    </section>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center">
      <div className="relative">
        <div className="h-20 w-20 rounded-full border-2 border-cyan-300/15" />
        <Loader2 className="absolute inset-0 m-auto h-10 w-10 animate-spin text-cyan-300" />
      </div>

      <p className="mt-5 text-sm font-semibold text-white/50">
        Sana uygun profiller hazırlanıyor...
      </p>
    </div>
  );
}

interface EmptySearchStateProps {
  onReset: () => void;
}

function EmptySearchState({ onReset }: EmptySearchStateProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-6 py-20 text-center backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/[0.06]">
        <Search className="h-9 w-9 text-white/30" />
      </div>

      <h3 className="mt-6 text-2xl font-black">Uygun profil bulunamadı</h3>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/50">
        Filtrelerini biraz genişleterek daha fazla üyeye ulaşabilirsin.
      </p>

      <button
        type="button"
        onClick={onReset}
        className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-6 font-black text-slate-950 transition hover:bg-cyan-200"
      >
        <RefreshCcw className="h-4 w-4" />
        Filtreleri Temizle
      </button>
    </div>
  );
}

interface InitialEmptyStateProps {
  text: string;
}

function InitialEmptyState({ text }: InitialEmptyStateProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-6 py-20 text-center backdrop-blur-xl">
      <Heart className="mx-auto h-12 w-12 text-white/25" />
      <p className="mt-5 text-lg text-white/50">{text}</p>
    </div>
  );
}

interface FilterDrawerProps {
  filters: FilterState;
  cities: City[];
  districts: District[];
  activeFilterCount: number;
  loading: boolean;
  t: ReturnType<typeof useI18n>["t"];
  onClose: () => void;
  onClear: () => void;
  onSearch: () => void;
  updateFilter: <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => void;
}

function FilterDrawer({
  filters,
  cities,
  districts,
  activeFilterCount,
  loading,
  t,
  onClose,
  onClear,
  onSearch,
  updateFilter,
}: FilterDrawerProps) {
  return (
    <div className="fixed inset-0 z-[100]">
      <button
        type="button"
        aria-label="Filtreleri kapat"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
      />

     <aside className="fixed inset-y-0 right-0 z-50 pointer-events-auto flex h-screen w-full max-w-2xl flex-col border-l border-white/10 bg-[#10141f] shadow-2xl shadow-black/50">


        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-7">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-cyan-300">
              <SlidersHorizontal className="h-4 w-4" />
              Gelişmiş Arama
            </div>
            <h2 className="mt-1 text-2xl font-black text-white">Filtreler</h2>
          </div>
          <button type="button" onClick={onClose} className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-white/70 transition hover:bg-white/10 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>


      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-8 sm:px-7 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FilterBlock label="Cinsiyet">
              <StyledSelect value={filters.gender} placeholder="Seçiniz" onValueChange={(v) => updateFilter("gender", v)} options={GENDER_OPTIONS} />
            </FilterBlock>
            <FilterBlock label="Yaş Aralığı">
              <RangeInputs minValue={filters.minAge} maxValue={filters.maxAge} onMinChange={(v) => updateFilter("minAge", v)} onMaxChange={(v) => updateFilter("maxAge", v)} />
            </FilterBlock>

           <FilterBlock label="Şehir">
  <StyledSelect
    value={filters.cityId}
    placeholder="Şehir seçin"
    onValueChange={(v) => updateFilter("cityId", v)}
    options={cities.map((c) => ({
      value: c.id.toString(),
      label: c.name,
    }))}
  />
</FilterBlock>
          </div>
        </div>

        <div className="border-t border-white/10 bg-[#10141f] p-5 sm:p-7">
          <div className="flex gap-4">
            <button onClick={onClear} disabled={activeFilterCount === 0} className="flex-1 rounded-xl border border-white/10 py-4 font-bold text-white hover:bg-white/5 transition disabled:opacity-50">Temizle</button>
            <button onClick={onSearch} disabled={loading} className="flex-1 rounded-xl bg-cyan-600 py-4 font-bold text-white hover:bg-cyan-700 transition disabled:opacity-50">{loading ? "Aranıyor..." : "Uygula"}</button>
          </div>
        </div>
      </aside>
    </div>
  );
}
interface FilterBlockProps {
  label: string;
  children: ReactNode;
  fullWidth?: boolean;
}

function FilterBlock({
  label,
  children,
  fullWidth = false,
}: FilterBlockProps) {
  return (
    <div className={fullWidth ? "sm:col-span-2" : ""}>
      <Label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/45">
        {label}
      </Label>

      {children}
    </div>
  );
}

function StyledInput({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Input
      {...props}
      className={`h-11 rounded-xl border-white/12 bg-white/[0.05] text-white placeholder:text-white/30 focus-visible:border-cyan-300/60 focus-visible:ring-cyan-300/20 ${className}`}
    />
  );
}

interface StyledSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  options?: { value: string; label: string }[];
  disabled?: boolean;
}

function StyledSelect({
  value = "",
  onValueChange,
  placeholder = "Seçiniz",
  options = [],
  disabled = false,
}: StyledSelectProps) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(event) => onValueChange?.(event.target.value)}
      className="h-11 w-full rounded-xl border border-white/20 bg-[#171b26] px-4 text-sm font-medium text-white outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <option value="" disabled>
        {placeholder}
      </option>

      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}



interface RangeInputsProps {
  minValue: string | number; // <-- Bu satırın varlığından emin olun
  maxValue: string | number;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
  minPlaceholder?: string;
  maxPlaceholder?: string;
}

function RangeInputs({
  minValue, // <-- Eksik olan bu satırı ekleyin
  maxValue,
  onMinChange,
  onMaxChange,
  minPlaceholder = "Min",
  maxPlaceholder = "Max",
}: RangeInputsProps) {
  return (
   <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
  <StyledInput
    type="number"
    placeholder={minPlaceholder}
    value={minValue}
    onChange={(event) => onMinChange(event.target.value)}
  />

  <span className="text-white/50">-</span>

  <StyledInput
    type="number"
    placeholder={maxPlaceholder}
    value={maxValue}
    onChange={(event) => onMaxChange(event.target.value)}
  />
</div>
  );
}


interface FilterCheckboxProps {
  checked: boolean;
  onCheckedChange: (value: boolean | "indeterminate") => void;
  icon: ReactNode;
  label: string;
  pulse?: boolean;
}

function FilterCheckbox({
  checked,
  onCheckedChange,
  icon,
  label,
  pulse = false,
}: FilterCheckboxProps) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${
        checked
          ? "border-cyan-300/50 bg-cyan-300/10 text-white"
          : "border-white/10 bg-white/[0.04] text-white/60 hover:bg-white/[0.07] hover:text-white"
      }`}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="border-white/30 data-[state=checked]:border-cyan-300 data-[state=checked]:bg-cyan-300 data-[state=checked]:text-slate-950"
      />

      <span className="relative text-cyan-300">
        {icon}

        {pulse && checked && (
          <span className="absolute -right-1 -top-1 h-2 w-2 animate-ping rounded-full bg-emerald-400" />
        )}
      </span>

      <span className="text-sm font-semibold">{label}</span>
    </label>
  );
}