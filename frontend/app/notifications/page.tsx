"use client";

import { Bell } from "lucide-react";

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-[#121420] text-white p-6 md:p-8">
      <div className="max-w-5xl mx-auto">

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-purple-400" />
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-wide">
                Bildirimler
              </h1>

              <p className="text-sm text-slate-400 mt-1">
                Hesabınla ilgili bildirimler burada görünecek.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-10 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
            <Bell className="w-7 h-7 text-slate-500" />
          </div>

          <h2 className="text-lg font-bold">
            Henüz bildirimin yok
          </h2>

          <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
            Seni beğenenler, yeni eşleşmeler ve diğer hesap
            hareketleri burada gösterilecek.
          </p>
        </div>

      </div>
    </div>
  );
}