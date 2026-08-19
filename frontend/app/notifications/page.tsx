"use client";

import { useEffect, useState } from "react";
import { Bell, Check, CheckCheck, Heart, UserPlus } from "lucide-react";

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  relatedUserId?: string | null;
  isRead: boolean;
  createdAt: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://egelove-backend.onrender.com";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadNotifications() {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("accessToken");

      if (!token) {
        setError("Oturum bulunamadı.");
        return;
      }

      const res = await fetch(`${API_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Bildirimler alınamadı: ${res.status}`);
      }

      const data = await res.json();

      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Notifications error:", err);
      setError("Bildirimler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(id: string) {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) return;

      await fetch(`${API_URL}/notifications/${id}/read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isRead: true } : item
        )
      );
    } catch (err) {
      console.error("Mark as read error:", err);
    }
  }

  async function markAllAsRead() {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) return;

      await fetch(`${API_URL}/notifications/read-all`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          isRead: true,
        }))
      );
    } catch (err) {
      console.error("Mark all as read error:", err);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  const unreadCount = notifications.filter(
    (item) => !item.isRead
  ).length;

  return (
    <div className="min-h-screen bg-[#121420] text-white p-6 md:p-8">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between gap-4">
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

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 transition"
            >
              <CheckCheck className="w-4 h-4" />
              Tümünü okundu işaretle
            </button>
          )}
        </div>

        {/* LOADING */}
        {loading && (
          <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-10 text-center">
            <div className="mx-auto w-12 h-12 rounded-full border-2 border-purple-400/30 border-t-purple-400 animate-spin" />

            <p className="text-slate-400 mt-5">
              Bildirimler yükleniyor...
            </p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8 text-center">
            <p className="text-red-300">
              {error}
            </p>

            <button
              onClick={loadNotifications}
              className="mt-4 px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 transition font-semibold"
            >
              Tekrar Dene
            </button>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && notifications.length === 0 && (
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
        )}

        {/* NOTIFICATIONS */}
        {!loading && !error && notifications.length > 0 && (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-2xl border p-5 transition ${
                  notification.isRead
                    ? "bg-slate-900/40 border-white/10"
                    : "bg-purple-500/10 border-purple-500/30"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center ${
                      notification.type === "LIKE"
                        ? "bg-pink-500/15 text-pink-400"
                        : "bg-purple-500/15 text-purple-400"
                    }`}
                  >
                    {notification.type === "LIKE" ? (
                      <Heart className="w-5 h-5" />
                    ) : (
                      <UserPlus className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold">
                          {notification.title}
                        </h3>

                        <p className="text-sm text-slate-400 mt-1">
                          {notification.message}
                        </p>
                      </div>

                      {!notification.isRead && (
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shrink-0 mt-2" />
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-slate-500">
                        {new Date(
                          notification.createdAt
                        ).toLocaleString("tr-TR")}
                      </span>

                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="flex items-center gap-1.5 text-xs text-purple-300 hover:text-purple-200 transition"
                        >
                          <Check className="w-4 h-4" />
                          Okundu işaretle
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}