'use client';

import React, { useEffect, useState } from "react";
import { Bell, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://egelove-backend.onrender.com";
// 🛰️ APAR TOPAR TASARIMLARI ENGELLEYEN VE MOR EKRAN BARAJINI YIKAN VIP VERİ SETİ
interface NotificationItem {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // 🧪 BARAJ KIRICI EMNEYET FONKSİYONU
  async function loadNotifications() {
  try {
    setLoading(true);
    setError(null);

    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setError("Oturum bulunamadı.");
      return;
    }

    const res = await fetch(`${API_URL}/notifications`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Bildirimler alınamadı: ${res.status}`);
    }

    const data = await res.json();

    setNotifications(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("Notifications fetch error:", err);
    setError("Bildirimler yüklenemedi.");
    setNotifications([]);
  } finally {
    setLoading(false);
  }
}
  // 📝 OKUNDU İŞARETLEME MOTORLARI (ORİJİNAL ŞASİ KORUNDU)
  async function markAsRead(id: string) {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    );
  }

  async function markAllAsRead() {
    setNotifications((prev) =>
      prev.map((item) => ({ ...item, isRead: true }))
    );
  }

  useEffect(() => {
    setIsClient(true);
    loadNotifications();
  }, []);

  // 📊 CANLI HESAPLANAN AKTİF SAYAÇ
  const unreadCount = notifications.filter((item) => !item.isRead).length;

  if (!isClient) {
    return (
      <div className="min-h-screen bg-[#121420] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121420] text-white flex flex-col font-sans">
      
      {/* 🧭 ÜST NAVİGASYON BARI - SAF HTML GERİ DÖNÜŞ KAPISI ÇAKILDI */}
      <header className="w-full bg-[#1a1d30] border-b border-white/5 px-6 py-5 flex items-center justify-between shadow-md shrink-0">
        <a 
          href="/dashboard" 
          className="flex items-center gap-3 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-2xl text-sm font-black tracking-wider transition-all shadow-lg shadow-purple-500/20 border border-purple-400/30"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>⬅️ ANA SAYFAYA GERİ DÖN</span>
        </a>
        <span className="text-xs font-bold text-slate-500 tracking-widest font-mono">EGELOVE BİLDİRİM MERKEZİ</span>
      </header>

      {/* 📊 ANA İÇERİK ALANI */}
      <main className="flex-1 p-6 md:p-8 max-w-3xl mx-auto w-full space-y-6">
        
        {/* Üst Başlık ve Toplu Okundu Butonu */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-purple-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-wider text-purple-400 uppercase">Son Aktivite Bildirimleri</h2>
              <p className="text-[10px] text-slate-400 mt-0.5 tracking-wide">
                Platform genelindeki anlık etkileşimleriniz ve sistem raporları.
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shrink-0"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Tümünü Okundu İşaretle</span>
            </button>
          )}
        </div>

        {/* Yüklenme veya Boş Durum Kontrolleri */}
        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-center text-xs font-bold">
            {error}
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs font-bold tracking-wide uppercase">
            [ Henüz yeni bir bildiriminiz bulunmuyor ]
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div 
                key={notification.id}
                onClick={() => !notification.isRead && markAsRead(notification.id)}
                className={`p-5 rounded-2xl border transition-all duration-200 flex items-start gap-4 shadow-xl relative overflow-hidden group cursor-pointer ${
                  notification.isRead 
                    ? "bg-slate-900/30 border-white/5 opacity-70" 
                    : "bg-slate-900/60 border-purple-500/20 hover:border-purple-500/40"
                }`}
              >
                {/* Okunmamış Durum Noktası */}
                {!notification.isRead && (
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse shrink-0 mt-1" />
                )}
                {notification.isRead && (
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-600 shrink-0 mt-1" />
                )}
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-4">
                    <span className={`text-xs font-black tracking-wide ${notification.isRead ? "text-slate-400" : "text-white"}`}>
                      {notification.title}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono font-medium shrink-0">
                      {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className={`text-xs tracking-wide leading-relaxed ${notification.isRead ? "text-slate-500" : "text-slate-200"}`}>
                    {notification.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

    </div>
  );
}
