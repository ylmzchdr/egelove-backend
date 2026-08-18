'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Camera,
  Heart,
  Loader2,
  MapPin,
  MessageCircle,
  Search,
  Sparkles,
  Home,
  User,
  Bell,
  LogOut
} from "lucide-react";

export default function DashboardPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-[#121420] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121420] text-white flex">
      
      {/* 📱 1. SOL MENÜ SÜTUNU (HER EKRANDA KİLİTLİ VE SABİT) */}
      <aside className="w-64 bg-[#1a1d30] border-r border-white/5 flex flex-col justify-between p-6 shrink-0">
        <div className="space-y-8">
          {/* Logo Bölümü */}
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <div className="w-8 h-8 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-xl flex items-center justify-center font-black text-sm shadow-lg shadow-purple-500/20">
              E
            </div>
            <span className="font-black text-lg tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-300">
              EGELOVE
            </span>
          </div>

          {/* Menü Linkleri */}
          <nav className="space-y-2">
            <Link href="/dashboard" className="flex items-center gap-3 bg-purple-600 text-white px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all shadow-lg shadow-purple-500/10">
              <Home className="w-4 h-4" />
              <span>Ana Sayfa</span>
            </Link>
            <Link href="/dashboard" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-white/5 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all">
              <User className="w-4 h-4" />
              <span>Benim Sayfam</span>
            </Link>
            <a href="/messages" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-white/5 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all">
              <MessageCircle className="w-4 h-4" />
              <span>Mesajlar</span>
            </a>
            <Link href="/dashboard" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-white/5 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all">
              <Bell className="w-4 h-4" />
              <span>Bildirimler</span>
            </Link>
          </nav>
        </div>

        {/* En Alt: Çıkış Yap Butonu */}
        <a href="/" className="flex items-center gap-3 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all border border-rose-500/10 w-full mt-auto text-center justify-center">
          <LogOut className="w-4 h-4" />
          <span>Çıkış Yap</span>
        </a>
      </aside>

      {/* 📊 2. ANA İÇERİK ALANI */}
      <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
        
        {/* Üst Başlık */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-2xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-purple-400">
              EGE LOVE PANEL
            </h1>
            <p className="text-xs text-slate-400 mt-1">Ege ve Akdeniz'in en seçkin flört ve arkadaşlık platformu.</p>
          </div>
          <div className="flex items-center gap-3 bg-purple-500/10 border border-purple-500/20 px-4 py-2 rounded-2xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-purple-300 tracking-wide">COPY.PLATFORM AKTİF</span>
          </div>
        </div>

        {/* 👥 81 İLDEN CANLI ÇEVRİMİÇİ ÜYELER ŞERİDİ */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <h2 className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
                81 İlden Canlı Çevrimiçi Üyeler
              </h2>
            </div>
            <span className="text-xs text-slate-500 hover:text-purple-400 cursor-pointer transition-colors font-medium">Tüm İlleri Gör</span>
          </div>
          
          <div className="flex items-center gap-6 overflow-x-auto pb-2 scrollbar-none">
            {[
              { name: "sabrina", city: "Muğla", color: "from-pink-500 to-purple-600", active: true },
              { name: "Can", city: "Muğla", color: "from-blue-500 to-teal-500", active: true },
              { name: "Merve", city: "Aydın", color: "from-purple-500 to-pink-500", active: true },
              { name: "Deniz", city: "Antalya", color: "from-emerald-500 to-blue-500", active: true },
              { name: "Elif", city: "İstanbul", color: "from-orange-500 to-amber-500", active: true },
              { name: "Burak", city: "Ankara", color: "from-indigo-500 to-purple-500", active: true },
              { name: "Zeynep", city: "Diyarbakır", color: "from-rose-500 to-pink-500", active: true },
              { name: "Hakan", city: "Trabzon", color: "from-cyan-500 to-blue-500", active: true }
            ].map((user, idx) => (
              <div key={idx} className="flex flex-col items-center space-y-1.5 min-w-[70px] cursor-pointer group">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-tr ${user.color} p-0.5 relative shadow-lg group-hover:scale-105 transition-transform`}>
                  <div className="w-full h-full bg-[#121420] rounded-full flex items-center justify-center overflow-hidden">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{user.name.slice(0,2)}</span>
                  </div>
                  {user.active && <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#121420] rounded-full" />}
                </div>
                <span className="text-xs font-bold text-slate-200 tracking-wide truncate max-w-[65px]">{user.name}</span>
                <span className="text-[10px] text-slate-500 font-medium">{user.city}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ⚡ ANA LANSMAN KARTLARI BÖLÜMÜ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 🎥 Sesli & Görüntülü Canlı Sohbet */}
          <a href="/messages" className="block group">
            <div className="bg-gradient-to-br from-purple-900/40 to-slate-900/60 backdrop-blur-xl border border-purple-500/40 rounded-3xl p-6 shadow-xl shadow-purple-500/5 relative overflow-hidden h-full transform hover:scale-[1.01] transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-purple-500/20 transition-all duration-500" />
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30 text-purple-400">
                  <Camera className="w-5 h-5 text-purple-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-wide text-white">Sesli & Görüntülü Canlı Sohbet</h3>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400 tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> AKTİF & CANLI SİSTEM
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed tracking-wide">
                Ege ve Akdeniz'in sıcaklığını sıfır gecikmeli sesli ogörüntülü odalarda bizzat hisset! WebRTC altyapısıyla kesintisiz, anlık ve 81 il genelinde sınırsız görüntülü flört deneyimi başarıyla devrede. Ortaklıkla başardık!
              </p>
            </div>
          </a>

          {/* 📱 Google Play & App Store */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden h-full group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10" />
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-wide text-white">Google Play & App Store</h3>
                <span className="inline-block px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-[9px] font-bold text-blue-400 rounded-md tracking-wider">GELİŞTİRİLİYOR</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed tracking-wide">
              Egelove cebine geliyor! Bildirimleri anında ekrana düşen, jeton/kredi sistemiyle canavar gibi akıcı yerel (native) Android ve iOS mobil uygulamalarımız yakında mağazalarda.
            </p>
          </div>

        </div>

        {/* 📊 ALT İSTATİSTİK VE KONTROL KARTLARI */}
                {/* 📊 ALT İSTATİSTİK VE KONTROL KARTLARI */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 flex flex-col justify-between h-28">
            <Heart className="w-4 h-4 text-pink-500" />
            <div>
              <span className="text-xs font-bold text-slate-200 block">Yeni Beğeni</span>
              <span className="text-[10px] text-emerald-400 font-semibold mt-0.5 block">● Aktif</span>
            </div>
          </div>
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 flex flex-col justify-between h-28">
            <MessageCircle className="w-4 h-4 text-blue-400" />
            <div>
              <span className="text-xs font-bold text-slate-200 block">Okunmamış Mesaj</span>
              <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">MESAJLAR</span>
            </div>
          </div>
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 flex flex-col justify-between h-28">
            <Search className="w-4 h-4 text-purple-400" />
            <div>
              <span className="text-2xl font-black text-white">81</span>
              <span className="text-[10px] text-slate-500 font-medium block">İl Genelinde Bul</span>
            </div>
          </div>
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 flex flex-col justify-between h-28">
            <MapPin className="w-4 h-4 text-amber-500" />
            <div>
              <span className="text-xs font-bold text-white block">Muğla</span>
              <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">Mevcut Konum</span>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

