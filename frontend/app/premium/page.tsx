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
    paymentUrl: "https://shopier.com/46963153",
    icon: Star,
    features: ["Sınırsız mesaj", "Kimler beğendi gör", "Ön planda profil", "Filtreleme"],
  },
  {
    id: "QUARTERLY",
    name: "3 Aylık",
    price: 999,
    originalPrice: 1299,
    currency: "TL",
    paymentUrl: "https://shopier.com/46963423",
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
    paymentUrl: "https://shopier.com/46963489",
    icon: Sparkles,
    features: ["Tüm özellikler", "Öncelikli destek", "VIP rozet"],
  },
  {
    id: "ANNUAL",
    name: "12 Aylık",
    price: 2199,
    originalPrice: 2799,
    currency: "TL",
    paymentUrl: "https://shopier.com/46963553",
    icon: Crown,
    features: ["Tüm özellikler", "Öncelikli destek", "VIP rozet", "En avantajlı"],
  },
];

const plansEN = [
  {
    id: "MONTHLY",
    name: "1 Month",
    price: 12.99,
    originalPrice: 15.99,
    currency: "$",
    paymentUrl: "https://shopier.com/47884827",
    icon: Star,
    features: ["Unlimited messages", "See who liked you", "Featured profile", "Filters"],
  },
  {
    id: "QUARTERLY",
    name: "3 Months",
    price: 29.99,
    originalPrice: 39.99,
    currency: "$",
    paymentUrl: "https://shopier.com/47884852",
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
    paymentUrl: "https://shopier.com/47884878",
    icon: Sparkles,
    features: ["All features", "Priority support", "VIP badge"],
  },
  {
    id: "ANNUAL",
    name: "12 Months",
    price: 79.99,
    originalPrice: 109.99,
    currency: "$",
    paymentUrl: "https://shopier.com/47884893",
    icon: Crown,
    features: ["All features", "Priority support", "VIP badge", "Best value"],
  },
];

const plansRU = [
  {
    id: "MONTHLY",
    name: "1 месяц",
    price: 12.99,
    originalPrice: 15.99,
    currency: "$",
    paymentUrl: "https://shopier.com/47884827",
    icon: Star,
    features: ["Безлимитные сообщения", "Кто вас лайкнул", "Продвижение профиля", "Фильтры"],
  },
  {
    id: "QUARTERLY",
    name: "3 месяца",
    price: 29.99,
    originalPrice: 39.99,
    currency: "$",
    paymentUrl: "https://shopier.com/47884852",
    icon: Zap,
    popular: true,
    features: ["Безлимитные сообщения", "Кто вас лайкнул", "Продвижение профиля", "Фильтры", "Расширенный поиск"],
  },
  {
    id: "SEMI_ANNUAL",
    name: "6 месяцев",
    price: 49.99,
    originalPrice: 69.99,
    currency: "$",
    paymentUrl: "https://shopier.com/47884878",
    icon: Sparkles,
    features: ["Все функции", "Приоритетная поддержка", "VIP-значок"],
  },
  {
    id: "ANNUAL",
    name: "12 месяцев",
    price: 79.99,
    originalPrice: 109.99,
    currency: "$",
    paymentUrl: "https://shopier.com/47884893",
    icon: Crown,
    features: ["Все функции", "Приоритетная поддержка", "VIP-значок", "Самый выгодный"],
  },
];

const plansAR = [
  {
    id: "MONTHLY",
    name: "شهر واحد",
    price: 12.99,
    originalPrice: 15.99,
    currency: "$",
    paymentUrl: "https://shopier.com/47884827",
    icon: Star,
    features: ["رسائل غير محدودة", "اعرف من أعجب بك", "إبراز الملف الشخصي", "الفلاتر"],
  },
  {
    id: "QUARTERLY",
    name: "3 أشهر",
    price: 29.99,
    originalPrice: 39.99,
    currency: "$",
    paymentUrl: "https://shopier.com/47884852",
    icon: Zap,
    popular: true,
    features: ["رسائل غير محدودة", "اعرف من أعجب بك", "إبراز الملف الشخصي", "الفلاتر", "بحث متقدم"],
  },
  {
    id: "SEMI_ANNUAL",
    name: "6 أشهر",
    price: 49.99,
    originalPrice: 69.99,
    currency: "$",
    paymentUrl: "https://shopier.com/47884878",
    icon: Sparkles,
    features: ["كل المميزات", "دعم ذو أولوية", "شارة VIP"],
  },
  {
    id: "ANNUAL",
    name: "12 شهراً",
    price: 79.99,
    originalPrice: 109.99,
    currency: "$",
    paymentUrl: "https://shopier.com/47884893",
    icon: Crown,
    features: ["كل المميزات", "دعم ذو أولوية", "شارة VIP", "الأكثر توفيراً"],
  },
];

export default function PremiumPage() {
  const [authTab, setAuthTab] = useState<"login" | "register" | null>(null);
  const [selected, setSelected] = useState<string>("QUARTERLY");

  const { lang } = useI18n();

  const plans =
    lang === "TR"
      ? plansTR
      : lang === "RU"
      ? plansRU
      : lang === "AR"
      ? plansAR
      : plansEN;

  const title =
    lang === "TR"
      ? "Premium Üyelik"
      : lang === "RU"
      ? "Премиум-подписка"
      : lang === "AR"
      ? "العضوية المميزة"
      : "Premium Membership";

  const subtitle =
    lang === "TR"
      ? "Gerçek aşkı bulmak için bir adım önde ol"
      : lang === "RU"
      ? "Будьте на шаг впереди, чтобы найти настоящую связь"
      : lang === "AR"
      ? "كن متقدماً بخطوة للعثور على علاقة حقيقية"
      : "Stay one step ahead to find real connection";

  const popularText =
    lang === "TR"
      ? "Popüler"
      : lang === "RU"
      ? "Популярно"
      : lang === "AR"
      ? "الأكثر شيوعاً"
      : "Popular";

  const buyText =
    lang === "TR"
      ? "Satın Al"
      : lang === "RU"
      ? "Купить"
      : lang === "AR"
      ? "اشترِ الآن"
      : "Buy Now";

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
    <div className="min-h-screen bg-[#310D0C] text-white">
      <Header onOpenLogin={() => setAuthTab("login")} onOpenRegister={() => setAuthTab("register")} />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <Crown className="w-12 h-12 text-[#F6BA48] mx-auto mb-4" />

          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>

          <p className="text-[#F8D290]/70 max-w-xl mx-auto mb-12">{subtitle}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {plans.map((plan) => {
              const Icon = plan.icon;

              return (
                <Card
                  key={plan.id}
                  className={`relative p-6 cursor-pointer transition-all duration-300 ${
                    selected === plan.id
                      ? "border-[#F6BA48] bg-[#683312]/80 scale-105 shadow-[0_18px_50px_rgba(246,186,72,0.14)]"
                      : "border-[#F6BA48]/20 bg-[#512510]/55 hover:border-[#F6BA48]/45 hover:bg-[#683312]/65"
                  }`}
                  onClick={() => setSelected(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#F6BA48] text-[#310D0C] text-xs font-black px-4 py-1 rounded-full">
                      {popularText}
                    </div>
                  )}

                  <Icon className={`w-8 h-8 mx-auto mb-3 ${selected === plan.id ? "text-[#F6BA48]" : "text-[#F8D290]/55"}`} />

                  <h3 className="text-xl font-bold mb-1 text-[#FFF7E8]">{plan.name}</h3>

                  <div className="mb-4">
                    <span className="text-3xl font-bold text-[#F6BA48]">
                      {formatPrice(plan.price)}
                    </span>

                    <span className="text-[#F8D290]/55 text-base"> {plan.currency}</span>

                    {plan.originalPrice && (
                      <span className="block text-[#B5A093]/60 text-xs line-through">
                        {formatPrice(plan.originalPrice)} {plan.currency}
                      </span>
                    )}
                  </div>

                  <ul className="text-left text-base space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-[#F8D290]/75">
                        <Check className="w-4 h-4 text-[#F6BA48]" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${
                      selected === plan.id
                        ? "bg-[#F6BA48] hover:bg-[#EF912C] text-[#310D0C]"
                        : "bg-[#7E4114]/70 hover:bg-[#964F1C] text-[#FFF7E8]"
                    } font-bold`}
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
