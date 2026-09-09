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
    <div className="min-h-screen bg-gradient-to-b from-[#310D0C] via-[#512510] to-[#310D0C] text-white flex flex-col items-center justify-center p-4">

      <div className="w-full max-w-md bg-[#512510]/80 rounded-xl p-6 shadow-[0_24px_70px_rgba(0,0,0,0.35)] border border-[#F6BA48]/20">

        <h2 className="text-xl font-bold mb-2 text-center text-[#F6BA48]">
          Hızlı Mesaj Gönder
        </h2>

        <p className="text-xs text-[#B5A093] mb-6 text-center">
          Kullanıcıya doğrudan mesaj iletiliyorsunuz.
        </p>

        <textarea
          className="w-full h-32 bg-[#310D0C]/70 border border-[#F6BA48]/20 rounded-lg p-3 text-white placeholder:text-[#B5A093]/60 focus:outline-none focus:border-[#F6BA48] focus:ring-2 focus:ring-[#F6BA48]/15 resize-none text-sm mb-4"
          placeholder="Mesajınızı buraya yazın..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />

        <button
          onClick={handleSendMessage}
          className="w-full bg-[#F6BA48] hover:bg-[#EF912C] text-[#310D0C] font-semibold py-3 px-4 rounded-lg transition duration-200 text-sm shadow-lg"
        >
          Mesajı Gönder
        </button>

        {status && (
          <p className="mt-4 text-xs text-center font-medium text-[#F8D290] bg-[#683312]/45 py-2 rounded-md border border-[#F6BA48]/20">
            {status}
          </p>
        )}

        <button
          type="button"
          onClick={() => router.push("/messages")}
          className="w-full mt-3 border border-[#F6BA48]/25 hover:border-[#F6BA48] text-[#F8D290]/80 hover:text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 text-sm"
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
        <div className="min-h-screen bg-[#310D0C] text-[#F8D290] flex items-center justify-center">
          Yükleniyor...
        </div>
      }
    >
      <DirectMessageContent />
    </Suspense>
  );
}
