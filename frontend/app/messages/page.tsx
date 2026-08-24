"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";


export default function MessagesPage() {
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const bagimsizKameraAc = () => {
    const width = 450;
    const height = 650;

    const left = Math.max(
      0,
      (window.screen.width - width) / 2
    );

    const top = Math.max(
      0,
      (window.screen.height - height) / 2
    );

    window.open(
      "/canavar-video",
      "EgeloveLivePopup",
      `width=${width},height=${height},top=${top},left=${left},resizable=no,scrollbars=no,status=no,location=no,toolbar=no,menubar=no`
    );
  };
  

  if (!isClient) return null;
       // 🔗 URL'den gelen ?userId= parametresini yakalayıp otomatik sohbet açma katmanı (Emniyet Kalkanlı)
  useEffect(() => {
    // Emniyet Kalkanı: Tarayıcı tamamen hazır olmadan ve istemci onaylanmadan ASLA tetiklenme!
    if (typeof window === 'undefined' || !isClient) return;

    const currentParams = new URLSearchParams(window.location.search);
    const targetUserId = currentParams.get('userId');

    if (targetUserId) {
      fetch("https://onrender.com", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId: targetUserId })
      })
      .then(() => {
        // Döngüyü tamamen kırmak için tarayıcı adres satırındaki parametreyi jilet gibi temizle
        const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({ path: newUrl }, '', newUrl);
        // Next.js yönlendiricisi ile pürüzsüzce sayfayı mesajlara tazeleyelim ortak!
        router.replace('/messages');
      })
      .catch(err => {
        console.error("Otomatik sohbet bağlantı hatası:", err);
        router.replace('/messages');
      });
    }
  }, [isClient]); // 🚀 Sadece isClient (istemci) true olduğunda güvenle tetiklenir!


  return (
    <div className="min-h-screen bg-[#121420] text-white flex flex-col">

      {/* =========================
          ÜST NAVİGASYON
      ========================== */}
      <header className="w-full bg-[#1a1d30] border-b border-white/10 px-4 sm:px-6 py-4 sm:py-5 shrink-0">

        <div className="max-w-6xl mx-auto flex flex-col items-start gap-3">

          <a
            href="/dashboard"
            className="
              inline-flex items-center
              gap-2
              bg-purple-600
              hover:bg-purple-500
              text-white
              px-5 sm:px-6
              py-3
              rounded-2xl
              text-sm sm:text-base
              font-black
              tracking-wide
              transition-all
              shadow-lg
              shadow-purple-500/20
              border border-purple-400/30
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="w-5 h-5 shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7M3 12h18"
              />
            </svg>

            <span>ANA SAYFAYA GERİ DÖN</span>
          </a>

          <span className="
            text-[10px]
            sm:text-xs
            font-bold
            text-slate-500
            tracking-[0.25em]
            font-mono
            pl-1
          ">
            EGELOVE GÜVENLİ ODASI
          </span>

        </div>
      </header>


      {/* =========================
          ANA İÇERİK
      ========================== */}
      <main className="
        flex-1
        px-4
        sm:px-6
        py-5
        sm:py-6
      ">

        <div className="
          max-w-6xl
          mx-auto
          grid
          grid-cols-1
          md:grid-cols-3
          gap-5
          sm:gap-6
        ">

          {/* =========================
              MESAJ LİSTESİ
          ========================== */}
          <section className="
            md:col-span-1
            bg-slate-900/60
            backdrop-blur-xl
            border
            border-white/20
            rounded-[28px]
            p-5
            sm:p-6

            min-h-[430px]
            sm:min-h-[470px]
            md:h-[500px]

            flex
            flex-col
          ">

            <div>

              <h1 className="
                text-2xl
                sm:text-3xl
                font-bold
                tracking-wide
                text-purple-400
                mb-5
              ">
                Mesajlar
              </h1>


              {/* FİLTRELER */}
              <div className="flex gap-2 mb-5">

                <button
                  className="
                    bg-blue-600
                    hover:bg-blue-500
                    px-5
                    py-3
                    rounded-2xl
                    text-sm
                    font-semibold
                    transition
                  "
                >
                  Tümü
                </button>

                <button
                  className="
                    bg-slate-800
                    hover:bg-slate-700
                    px-5
                    py-3
                    rounded-2xl
                    text-sm
                    font-semibold
                    text-slate-400
                    transition
                  "
                >
                  Gelen
                </button>

                <button
                  className="
                    bg-slate-800
                    hover:bg-slate-700
                    px-5
                    py-3
                    rounded-2xl
                    text-sm
                    font-semibold
                    text-slate-400
                    transition
                  "
                >
                  Giden
                </button>

              </div>


              {/* ARAMA */}
              <input
                type="text"
                placeholder="Ara..."
                className="
                  w-full
                  h-14
                  bg-black/40
                  border
                  border-white/20
                  rounded-2xl
                  px-5
                  text-base
                  text-white
                  placeholder:text-slate-500
                  focus:outline-none
                  focus:border-purple-500
                  transition
                "
              />

            </div>


            {/* BOŞ MESAJ */}
            <div className="
              flex-1
              flex
              items-center
              justify-center
            ">
              <p className="
                text-sm
                sm:text-base
                text-slate-500
                text-center
              ">
                Henüz mesajın yok
              </p>
            </div>

          </section>


          {/* =========================
              SOHBET PANELİ
          ========================== */}
          <section className="
            md:col-span-2
            bg-slate-900/60
            backdrop-blur-xl
            border
            border-white/20
            rounded-[28px]
            p-5
            sm:p-6

            min-h-[300px]
            sm:min-h-[330px]
            md:h-[500px]

            flex
            items-center
            justify-center
          ">

            <p className="
              text-base
              sm:text-lg
              text-slate-400
              font-semibold
              tracking-wide
              text-center
            ">
              Sohbet başlatmak için bir konuşma seç
            </p>

          </section>

        </div>


        {/* =========================
            CANLI GÖRÜNTÜLÜ SOHBET
        ========================== */}
        <section className="
          max-w-3xl
          mx-auto
          mt-5
          sm:mt-6

          bg-gradient-to-b
          from-purple-900/20
          to-pink-900/10

          backdrop-blur-xl

          border
          border-purple-500/30

          rounded-[28px]

          px-5
          py-6
          sm:p-7

          text-center
          shadow-2xl
        ">

          <h2 className="
            text-lg
            sm:text-2xl
            font-bold
            tracking-wide

            text-transparent
            bg-clip-text
            bg-gradient-to-r
            from-purple-400
            to-pink-400

            leading-snug
          ">
            🛰️ CANLI GÖRÜNTÜLÜ SOHBET ODALARI
          </h2>


          <p className="
            text-sm
            sm:text-base
            leading-6
            text-slate-400
            mt-3
            mb-5
            max-w-2xl
            mx-auto
          ">
            Güvenli görüntülü sohbet odalarına geçerek
            yeni insanlarla canlı olarak tanışabilirsin.
          </p>


          <div className="max-w-md mx-auto">

            <button
              onClick={bagimsizKameraAc}
              className="
                w-full

                bg-gradient-to-r
                from-purple-600
                to-blue-500

                hover:from-purple-500
                hover:to-blue-400

                text-white

                font-bold

                py-4
                px-6

                rounded-2xl

                text-sm

                tracking-wide

                transition-all

                shadow-lg

                active:scale-[0.98]
              "
            >
              🚀 GÖRÜNTÜLÜ KONUŞMAYI BAŞLAT
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}