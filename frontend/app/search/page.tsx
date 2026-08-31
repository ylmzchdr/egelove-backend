"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { api } from "@/lib/api";

import {
  Search,
  SlidersHorizontal,
  Users,
  Shield,
  Zap,
  MapPin,
  Loader2,
  UserRound,
} from "lucide-react";

// --------------------------------------------------
// KULLANICI TİPİ
// --------------------------------------------------

interface SearchUser {
  id: string;
  username: string;
  name: string;
  age: number | null;
  city: string;
  district: string;
  avatar: string | null;
  photo: string | null;
  online: boolean;
  premium: boolean;
  verified: boolean;
  lastSeen: string | null;
}

interface SearchResponse {
  total: number;
  page: number;
  limit: number;
  pages: number;
  users: SearchUser[];
}

// --------------------------------------------------
// INPUT
// --------------------------------------------------

interface StyledInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

function StyledInput({
  className = "",
  ...props
}: StyledInputProps) {
  return (
    <input
      className={`h-11 w-full rounded-xl border border-white/12 bg-white/[0.05] px-3 text-base text-white outline-none transition focus:ring-2 focus:ring-cyan-400 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}

// --------------------------------------------------
// YAŞ ARALIĞI
// --------------------------------------------------

interface RangeInputsProps {
  minValue: string;
  maxValue: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
}

function RangeInputs({
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
}: RangeInputsProps) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
      <StyledInput
        type="number"
        min="18"
        max="99"
        placeholder="En az"
        value={minValue}
        onChange={(event) => onMinChange(event.target.value)}
      />

      <span className="text-white/50">-</span>

      <StyledInput
        type="number"
        min="18"
        max="99"
        placeholder="En çok"
        value={maxValue}
        onChange={(event) => onMaxChange(event.target.value)}
      />
    </div>
  );
}

// --------------------------------------------------
// CHECKBOX
// --------------------------------------------------

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

      <span className="text-base font-semibold">
        {label}
      </span>
    </label>
  );
}

// --------------------------------------------------
// SONUÇ KARTI
// --------------------------------------------------

function UserCard({ user }: { user: SearchUser }) {
 
  const image = user.photo || user.avatar;

  return (
    <Link
      href={`/profile/${user.id}`}
      className="group block cursor-pointer rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-cyan-400/40 hover:bg-white/[0.07]"
    >
      <div className="flex items-center gap-4">

        {/* FOTOĞRAF */}
        <div className="relative shrink-0">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-slate-800">
            {image ? (
              <img
                src={image}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <UserRound className="h-7 w-7 text-white/40" />
            )}
          </div>

          {/* ONLINE */}
          {user.online && (
            <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-[#121420] bg-emerald-400" />
          )}
        </div>

        {/* BİLGİLER */}
        <div className="min-w-0 flex-1">

          <div className="flex items-center gap-2">
            <h3 className="truncate text-lg font-bold text-white">
              {user.name}
            </h3>

            {user.verified && (
              <span className="rounded-full bg-cyan-400/10 px-2 py-0.5 text-xs font-semibold text-cyan-300">
                ✓
              </span>
            )}

            {user.premium && (
              <span className="rounded-full bg-purple-400/10 px-2 py-0.5 text-xs font-semibold text-purple-300">
                VIP
              </span>
            )}
          </div>

          <p className="truncate text-sm text-white/40">
            @{user.username}
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-white/50">

            {user.age !== null && (
              <span>{user.age} yaş</span>
            )}

            {user.city && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {user.city}
              </span>
            )}

            {user.online && (
              <span className="font-semibold text-emerald-400">
                Çevrimiçi
              </span>
            )}

          </div>
        </div>
      </div>
    </Link>
  );
}

// --------------------------------------------------
// ANA ARAMA SAYFASI
// --------------------------------------------------

export default function SearchPage() {
    const searchParams = useSearchParams();
  const isOnlineFilter = searchParams.get('online') === 'true';

  const [isClient, setIsClient] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");

  const [onlyOnline, setOnlyOnline] = useState(isOnlineFilter);

  const [onlyPremium, setOnlyPremium] = useState(false);

  const [results, setResults] = useState<SearchUser[]>([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  // --------------------------------------------------
  // GERÇEK ARAMA
  // --------------------------------------------------

  async function performSearch() {
    const query = searchQuery.trim();

    // Boş aramada sonuç göstermiyoruz
    if (
      query.length === 0 &&
      !minAge &&
      !maxAge &&
      !onlyOnline &&
      !onlyPremium
    ) {
      setResults([]);
      setTotal(0);
      setHasSearched(false);
      setError("");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload: Record<string, unknown> = {
        limit: 20,
        page: 1,
      };

      // İsim / kullanıcı adı
      if (query.length > 0) {
        payload.username = query;
      }

      // Yaş
      if (minAge) {
        payload.minAge = Number(minAge);
      }

      if (maxAge) {
        payload.maxAge = Number(maxAge);
      }

      // Çevrimiçi
      if (onlyOnline) {
        payload.online = true;
      }

      // VIP
      if (onlyPremium) {
        payload.premium = true;
      }

      console.log("🔍 ARAMA GÖNDERİLİYOR:", payload);

      const response = (await api.users.search(
        payload
      )) as SearchResponse;

      console.log("🟢 ARAMA CEVABI:", response);

      const normalizedUsers = (response?.users ?? [])
  .map((user: any) => ({
    ...user,
    id: String(user.id ?? user.userId ?? user._id ?? ""),
  }))
  .filter((user) => user.id);

setResults(normalizedUsers);
setTotal(response?.total ?? 0);
setHasSearched(true);

    } catch (err) {
      console.error("🔴 ARAMA HATASI:", err);

      setResults([]);
      setTotal(0);
      setHasSearched(true);

      setError(
        err instanceof Error
          ? err.message
          : "Arama sırasında bir hata oluştu."
      );
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------------------------
  // ENTER İLE ARAMA
  // --------------------------------------------------

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "Enter") {
      event.preventDefault();
      performSearch();
    }
  }

  // --------------------------------------------------
  // FİLTRE DEĞİŞİNCE ARA
  // --------------------------------------------------

  useEffect(() => {
    if (!hasSearched) return;

    const timer = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [minAge, maxAge, onlyOnline, onlyPremium]);

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#121420] px-4 py-6 text-white sm:px-6">

      {/* ------------------------------------------------ */}
      {/* LOGO */}
      {/* ------------------------------------------------ */}

      <div className="mx-auto mb-8 mt-6 flex w-full max-w-xl flex-col items-center justify-center gap-3 text-center">

        <div className="flex select-none items-center gap-2">

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 shadow-lg shadow-purple-500/20">
            <span className="text-xl font-black tracking-tighter text-white">
              E
            </span>
          </div>

          <h1 className="bg-gradient-to-r from-white via-purple-200 to-cyan-300 bg-clip-text text-3xl font-black tracking-tight text-transparent">
            EGELOVE
            <span className="text-xl font-bold text-cyan-400">
              .TR
            </span>
          </h1>

        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 backdrop-blur-md">

          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
          </span>

          <p className="text-xs font-bold tracking-wide text-cyan-400">
            81 İLDEN CANLI VE GÜVENLİ BAĞLANTI MERKEZİ
          </p>

        </div>
      </div>

      {/* ------------------------------------------------ */}
      {/* ARAMA */}
      {/* ------------------------------------------------ */}

      <div className="mx-auto w-full max-w-xl space-y-4">

        <div className="relative flex items-center gap-2">

          <div className="relative flex-1">

            <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />

            <input
              type="text"
              placeholder="İsim, şehir veya kullanıcı adı ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-12 w-full rounded-xl border border-white/12 bg-white/[0.05] pl-11 pr-4 text-base text-white outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
            />

          </div>
                <Link
        href="/dashboard"
        className="mx-auto mt-3 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/70 transition-all duration-200 hover:border-cyan-400/30 hover:bg-cyan-400/[0.06] hover:text-cyan-300"
      >
        ← Anasayfaya Dön
      </Link>

          {/* ARAMA BUTONU */}

          <button
            type="button"
            onClick={performSearch}
            disabled={loading}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-400/10 text-cyan-300 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50"
            title="Ara"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </button>

          {/* FİLTRE */}

          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition ${
              showFilters
                ? "border-cyan-400 bg-cyan-400/10 text-cyan-400"
                : "border-white/12 bg-white/[0.05] text-white/60 hover:bg-white/[0.08]"
            }`}
            title="Filtreler"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </button>

        </div>

        {/* ------------------------------------------------ */}
        {/* FİLTRELER */}
        {/* ------------------------------------------------ */}

        {showFilters && (
          <div className="space-y-5 rounded-2xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-xl">

            <div className="space-y-2">

              <label className="flex items-center gap-2 text-sm font-semibold text-white/60">
                <Users className="h-4 w-4 text-cyan-400" />
                Yaş Aralığı
              </label>

              <RangeInputs
                minValue={minAge}
                maxValue={maxAge}
                onMinChange={setMinAge}
                onMaxChange={setMaxAge}
              />

            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

              <FilterCheckbox
                checked={onlyOnline}
                onCheckedChange={setOnlyOnline}
                icon={<Zap className="h-4 w-4" />}
                label="Sadece Çevrimiçi"
                pulse
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

        {/* ------------------------------------------------ */}
        {/* HATA */}
        {/* ------------------------------------------------ */}

        {error && (
          <div className="rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-center text-sm text-red-300">
            {error}
          </div>
        )}

        {/* ------------------------------------------------ */}
        {/* SONUÇ SAYISI */}
        {/* ------------------------------------------------ */}

        {hasSearched && !loading && !error && (
          <div className="flex items-center justify-between px-1 pt-3">

            <span className="text-sm text-white/40">
              {total === 0
                ? "Sonuç bulunamadı"
                : `${total} sonuç bulundu`}
            </span>

            {searchQuery.trim() && (
              <span className="text-sm font-semibold text-cyan-400">
                "{searchQuery.trim()}"
              </span>
            )}

          </div>
        )}

        {/* ------------------------------------------------ */}
        {/* YÜKLENİYOR */}
        {/* ------------------------------------------------ */}

        {loading && (
          <div className="flex flex-col items-center justify-center py-12 text-center">

            <Loader2 className="mb-3 h-8 w-8 animate-spin text-cyan-400" />

            <p className="text-sm text-white/50">
              Kullanıcılar aranıyor...
            </p>

          </div>
        )}

        {/* ------------------------------------------------ */}
        {/* SONUÇLAR */}
        {/* ------------------------------------------------ */}

        {!loading && hasSearched && !error && results.length > 0 && (
          <div className="grid gap-3 pt-2">

            {results.map((user) => (
              <UserCard
                key={user.id}
                user={user}
              />
            ))}

          </div>
        )}

        {/* ------------------------------------------------ */}
        {/* SONUÇ YOK */}
        {/* ------------------------------------------------ */}

        {!loading &&
          hasSearched &&
          !error &&
          results.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center">

              <Search className="mx-auto mb-4 h-10 w-10 text-white/20" />

              <h2 className="text-lg font-bold text-white/70">
                Kullanıcı bulunamadı
              </h2>

              <p className="mt-2 text-sm text-white/40">
                Arama kriterlerini değiştirip tekrar deneyebilirsin.
              </p>

            </div>
          )}

        {/* ------------------------------------------------ */}
        {/* İLK AÇILIŞ */}
        {/* ------------------------------------------------ */}

        {!hasSearched && !loading && (
          <div className="pt-8 text-center">

            <Search className="mx-auto mb-3 h-8 w-8 text-white/15" />

            <p className="text-sm text-white/40">
              Bir isim, kullanıcı adı veya şehir yazıp
              <br />
              Enter'a basarak arama yap.
            </p>

          </div>
        )}

      </div>
    </div>
  );
}