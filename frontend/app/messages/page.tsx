'use client';

import React, { useEffect, useState } from 'react';

export default function MessagesPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 🛰️ PLANIMIZDAKİ O SİHİRLİ SAF HTML WINDOW.OPEN FIRLATICISI
  const bagimsizKameraAc = () => {
    const width = 450;
    const height = 650;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    window.open(
      '/canavar-video',
      'EgeloveLivePopup',
      `width=${width},height=${height},top=${top},left=${left},resizable=no,scrollbars=no,status=no,location=no,toolbar=no,menubar=no`
    );
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-[#121420] text-white flex flex-col">
      
      {/* 🧭 ÜST NAVİGASYON BARI - SAF HTML GERİ DÖNÜŞ KAPISI ÇAKILDI */}
      <header className="w-full bg-[#1a1d30] border-b border-white/5 px-6 py-5 flex items-center justify-between shadow-md shrink-0">
        <a 
          href="/dashboard" 
          className="flex items-center gap-3 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-2xl text-sm font-black tracking-wider transition-all shadow-lg shadow-purple-500/20 border border-purple-400/30"
        >
          <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7M3 12h18" />
          </svg>
          <span>⬅️ ANA SAYFAYA GERİ DÖN</span>
        </a>
        <span className="text-xs font-bold text-slate-500 tracking-widest font-mono">EGELOVE GÜVENLİ ODASI</span>
      </header>

      {/* 📊 ANA İÇERİK ALANI */}
      <main className="flex-1 p-6 space-y-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-[350px] flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold mb-4 tracking-wide text-purple-400">Mesajlar</h3>
              <div className="flex gap-2 mb-4">
                <button className="bg-blue-600 px-3 py-1.5 rounded-xl text-xs font-medium">Tümü</button>
                <button className="bg-slate-800 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400">Gelen</button>
                <button className="bg-slate-800 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400">Giden</button>
              </div>
              <input type="text" placeholder="Ara..." className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-purple-500" />
            </div>
            <p className="text-xs text-slate-500 text-center py-8">Henüz mesajın yok</p>
          </div>
          <div className="md:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-[350px] flex items-center justify-center">
            <p className="text-sm text-slate-400 font-medium tracking-wide">Sohbet başlatmak için bir konuşma seç</p>
          </div>
        </div>

        {/* 🚀 FIRLATICI PANELİ */}
        <div className="max-w-xl mx-auto bg-gradient-to-b from-purple-900/20 to-pink-900/10 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6 text-center shadow-2xl">
          <h2 className="text-lg font-bold mb-2 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            🛰️ CANLI GÖRÜNTÜLÜ SOHBET ODALARI
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            Ana sayfa düzenini ve Next.js şasisini bozmadan, kasanın içindeki o gizli tüneli bağımsız Hereke VIP penceresinde güvenle fırlatır.
          </p>
          <div className="max-w-xs mx-auto">
            <button
              onClick={bagimsizKameraAc}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3.5 px-6 rounded-2xl text-xs transition-all tracking-wider shadow-lg transform hover:scale-[1.02]"
            >
              🚀 GÖRÜNTÜLÜ KONUŞMAYI BAŞLAT
            </button>
          </div>
        </div>
      </main>

    </div>
  );
}
