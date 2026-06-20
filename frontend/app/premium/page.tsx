"use client";

import { useState } from "react";
import { Check, Crown, Star, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthDialog from "@/components/AuthDialog";
import { useI18n } from "@/lib/i18n-context";

const plansTR = [
  {
    id: "MONTHLY",
    name: "Aylık",
    price: 399.99,
    originalPrice: 499.99,
    currency: "TL",
    paymentUrl: "https://www.shopier.com/ShowProductNew/products.php?id=4696153",
    icon: Star,
    features: ["Sınırsız mesaj", "Kimler beğendi gör", "Ön planda profil", "Filtreleme"],
  },
  {
    id: "QUARTERLY",
    name: "3 Aylık",
    price: 999,
    originalPrice: 1299,
    currency: "TL",
    paymentUrl: "https://www.shopier.com/ShowProductNew/products.php?id=4696342",
    icon: Zap,
    popular: true,
    features: ["Sınırsız mesaj", "Kimler beğendi gör", "Ön planda profil", "Filtreleme", "Gelişmiş arama"],
  },
  {
    id: "SEMI_ANNUAL",
    name: "6 Aylık",
    price: 1799,
    originalPrice: 2199,
    currency: "TL",
    paymentUrl: "https://www.shopier.com/ShowProductNew/products.php?id=4696348",
    icon: Sparkles,
    features: ["Tüm özellikler", "Öncelikli destek", "VIP rozet"],
  },
  {
    id: "ANNUAL",
    name: "12 Aylık",
    price: 2199,
    originalPrice: 2799,
    currency: "TL",
    paymentUrl: "https://www.shopier.com/ShowProductNew/products.php?id=4696353",
    icon: Crown,
    features: ["Tüm özellikler", "Öncelikli destek", "VIP rozet", "En avantajlı"],
  },
];

const plansUSD = [
  {
    id: "MONTHLY",
    name: "1 Month",
    price: 12.99,
    originalPrice: 15.99,
    currency: "$",
    paymentUrl: "https://www.shopier.com/ShowProductNew/products.php?id=4784827",
    icon: Star,
    features: ["Unlimited messages", "See who liked you", "Featured profile", "Filters"],
  },
  {
    id: "QUARTERLY",
    name: "3 Months",
    price: 29.99,
    originalPrice: 39.99,
    currency: "$",
    paymentUrl: "https://www.shopier.com/ShowProductNew/products.php?id=4784852",
    icon: Zap,
    popular: true,
    features: ["Unlimited messages", "See who liked you", "Featured profile", "Filters", "Advanced search"],
  },
  {
    id: "SEMI_ANNUAL",
    name: "6 Months",
    price: 49.99,
    originalPrice: 69.99,
    currency: "$",
    paymentUrl: "https://www.shopier.com/ShowProductNew/products.php?id=4784878",
    icon: Sparkles,
    features: ["All features", "Priority support", "VIP badge"],
  },
  {
    id: "ANNUAL",
    name: "12 Months",
    price: 79.99,
    originalPrice: 109.99,
    currency: "$",
    paymentUrl: "https://www.shopier.com/ShowProductNew/products.php?id=4784893",
    icon: Crown,
    features: ["All features", "Priority support", "VIP badge", "Best value"],
  },
];

export default function PremiumPage() {
  const [authTab, setAuthTab] = useState<"login" | "register" | null>(null);
  const [selected, setSelected] = useState<string>("QUARTERLY");

  const { lang } = useI18n();
  const isTR = lang === "TR";
  const plans = isTR ? plansTR : plansUSD;

  const title = isTR ? "Premium Üyelik" : "Premium Membership";
  const subtitle = isTR
    ? "Gerçek aşkı bulmak için bir adım önde ol"
    : "Stay one step ahead to find real connection";
  const popularText = isTR ? "Popüler" : "Popular";
  const buyText = isTR ? "Satın Al" : "Buy Now";

  const formatPrice = (price: number) => {
    return price % 1 === 0 ? price.toString() : price.toFixed(2);
  };

  const handleBuy = (planId: string) => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setAuthTab("login");
      return;
    }

    const plan = plans.find((p) => p.id === planId);
    if (!plan) return;

    window.location.href = plan.paymentUrl;
  };

  return (
    <div className="min-h-screen bg-pink-950 text-white">
      <Header onOpenLogin={() => setAuthTab("login")} onOpenRegister={() => setAuthTab("register")} />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-4" />

          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>

          <p className="text-white/60 max-w-xl mx-auto mb-12">{subtitle}</p>

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
                      {popularText}
                    </div>
                  )}

                  <Icon className={`w-8 h-8 mx-auto mb-3 ${selected === plan.id ? "text-pink-300" : "text-white/50"}`} />

                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>

                  <div className="mb-4">
                    <span className="text-3xl font-bold text-pink-300">
                      {formatPrice(plan.price)}
                    </span>

                    <span className="text-white/40 text-sm"> {plan.currency}</span>

                    {plan.originalPrice && (
                      <span className="block text-white/30 text-xs line-through">
                        {formatPrice(plan.originalPrice)} {plan.currency}
                      </span>
                    )}
                  </div>

                  <ul className="text-left text-sm space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-white/70">
                        <Check className="w-4 h-4 text-pink-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${
                      selected === plan.id
                        ? "bg-pink-600 hover:bg-pink-700"
                        : "bg-white/10 hover:bg-white/20"
                    } text-white`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBuy(plan.id);
                    }}
                  >
                    {buyText}
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