'use client';

import React, { useState, useRef, useEffect } from 'react';

export default function CanavarVideoPage() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsClient(true);
    setTimeout(() => {
      kamerayiOtomatikAc();
    }, 500);
  }, []);

  const kamerayiOtomatikAc = async () => {
    try {
      setError('');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setStream(mediaStream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      setError(
        'Kamera izni alınamadı ortak! Lütfen tarayıcı kilit ikonundan izin ver.'
      );
    }
  };

  const baglantiyiKapat = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

    window.close();
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#310D0C] via-[#512510] to-[#310D0C] text-white p-6 flex flex-col justify-between font-sans">
      <div className="text-center border-b border-[#F6BA48]/20 pb-4">
        <h1 className="text-sm font-black tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-[#B16323] via-[#F6BA48] to-[#F8D290]">
          SENveBEN VIP CANLI BAĞLANTI
        </h1>

        <p className="text-[10px] text-[#B5A093] mt-0.5 tracking-wider uppercase">
          SENveBEN KALİTESİNDE GÜVENLİ WEBRTC TÜNELİ
        </p>
      </div>

      <div className="my-auto">
        <div className="w-full aspect-video bg-black/80 rounded-3xl border-2 border-[#F6BA48]/40 overflow-hidden flex items-center justify-center relative shadow-2xl">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          {!stream && !error && (
            <p className="absolute text-[10px] text-[#F6BA48] tracking-widest font-mono animate-pulse uppercase">
              [ WEBRTC GÖRÜNTÜ AKIŞI BEKLENİYOR ]
            </p>
          )}
        </div>

        {error && (
          <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 py-2 px-3 rounded-xl mt-4 text-center">
            {error}
          </p>
        )}
      </div>

      <div className="space-y-4 pt-4 border-t border-[#F6BA48]/10">
        <button
          onClick={baglantiyiKapat}
          className="w-full bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold py-3 px-6 rounded-2xl text-xs transition-all tracking-widest uppercase shadow-lg"
        >
          🛑 SOHBETİ VE PENCEREYİ KAPAT
        </button>
      </div>
    </div>
  );
}
