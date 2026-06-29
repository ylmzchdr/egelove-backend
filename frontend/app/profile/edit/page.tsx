"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthDialog from "@/components/AuthDialog";
import ProfilePhotoUpload from "@/components/ProfilePhotoUpload";
import { api } from "@/lib/api";

const EDUCATION_OPTIONS = [
  { value: "PRIMARY", label: "İlkokul" },
  { value: "HIGH_SCHOOL", label: "Lise" },
  { value: "ASSOCIATE", label: "Ön Lisans" },
  { value: "BACHELOR", label: "Lisans" },
  { value: "MASTER", label: "Yüksek Lisans" },
  { value: "DOCTORATE", label: "Doktora" },
];

const INCOME_OPTIONS = [
  { value: "VERY_LOW", label: "Asgari ücret" },
  { value: "LOW", label: "10-20 bin TL" },
  { value: "MEDIUM", label: "20-40 bin TL" },
  { value: "HIGH", label: "40-70 bin TL" },
  { value: "VERY_HIGH", label: "70 bin TL üzeri" },
];

const MARITAL_OPTIONS = [
  { value: "NEVER_MARRIED", label: "Bekar" },
  { value: "DIVORCED", label: "Boşandı" },
  { value: "WIDOWED", label: "Eşi vefat etti" },
  { value: "SEPARATED", label: "Ayrı yaşıyor" },
];

const CHILDREN_OPTIONS = [
  { value: "NONE", label: "Yok" },
  { value: "HAS_LIVING_WITH", label: "Var (yanımda)" },
  { value: "HAS_NOT_LIVING", label: "Var (yanımda değil)" },
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

const BODY_TYPE_OPTIONS = [
  { value: "SLIM", label: "Zayıf" },
  { value: "ATHLETIC", label: "Atletik" },
  { value: "NORMAL", label: "Normal" },
  { value: "CURVY", label: "Tombul" },
  { value: "PLUS", label: "Kilolu" },
];

const HAIR_COLOR_OPTIONS = [
  { value: "BLACK", label: "Siyah" },
  { value: "BROWN", label: "Kahverengi" },
  { value: "BLOND", label: "Sarı" },
  { value: "RED", label: "Kızıl" },
  { value: "WHITE", label: "Beyaz" },
  { value: "BALD", label: "Kel" },
  { value: "OTHER", label: "Diğer" },
];
const EYE_COLOR_OPTIONS = [
  { value: "BROWN", label: "Kahverengi" },
  { value: "BLUE", label: "Mavi" },
  { value: "GREEN", label: "Yeşil" },
  { value: "HAZEL", label: "Ela" },
  { value: "BLACK", label: "Siyah" },
  { value: "OTHER", label: "Diğer" },
];

const BLOOD_TYPE_OPTIONS = [
  { value: "A_POSITIVE", label: "A+" },
  { value: "A_NEGATIVE", label: "A-" },
  { value: "B_POSITIVE", label: "B+" },
  { value: "B_NEGATIVE", label: "B-" },
  { value: "AB_POSITIVE", label: "AB+" },
  { value: "AB_NEGATIVE", label: "AB-" },
  { value: "ZERO_POSITIVE", label: "0+" },
  { value: "ZERO_NEGATIVE", label: "0-" },
];

const GENDER_OPTIONS = [
  { value: "MALE", label: "Erkek" },
  { value: "FEMALE", label: "Kadın" },
  { value: "OTHER", label: "Diğer" },
];

interface City {
  id: number;
  name: string;
}

interface District {
  id: number;
  name: string;
}

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
  privacySettings?: Record<string, boolean>;
  matchingPreferences?: Record<string, any>;
}

export default function ProfileEditPage() {
  const [authTab, setAuthTab] = useState<"login" | "register" | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [hobbiesInput, setHobbiesInput] = useState("");

  const [form, setForm] = useState<ProfileData>({
    id: "", name: "", surname: "", email: "", phone: "",
    birthDate: "", gender: "", cityId: 0, districtId: 0,
    bio: "", aboutMe: "", lookingFor: "",
    education: "", income: "", religion: "", smoking: "",
    alcohol: "", children: "", bodyType: "", maritalStatus: "",
    height: 0, weight: 0, eyeColor: "", hairColor: "", bloodType: "",
    occupation: "", hobbies: [],
    privacySettings: {},
    matchingPreferences: {},
  });

  const updateField = <K extends keyof ProfileData>(key: K, value: ProfileData[K]) => {
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
    ]).then(([profile, cityList]) => {
      setForm((prev) => ({ ...prev, ...profile, birthDate: profile.birthDate?.split("T")[0] || "" }));
      setCities(cityList);
    setHobbiesInput(Array.isArray(profile.hobbies) ? profile.hobbies.join(", ") : (profile.hobbies || ""));
      setLoading(false);
    }).catch((err) => {
      setError(err.message || "Profil yüklenemedi");
      setLoading(false);
    });
  }, []);

  const handleCityChange = useCallback((cityIdStr: string) => {
    const cityId = parseInt(cityIdStr);
    setForm((prev) => ({ ...prev, cityId, districtId: 0 }));
    setDistricts([]);
    if (cityId) {
      api.cities.districts(cityId).then(setDistricts).catch(() => {});
    }
  }, []);

 const handleSubmit = async () => {
  setSaving(true);
  setError("");
  setSuccess("");

  try {
    const payload: any = {
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
    };

    Object.keys(payload).forEach((k) => {
      if (
        payload[k] === undefined ||
        payload[k] === null ||
        payload[k] === "" ||
        payload[k] === 0
      ) {
        delete payload[k];
      }
    });

    await api.users.update(payload);
    setSuccess("Profil başarıyla güncellendi!");
  } catch (err: any) {
    console.error("PROFILE UPDATE ERROR:", err);
    setError(err.message || "Kaydedilirken hata oluştu");
  } finally {
    setSaving(false);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-pink-950 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-950 text-white">
      <Header onOpenLogin={() => setAuthTab("login")} onOpenRegister={() => setAuthTab("register")} />
      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="text-3xl font-bold mb-8">Profil Düzenle</h1>

          {error && <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 text-red-200">{error}</div>}
          {success && <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-6 text-green-200">{success}</div>}

          <div className="space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Fotoğraflar</h2>
              <ProfilePhotoUpload initialPhotos={(form as any).photos || []} isOwner />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Temel Bilgiler</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Ad</Label>
                  <Input className="bg-pink-950/50 border-white/10 text-white" value={form.name} onChange={(e) => updateField("name", e.target.value)} />
                </div>
                <div>
                  <Label>Soyad</Label>
                  <Input className="bg-pink-950/50 border-white/10 text-white" value={form.surname} onChange={(e) => updateField("surname", e.target.value)} />
                </div>
                <div>
                  <Label>Cinsiyet</Label>
                  <Select value={form.gender} onValueChange={(v) => updateField("gender", v)}>
                    <SelectTrigger className="bg-pink-950/50 border-white/10 text-white"><SelectValue placeholder="Seçin" /></SelectTrigger>
                    <SelectContent>
                      {GENDER_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Telefon</Label>
                  <Input className="bg-pink-950/50 border-white/10 text-white" value={form.phone || ""} onChange={(e) => updateField("phone", e.target.value)} />
                </div>
                <div>
                  <Label>Doğum Tarihi</Label>
                  <Input type="date" className="bg-pink-950/50 border-white/10 text-white" value={form.birthDate} onChange={(e) => updateField("birthDate", e.target.value)} />
                </div>
                <div>
                  <Label>İl</Label>
                  <Select value={form.cityId ? String(form.cityId) : ""} onValueChange={handleCityChange}>
                    <SelectTrigger className="bg-pink-950/50 border-white/10 text-white"><SelectValue placeholder="Seçin" /></SelectTrigger>
                    <SelectContent>
                      {cities.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>İlçe</Label>
                  <Select value={form.districtId ? String(form.districtId) : ""} onValueChange={(v) => updateField("districtId", parseInt(v))}>
                    <SelectTrigger className="bg-pink-950/50 border-white/10 text-white"><SelectValue placeholder="Önce il seçin" /></SelectTrigger>
                    <SelectContent>
                      {districts.map((d) => <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Boy (cm)</Label>
                  <Input type="number" className="bg-pink-950/50 border-white/10 text-white" value={form.height || ""} onChange={(e) => updateField("height", e.target.value ? parseInt(e.target.value) : 0)} />
                </div>
                <div>
                  <Label>Kilo (kg)</Label>
                  <Input type="number" className="bg-pink-950/50 border-white/10 text-white" value={form.weight || ""} onChange={(e) => updateField("weight", e.target.value ? parseInt(e.target.value) : 0)} />
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Detaylı Bilgiler</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Eğitim</Label>
                  <Select value={form.education} onValueChange={(v) => updateField("education", v)}>
                    <SelectTrigger className="bg-pink-950/50 border-white/10 text-white"><SelectValue placeholder="Seçin" /></SelectTrigger>
                    <SelectContent>
                      {EDUCATION_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Meslek</Label>
                  <Input className="bg-pink-950/50 border-white/10 text-white" value={form.occupation || ""} onChange={(e) => updateField("occupation", e.target.value)} />
                </div>
                <div>
                  <Label>Gelir</Label>
                  <Select value={form.income} onValueChange={(v) => updateField("income", v)}>
                    <SelectTrigger className="bg-pink-950/50 border-white/10 text-white"><SelectValue placeholder="Seçin" /></SelectTrigger>
                    <SelectContent>
                      {INCOME_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Medeni Durum</Label>
                  <Select value={form.maritalStatus} onValueChange={(v) => updateField("maritalStatus", v)}>
                    <SelectTrigger className="bg-pink-950/50 border-white/10 text-white"><SelectValue placeholder="Seçin" /></SelectTrigger>
                    <SelectContent>
                      {MARITAL_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Çocuk</Label>
                  <Select value={form.children} onValueChange={(v) => updateField("children", v)}>
                    <SelectTrigger className="bg-pink-950/50 border-white/10 text-white"><SelectValue placeholder="Seçin" /></SelectTrigger>
                    <SelectContent>
                      {CHILDREN_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Sigara</Label>
                  <Select value={form.smoking} onValueChange={(v) => updateField("smoking", v)}>
                    <SelectTrigger className="bg-pink-950/50 border-white/10 text-white"><SelectValue placeholder="Seçin" /></SelectTrigger>
                    <SelectContent>
                      {SMOKING_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Alkol</Label>
                  <Select value={form.alcohol} onValueChange={(v) => updateField("alcohol", v)}>
                    <SelectTrigger className="bg-pink-950/50 border-white/10 text-white"><SelectValue placeholder="Seçin" /></SelectTrigger>
                    <SelectContent>
                      {ALCOHOL_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Din</Label>
                  <Select value={form.religion} onValueChange={(v) => updateField("religion", v)}>
                    <SelectTrigger className="bg-pink-950/50 border-white/10 text-white"><SelectValue placeholder="Seçin" /></SelectTrigger>
                    <SelectContent>
                      {RELIGION_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Vücut Tipi</Label>
                  <Select value={form.bodyType} onValueChange={(v) => updateField("bodyType", v)}>
                    <SelectTrigger className="bg-pink-950/50 border-white/10 text-white"><SelectValue placeholder="Seçin" /></SelectTrigger>
                    <SelectContent>
                      {BODY_TYPE_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Saç Rengi</Label>
                  <Select value={form.hairColor} onValueChange={(v) => updateField("hairColor", v)}>
                    <SelectTrigger className="bg-pink-950/50 border-white/10 text-white"><SelectValue placeholder="Seçin" /></SelectTrigger>
                    <SelectContent>
                      {HAIR_COLOR_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Göz Rengi</Label>
                  <Select value={form.eyeColor} onValueChange={(v) => updateField("eyeColor", v)}>
                    <SelectTrigger className="bg-pink-950/50 border-white/10 text-white"><SelectValue placeholder="Seçin" /></SelectTrigger>
                    <SelectContent>
                      {EYE_COLOR_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Kan Grubu</Label>
                  <Select value={form.bloodType} onValueChange={(v) => updateField("bloodType", v)}>
                    <SelectTrigger className="bg-pink-950/50 border-white/10 text-white"><SelectValue placeholder="Seçin" /></SelectTrigger>
                    <SelectContent>
                      {BLOOD_TYPE_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label>Hobiler (virgülle ayırın)</Label>
                  <Input className="bg-pink-950/50 border-white/10 text-white" value={hobbiesInput} onChange={(e) => setHobbiesInput(e.target.value)} placeholder="Yüzme, kitap okuma, seyahat" />
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Hakkımda</h2>
              <textarea
                className="w-full bg-pink-950/50 border border-white/10 rounded-lg p-3 text-white min-h-[120px] resize-y"
                placeholder="Kendinden bahset..."
                value={form.aboutMe || ""}
                onChange={(e) => updateField("aboutMe", e.target.value)}
              />
              <Label className="mt-4 block">Aradığın özellikler</Label>
              <textarea
                className="w-full bg-pink-950/50 border border-white/10 rounded-lg p-3 text-white min-h-[80px] resize-y mt-1"
                placeholder="Partnerinde aradığın özellikler..."
                value={form.lookingFor || ""}
                onChange={(e) => updateField("lookingFor", e.target.value)}
              />
            </div>

            <Button
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-6 text-lg disabled:opacity-50"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? "Kaydediliyor..." : "Profili Kaydet"}
            </Button>
          </div>
        </div>
      </section>
      <Footer />
      <AuthDialog activeTab={authTab} onClose={() => setAuthTab(null)} />
    </div>
  );
}
