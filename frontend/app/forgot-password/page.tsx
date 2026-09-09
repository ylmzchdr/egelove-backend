"use client";

import { useState } from "react";
import { Mail, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "sent" | "reset">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanEmail = email.toLowerCase().trim();

    if (!cleanEmail) {
      alert("Lütfen e-posta adresinizi girin.");
      return;
    }

    try {
      await api.auth.forgotPassword(cleanEmail);
      setEmail(cleanEmail);
      setStep("sent");
    } catch (err: any) {
      alert(err.message || "Kod gönderilemedi.");
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !code || !newPassword) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      await api.auth.resetPassword({
        email,
        code,
        newPassword,
      });

      alert("Şifreniz başarıyla sıfırlandı!");
      window.location.href = "/";
    } catch (err: any) {
      alert(err.message || "Şifre sıfırlanamadı.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#310D0C] via-[#512510] to-[#310D0C] text-white flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-[#B5A093] hover:text-[#F8D290] mb-8 text-base transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Ana Sayfaya Dön
        </a>

        <Card className="bg-[#512510]/70 border-[#F6BA48]/20 p-8 shadow-2xl shadow-black/20">
          {step === "email" && (
            <form onSubmit={handleSendCode} className="space-y-4">
              <Mail className="w-10 h-10 text-[#F6BA48] mx-auto mb-2" />
              <h1 className="text-2xl font-bold text-center text-[#FFF7E8]">
                Şifremi Unuttum
              </h1>
              <p className="text-base text-[#B5A093] text-center">
                E-posta adresine şifre sıfırlama kodu gönderelim.
              </p>
              <Input
                type="email"
                placeholder="E-posta adresin"
                className="bg-[#310D0C]/50 border-[#F6BA48]/20 text-white placeholder:text-[#9F7C61] focus-visible:ring-[#F6BA48]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                type="submit"
                className="w-full bg-[#F6BA48] hover:bg-[#EF912C] text-[#310D0C] font-bold"
              >
                Kod Gönder
              </Button>
            </form>
          )}

          {step === "sent" && (
            <div className="text-center space-y-4">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
              <h1 className="text-2xl font-bold text-[#FFF7E8]">
                Kod Gönderildi
              </h1>
              <p className="text-base text-[#B5A093]">
                {email} adresine bir doğrulama kodu gönderdik.
              </p>
              <Button
                className="w-full bg-[#F6BA48] hover:bg-[#EF912C] text-[#310D0C] font-bold"
                onClick={() => setStep("reset")}
              >
                Kodu Gir
              </Button>
            </div>
          )}

          {step === "reset" && (
            <form onSubmit={handleReset} className="space-y-4">
              <h1 className="text-2xl font-bold text-center text-[#FFF7E8]">
                Yeni Şifre
              </h1>
              <Input
                placeholder="Doğrulama kodu"
                className="bg-[#310D0C]/50 border-[#F6BA48]/20 text-white placeholder:text-[#9F7C61] focus-visible:ring-[#F6BA48]"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Yeni şifren (en az 8 karakter)"
                className="bg-[#310D0C]/50 border-[#F6BA48]/20 text-white placeholder:text-[#9F7C61] focus-visible:ring-[#F6BA48]"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Button
                type="submit"
                className="w-full bg-[#F6BA48] hover:bg-[#EF912C] text-[#310D0C] font-bold"
              >
                Şifreyi Sıfırla
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
