"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthDialog from "@/components/AuthDialog";

import { api } from "@/lib/api";
import { useI18n } from "@/lib/i18n-context";
import ProfileCard from "@/components/ProfileCard";

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

const ZODIAC_OPTIONS = [
  { value: "KOC", label: "Koç" },
  { value: "BOGA", label: "Boğa" },
  { value: "IKIZLER", label: "İkizler" },
  { value: "YENGEC", label: "Yengeç" },
  { value: "ASLAN", label: "Aslan" },
  { value: "BASAK", label: "Başak" },
  { value: "TERAZI", label: "Terazi" },
  { value: "AKREP", label: "Akrep" },
  { value: "YAY", label: "Yay" },
  { value: "OGLAK", label: "Oğlak" },
  { value: "KOVA", label: "Kova" },
  { value: "BALIK", label: "Balık" },
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

interface City { id: number; name: string; }
interface District { id: number; name: string; }

interface ProfileResult {
  id: string; name: string; surname: string; age: number;
  gender: string; city: City; district: District;
  bio?: string; aboutMe?: string; avatar?: string;
  isVerified: boolean; occupation?: string;
}

export default function SearchPage() {
  const [authTab, setAuthTab] = useState<"login" | "register" | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [results, setResults] = useState<ProfileResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { t } = useI18n();

  const [filters, setFilters] = useState<FilterState>({
    gender: "", cityId: "", districtId: "", minAge: "", maxAge: "",
    education: "", smoking: "", alcohol: "", maritalStatus: "",
    children: "", religion: "", bodyType: "", income: "",
    minHeight: "", maxHeight: "", minWeight: "", maxWeight: "",
    occupation: "", username: "", hasPhotos: false, isOnline: false, isNewMember: false,
  });

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const buildParams = useCallback(() => {
    const params: Record<string, string> = {};
    if (filters.gender) params.gender = filters.gender;
    if (filters.cityId) params.city = filters.cityId;
    if (filters.districtId) params.district = filters.districtId;
    if (filters.minAge) params.minAge = filters.minAge;
    if (filters.maxAge) params.maxAge = filters.maxAge;
    if (filters.education) params.education = filters.education;
    if (filters.smoking) params.smoking = filters.smoking;
    if (filters.alcohol) params.alcohol = filters.alcohol;
    if (filters.maritalStatus) params.maritalStatus = filters.maritalStatus;
    if (filters.children) params.children = filters.children;
    if (filters.religion) params.religion = filters.religion;
    if (filters.bodyType) params.bodyType = filters.bodyType;
    if (filters.income) params.income = filters.income;
    if (filters.minHeight) params.minHeight = filters.minHeight;
    if (filters.maxHeight) params.maxHeight = filters.maxHeight;
    if (filters.minWeight) params.minWeight = filters.minWeight;
    if (filters.maxWeight) params.maxWeight = filters.maxWeight;
    if (filters.occupation) params.occupation = filters.occupation;
    if (filters.username) params.username = filters.username;
    if (filters.hasPhotos) params.hasPhotos = "true";
    if (filters.isOnline) params.isOnline = "true";
    if (filters.isNewMember) params.isNewMember = "true";
    return params;
  }, [filters]);

  useEffect(() => {
    api.cities.list().then(setCities).catch(() => {});
  }, []);

  useEffect(() => {
    if (filters.cityId) {
      api.cities.districts(parseInt(filters.cityId)).then((data: any[]) => setDistricts(data.map((d: any) => ({ id: d.id, name: d.name })))).catch(() => {});
    } else {
      setDistricts([]);
    }
  }, [filters.cityId]);

 const handleSearch = async () => {
  setLoading(true);
  setSearched(true);

  try {
    const data: any = await api.users.search(buildParams());

    setResults(
      Array.isArray(data)
        ? data
        : data.users || []
    );
  } catch (error) {
    console.error(error);
    setResults([]);
  } finally {
    setLoading(false);
  }
};

  const clearFilters = () => {
    setFilters({
      gender: "", cityId: "", districtId: "", minAge: "", maxAge: "",
      education: "", smoking: "", alcohol: "", maritalStatus: "",
      children: "", religion: "", bodyType: "", income: "",
      minHeight: "", maxHeight: "", minWeight: "", maxWeight: "",
      occupation: "", username: "", hasPhotos: false, isOnline: false, isNewMember: false,
    });
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== "" && v !== false);

  return (
    <div className="min-h-screen bg-pink-950 text-white">
      <Header onOpenLogin={() => setAuthTab("login")} onOpenRegister={() => setAuthTab("register")} />
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">{t.search.title}</h2>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-sm text-pink-400 hover:text-pink-300 flex items-center gap-1">
                  <X className="w-3.5 h-3.5" /> {t.search.clear}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
               <Label className="text-xs text-white/60 mb-2 block">
  {t.search.gender}
</Label>
                <div className="flex gap-2">
                  {GENDER_OPTIONS.map((o) => (
                    <button
                      key={o.value}
                      onClick={() => updateFilter("gender", filters.gender === o.value ? "" : o.value)}
                      className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                        filters.gender === o.value
                          ? "bg-pink-600 text-white shadow-lg shadow-pink-600/30"
                          : "bg-white/5 text-white/60 hover:bg-white/10 border border-white/10"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
              <Label className="text-xs text-white/60 mb-2 block">
  {t.search.ageRange}
</Label>
                <div className="flex items-center gap-3">
                  <Input type="number" min={18} max={99} placeholder="18"
                    className="bg-pink-950/50 border-white/10 text-white w-full text-center"
                    value={filters.minAge} onChange={(e) => updateFilter("minAge", e.target.value)} />
                  <span className="text-white/30">—</span>
                  <Input type="number" min={18} max={99} placeholder="99"
                    className="bg-pink-950/50 border-white/10 text-white w-full text-center"
                    value={filters.maxAge} onChange={(e) => updateFilter("maxAge", e.target.value)} />
                </div>
              </div>

              <div>
               <Label className="text-xs text-white/60 mb-2 block">
  {t.search.location}
</Label>
                <div className="flex gap-2">
                  <Select value={filters.cityId} onValueChange={(v) => { updateFilter("cityId", v); updateFilter("districtId", ""); }}>
                    <SelectTrigger className="bg-pink-950/50 border-white/10 text-white flex-1">
                    <SelectValue placeholder={t.search.city} />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={filters.districtId} onValueChange={(v) => updateFilter("districtId", v)} disabled={!filters.cityId}>
                    <SelectTrigger className="bg-pink-950/50 border-white/10 text-white flex-1">
                    <SelectValue placeholder={t.search.district} />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((d) => <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
            <Label className="text-xs text-white/60 mb-2 block">
  💍 {t.search.maritalStatus}
</Label>
                <Select value={filters.maritalStatus} onValueChange={(v) => updateFilter("maritalStatus", v)}>
                  <SelectTrigger className="bg-pink-950/50 border-white/10 text-white">
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    {MARITAL_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs text-white/60 mb-2 block">
  💼 {t.search.occupation}
</Label>
                <Input type="text" placeholder={t.search.occupationPlaceholder}
                  className="bg-pink-950/50 border-white/10 text-white"
                  value={filters.occupation} onChange={(e) => updateFilter("occupation", e.target.value)} />
              </div>

              <div>
                <Label className="text-xs text-white/60 mb-2 block">
  🎓 {t.search.education}
</Label>
                <Select value={filters.education} onValueChange={(v) => updateFilter("education", v)}>
                  <SelectTrigger className="bg-pink-950/50 border-white/10 text-white">
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    {EDUCATION_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div>
             <Label className="text-xs text-white/60 mb-2 block">
  💰 {t.search.income}
</Label>
                <Select value={filters.income} onValueChange={(v) => updateFilter("income", v)}>
                  <SelectTrigger className="bg-pink-950/50 border-white/10 text-white">
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    {INCOME_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div>
           <Label className="text-xs text-white/60 mb-2 block">
  🛐 {t.search.religion}
</Label>
                <Select value={filters.religion} onValueChange={(v) => updateFilter("religion", v)}>
                  <SelectTrigger className="bg-pink-950/50 border-white/10 text-white">
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    {RELIGION_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs text-white/60 mb-2 block">
  🚬 {t.search.smoking}
</Label>
                <Select value={filters.smoking} onValueChange={(v) => updateFilter("smoking", v)}>
                  <SelectTrigger className="bg-pink-950/50 border-white/10 text-white">
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    {SMOKING_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs text-white/60 mb-2 block">
  🍺 {t.search.alcohol}
</Label>
                <Select value={filters.alcohol} onValueChange={(v) => updateFilter("alcohol", v)}>
                  <SelectTrigger className="bg-pink-950/50 border-white/10 text-white">
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    {ALCOHOL_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs text-white/60 mb-2 block">
  👶 {t.search.children}
</Label>
                <Select value={filters.children} onValueChange={(v) => updateFilter("children", v)}>
                  <SelectTrigger className="bg-pink-950/50 border-white/10 text-white">
                    <SelectValue placeholder="Seçiniz" />
                  </SelectTrigger>
                  <SelectContent>
                    {CHILDREN_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div>
               <Label className="text-xs text-white/60 mb-2 block">
  📏 {t.search.height}
</Label>
                <div className="flex items-center gap-2">
                  <Input type="number" placeholder="Min"
                    className="bg-pink-950/50 border-white/10 text-white text-center"
                    value={filters.minHeight} onChange={(e) => updateFilter("minHeight", e.target.value)} />
                  <span className="text-white/30">—</span>
                  <Input type="number" placeholder="Max"
                    className="bg-pink-950/50 border-white/10 text-white text-center"
                    value={filters.maxHeight} onChange={(e) => updateFilter("maxHeight", e.target.value)} />
                </div>
              </div>

              <div>
              <Label className="text-xs text-white/60 mb-2 block">
  ⚖️ {t.search.weight}
</Label>
                <div className="flex items-center gap-2">
                  <Input type="number" placeholder="Min"
                    className="bg-pink-950/50 border-white/10 text-white text-center"
                    value={filters.minWeight} onChange={(e) => updateFilter("minWeight", e.target.value)} />
                  <span className="text-white/30">—</span>
                  <Input type="number" placeholder="Max"
                    className="bg-pink-950/50 border-white/10 text-white text-center"
                    value={filters.maxWeight} onChange={(e) => updateFilter("maxWeight", e.target.value)} />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 mt-5 pt-5 border-t border-white/10">
              <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
                <Checkbox checked={filters.hasPhotos} onCheckedChange={(v) => updateFilter("hasPhotos", v === true)} className="border-white/30 data-[state=checked]:bg-pink-600" />
                {t.search.hasPhotos}
              </label>
              <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
                <Checkbox checked={filters.isOnline} onCheckedChange={(v) => updateFilter("isOnline", v === true)} className="border-white/30 data-[state=checked]:bg-pink-600" />
              {t.search.online}
              </label>
              <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
                <Checkbox checked={filters.isNewMember} onCheckedChange={(v) => updateFilter("isNewMember", v === true)} className="border-white/30 data-[state=checked]:bg-pink-600" />
               {t.search.newMember}
              </label>
            </div>

            <div className="flex items-center gap-3 mt-5 pt-5 border-t border-white/10">
              <div className="flex-1 max-w-xs">
                <Input type="text" placeholder={t.search.usernamePlaceholder}
                  className="bg-pink-950/50 border-white/10 text-white"
                  value={filters.username} onChange={(e) => updateFilter("username", e.target.value)} />
              </div>
              <Button className="bg-pink-600 hover:bg-pink-700 text-white h-11 px-8" onClick={handleSearch} disabled={loading}>
                <Search className="w-4 h-4 mr-2" /> {loading ? "Aranıyor..." : "Seçimleri Uygula"}
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-500" />
            </div>
          ) : results.length > 0 ? (
            <>
              <p className="text-white/40 text-sm mb-6">{results.length} {t.search.resultsFound}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {results.map((profile) => (
  results.map((profile) => {
   const mainPhoto = (profile as any).photos?.[0]?.url;
  return (
 <ProfileCard
  key={profile.id}
  name={`${profile.name}${profile.surname ? " " + profile.surname : ""}`}
  age={profile.age}
  city={profile.city?.name || ""}
  district={profile.district?.name || ""}
  bio={profile.aboutMe || profile.bio || ""}
  verified={profile.isVerified}
  avatar={profile as any}
/>

  );
})

                ))}
              </div>
            </>
          ) : searched ? (
            <div className="text-center py-20 text-white/40">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg">{t.search.noResults}</p>
             <p className="text-sm mt-1">{t.search.broadenFilters}</p>
            </div>
          ) : (
            <div className="text-center py-20 text-white/40">
              <Heart className="w-12 h-12 mx-auto mb-4 opacity-30" />
             <p className="text-lg">{t.search.startSearch}</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
      <AuthDialog activeTab={authTab} onClose={() => setAuthTab(null)} />
    </div>
  );
}