"use client";

import { useState } from "react";
import { Users, Shield, Smartphone, Star } from "lucide-react";

import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import AuthDialog from "@/components/AuthDialog";

const features = [
  {
    icon: Users,
    title: "Geniş Üye Tabanı",
    description:
      "EgeLove'da yeni insanlarla tanışın, size uygun profilleri keşfedin ve yeni bağlantılar kurun.",
  },
  {
    icon: Shield,
    title: "Güvenli Platform",
    description:
      "Kişisel bilgileriniz ve iletişimleriniz güvenli bir ortamda korunur.",
  },
  {
    icon: Smartphone,
    title: "Her Yerden Erişim",
    description:
      "Telefon, tablet veya bilgisayarınızdan EgeLove'a kolayca erişin.",
  },
  {
    icon: Star,
    title: "Akıllı Eşleşme",
    description:
      "EgeMatch AI ile ilgi alanlarınıza ve tercihlerinize uygun insanları keşfedin.",
  },
];

function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-[#160019] py-20 md:py-24"
    >
      {/* Arka plan ışıkları */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-72 w-72 rounded-full bg-pink-600/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-0 h-72 w-72 rounded-full bg-purple-600/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        {/* Başlık */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <div className="mb-4 text-3xl">❤️</div>

          <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
            Neden <span className="text-[#FFC000]">EgeLove?</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
            Yeni insanlarla tanışmak, sohbet etmek ve size uygun bağlantılar
            kurmak için ihtiyacınız olan her şey EgeLove'da.
          </p>
        </div>

        {/* Özellik kartları */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-white/10 bg-white/[0.035] p-7 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#FFC000]/40 hover:bg-white/[0.07]"
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#FFC000]/20 bg-[#FFC000]/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#FFC000]/15">
                  <Icon className="h-8 w-8 text-[#FFC000]" />
                </div>

                <h3 className="mb-3 text-xl font-extrabold text-white">
                  {feature.title}
                </h3>

                <p className="text-sm leading-6 text-white/65">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [authTab, setAuthTab] = useState<"login" | "register" | null>(null);

  return (
    <div className="min-h-screen bg-[#0d1527] font-sans text-white">
      <Header
        onOpenLogin={() => setAuthTab("login")}
        onOpenRegister={() => setAuthTab("register")}
      />

      {/* HERO */}
      <HeroSection onCtaClick={() => setAuthTab("register")} />

      <main>
        {/* NEDEN EGELOVE */}
        <FeaturesSection />

        {/* İLETİŞİM */}
        <ContactSection />
      </main>

      <Footer />

      {/* GİRİŞ / KAYIT */}
      <AuthDialog
        activeTab={authTab}
        onClose={() => setAuthTab(null)}
      />
    </div>
  );
}