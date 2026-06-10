"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (!token) { setStatus("error"); return; }
    fetch(`http://localhost:3000/auth/verify-email?token=${token}`)
      .then((r) => r.json())
      .then((d) => setStatus(d.verified ? "success" : "error"))
      .catch(() => setStatus("error"));
  }, [token]);

  return (
    <div className="min-h-screen bg-pink-950 text-white flex items-center justify-center">
      <Card className="bg-white/5 border-white/10 p-10 text-center max-w-md">
        {status === "loading" && (
          <div className="space-y-4">
            <Loader2 className="w-12 h-12 text-pink-400 mx-auto animate-spin" />
            <p>E-posta doğrulanıyor...</p>
          </div>
        )}
        {status === "success" && (
          <div className="space-y-4">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
            <h1 className="text-2xl font-bold">E-posta Doğrulandı! 🎉</h1>
            <p className="text-white/60">Artık tüm özellikleri kullanabilirsin.</p>
            <a href="/"><Button className="bg-pink-600 hover:bg-pink-700 text-white">Ana Sayfaya Git</Button></a>
          </div>
        )}
        {status === "error" && (
          <div className="space-y-4">
            <XCircle className="w-16 h-16 text-red-400 mx-auto" />
            <h1 className="text-2xl font-bold">Doğrulama Başarısız</h1>
            <p className="text-white/60">Link geçersiz veya süresi dolmuş olabilir.</p>
            <Button className="bg-pink-600 hover:bg-pink-700 text-white">Yeni Kod Gönder</Button>
          </div>
        )}
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-pink-950 text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-pink-400 animate-spin" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
