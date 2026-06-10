
"use client";

import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProfileCard from "@/components/ProfileCard";
import { useI18n } from "@/lib/i18n-context";

const demoProfiles = [
  { name: "Elena", age: 29, city: "İstanbul", district: "Kadıköy", bio: "Yeni insanlarla tanışmayı seviyorum ✨", verified: true },
  { name: "Sofia", age: 31, city: "Antalya", district: "Konyaaltı", bio: "Seyahat ve kahve tutkunu ☕" },
  { name: "Merve", age: 27, city: "İzmir", district: "Karşıyaka", bio: "Gün batımı yürüyüşlerini seviyorum 🌅", verified: true },
  { name: "Natalia", age: 33, city: "Muğla", district: "Bodrum", bio: "Deniz, müzik ve eğlence 🌊" },
];

const allCities = [
  "Adana","Adıyaman","Afyonkarahisar","Ağrı","Amasya","Ankara","Antalya","Artvin","Aydın","Balıkesir",
  "Bilecik","Bingöl","Bitlis","Bolu","Burdur","Bursa","Çanakkale","Çankırı","Çorum","Denizli",
  "Diyarbakır","Edirne","Elazığ","Erzincan","Erzurum","Eskişehir","Gaziantep","Giresun","Gümüşhane",
  "Hakkari","Hatay","Isparta","Mersin","İstanbul","İzmir","Kars","Kastamonu","Kayseri","Kırklareli",
  "Kırşehir","Kocaeli","Konya","Kütahya","Malatya","Manisa","Kahramanmaraş","Mardin","Muğla","Muş",
  "Nevşehir","Niğde","Ordu","Rize","Sakarya","Samsun","Siirt","Sinop","Sivas","Tekirdağ","Tokat",
  "Trabzon","Tunceli","Şanlıurfa","Uşak","Van","Yozgat","Zonguldak","Aksaray","Bayburt","Karaman",
  "Kırıkkale","Batman","Şırnak","Bartın","Ardahan","Iğdır","Yalova","Karabük","Kilis","Osmaniye","Düzce",
];

export default function DiscoverMembers() {
  const [selectedCity, setSelectedCity] = useState("");
  const { t } = useI18n();

  return (
    <section id="discover" className="py-20 bg-gradient-to-b from-pink-950 to-pink-900">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-white mb-3">
            {t.discover.title}
          </h2>
          <p className="text-white/60">{t.discover.subtitle}</p>
        </div>

        <div className="max-w-xs mx-auto mb-10">
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="bg-pink-900/40 border-white/10 text-white">
              <SelectValue placeholder={t.auth.selectCity} />
            </SelectTrigger>
            <SelectContent className="bg-pink-950 text-white border-white/10 max-h-72">
              {allCities.map((city) => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {demoProfiles.map((profile, index) => (
            <ProfileCard key={index} {...profile} />
          ))}
        </div>
      </div>
    </section>
  );
}
