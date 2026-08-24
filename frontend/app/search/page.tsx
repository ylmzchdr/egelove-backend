"use client";

import React, { useState, useEffect } from "react";
import { Search, MapPin, SlidersHorizontal, Users, Shield, Zap } from "lucide-react";

// --- GÜVENLİ INPUT BİLEŞENLERİ ---
interface StyledInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

function StyledInput({ className = "", ...props }: StyledInputProps) {
  return (
    <input
      className={`h-11 w-full rounded-xl border border-white/12 bg-white/[0.05] px-3 text-base text-white outline-none transition focus:ring-2 focus:ring-cyan-400 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}

interface RangeInputsProps {
  minValue: string | number;
  maxValue: string | number;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
  minPlaceholder?: string;
  maxPlaceholder?: string;
}

function RangeInputs({
  minValue,
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
  onCheckedChange: (value: boolean) => void;
  icon: React.ReactNode;
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
      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition select-none ${
        checked
          ? "border-cyan-300/50 bg-cyan-300/10 text-white"
          : "border-white/10 bg-white/[0.04] text-white/60 hover:bg-white/[0.07] hover:text-white"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="h-4 w-4 rounded border-white/30 bg-transparent text-cyan-400 focus:ring-0 accent-cyan-400"
      />
      <span className="relative text-cyan-300">
        {icon}
        {pulse && checked && (
          <span className="absolute -right-1 -top-1 h-2 w-2 animate-ping rounded-full bg-emerald-400" />
        )}
      </span>
      <span className="text-base font-semibold">{label}</span>
    </label>
  );
}

// --- ANA ARAMA SAYFASI BİLEŞENİ ---
export default function SearchPage() {
  const [isClient, setIsClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  // Filtre Durumları
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [onlyOnline, setOnlyOnline] = useState(false);
  const [onlyPremium, setOnlyPremium] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-[#121420] text-white flex flex-col items-center p-4 sm:p-6">
      
      {/* 🚀 EGELOVE.TR ULUSAL AMBLEM VE VIP SLOGAN ALANI */}
      <div className="w-full max-w-xl mx-auto mb-8 mt-6 text-center flex flex-col items-center justify-center gap-3">
        {/* Canavar Amblem ve Logo */}
        <div className="flex items-center gap-2 select-none">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <span className="text-white font-black text-xl tracking-tighter">E</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white via-purple-200 to-cyan-300 bg-clip-text text-transparent">
            EGELOVE<span className="text-cyan-400 text-xl font-bold">.TR</span>
          </h1>
        </div>

        {/* Canlı Slogan Şeridi (81 İl Vizyonu) */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <p className="text-xs font-bold tracking-wide text-cyan-400">
            81 İLDEN CANLI VE GÜVENLİ BAĞLANTI MERKEZİ
          </p>
        </div>
      </div>

      {/* 🔍 ANA ARAMA PANELİ KUTUSU */}
      <div className="w-full max-w-xl mx-auto space-y-4">
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="İsim, şehir veya kullanıcı adı ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 w-full rounded-xl border border-white/12 bg-white/[0.05] pl-11 pr-4 text-base text-white outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex h-12 w-12 items-center justify-center rounded-xl border transition ${
              showFilters 
                ? "border-cyan-400 bg-cyan-400/10 text-cyan-400" 
                : "border-white/12 bg-white/[0.05] text-white/60 hover:bg-white/[0.08]"
            }`}
          >
            <SlidersHorizontal className="h-5 w-5" />
          </button>
        </div>

        {/* 🛠️ GELİŞMİŞ FİLTRE PANELİ (AÇILIR-KAPANIR) */}
        {showFilters && (
          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-xl space-y-5 animate-in fade-in-50 duration-200">
            {/* Yaş Aralığı Ayarı */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white/60 flex items-center gap-2">
                <Users className="h-4 w-4 text-cyan-400" /> Yaş Aralığı
              </label>
              <RangeInputs
                minValue={minAge}
                maxValue={maxAge}
                onMinChange={setMinAge}
                onMaxChange={setMaxAge}
                minPlaceholder="En az"
                maxPlaceholder="En çok"
              />
            </div>

            {/* Durum Filtreleri */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FilterCheckbox
                checked={onlyOnline}
                onCheckedChange={setOnlyOnline}
                icon={<Zap className="h-4 w-4" />}
                label="Sadece Çevrimiçi"
                pulse={true}
              />
              <FilterCheckbox
                checked={onlyPremium}
                onCheckedChange={setOnlyPremium}
                icon={<Shield className="h-4 w-4" />}
                label="Sadece VIP Üyeler"
              />
            </div>
          </div>
        )}

        {/* 🎴 ARAMA SONUÇLARI ALANI */}
        <div className="pt-4 text-center text-white/40 text-sm">
          Arama kriterlerine uygun sonuçlar burada listelenecektir.
        </div>
      </div>

    </div>
  );
}
