'use client';

import React from 'react';

export default function MessagesPage() {
  // 🚀 Bağımsız görüntülü sohbet penceresini aç
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
      '/canavar-video',
      'EgeloveLivePopup',
      `width=${width},height=${height},top=${top},left=${left},resizable=no,scrollbars=no,status=no,location=no,toolbar=no,menubar=no`
    );
  };

  return (
    <div className="min-h-screen bg-[#121420] text-white flex flex-col">

      {/* =====================================================
          ÜST NAVİGASYON
          ===================================================== */}
      <header className="w-full bg-[#1a1d30] border-b border-white/10 px-4 sm:px-6 py-4 sm:py-5 shrink-0">

        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

          {/* Ana Sayfaya Dön */}
          <a
            href="/dashboard"
            className="
              inline-flex
              items-center
              gap-2
              w-fit
              bg-purple-600
              hover:bg-purple-500
              text-white
              px-4
              sm:px-6
              py-2.5
              sm:py-3
              rounded-xl
              sm:rounded-2xl
              text-xs
              sm:text-sm
              font-black
              tracking-wide
              transition-all
              shadow-lg
              shadow-purple-500/20
              border
              border-purple-400/30
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

          {/* Güvenli Oda Başlığı */}
          <div className="text-[10px] sm:text-xs font-bold text-slate-500 tracking-[0.25em] font-mono sm:text-right">
            EGELOVE GÜVENLİ ODASI
          </div>

        </div>
      </header>


      {/* =====================================================
          ANA İÇERİK
          ===================================================== */}
      <main className="flex-1 px-4 sm:px-6 py-5 sm:py-8 overflow-y-auto">

        <div className="max-w-6xl mx-auto space-y-5 sm:space-y-8">


          {/* =================================================
              MESAJLAR + SOHBET
              ================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">

            {/* ===============================================
                MESAJ LİSTESİ
                =============================================== */}
            <div
              className="
                md:col-span-1
                bg-slate-900/60
                backdrop-blur-xl
                border
                border-white/10
                rounded-3xl
                p-5
                sm:p-6
                min-h-[330px]
                sm:h-[350px]
                flex
                flex-col
              "
            >

              <div>

                <h3 className="text-xl sm:text-lg font-bold mb-4 tracking-wide text-purple-400">
                  Mesajlar
                </h3>

                {/* Filtreler */}
                <div className="flex gap-2 mb-4">

                  <button
                    type="button"
                    className="
                      bg-blue-600
                      hover:bg-blue-500
                      px-4
                      py-2
                      rounded-xl
                      text-xs
                      font-semibold
                      transition
                    "
                  >
                    Tümü
                  </button>

                  <button
                    type="button"
                    className="
                      bg-slate-800
                      hover:bg-slate-700
                      px-4
                      py-2
                      rounded-xl
                      text-xs
                      font-medium
                      text-slate-400
                      transition
                    "
                  >
                    Gelen
                  </button>

                  <button
                    type="button"
                    className="
                      bg-slate-800
                      hover:bg-slate-700
                      px-4
                      py-2
                      rounded-xl
                      text-xs
                      font-medium
                      text-slate-400
                      transition
                    "
                  >
                    Giden
                  </button>

                </div>

                {/* Arama */}
                <input
                  type="text"
                  placeholder="Ara..."
                  className="
                    w-full
                    bg-black/40
                    border
                    border-white/10
                    rounded-xl
                    px-4
                    py-3
                    text-sm
                    placeholder:text-slate-600
                    focus:outline-none
                    focus:border-purple-500
                    transition
                  "
                />

              </div>

              {/* Boş mesaj alanı */}
              <div className="flex-1 flex items-center justify-center min-h-[90px]">
                <p className="text-sm text-slate-500 text-center">
                  Henüz mesajın yok
                </p>
              </div>

            </div>


            {/* ===============================================
                SOHBET ALANI
                =============================================== */}
            <div
              className="
                md:col-span-2
                bg-slate-900/60
                backdrop-blur-xl
                border
                border-white/10
                rounded-3xl
                p-5
                sm:p-6
                min-h-[260px]
                sm:h-[350px]
                flex
                items-center
                justify-center
              "
            >

              <p className="text-sm sm:text-base text-slate-400 font-medium tracking-wide text-center">
                Sohbet başlatmak için bir konuşma seç
              </p>

            </div>

          </div>


          {/* =================================================
              CANLI GÖRÜNTÜLÜ SOHBET
              ================================================= */}
          <div
            className="
              max-w-xl
              mx-auto
              bg-gradient-to-b
              from-purple-900/20
              to-pink-900/10
              backdrop-blur-xl
              border
              border-purple-500/30
              rounded-3xl
              p-5
              sm:p-6
              text-center
              shadow-2xl
            "
          >

            {/* Başlık */}
            <h2
              className="
                text-lg
                sm:text-xl
                font-bold
                mb-3
                tracking-wide
                text-transparent
                bg-clip-text
                bg-gradient-to-r
                from-purple-400
                to-pink-400
              "
            >
              🛰️ CANLI GÖRÜNTÜLÜ SOHBET ODALARI
            </h2>


            {/* Açıklama */}
            <p className="text-xs sm:text-sm leading-6 text-slate-400 mb-5 max-w-lg mx-auto">
              EgeLove üyeleriyle canlı görüntülü sohbet odalarına
              katıl. Güvenli ve hızlı bağlantıyla yeni insanlarla
              tanışmaya başla.
            </p>


            {/* Buton */}
            <div className="max-w-sm mx-auto">

              <button
                type="button"
                onClick={bagimsizKameraAc}
                className="
                  w-full
                  bg-gradient-to-r
                  from-purple-600
                  to-pink-600
                  hover:from-purple-500
                  hover:to-pink-500
                  active:scale-[0.98]
                  text-white
                  font-semibold
                  py-3.5
                  px-5
                  rounded-2xl
                  text-xs
                  sm:text-sm
                  transition-all
                  tracking-wide
                  shadow-lg
                  shadow-purple-500/20
                "
              >
                🚀 GÖRÜNTÜLÜ KONUŞMAYI BAŞLAT
              </button>

            </div>

          </div>


        </div>

      </main>

    </div>
  );
}