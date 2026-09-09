"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3001";

function DirectMessageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const targetUserId = searchParams.get("userId");

  const [messageText, setMessageText] = useState("");
  const [status, setStatus] = useState("");

  const handleSendMessage = async () => {
    if (!messageText.trim() || !targetUserId) {
      setStatus("Lütfen bir mesaj yazın.");
      return;
    }

    setStatus("Mesajınız gönderiliyor...");

    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setStatus("Oturumunuz bulunamadı. Lütfen tekrar giriş yapın.");
        return;
      }

      // 1️⃣ Önce kullanıcıyla konuşmayı oluştur / mevcut konuşmayı getir
      const conversationResponse = await fetch(
        `${API_URL}/conversations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: targetUserId,
          }),
        }
      );

      if (!conversationResponse.ok) {
        const errorText = await conversationResponse.text();

        console.error(
          "Konuşma oluşturma hatası:",
          conversationResponse.status,
          errorText
        );

        setStatus("Konuşma başlatılamadı.");
        return;
      }

      const conversation = await conversationResponse.json();

      console.log("Konuşma:", conversation);

      if (!conversation?.id) {
        console.error("Conversation ID bulunamadı:", conversation);
        setStatus("Konuşma bilgisi alınamadı.");
        return;
      }

      // 2️⃣ Conversation ID ile mesajı gönder
      const messageResponse = await fetch(
        `${API_URL}/conversations/${conversation.id}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: messageText.trim(),
          }),
        }
      );

      if (!messageResponse.ok) {
        const errorText = await messageResponse.text();

        console.error(
          "Mesaj gönderme hatası:",
          messageResponse.status,
          errorText
        );

        try {
          const errorData = JSON.parse(errorText);

          setStatus(
            errorData?.message ||
              "Mesaj gönderilemedi."
          );
        } catch {
          setStatus("Mesaj gönderilemedi.");
        }

        return;
      }

      const message = await messageResponse.json();

      console.log("Gönderilen mesaj:", message);

      setStatus("Mesaj başarıyla gönderildi!");
      setMessageText("");

      setTimeout(() => {
        router.push("/messages");
      }, 1200);

    } catch (error) {
      console.error("MESAJ GÖNDERME HATASI:", error);

      setStatus(
        "Bağlantı hatası oluştu. Konsolu kontrol edin."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#EFA3C0] text-[#2D1721] flex flex-col items-center justify-center p-4">

      <div className="w-full max-w-md bg-[#1a1d30] rounded-xl p-6 shadow-xl border border-pink-300/60">

        <h2 className="text-xl font-bold mb-2 text-center text-[#F6BA48]">
          Hızlı Mesaj Gönder
        </h2>

        <p className="text-xs text-[#8A6372] mb-6 text-center">
          Kullanıcıya doğrudan mesaj iletiliyorsunuz.
        </p>

        <textarea
          className="w-full h-32 bg-[#EFA3C0] border border-pink-300/70 rounded-lg p-3 text-[#2D1721] placeholder-slate-500 focus:outline-none focus:border-[#F6BA48] resize-none text-sm mb-4"
          placeholder="Mesajınızı buraya yazın..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />

        <button
          onClick={handleSendMessage}
          className="w-full bg-pink-500 hover:bg-[#C9186B] text-[#2D1721] font-semibold py-3 px-4 rounded-lg transition duration-200 text-sm shadow-lg"
        >
          Mesajı Gönder
        </button>

        {status && (
          <p className="mt-4 text-xs text-center font-medium text-pink-500 bg-pink-950/30 py-2 rounded-md border border-pink-500/50">
            {status}
          </p>
        )}
        <button
  type="button"
  onClick={() => router.push("/messages")}
  className="w-full mt-3 border border-pink-300/70 hover:border-[#F6BA48] text-[#6B4454] hover:text-[#2D1721] font-medium py-2.5 px-4 rounded-lg transition duration-200 text-sm"
>
  ← Geri Dön
</button>

      </div>

    </div>
  );
}

export default function DirectMessagePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#EFA3C0] text-[#2D1721] flex items-center justify-center">
          Yükleniyor...
        </div>
      }
    >
      <DirectMessageContent />
    </Suspense>
  );
}
