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
    select: "SeÃ§iniz",
    male: "Erkek",
    female: "KadÄ±n",

    city: "Åehir",
    selectCity: "Åehir seÃ§in",

    district: "Ä°lÃ§e",
    selectDistrict: "Ä°lÃ§e seÃ§in",

    ageRange: "YaÅŸ aralÄ±ÄŸÄ±",
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
    gender: "ĞŸĞ¾Ğ»",
    select: "Ğ’Ñ‹Ğ±ĞµÑ€Ğ¸Ñ‚Ğµ",
    male: "ĞœÑƒĞ¶Ñ‡Ğ¸Ğ½Ğ°",
    female: "Ğ–ĞµĞ½Ñ‰Ğ¸Ğ½Ğ°",

    city: "Ğ“Ğ¾Ñ€Ğ¾Ğ´",
    selectCity: "Ğ’Ñ‹Ğ±ĞµÑ€Ğ¸Ñ‚Ğµ Ğ³Ğ¾Ñ€Ğ¾Ğ´",

    district: "Ğ Ğ°Ğ¹Ğ¾Ğ½",
    selectDistrict: "Ğ’Ñ‹Ğ±ĞµÑ€Ğ¸Ñ‚Ğµ Ñ€Ğ°Ğ¹Ğ¾Ğ½",

    ageRange: "Ğ’Ğ¾Ğ·Ñ€Ğ°ÑÑ‚",
    minimum: "ĞœĞ¸Ğ½Ğ¸Ğ¼ÑƒĞ¼",
    maximum: "ĞœĞ°ĞºÑĞ¸Ğ¼ÑƒĞ¼",

    clear: "ĞÑ‡Ğ¸ÑÑ‚Ğ¸Ñ‚ÑŒ",
    apply: "ĞŸÑ€Ğ¸Ğ¼ĞµĞ½Ğ¸Ñ‚ÑŒ",
  },

  ar: {
    gender: "Ø§Ù„Ø¬Ù†Ø³",
    select: "Ø§Ø®ØªØ±",
    male: "Ø±Ø¬Ù„",
    female: "Ø§Ù…Ø±Ø£Ø©",

    city: "Ø§Ù„Ù…Ø¯ÙŠÙ†Ø©",
    selectCity: "Ø§Ø®ØªØ± Ø§Ù„Ù…Ø¯ÙŠÙ†Ø©",

    district: "Ø§Ù„Ù…Ù†Ø·Ù‚Ø©",
    selectDistrict: "Ø§Ø®ØªØ± Ø§Ù„Ù…Ù†Ø·Ù‚Ø©",

    ageRange: "Ø§Ù„ÙØ¦Ø© Ø§Ù„Ø¹Ù…Ø±ÙŠØ©",
    minimum: "Ø§Ù„Ø­Ø¯ Ø§Ù„Ø£Ø¯Ù†Ù‰",
    maximum: "Ø§Ù„Ø­Ø¯ Ø§Ù„Ø£Ù‚ØµÙ‰",

    clear: "Ù…Ø³Ø­",
    apply: "ØªØ·Ø¨ÙŠÙ‚",
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
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="space-y-5"
    >
      {/* Cinsiyet */}
      <div>
        <label className="text-base text-[#6B4454]">
          {t.gender}
        </label>

        <select
          className="w-full mt-2 h-11 rounded-xl bg-pink-50 border border-pink-300 px-3 text-[#2D1721]"
          value={filters.gender}
          onChange={(e) =>
            updateFilter("gender", e.target.value)
          }
        >
          <option value="">
            {t.select}
          </option>

          <option value="MALE">
            {t.male}
          </option>

          <option value="FEMALE">
            {t.female}
          </option>
        </select>
      </div>

      {/* Åehir */}
      <div>
        <label className="text-base text-[#6B4454]">
          {t.city}
        </label>

        <select
          className="w-full mt-2 h-11 rounded-xl bg-pink-50 border border-pink-300 px-3 text-[#2D1721]"
          value={filters.cityId}
          onChange={(e) =>
            updateFilter("cityId", e.target.value)
          }
        >
          <option value="">
            {t.selectCity}
          </option>

          {cities.map((city) => (
            <option
              key={city.id}
              value={city.id}
            >
              {city.name}
            </option>
          ))}
        </select>
      </div>

      {/* Ä°lÃ§e */}
      <div>
        <label className="text-base text-[#6B4454]">
          {t.district}
        </label>

        <select
          className="w-full mt-2 h-11 rounded-xl bg-pink-50 border border-pink-300 px-3 text-[#2D1721]"
          value={filters.districtId}
          disabled={!filters.cityId}
          onChange={(e) =>
            updateFilter("districtId", e.target.value)
          }
        >
          <option value="">
            {t.selectDistrict}
          </option>

          {districts.map((district) => (
            <option
              key={district.id}
              value={district.id}
            >
              {district.name}
            </option>
          ))}
        </select>
      </div>

      {/* YaÅŸ */}
      <div>
        <label className="text-base text-[#6B4454]">
          {t.ageRange}
        </label>

        <div className="grid grid-cols-2 gap-3 mt-2">
          <input
            type="number"
            min="18"
            max="100"
            placeholder={t.minimum}
            value={filters.minAge}
            onChange={(e) =>
              updateFilter("minAge", e.target.value)
            }
            className="w-full h-11 rounded-xl bg-pink-50 border border-pink-300 px-3 text-[#2D1721] placeholder:text-[#8A6372]"
          />

          <input
            type="number"
            min="18"
            max="100"
            placeholder={t.maximum}
            value={filters.maxAge}
            onChange={(e) =>
              updateFilter("maxAge", e.target.value)
            }
            className="w-full h-11 rounded-xl bg-pink-50 border border-pink-300 px-3 text-[#2D1721] placeholder:text-[#8A6372]"
          />
        </div>
      </div>

      {/* Butonlar */}
      <div className="flex gap-3 pt-3 pb-2">
        <button
          type="button"
          onClick={clearFilters}
          className="flex-1 h-12 rounded-xl border border-pink-300 text-[#2D1721]"
        >
          {t.clear}
        </button>

        <button
          type="button"
          onClick={handleSearch}
          className="flex-1 h-12 rounded-xl bg-cyan-500 text-[#2D1721]"
        >
          {t.apply}
        </button>
      </div>
    </div>
  );
}
