"use client";

import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import AuthDialog from "@/components/AuthDialog";

export default function Home() {
  const [authTab, setAuthTab] = useState<"login" | "register" | null>(null);

  return (
    <div className="min-h-screen bg-[#0d1527] text-white font-sans">
      <Header
        onOpenLogin={() => setAuthTab("login")}
        onOpenRegister={() => setAuthTab("register")}
      />

      <HeroSection onCtaClick={() => setAuthTab("register")} />

      <main>
        <ContactSection />
      </main>

      <Footer />

      <AuthDialog activeTab={authTab} onClose={() => setAuthTab(null)} />
    </div>
  );
}