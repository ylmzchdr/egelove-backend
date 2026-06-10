"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProfilePhotoUpload from "@/components/ProfilePhotoUpload";
import { api } from "@/lib/api";

const STEPS = ["Temel Bilgiler", "Fiziksel", "Yaşam Tarzı", "Hakkımda", "Fotoğraflar"];

const GENDER_OPTIONS = [
  { value: "MALE", label: "Erkek" },
  { value: "FEMALE", label: "Kadın" },
  { value: "OTHER", label: "Diğer" },
];

const EDUCATION_OPTIONS = [
  { value: "PRIMARY", label: "İlkokul" },
  { value: "SECONDARY", label: "Ortaokul" },
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
  { value: "NEVER_MARRIED", label: "Hiç evlenmedi" },
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
  { value: "A_POSITIVE", label: "A+" }, { value: "A_NEGATIVE", label: "A-" },
  { value: "B_POSITIVE", label: "B+" }, { value: "B_NEGATIVE", label: "B-" },
  { value: "AB_POSITIVE", label: "AB+" }, { value: "AB_NEGATIVE", label: "AB-" },
  { value: "ZERO_POSITIVE", label: "0+" }, { value: "ZERO_NEGATIVE", label: "0-" },
];

interface City { id: number; name: string; }
interface District { id: number; name: string; }

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);

  const [form, setForm] = useState({
    name: "", surname: "", birthDate: "", gender: "", phone: "",
    cityId: 0, districtId: 0,
    height: 0, weight: 0, bodyType: "", hairColor: "", eyeColor: "", bloodType: "",
    education: "", occupation: "", income: "", maritalStatus: "",
    children: "", smoking: "", alcohol: "", religion: "",
    aboutMe: "", lookingFor: "", hobbies: "",
  });

  const update = (key: string, value: any) => setForm((p) => ({ ...p, [key]: value }));

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) { router.push("/"); return; }
    api.cities.list().then(setCities).catch(() => {});
    api.users.me().then((p: any) => {
      if (p.name) setForm((prev) => ({
        ...prev,
        name: p.name || "", surname: p.surname || "", birthDate: p.birthDate?.split("T")[0] || "",
        gender: p.gender || "", phone: p.phone || "", cityId: p.cityId || 0, districtId: p.districtId || 0,
        height: p.height || 0, weight: p.weight || 0, bodyType: p.bodyType || "",
        hairColor: p.hairColor || "", eyeColor: p.eyeColor || "", bloodType: p.bloodType || "",
        education: p.education || "", occupation: p.occupation || "", income: p.income || "",
        maritalStatus: p.maritalStatus || "", children: p.children || "",
        smoking: p.smoking || "", alcohol: p.alcohol || "", religion: p.religion || "",
        aboutMe: p.aboutMe || "", lookingFor: p.lookingFor || "",
        hobbies: (p.hobbies || []).join(", "),
      }));
      if (p.cityId) api.cities.districts(p.cityId).then(setDistricts).catch(() => {});
    }).catch(() => router.push("/"));
  }, []);

  const loadDistricts = async (cityId: number) => {
    update("cityId", cityId);
    update("districtId", 0);
    setDistricts([]);
    if (cityId) api.cities.districts(cityId).then(setDistricts).catch(() => {});
  };

  const canProceed = () => {
    if (step === 0) return form.name && form.surname && form.birthDate && form.gender;
    return true;
  };

  const saveAndNext = async () => {
    if (step < STEPS.length - 1) { setStep(step + 1); return; }
    setSaving(true);
    try {
      const payload: any = {
        name: form.name, surname: form.surname, birthDate: form.birthDate,
        gender: form.gender, phone: form.phone || undefined,
        cityId: form.cityId || undefined, districtId: form.districtId || undefined,
        height: form.height || undefined, weight: form.weight || undefined,
        bodyType: form.bodyType || undefined, hairColor: form.hairColor || undefined,
        eyeColor: form.eyeColor || undefined, bloodType: form.bloodType || undefined,
        education: form.education || undefined, occupation: form.occupation || undefined,
        income: form.income || undefined, maritalStatus: form.maritalStatus || undefined,
        children: form.children || undefined, smoking: form.smoking || undefined,
        alcohol: form.alcohol || undefined, religion: form.religion || undefined,
        aboutMe: form.aboutMe || undefined, lookingFor: form.lookingFor || undefined,
        hobbies: form.hobbies.split(",").map((h: string) => h.trim()).filter(Boolean),
      };
      Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);
      await api.users.update(payload);
      router.push("/");
    } catch {
    } finally {
      setSaving(false);
    }
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-pink-950 text-white">
      <Header />
      <section className="py-12">
        <div className="mx-auto max-w-2xl px-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-8">
            <div className="flex justify-between mb-2">
              <h1 className="text-2xl font-bold">Profilini Oluştur</h1>
              <span className="text-white/40 text-sm">{step + 1}/{STEPS.length}</span>
            </div>

            <div className="w-full bg-white/10 rounded-full h-2 mb-8">
              <div className="bg-pink-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>

            {step === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2"><Label className="text-lg">Adın soyadın nedir?</Label></div>
                <div><Label>Ad</Label><Input className="bg-pink-950/50 border-white/10 text-white" value={form.name} onChange={(e) => update("name", e.target.value)} /></div>
                <div><Label>Soyad</Label><Input className="bg-pink-950/50 border-white/10 text-white" value={form.surname} onChange={(e) => update("surname", e.target.value)} /></div>
                <div><Label>Doğum Tarihi</Label><Input type="date" className="bg-pink-950/50 border-white/10 text-white" value={form.birthDate} onChange={(e) => update("birthDate", e.target.value)} /></div>
                <div>
                  <Label>Cinsiyet</Label>
                  <Select value={form.gender} onValueChange={(v) => update("gender", v)}>
                    <SelectTrigger className="bg-pink-950/50 border-white/10 text-white"><SelectValue placeholder="Seçin" /></SelectTrigger>
                    <SelectContent>
                      {GENDER_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Telefon (isteğe bağlı)</Label><Input className="bg-pink-950/50 border-white/10 text-white" value={form.phone} onChange={(e) => update("phone", e.target.value)} /></div>
                <div>
                  <Label>İl</Label>
                  <Select value={form.cityId ? String(form.cityId) : ""} onValueChange={(v) => loadDistricts(parseInt(v))}>
                    <SelectTrigger className="bg-pink-950/50 border-white/10 text-white"><SelectValue placeholder="Seçin" /></SelectTrigger>
                    <SelectContent>
                      {cities.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>İlçe</Label>
                  <Select value={form.districtId ? String(form.districtId) : ""} onValueChange={(v) => update("districtId", parseInt(v))}>
                    <SelectTrigger className="bg-pink-950/50 border-white/10 text-white"><SelectValue placeholder="Önce il seçin" /></SelectTrigger>
                    <SelectContent>
                      {districts.map((d) => <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2"><Label className="text-lg">Fiziksel özelliklerin neler?</Label></div>
                <div><Label>Boy (cm)</Label><Input type="number" className="bg-pink-950/50 border-white/10 text-white" value={form.height || ""} onChange={(e) => update("height", e.target.value ? parseInt(e.target.value) : 0)} /></div>
                <div><Label>Kilo (kg)</Label><Input type="number" className="bg-pink-950/50 border-white/10 text-white" value={form.weight || ""} onChange={(e) => update("weight", e.target.value ? parseInt(e.target.value) : 0)} /></div>
                <div><Label>Vücut Tipi</Label>
                  <Select value={form.bodyType} onValueChange={(v) => update("bodyType", v)}>
                    <SelectTrigger className="bg-pink-950/50 border-white/10 text-white"><SelectValue placeholder="Seçin" /></SelectTrigger>
                    <SelectContent>{BODY_TYPE_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Saç Rengi</Label>
                  <Select value={form.hairColor} onValueChange={(v) => update("hairColor", v)}>
                    <SelectTrigger className="bg-pink-950/50 border-white/10 text-white"><SelectValue placeholder="Seçin" /></SelectTrigger>
                    <SelectContent>{HAIR_COLOR_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Göz Rengi</Label>
                  <Select value={form.eyeColor} onValueChange={(v) => update("eyeColor", v)}>
                    <SelectTrigger className="bg-pink-950/50 border-white/10 text-white"><SelectValue placeholder="Seçin" /></SelectTrigger>
                    <SelectContent>{EYE_COLOR_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Kan Grubu</Label>
                  <Select value={form.bloodType} onValueChange={(v) => update("bloodType", v)}>
                    <SelectTrigger className="bg-pink-950/50 border-white/10 text-white"><SelectValue placeholder="Seçin" /></SelectTrigger>
                    <SelectContent>{BLOOD_TYPE_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2"><Label className="text-lg">Yaşam tarzın nasıl?</Label></div>
                <div><Label>Eğitim</Label>
                  <Select value={form.education} onValueChange={(v) => update("education", v)}>
                    <SelectTrigger className="bg-pink-950/50 border-white/10 text-white"><SelectValue placeholder="Seçin" /></SelectTrigger>
                    <SelectContent>{EDUCATION_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Meslek</Label><Input className="bg-pink-950/50 border-white/10 text-white" value={form.occupation} onChange={(e) => update("occupation", e.target.value)} /></div>
                <div><Label>Gelir</Label>
                  <Select value={form.income} onValueChange={(v) => update("income", v)}>
                    <SelectTrigger className="bg-pink-950/50 border-white/10 text-white"><SelectValue placeholder="Seçin" /></SelectTrigger>
                    <SelectContent>{INCOME_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Medeni Durum</Label>
                  <Select value={form.maritalStatus} onValueChange={(v) => update("maritalStatus", v)}>
                    <SelectTrigger className="bg-pink-950/50 border-white/10 text-white"><SelectValue placeholder="Seçin" /></SelectTrigger>
                    <SelectContent>{MARITAL_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Çocuk</Label>
                  <Select value={form.children} onValueChange={(v) => update("children", v)}>
                    <SelectTrigger className="bg-pink-950/50 border-white/10 text-white"><SelectValue placeholder="Seçin" /></SelectTrigger>
                    <SelectContent>{CHILDREN_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Sigara</Label>
                  <Select value={form.smoking} onValueChange={(v) => update("smoking", v)}>
                    <SelectTrigger className="bg-pink-950/50 border-white/10 text-white"><SelectValue placeholder="Seçin" /></SelectTrigger>
                    <SelectContent>{SMOKING_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Alkol</Label>
                  <Select value={form.alcohol} onValueChange={(v) => update("alcohol", v)}>
                    <SelectTrigger className="bg-pink-950/50 border-white/10 text-white"><SelectValue placeholder="Seçin" /></SelectTrigger>
                    <SelectContent>{ALCOHOL_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Din</Label>
                  <Select value={form.religion} onValueChange={(v) => update("religion", v)}>
                    <SelectTrigger className="bg-pink-950/50 border-white/10 text-white"><SelectValue placeholder="Seçin" /></SelectTrigger>
                    <SelectContent>{RELIGION_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <Label className="text-lg">Kendinden bahset</Label>
                <textarea className="w-full bg-pink-950/50 border border-white/10 rounded-lg p-3 text-white min-h-[120px] resize-y" placeholder="Hobilerin, ilgi alanların, hayallerin..." value={form.aboutMe} onChange={(e) => update("aboutMe", e.target.value)} />
                <Label className="text-lg">Partnerinde aradığın özellikler</Label>
                <textarea className="w-full bg-pink-950/50 border border-white/10 rounded-lg p-3 text-white min-h-[80px] resize-y" placeholder="Nasıl birini arıyorsun?" value={form.lookingFor} onChange={(e) => update("lookingFor", e.target.value)} />
                <Label>Hobiler (virgülle ayırın)</Label>
                <Input className="bg-pink-950/50 border-white/10 text-white" placeholder="Yüzme, kitap okuma, seyahat" value={form.hobbies} onChange={(e) => update("hobbies", e.target.value)} />
              </div>
            )}

            {step === 4 && (
              <div>
                <Label className="text-lg mb-4 block">Profil fotoğrafların</Label>
                <ProfilePhotoUpload />
                <p className="text-white/40 text-sm mt-4">En az 1 fotoğraf yüklemen önerilir. Fotoğraflar onaylandıktan sonra profilin görünür olacak.</p>
              </div>
            )}

            <div className="flex gap-3 mt-8">
              {step > 0 && (
                <Button variant="outline" className="border-white/20 text-white flex-1" onClick={() => setStep(step - 1)}>
                  Geri
                </Button>
              )}
              <Button
                className="bg-pink-600 hover:bg-pink-700 text-white flex-1 disabled:opacity-50"
                onClick={saveAndNext}
                disabled={!canProceed() || saving}
              >
                {step < STEPS.length - 1 ? "Devam" : saving ? "Kaydediliyor..." : "Tamamla"}
              </Button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
