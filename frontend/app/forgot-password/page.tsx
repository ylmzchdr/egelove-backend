"use client";

import { useState } from "react";
import { Mail, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "sent" | "reset">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStep("sent");
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Şifreniz başarıyla sıfırlandı! Yeni şifrenizle giriş yapabilirsiniz.");
  };

  return (
    <div className="min-h-screen bg-pink-950 text-white flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <a href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" /> Ana Sayfaya Dön
        </a>

        <Card className="bg-white/5 border-white/10 p-8">
          {step === "email" && (
            <form onSubmit={handleSendCode} className="space-y-4">
              <Mail className="w-10 h-10 text-pink-400 mx-auto mb-2" />
              <h1 className="text-2xl font-bold text-center">Şifremi Unuttum</h1>
              <p className="text-sm text-white/50 text-center">E-posta adresine şifre sıfırlama kodu gönderelim.</p>
              <Input
                type="email"
                placeholder="E-posta adresin"
                className="bg-pink-950/50 border-white/10 text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold">
                Kod Gönder
              </Button>
            </form>
          )}

          {step === "sent" && (
            <div className="text-center space-y-4">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
              <h1 className="text-2xl font-bold">Kod Gönderildi</h1>
              <p className="text-sm text-white/50">{email} adresine bir doğrulama kodu gönderdik.</p>
              <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold" onClick={() => setStep("reset")}>
                Kodu Gir
              </Button>
            </div>
          )}

          {step === "reset" && (
            <form onSubmit={handleReset} className="space-y-4">
              <h1 className="text-2xl font-bold text-center">Yeni Şifre</h1>
              <Input
                placeholder="Doğrulama kodu"
                className="bg-pink-950/50 border-white/10 text-white"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Yeni şifren (en az 8 karakter)"
                className="bg-pink-950/50 border-white/10 text-white"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold">
                Şifreyi Sıfırla
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
