'use client';

import React, { useEffect, useState } from "react";
import { Bell, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://egelove-backend.onrender.com";

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

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  if (!isClient) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#310D0C]">
        <Loader2 className="h-8 w-8 animate-spin text-[#F6BA48]" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#310D0C] via-[#512510] to-[#310D0C] font-sans text-[#F8D290]">
      <header className="flex w-full shrink-0 items-center justify-between border-b border-[#F6BA48]/10 bg-[#310D0C]/90 px-6 py-5 shadow-md backdrop-blur-xl">
        <a
          href="/dashboard"
          className="flex items-center gap-3 rounded-2xl border border-[#F6BA48]/30 bg-gradient-to-r from-[#7E4114] via-[#B16323] to-[#F6BA48] px-6 py-3 text-sm font-black tracking-wider text-[#310D0C] shadow-lg shadow-black/20 transition-all hover:brightness-110"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>⬅️ ANA SAYFAYA GERİ DÖN</span>
        </a>

        <span className="font-mono text-xs font-bold tracking-widest text-[#F6BA48]">
          SENveBEN BİLDİRİM MERKEZİ
        </span>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 space-y-6 p-6 md:p-8">
        <div className="mb-2 flex items-center justify-between border-b border-[#F6BA48]/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#F6BA48]/25 bg-[#F6BA48]/10">
              <Bell className="h-5 w-5 animate-pulse text-[#F6BA48]" />
            </div>

            <div>
              <h2 className="text-lg font-black uppercase tracking-wider text-[#F6BA48]">
                Son Aktivite Bildirimleri
              </h2>

              <p className="mt-0.5 text-[10px] tracking-wide text-[#B5A093]">
                Platform genelindeki anlık etkileşimleriniz ve sistem raporları.
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex shrink-0 items-center gap-2 rounded-xl border border-[#F6BA48]/15 bg-[#683312]/70 px-4 py-2 text-xs font-bold text-[#F8D290] shadow-md transition-all hover:border-[#F6BA48]/30 hover:bg-[#7E4114]"
            >
              <CheckCircle2 className="h-4 w-4 text-[#3FB36E]" />
              <span>Tümünü Okundu İşaretle</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-[#F6BA48]" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-center text-xs font-bold text-red-400">
            {error}
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-12 text-center text-xs font-bold uppercase tracking-wide text-[#9F7C61]">
            [ Henüz yeni bir bildiriminiz bulunmuyor ]
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() =>
                  !notification.isRead && markAsRead(notification.id)
                }
                className={`group relative flex cursor-pointer items-start gap-4 overflow-hidden rounded-2xl border p-5 shadow-xl transition-all duration-200 ${
                  notification.isRead
                    ? "border-[#F6BA48]/5 bg-[#310D0C]/35 opacity-70"
                    : "border-[#F6BA48]/20 bg-[#683312]/55 hover:border-[#F6BA48]/45 hover:bg-[#7E4114]/55"
                }`}
              >
                {!notification.isRead && (
                  <div className="mt-1 h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-[#F6BA48]" />
                )}

                {notification.isRead && (
                  <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#795843]" />
                )}

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-4">
                    <span
                      className={`text-xs font-black tracking-wide ${
                        notification.isRead
                          ? "text-[#9F7C61]"
                          : "text-[#F8D290]"
                      }`}
                    >
                      {notification.title}
                    </span>

                    <span className="shrink-0 font-mono text-[10px] font-medium text-[#9F7C61]">
                      {new Date(notification.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <p
                    className={`text-xs leading-relaxed tracking-wide ${
                      notification.isRead
                        ? "text-[#795843]"
                        : "text-[#B5A093]"
                    }`}
                  >
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