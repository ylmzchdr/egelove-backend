'use client';

import React, { useState, useRef, useEffect } from 'react';

export default function TestVideoPage() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  // Next.js'in tarayıcıyı tam olarak tanımasını sağlayan emniyet kilidi
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

  if (!isClient) return null; // Tarayıcı tamamen hazır olana kadar sayfayı güvenli tut

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#310D0C] via-[#512510] to-[#310D0C] text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#512510]/70 backdrop-blur-xl border border-[#F6BA48]/20 rounded-3xl p-6 text-center shadow-2xl">
        <h2 className="text-xl font-bold mb-2 tracking-wide text-[#F6BA48]">
          🛰️ GEÇİCİ VİDEO LABORATUVARI
        </h2>
        <p className="text-xs text-[#B5A093] mb-6">
          Canlı sisteme dokunmadan, WebRTC kamera motorunu test ettiğimiz gizli oda.
        </p>

        {/* 📺 Görüntü Ekranı */}
        <div className="w-full aspect-video bg-black/40 rounded-2xl border border-[#F6BA48]/10 overflow-hidden flex items-center justify-center relative mb-6">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {!stream && (
            <span className="absolute text-xs text-[#9F7C61] tracking-wider">
              KAMERA KAPALI
            </span>
          )}
        </div>

        {error && (
          <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 py-2 px-3 rounded-xl mb-4">
            {error}
          </p>
        )}

        {/* 🎮 Kontrol Butonları */}
        <div className="flex gap-4">
          {!stream ? (
            <button
              onClick={kamerayiAc}
              className="flex-1 bg-gradient-to-r from-[#B16323] to-[#F6BA48] hover:from-[#CF7526] hover:to-[#EF912C] text-[#310D0C] font-bold py-3 px-4 rounded-xl text-xs transition-all tracking-wider shadow-lg shadow-[#F6BA48]/20"
            >
              🚀 KAMERAYI TEST ET
            </button>
          ) : (
            <button
              onClick={kamerayiKapat}
              className="flex-1 bg-[#683312] hover:bg-[#7E4114] text-[#F8D290] border border-[#F6BA48]/20 font-medium py-3 px-4 rounded-xl text-xs transition-all tracking-wider"
            >
              🛑 BAĞLANTIYI KES
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
