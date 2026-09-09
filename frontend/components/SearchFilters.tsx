"use client";

import React from "react";

type City = {
  id: number;
  name: string;
};

type District = {
  id: number;
  name: string;
};

type Filters = {
  gender: string;
  cityId: string;
  districtId: string;
  minAge: string;
  maxAge: string;
};

type K = keyof Filters;

type Props = {
  filters: Filters;
  cities: City[];
  districts: District[];
  updateFilter: (key: K, value: Filters[K]) => void;
  clearFilters: () => void;
  handleSearch: () => void;

  // Dil
  language?: "tr" | "en" | "ru" | "ar";
};

const translations = {
  tr: {
    gender: "Cinsiyet",
    select: "Seçiniz",
    male: "Erkek",
    female: "Kadın",
    city: "Şehir",
    selectCity: "Şehir seçin",
    district: "İlçe",
    selectDistrict: "İlçe seçin",
    ageRange: "Yaş aralığı",
    minimum: "Minimum",
    maximum: "Maksimum",
    clear: "Temizle",
    apply: "Uygula",
  },
  en: {
    gender: "Gender",
    select: "Select",
    male: "Male",
    female: "Female",
    city: "City",
    selectCity: "Select city",
    district: "District",
    selectDistrict: "Select district",
    ageRange: "Age range",
    minimum: "Minimum",
    maximum: "Maximum",
    clear: "Clear",
    apply: "Apply",
  },
  ru: {
    gender: "Пол",
    select: "Выберите",
    male: "Мужчина",
    female: "Женщина",
    city: "Город",
    selectCity: "Выберите город",
    district: "Район",
    selectDistrict: "Выберите район",
    ageRange: "Возраст",
    minimum: "Минимум",
    maximum: "Максимум",
    clear: "Очистить",
    apply: "Применить",
  },
  ar: {
    gender: "الجنس",
    select: "اختر",
    male: "رجل",
    female: "امرأة",
    city: "المدينة",
    selectCity: "اختر المدينة",
    district: "المنطقة",
    selectDistrict: "اختر المنطقة",
    ageRange: "الفئة العمرية",
    minimum: "الحد الأدنى",
    maximum: "الحد الأقصى",
    clear: "مسح",
    apply: "تطبيق",
  },
};

export default function SearchFilters({
  filters,
  cities,
  districts,
  updateFilter,
  clearFilters,
  handleSearch,
  language = "tr",
}: Props) {
  const t = translations[language];
  const isArabic = language === "ar";

  return (
    <div dir={isArabic ? "rtl" : "ltr"} className="space-y-5">
      {/* Cinsiyet */}
      <div>
        <label className="text-base text-[#F8D290]/80">{t.gender}</label>
        <select
          className="w-full mt-2 h-11 rounded-xl bg-[#512510]/60 border border-[#F6BA48]/20 px-3 text-white outline-none focus:border-[#F6BA48] focus:ring-1 focus:ring-[#F6BA48]"
          value={filters.gender}
          onChange={(e) => updateFilter("gender", e.target.value)}
        >
          <option value="">{t.select}</option>
          <option value="MALE">{t.male}</option>
          <option value="FEMALE">{t.female}</option>
        </select>
      </div>

      {/* Şehir */}
      <div>
        <label className="text-base text-[#F8D290]/80">{t.city}</label>
        <select
          className="w-full mt-2 h-11 rounded-xl bg-[#512510]/60 border border-[#F6BA48]/20 px-3 text-white outline-none focus:border-[#F6BA48] focus:ring-1 focus:ring-[#F6BA48]"
          value={filters.cityId}
          onChange={(e) => updateFilter("cityId", e.target.value)}
        >
          <option value="">{t.selectCity}</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      {/* İlçe */}
      <div>
        <label className="text-base text-[#F8D290]/80">{t.district}</label>
        <select
          className="w-full mt-2 h-11 rounded-xl bg-[#512510]/60 border border-[#F6BA48]/20 px-3 text-white outline-none focus:border-[#F6BA48] focus:ring-1 focus:ring-[#F6BA48] disabled:opacity-50 disabled:cursor-not-allowed"
          value={filters.districtId}
          disabled={!filters.cityId}
          onChange={(e) => updateFilter("districtId", e.target.value)}
        >
          <option value="">{t.selectDistrict}</option>
          {districts.map((district) => (
            <option key={district.id} value={district.id}>
              {district.name}
            </option>
          ))}
        </select>
      </div>

      {/* Yaş */}
      <div>
        <label className="text-base text-[#F8D290]/80">{t.ageRange}</label>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <input
            type="number"
            min="18"
            max="100"
            placeholder={t.minimum}
            value={filters.minAge}
            onChange={(e) => updateFilter("minAge", e.target.value)}
            className="w-full h-11 rounded-xl bg-[#512510]/60 border border-[#F6BA48]/20 px-3 text-white placeholder:text-[#9F7C61] outline-none focus:border-[#F6BA48] focus:ring-1 focus:ring-[#F6BA48]"
          />
          <input
            type="number"
            min="18"
            max="100"
            placeholder={t.maximum}
            value={filters.maxAge}
            onChange={(e) => updateFilter("maxAge", e.target.value)}
            className="w-full h-11 rounded-xl bg-[#512510]/60 border border-[#F6BA48]/20 px-3 text-white placeholder:text-[#9F7C61] outline-none focus:border-[#F6BA48] focus:ring-1 focus:ring-[#F6BA48]"
          />
        </div>
      </div>

      {/* Butonlar */}
      <div className="flex gap-3 pt-3 pb-2">
        <button
          type="button"
          onClick={clearFilters}
          className="flex-1 h-12 rounded-xl border border-[#F6BA48]/30 text-[#F8D290] hover:bg-[#F6BA48]/10 transition-colors"
        >
          {t.clear}
        </button>

        <button
          type="button"
          onClick={handleSearch}
          className="flex-1 h-12 rounded-xl bg-[#F6BA48] hover:bg-[#EF912C] text-[#310D0C] font-semibold transition-colors"
        >
          {t.apply}
        </button>
      </div>
    </div>
  );
}
