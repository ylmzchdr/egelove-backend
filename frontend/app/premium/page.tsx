"use client";

import { useState } from "react";
import { Check, Crown, Star, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthDialog from "@/components/AuthDialog";

const plans = [
  { id: "MONTHLY", name: "Aylık", price: 399.99, originalPrice: 499.99, days: 30, icon: Star, features: ["Sınırsız mesaj", "Kimler beğendi gör", "Ön planda profil", "Filtreleme"] },
  { id: "QUARTERLY", name: "3 Aylık", price: 999, originalPrice: 1299, days: 90, icon: Zap, popular: true, features: ["Sınırsız mesaj", "Kimler beğendi gör", "Ön planda profil", "Filtreleme", "Gelişmiş arama"] },
  { id: "SEMI_ANNUAL", name: "6 Aylık", price: 999, originalPrice: 1799, days: 180, icon: Sparkles, features: ["Tüm özellikler", "Öncelikli destek", "VIP rozet"] },
  { id: "ANNUAL", name: "12 Aylık", price: 1599, originalPrice: 2799, days: 365, icon: Crown, features: ["Tüm özellikler", "Öncelikli destek", "VIP rozet", "En popüler"] },
];

export default function PremiumPage() {
  const [authTab, setAuthTab] = useState<"login" | "register" | null>(null);
  const [selected, setSelected] = useState<string>("QUARTERLY");

  const handleBuy = (planId: string) => {
    const token = localStorage.getItem("accessToken");
    if (!token) { setAuthTab("login"); return; }
    alert(`${planId} paketi seçildi. Shopier yönlendirmesi yapılacak.`);
  };

  return (
    <div className="min-h-screen bg-pink-950 text-white">
      <Header onOpenLogin={() => setAuthTab("login")} onOpenRegister={() => setAuthTab("register")} />
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Premium Üyelik</h1>
          <p className="text-white/60 max-w-xl mx-auto mb-12">Gerçek aşkı bulmak için bir adım önde ol</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {plans.map((plan) => {
              const Icon = plan.icon;
              return (
                <Card
                  key={plan.id}
                  className={`relative p-6 cursor-pointer transition-all duration-300 ${
                    selected === plan.id
                      ? "border-pink-500 bg-pink-900/60 scale-105"
                      : "border-white/10 bg-white/5 hover:border-pink-400/30"
                  }`}
                  onClick={() => setSelected(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-pink-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                      Popüler
                    </div>
                  )}
                  <Icon className={`w-8 h-8 mx-auto mb-3 ${selected === plan.id ? "text-pink-300" : "text-white/50"}`} />
                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-pink-300">{plan.price % 1 === 0 ? plan.price : plan.price.toFixed(2)}</span>
                    <span className="text-white/40 text-sm"> TL</span>
                    {plan.originalPrice && (
                      <span className="block text-white/30 text-xs line-through">{plan.originalPrice % 1 === 0 ? plan.originalPrice : plan.originalPrice.toFixed(2)} TL</span>
                    )}
                  </div>
                  <ul className="text-left text-sm space-y-2 mb-6">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-white/70">
                        <Check className="w-4 h-4 text-pink-400" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${selected === plan.id ? "bg-pink-600 hover:bg-pink-700" : "bg-white/10 hover:bg-white/20"} text-white`}
                    onClick={() => handleBuy(plan.id)}
                  >
                    Satın Al
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
      <Footer />
      <AuthDialog activeTab={authTab} onClose={() => setAuthTab(null)} />
    </div>
  );
}
