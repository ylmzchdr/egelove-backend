"use client";

import { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster, toast } from "sonner";
import { io } from "socket.io-client";
import { I18nProvider } from "@/lib/i18n-context";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://egelove-backend.onrender.com";

function RealtimeNotifications() {
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) return;

    const socket = io(`${SOCKET_URL}/chat`, {
      auth: {
        token,
      },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("🟢 Bildirim Socket bağlantısı kuruldu");
    });

    socket.on("connect_error", (error) => {
      console.error("🔴 Bildirim Socket bağlantı hatası:", error);
    });

    socket.on("message:new", (message) => {
      console.log("🔔 YENİ MESAJ:", message);

      window.dispatchEvent(
        new CustomEvent("egelove:notification", {
          detail: {
            type: "message",
            message,
          },
        }),
      );

      const senderName =
        message?.sender?.name || "Yeni mesaj";

      const content =
        message?.content || "Sana yeni bir mesaj gönderildi.";

      toast.info(`${senderName} sana yeni bir mesaj gönderdi`, {
        description: content,
        duration: 6000,
      });

      // Tarayıcı bildirim izni daha önce verilmişse
      if (
        typeof window !== "undefined" &&
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        new Notification(`${senderName} sana yeni bir mesaj gönderdi`, {
          body: content,
        });
      }

      // Basit sesli uyarı
      try {
        const audioContext = new AudioContext();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 880;
        oscillator.type = "sine";

        gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.001,
          audioContext.currentTime + 0.5,
        );

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
      } catch (error) {
        console.log("Bildirim sesi çalınamadı:", error);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return null;
}

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider defaultTheme="light" attribute="class">
      <I18nProvider>
        <RealtimeNotifications />
        {children}
        <Toaster />
      </I18nProvider>
    </ThemeProvider>
  );
}
