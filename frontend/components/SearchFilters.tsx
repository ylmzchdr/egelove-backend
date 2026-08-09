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

type Props = {
  filters: Filters;
  cities: City[];
  districts: District[];
  updateFilter: <K extends keyof Filters>(
    key: K,
    value: Filters[K]
  ) => void;
  clearFilters: () => void;
  handleSearch: () => void;
};

export default function SearchFilters({
  filters,
  cities,
  districts,
  updateFilter,
  clearFilters,
  handleSearch,
}: Props) {
  return (
    <div className="space-y-5">

      <div>
        <label className="text-sm text-white/70">
          Cinsiyet
        </label>

        <select
          className="w-full mt-2 h-11 rounded-xl bg-white/5 border border-white/20 px-3 text-white"
          value={filters.gender}
          onChange={(e)=>updateFilter("gender",e.target.value)}
        >
          <option value="">Seçiniz</option>
          <option value="MALE">Erkek</option>
          <option value="FEMALE">Kadın</option>
        </select>
      </div>


      <div>
        <label className="text-sm text-white/70">
          Şehir
        </label>

        <select
          className="w-full mt-2 h-11 rounded-xl bg-white/5 border border-white/20 px-3 text-white"
          value={filters.cityId}
          onChange={(e)=>updateFilter("cityId",e.target.value)}
        >
          <option value="">
            Şehir seçin
          </option>

          {cities.map((city)=>(
            <option
              key={city.id}
              value={city.id}
            >
              {city.name}
            </option>
          ))}

        </select>
      </div>


      <div>
        <label className="text-sm text-white/70">
          İlçe
        </label>

        <select
          className="w-full mt-2 h-11 rounded-xl bg-white/5 border border-white/20 px-3 text-white"
          value={filters.districtId}
          disabled={!filters.cityId}
          onChange={(e)=>updateFilter("districtId",e.target.value)}
        >

          <option value="">
            İlçe seçin
          </option>

          {districts.map((district)=>(
            <option
              key={district.id}
              value={district.id}
            >
              {district.name}
            </option>
          ))}

        </select>

      </div>


      <div className="flex gap-3 pt-5">

        <button
          onClick={clearFilters}
          className="flex-1 h-12 rounded-xl border border-white/20"
        >
          Temizle
        </button>


        <button
          onClick={handleSearch}
          className="flex-1 h-12 rounded-xl bg-cyan-500 text-white"
        >
          Uygula
        </button>

      </div>

    </div>
  );
}