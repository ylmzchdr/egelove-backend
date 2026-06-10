"use client";

import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import DiscoverMembers from "@/components/DiscoverMembers"; // Keşfet kısmı
import ContactSection from "@/components/ContactSection"; // İletişim kısmı
import Footer from "@/components/Footer"; // Footer
import AuthDialog from "@/components/AuthDialog";

export default function Home() {
  const [authTab, setAuthTab] = useState<"login" | "register" | null>(null);

  return (
    // bg-pink-950 temizlendi, yerine modern koyu arka plan (bg-[#0d1527]) getirildi
    <div className="min-h-screen bg-[#0d1527] text-white font-sans">
      <Header
        onOpenLogin={() => setAuthTab("login")}
        onOpenRegister={() => setAuthTab("register")}
      />
      
      {/* 
        Ana manzara, başlıklar ve o sarı buton bu HeroSection'ın içinde gizli!
        onCtaClick sayesinde sarı butona basıldığında Üye Ol penceresi tıkır tıkır açılacak.
      */}
      <HeroSection onCtaClick={() => setAuthTab("register")} />
      
      {/* Keşfet ve İletişim alanları */}
      <main>
        <DiscoverMembers />
        <ContactSection />
      </main>
      
      <Footer />
      
      {/* Giriş Yap / Üye Ol açılır pencere motoru */}
      <AuthDialog activeTab={authTab} onClose={() => setAuthTab(null)} />
    </div>
  );
}
