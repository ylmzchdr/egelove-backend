'use client';

import React, { useState, useRef, useEffect } from 'react';

export default function MessagesPage() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const kamerayiAc = async () => {
    try {
      setError('');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      setStream(mediaStream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      setError('Kamera veya mikrofon izni reddedildi ortak! Lütfen tarayıcıdan izin ver.');
    }
  };

  const kamerayiKapat = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-[#121420] text-white p-6">
      {/* Üst Kısım: Mevcut Mesajlar Arayüzü Düzeni */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-[400px] flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold mb-4 tracking-wide text-purple-400">Mesajlar</h3>
            <div className="flex gap-2 mb-4">
              <button className="bg-blue-600 px-3 py-1.5 rounded-xl text-xs font-medium">Tümü</button>
              <button className="bg-slate-800 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400">Gelen</button>
              <button className="bg-slate-800 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400">Giden</button>
            </div>
            <input 
              type="text" 
              placeholder="Ara..." 
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-purple-500"
            />
          </div>
          <p className="text-xs text-slate-500 text-center py-8">Henüz mesajın yok</p>
        </div>

        <div className="md:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-[400px] flex items-center justify-center">
          <p className="text-sm text-slate-400 font-medium tracking-wide">Sohbet başlatmak için bir konuşma seç</p>
        </div>
      </div>

      {/* Alt Kısım: Bize Para Basacak O Canavar Canlı Sohbet Görüntü Test Modülü */}
      <div className="max-w-xl mx-auto bg-gradient-to-b from-purple-900/20 to-pink-900/10 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6 text-center shadow-2xl shadow-purple-500/5">
        <h2 className="text-lg font-bold mb-2 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          🛰️ CANLI SOHBET GÖRÜNTÜ LABORATUVARI
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Mesajlaşma paneli içerisine gömülü, doğrudan cihaz kamerasını tetikleyen WebRTC test ünitesi.
        </p>

        {/* 📺 Görüntü Ekranı */}
        <div className="w-full aspect-video bg-black/60 rounded-2xl border border-purple-500/20 overflow-hidden flex items-center justify-center relative mb-6 shadow-inner">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {!stream && (
            <span className="absolute text-xs text-purple-400/50 tracking-wider animate-pulse font-mono">
              [ WEB RTC GÖRÜNTÜ AKIŞI BEKLENİYOR ]
            </span>
          )}
        </div>

        {error && (
          <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 py-2 px-3 rounded-xl mb-4 font-medium">
            {error}
          </p>
        )}

        {/* 🎮 Kontrol Butonları */}
        <div className="flex gap-4 max-w-xs mx-auto">
          {!stream ? (
            <button
              onClick={kamerayiAc}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3 px-6 rounded-xl text-xs transition-all tracking-wider shadow-lg shadow-purple-500/30 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              🚀 KAMERAYI TEST ET
            </button>
          ) : (
            <button
              onClick={kamerayiKapat}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-3 px-6 rounded-xl text-xs transition-all tracking-wider border border-white/10"
            >
              🛑 BAĞLANTIYI KES
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
