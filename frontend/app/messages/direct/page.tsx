"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const API_URL = "https://onrender.com";


function DirectMessageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const targetUserId = searchParams ? searchParams.get("userId") : null;
  
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
      const response = await fetch("https://onrender.com", {

        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          receiverId: targetUserId,
          content: messageText,
        }),
      });

      if (response.ok) {
        setStatus("Mesaj başarıyla gönderildi!");
        setMessageText("");
        // 2 saniye sonra ana mesaj sayfasına geri yönlendir
        setTimeout(() => router.push("/messages"), 2000);
      } else {
        setStatus("Mesaj gönderilemedi. Sunucu hatası.");
      }
    } catch (error) {
      setStatus("Bağlantı hatası oluştu.");
    }
  };

  return (
    <div className="min-h-screen bg-[#121420] text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1a1d30] rounded-xl p-6 shadow-xl border border-slate-800">
        <h2 className="text-xl font-bold mb-2 text-center text-purple-400">Hızlı Mesaj Gönder</h2>
        <p className="text-xs text-slate-500 mb-6 text-center">
          Kullanıcıya doğrudan mesaj iletiliyorsunuz.
        </p>

        <textarea
          className="w-full h-32 bg-[#121420] border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none text-sm mb-4"
          placeholder="Mesajınızı buraya yazın..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />

        <button
          onClick={handleSendMessage}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 text-sm shadow-lg"
        >
          Mesajı Gönder
        </button>

        {status && (
          <p className="mt-4 text-xs text-center font-medium text-purple-300 bg-purple-950/30 py-2 rounded-md border border-purple-900/50">
            {status}
          </p>
        )}
      </div>
    </div>
  );
}

export default function DirectMessagePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#121420] text-white flex items-center justify-center">Yükleniyor...</div>}>
      <DirectMessageContent />
    </Suspense>
  );
}
