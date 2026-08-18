import React from 'react';

export default function LansmanCards() {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      
      {/* 1. Kart: Sesli & Görüntülü Sohbet Tanıtımı */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1b1437]/60 via-[#121420]/80 to-[#1b1437]/60 backdrop-blur-md border border-purple-500/20 rounded-3xl p-5 group transition-all duration-300 hover:border-purple-500/40">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all duration-300"></div>
        
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400 group-hover:scale-110 transition-transform duration-300">
            {/* Mikrofon / Kamera İkonu (SVG) */}
            <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-white font-semibold text-sm md:text-base">Sesli & Görüntülü Canlı Sohbet</h4>
              <span className="text-[10px] font-bold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">Çok Yakında</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ege ve Akdeniz'in sıcaklığını sesli ve görüntülü odalarda hisset. WebRTC altyapısıyla kesintisiz, anlık ve 81 il genelinde sınırsız flört deneyimi yakında seninle!
            </p>
          </div>
        </div>
      </div>

      {/* 2. Kart: Mobil Uygulama Tanıtımı */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#2c1430]/60 via-[#121420]/80 to-[#2c1430]/60 backdrop-blur-md border border-pink-500/20 rounded-3xl p-5 group transition-all duration-300 hover:border-pink-500/40">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition-all duration-300"></div>
        
        <div className="flex items-start gap-4">
          <div className="p-3 bg-pink-500/10 rounded-2xl text-pink-400 group-hover:scale-110 transition-transform duration-300">
            {/* Telefon / App İkonu (SVG) */}
            <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-white font-semibold text-sm md:text-base">Google Play & App Store</h4>
              <span className="text-[10px] font-bold bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">Geliştiriliyor</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Egelove cebine geliyor! Bildirimleri anında ekrana düşen, jeton/kredi sistemiyle canavar gibi akıcı yerel (native) Android ve iOS mobil uygulamalarımız yakında mağazalarda.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
