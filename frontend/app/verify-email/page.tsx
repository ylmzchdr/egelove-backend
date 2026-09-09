"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    fetch(`${API_URL}/auth/verify-email?token=${token}`)
      .then((r) => r.json())
      .then((d) => setStatus(d.verified ? "success" : "error"))
      .catch(() => setStatus("error"));
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#310D0C] via-[#512510] to-[#310D0C] text-white flex items-center justify-center">
      <Card className="bg-[#512510]/70 border-[#F6BA48]/20 p-10 text-center max-w-md shadow-2xl shadow-black/20">
        {status === "loading" && (
          <div className="space-y-4">
            <Loader2 className="w-12 h-12 text-[#F6BA48] mx-auto animate-spin" />
            <p className="text-[#F8D290]">E-posta doğrulanıyor...</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
            <h1 className="text-2xl font-bold text-[#FFF7E8]">
              E-posta Doğrulandı! 🎉
            </h1>
            <p className="text-[#B5A093]">
              Artık tüm özellikleri kullanabilirsin.
            </p>
            <a href="/">
              <Button className="bg-[#F6BA48] hover:bg-[#EF912C] text-[#310D0C] font-bold">
                Ana Sayfaya Git
              </Button>
            </a>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <XCircle className="w-16 h-16 text-red-400 mx-auto" />
            <h1 className="text-2xl font-bold text-[#FFF7E8]">
              Doğrulama Başarısız
            </h1>
            <p className="text-[#B5A093]">
              Link geçersiz veya süresi dolmuş olabilir.
            </p>

            <Button
              className="bg-[#F6BA48] hover:bg-[#EF912C] text-[#310D0C] font-bold"
              onClick={() => {
                window.location.href = "/forgot-password";
              }}
            >
              Yeni Kod Gönder
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-[#310D0C] via-[#512510] to-[#310D0C] text-white flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#F6BA48] animate-spin" />
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
