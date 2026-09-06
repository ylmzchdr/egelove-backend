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
    <div className="min-h-screen bg-[#121420] text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-center shadow-2xl">
        <h2 className="text-xl font-bold mb-2 tracking-wide text-purple-400">
          🛰️ GEÇİCİ VİDEO LABORATUVARI
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Canlı sisteme dokunmadan, WebRTC kamera motorunu test ettiğimiz gizli oda.
        </p>

        {/* 📺 Görüntü Ekranı */}
        <div className="w-full aspect-video bg-black/40 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center relative mb-6">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {!stream && (
            <span className="absolute text-xs text-slate-500 tracking-wider">
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
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium py-3 px-4 rounded-xl text-xs transition-all tracking-wider shadow-lg shadow-purple-500/20"
            >
              🚀 KAMERAYI TEST ET
            </button>
          ) : (
            <button
              onClick={kamerayiKapat}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-3 px-4 rounded-xl text-xs transition-all tracking-wider"
            >
              🛑 BAĞLANTIYI KES
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
