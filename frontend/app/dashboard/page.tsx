'use client';



import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  Camera,
  ChevronRight,
  Globe2,
  Heart,
  Loader2,
  MapPin,
  MessageCircle,
  Search,
  Sparkles,
  User,
} from "lucide-react";
import Topbar from "@/components/dashboard/Topbar";
import { useI18n } from "@/lib/i18n-context";
import { api } from "@/lib/api";


const onlineUsers = [
  { id: "sabrina", name: "Sabrina", city: "Muğla", color: "from-pink-500 to-purple-600" },
  { id: "can", name: "Can", city: "Muğla", color: "from-blue-500 to-teal-500" },
  { id: "merve", name: "Merve", city: "Aydın", color: "from-purple-500 to-pink-500" },
  { id: "deniz", name: "Deniz", city: "Antalya", color: "from-emerald-500 to-blue-500" },
  { id: "elif", name: "Elif", city: "İstanbul", color: "from-orange-500 to-amber-500" },
  { id: "burak", name: "Burak", city: "Ankara", color: "from-indigo-500 to-purple-500" },
  { id: "zeynep", name: "Zeynep", city: "Diyarbakır", color: "from-rose-500 to-pink-500" },
  { id: "hakan", name: "Hakan", city: "Trabzon", color: "from-cyan-500 to-blue-500" },
];

export default function DashboardPage() {
const [isClient, setIsClient] = useState(false);
const { t } = useI18n();

const [user, setUser] = useState({
  name: "Üye",
  city: "Türkiye",
  profilePhoto: null as string | null,
});
 useEffect(() => {
  const loadUser = async () => {
    setIsClient(true);

    try {
      const rawUser = localStorage.getItem("user");

      if (rawUser) {
        const parsed = JSON.parse(rawUser);

        setUser({
          name: parsed.name || parsed.username || "Üye",
          city: parsed.city?.name || parsed.city || "Türkiye",
          profilePhoto:
            parsed.profilePhoto ||
            parsed.profileImage ||
            parsed.avatar ||
            null,
        });

        return;
      }

      const me: any = await api.users.me();

      localStorage.setItem(
        "user",
        JSON.stringify(me)
      );

      setUser({
        name: me.name || me.username || "Üye",
        city: me.city?.name || me.city || "Türkiye",
        profilePhoto:
          me.profilePhoto ||
          me.profileImage ||
          me.avatar ||
          null,
      });

    } catch (error) {
      console.log("Kullanıcı alınamadı:", error);
    }
  };

  loadUser();

}, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-[#121420] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121420] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">

      <Topbar
  userName={user.name}
  userCity={user.city}
  profilePhoto={user.profilePhoto}
/>

        {/* PROFİL + KİŞİ ARA */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/profile/edit" className="group">
            <div className="h-full bg-gradient-to-r from-purple-900/50 to-slate-900/70 border border-purple-500/40 rounded-2xl p-5 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/10 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-400/25 flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-purple-300" />
                </div>
                <div className="min-w-0 flex-1">
              <h2 className="text-base md:text-lg font-black">
  {t.dashboard.find}
</h2>
                  <p className="text-xs md:text-sm text-slate-400 mt-1">
                   {t.dashboard.findDesc}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-purple-300 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          <Link href="/search" className="group">
            <div className="h-full bg-slate-900/60 border border-white/15 rounded-2xl p-5 hover:border-purple-400/50 hover:bg-purple-500/5 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/15 flex items-center justify-center shrink-0">
                  <Search className="w-6 h-6 text-purple-300" />
                </div>
                <div className="min-w-0 flex-1">
                 <h2 className="text-base md:text-lg font-black">{t.dashboard.find}</h2>
                  <p className="text-xs md:text-sm text-slate-400 mt-1">
                    {t.dashboard.findDesc}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-purple-300 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </section>

        {/* 81 İLDEN ÇEVRİMİÇİ ÜYELER */}
        <section className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-5 md:p-6 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-xs md:text-sm font-bold tracking-widest text-emerald-400 uppercase">
                81 İlden Canlı Çevrimiçi Üyeler
              </h2>
            </div>

            <Link
              href="/search"
              className="text-[10px] md:text-xs text-slate-500 hover:text-purple-400 transition-colors font-medium"
            >
              Tümünü Gör →
            </Link>
          </div>

          <div className="flex items-center gap-5 md:gap-6 overflow-x-auto pb-2 scrollbar-none">
            {onlineUsers.map((user) => (
              <Link
                key={user.id}
                href={`/profile/${user.id}`}
                className="flex flex-col items-center gap-1.5 min-w-[70px] cursor-pointer group"
              >
                <div
                  className={`w-14 h-14 rounded-full bg-gradient-to-tr ${user.color} p-0.5 relative shadow-lg group-hover:scale-105 transition-transform`}
                >
                  <div className="w-full h-full bg-[#121420] rounded-full flex items-center justify-center overflow-hidden">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {user.name.slice(0, 2)}
                    </span>
                  </div>
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#121420] rounded-full" />
                </div>

                <span className="text-xs font-bold text-slate-200 tracking-wide truncate max-w-[65px] group-hover:text-purple-400 transition-colors">
                  {user.name}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {user.city}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ANA KARTLAR */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* CANLI SOHBET */}
          <Link href="/messages" className="block group">
            <div className="bg-gradient-to-br from-purple-900/40 to-slate-900/60 backdrop-blur-xl border border-purple-500/40 rounded-3xl p-6 shadow-xl shadow-purple-500/5 relative overflow-hidden h-full hover:border-purple-400/60 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-purple-500/20 transition-all duration-500" />

              <div className="flex items-center gap-4 mb-4 relative">
                <div className="w-11 h-11 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                  <Camera className="w-5 h-5 text-purple-400 animate-pulse" />
                </div>

                <div>
                  <h3 className="text-sm md:text-base font-bold tracking-wide text-white">
                    Sesli &amp; Görüntülü Canlı Sohbet
                  </h3>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 mt-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    AKTİF &amp; CANLI SİSTEM
                  </span>
                </div>
              </div>

              <p className="text-xs md:text-sm text-slate-300 leading-relaxed tracking-wide relative">
                Türkiye&apos;nin 81 ilinden yeni insanlarla sesli ve görüntülü
                sohbet et. Anlık ve kesintisiz canlı sohbet deneyimi burada.
              </p>
            </div>
          </Link>

          {/* MOBİL UYGULAMALAR */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10" />

            <div className="flex items-center gap-4 mb-4 relative">
              <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <Sparkles className="w-5 h-5 text-blue-400" />
              </div>

              <div>
                <h3 className="text-sm md:text-base font-bold tracking-wide text-white">
                  Google Play &amp; App Store
                </h3>
                <span className="inline-block px-2 py-1 mt-1 bg-blue-500/10 border border-blue-500/20 text-[9px] font-bold text-blue-400 rounded-md tracking-wider">
                  GELİŞTİRİLİYOR
                </span>
              </div>
            </div>

            <p className="text-xs md:text-sm text-slate-400 leading-relaxed tracking-wide relative">
              Egelove mobil uygulamaları için çalışmalar devam ediyor. Yakında
              mağazalarda.
            </p>
          </div>
        </section>

        {/* ALT KARTLAR */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <Link
            href="/likes"
            className="bg-slate-900/40 border border-white/10 rounded-2xl p-4 flex flex-col justify-between h-28 hover:border-pink-500/40 transition-all"
          >
            <Heart className="w-4 h-4 text-pink-500" />
            <div>
              <span className="text-xs font-bold text-slate-200 block">
                Yeni Beğeni
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold mt-0.5 block">
                ● Aktif
              </span>
            </div>
          </Link>

          <Link
            href="/messages"
            className="bg-slate-900/40 border border-white/10 rounded-2xl p-4 flex flex-col justify-between h-28 hover:border-blue-500/40 transition-all"
          >
            <MessageCircle className="w-4 h-4 text-blue-400" />
            <div>
              <span className="text-xs font-bold text-slate-200 block">
                Mesajlar
              </span>
              <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">
                SOHBETLERİ AÇ
              </span>
            </div>
          </Link>

          <Link
            href="/search"
            className="bg-slate-900/40 border border-white/10 rounded-2xl p-4 flex flex-col justify-between h-28 hover:border-purple-500/40 transition-all"
          >
            <Search className="w-4 h-4 text-purple-400" />
            <div>
              <span className="text-2xl font-black text-white">81</span>
              <span className="text-[10px] text-slate-500 font-medium block">
                İlde Üye Bul
              </span>
            </div>
          </Link>

          <Link
            href="/search"
            className="bg-slate-900/40 border border-white/10 rounded-2xl p-4 flex flex-col justify-between h-28 hover:border-amber-500/40 transition-all"
          >
            <MapPin className="w-4 h-4 text-amber-500" />
            <div>
              <span className="text-xs font-bold text-white block">
                Kişi Ara
              </span>
              <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">
                FİLTRELERİ AÇ
              </span>
            </div>
          </Link>
        </section>

      </div>
    </div>
  );
}