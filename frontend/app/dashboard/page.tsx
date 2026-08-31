"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import OnlineUsers from "../../components/OnlineUsers";
import {
  Camera,
  ChevronRight,
  Heart,
  Loader2,
  MapPin,
  MessageCircle,
  Search,
  Sparkles,
  User,
} from "lucide-react";

import Topbar from "@/components/dashboard/Topbar";
import Sidebar from "./Sidebar";
import { useI18n } from "@/lib/i18n-context";
import { api } from "@/lib/api";

   const onlineUsers: any[] = [];

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
      // Kullanıcı bilgisini her açılışta API'den taze al.
      // localStorage'daki eski şehir/ilçe bilgisine güvenme.
      const me: any = await api.users.me();

      localStorage.setItem("user", JSON.stringify(me));

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

      // API geçici olarak cevap vermezse mevcut local kullanıcıyı
      // sadece yedek olarak kullan.
      try {
        const rawUser = localStorage.getItem("user");

        if (!rawUser) return;

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
      } catch {
        // localStorage verisi bozuksa sessizce devam et.
      }
    }
  };

  loadUser();
}, []);
  if (!isClient) {
    return (
      <div className="min-h-screen bg-[#080b18] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#080b18] text-white">
      {/* =========================================================
          ANA SAYFA ŞASESİ
          SOL SIDEBAR: 286px
          SAĞ: KALAN ALAN
      ========================================================= */}
      <div className="flex min-h-screen w-full">

        {/* SOL SIDEBAR */}
        <aside className="hidden w-[286px] shrink-0 lg:block">
          <Sidebar />
        </aside>

        {/* SAĞ ANA İÇERİK */}
        <main className="min-h-screen min-w-0 flex-1 overflow-x-hidden">
        <div className="w-full pl-0 pr-4 pb-10 pt-4 sm:pr-5 md:pr-6 lg:pr-7 xl:pr-8">

          {/* =====================================================
              EGELOVE LOGO + SLOGAN
          ===================================================== */}
          <div className="mb-2 flex w-full flex-col items-center justify-center gap-3 text-center">

            <div className="flex select-none items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 shadow-lg shadow-purple-500/20">
                <span className="text-xl font-black tracking-tighter text-white">
                  E
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white via-purple-200 to-cyan-300 bg-clip-text text-transparent">
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
                {t.dashboard.connectionTitle}
              </p>
            </div>
          </div>

          {/* =====================================================
              TOPBAR
          ===================================================== */}
          <div className="mb-6 w-full">
            <Topbar
              userName={user.name}
              userCity={user.city}
              profilePhoto={user.profilePhoto}
            />
          </div>

          {/* =====================================================
              PROFİL + BİRİNİ BUL
          ===================================================== */}
          <section className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">

            {/* PROFİLİM */}
            <Link href="/profile/edit" className="group min-w-0">
              <div className="h-full rounded-2xl border border-purple-500/40 bg-gradient-to-r from-purple-900/50 to-slate-900/70 p-5 transition-all hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/10">
                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-purple-400/25 bg-purple-500/15">
                    <User className="h-6 w-6 text-purple-300" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="text-base font-black md:text-lg">
                      {t.dashboard.profileTitle}
                    </h2>

                    <p className="mt-1 text-xs text-slate-400 md:text-sm">
                      {t.dashboard.profileDesc}
                    </p>
                  </div>

                  <ChevronRight className="h-5 w-5 shrink-0 text-purple-300 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

            {/* BİRİNİ BUL */}
            <Link href="/search" className="group min-w-0">
              <div className="h-full rounded-2xl border border-white/15 bg-slate-900/60 p-5 transition-all hover:border-purple-400/50 hover:bg-purple-500/5">
                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/5">
                    <Search className="h-6 w-6 text-purple-300" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="text-base font-black md:text-lg">
                      {t.dashboard.find}
                    </h2>

                    <p className="mt-1 text-xs text-slate-400 md:text-sm">
                      {t.dashboard.findProfileDesc}
                    </p>
                  </div>

                  <ChevronRight className="h-5 w-5 shrink-0 text-purple-300 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

          </section>

          {/* =====================================================
              81 İLDEN ÇEVRİMİÇİ ÜYELER
          ===================================================== */}
          <section className="mt-6 w-full rounded-3xl border border-white/10 bg-slate-900/40 p-5 shadow-xl backdrop-blur-xl md:p-6">

            <div className="mb-5 flex items-center justify-between gap-4">

              <div className="flex min-w-0 items-center gap-2">
                <span className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-emerald-500" />

                <h2 className="truncate text-xs font-bold uppercase tracking-widest text-emerald-400 md:text-sm">
                  {t.dashboard.onlineUsersTitle}
                </h2>
              </div>

              <Link
                href="/search"
                className="shrink-0 text-[10px] font-medium text-slate-500 transition-colors hover:text-purple-400 md:text-xs"
              >
                {t.dashboard.viewAllCities}
              </Link>
            </div>

            <div className="flex items-start gap-5 overflow-x-auto pb-2 scrollbar-none md:gap-6">

             <OnlineUsers />


            </div>
          </section>

          {/* =====================================================
              ANA KARTLAR
          ===================================================== */}
          <section className="mt-6 grid w-full grid-cols-1 gap-6 md:grid-cols-2">

            {/* CANLI SOHBET */}
            <Link href="/messages" className="group block min-w-0">
              <div className="relative h-full overflow-hidden rounded-3xl border border-purple-500/40 bg-gradient-to-br from-purple-900/40 to-slate-900/60 p-6 shadow-xl shadow-purple-500/5 backdrop-blur-xl transition-all duration-300 hover:border-purple-400/60">

                <div className="absolute right-0 top-0 -mr-10 -mt-10 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl transition-all duration-500 group-hover:bg-purple-500/20" />

                <div className="relative mb-4 flex items-center gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/20">
                    <Camera className="h-5 w-5 animate-pulse text-purple-400" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-bold tracking-wide text-white md:text-base">
                      {t.dashboard.liveChatTitle}
                    </h3>

                    <span className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-emerald-400">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                      {t.dashboard.liveChatStatus}
                    </span>
                  </div>

                </div>

                <p className="relative text-xs leading-relaxed tracking-wide text-slate-300 md:text-sm">
                  {t.dashboard.liveChatDesc}
                </p>

              </div>
            </Link>

            {/* MOBİL UYGULAMALAR */}
            <div className="relative h-full min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 p-6 shadow-xl backdrop-blur-xl">

              <div className="absolute right-0 top-0 -mr-10 -mt-10 h-32 w-32 rounded-full bg-blue-500/5 blur-3xl" />

              <div className="relative mb-4 flex items-center gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
                  <Sparkles className="h-5 w-5 text-blue-400" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-bold tracking-wide text-white md:text-base">
                    {t.dashboard.mobileAppsTitle}
                  </h3>

                  <span className="mt-1 inline-block rounded-md border border-blue-500/20 bg-blue-500/10 px-2 py-1 text-[9px] font-bold tracking-wider text-blue-400">
                    {t.dashboard.mobileAppsStatus}
                  </span>
                </div>

              </div>

              <p className="relative text-xs leading-relaxed tracking-wide text-slate-400 md:text-sm">
                {t.dashboard.mobileAppsDesc}
              </p>

            </div>

          </section>

          {/* =====================================================
              ALT KARTLAR
          ===================================================== */}
          <section className="mt-6 grid w-full grid-cols-2 gap-4 md:grid-cols-4">

            {/* YENİ BEĞENİ */}
            <Link
              href="/likes"
              className="flex h-28 min-w-0 flex-col justify-between rounded-2xl border border-white/10 bg-slate-900/40 p-4 transition-all hover:border-pink-500/40"
            >
              <Heart className="h-4 w-4 text-pink-500" />

              <div>
                <span className="block text-xs font-bold text-slate-200">
                  {t.dashboard.newLike}
                </span>

                <span className="mt-0.5 block text-[10px] font-semibold text-emerald-400">
                  ● {t.dashboard.active}
                </span>
              </div>
            </Link>

            {/* MESAJLAR */}
            <Link
              href="/messages"
              className="flex h-28 min-w-0 flex-col justify-between rounded-2xl border border-white/10 bg-slate-900/40 p-4 transition-all hover:border-blue-500/40"
            >
              <MessageCircle className="h-4 w-4 text-blue-400" />

              <div>
                <span className="block text-xs font-bold text-slate-200">
                  {t.dashboard.messages}
                </span>

                <span className="mt-0.5 block text-[10px] font-medium text-slate-500">
                  {t.dashboard.openChats}
                </span>
              </div>
            </Link>

            {/* ÜYE BUL */}
            <Link
              href="/search"
              className="flex h-28 min-w-0 flex-col justify-between rounded-2xl border border-white/10 bg-slate-900/40 p-4 transition-all hover:border-purple-500/40"
            >
              <Search className="h-4 w-4 text-purple-400" />

              <div>
                <span className="text-2xl font-black text-white">
                  81
                </span>

                <span className="block text-[10px] font-medium text-slate-500">
                  {t.dashboard.find}
                </span>
              </div>
            </Link>

            {/* İLDE ÜYE BUL */}
            <Link
              href="/search"
              className="flex h-28 min-w-0 flex-col justify-between rounded-2xl border border-white/10 bg-slate-900/40 p-4 transition-all hover:border-amber-500/40"
            >
              <MapPin className="h-4 w-4 text-amber-500" />

              <div>
                <span className="block text-xs font-bold text-white">
                  {t.dashboard.findMembers}
                </span>

                <span className="mt-0.5 block text-[10px] font-medium text-slate-500">
                  {t.dashboard.openFilters}
                </span>
              </div>
            </Link>

          </section>

          {/* ALT BOŞLUK */}
          <div className="h-10" />

          </div>
        </main>
      </div>
    </div>
  );
}