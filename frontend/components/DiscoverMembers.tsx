"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProfileCard from "@/components/ProfileCard";
import { useI18n } from "@/lib/i18n-context";

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
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();

  useEffect(() => {
    setMembers([]);
    setLoading(false);
  }, []);

  return (
    <section
      id="discover"
      className="bg-gradient-to-b from-[#310D0C] via-[#512510] to-[#310D0C] py-20"
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-4xl font-bold text-[#FFF7E8]">
            {t.discover.title}
          </h2>
          <p className="text-[#B5A093]">{t.discover.subtitle}</p>
        </div>

        <div className="mx-auto mb-10 max-w-xs">
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="border-[#F6BA48]/20 bg-[#683312]/45 text-[#FFF7E8] focus:ring-[#F6BA48]/35">
              <SelectValue placeholder={t.auth.selectCity} />
            </SelectTrigger>
            <SelectContent className="max-h-72 border-[#F6BA48]/20 bg-[#512510] text-[#FFF7E8]">
              {allCities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            <p className="col-span-full text-center text-[#B5A093]">
              Yükleniyor...
            </p>
          ) : members.length === 0 ? (
            <p className="col-span-full text-center text-[#B5A093]">
              Henüz gösterilecek üye yok
            </p>
          ) : (
            members.map((user) => (
              <ProfileCard
                key={user.id}
                id={user.id}
                name={`${user.name || ""}${user.surname ? " " + user.surname : ""}`}
                age={
                  user.birthDate
                    ? new Date().getFullYear() -
                      new Date(user.birthDate).getFullYear()
                    : undefined
                }
                city={user.city?.name}
                district={user.district?.name}
                bio={user.bio}
                verified={user.isVerified}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
