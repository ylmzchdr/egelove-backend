"use client";

import { useState } from "react";
import { Users, Shield, Smartphone, Star, Mail, Globe, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n-context";

import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import AuthDialog from "@/components/AuthDialog";

type LangKey = "TR" | "EN" | "RU" | "AR";

// 1. ÖZELLİKLER BÖLÜMÜ DİL PAKETLERİ
const featuresTranslations = {
  TR: {
    sectionTitle: "Neden ",
    mainSubtitle: "Yeni insanlarla tanışmak, sohbet etmek ve size uygun bağlantılar kurmak için ihtiyacınız olan her şey EgeLove'da.",
    f1Title: "Geniş Üye Tabanı",
    f1Desc: "EgeLove'da yeni insanlarla tanışın, size uygun profilleri keşfedin ve yeni bağlantılar kurun.",
    f2Title: "Güvenli Platform",
    f2Desc: "Kişisel bilgileriniz ve iletişimleriniz güvenli bir ortamda korunur.",
    f3Title: "Her Yerden Erişim",
    f3Desc: "Telefon, tablet veya bilgisayarınızdan EgeLove'a kolayca erişin.",
    f4Title: "Akıllı Eşleşme",
    f4Desc: "EgeMatch AI ile ilgi alanlarınıza ve tercihlerinize uygun insanları keşfedin."
  },
  EN: {
    sectionTitle: "Why ",
    mainSubtitle: "Everything you need to meet new people, chat, and build right connections is on EgeLove.",
    f1Title: "Large Member Base",
    f1Desc: "Meet new people on EgeLove, discover profiles that suit you, and build new connections.",
    f2Title: "Secure Platform",
    f2Desc: "Your personal information and communications are protected in a secure environment.",
    f3Title: "Access Anywhere",
    f3Desc: "Easily access EgeLove from your phone, tablet, or computer.",
    f4Title: "Smart Match",
    f4Desc: "Discover people suitable for your interests and preferences with EgeMatch AI."
  },
  RU: {
    sectionTitle: "Почему ",
    mainSubtitle: "Все, что вам нужно для знакомства с новыми людьми, общения и создания правильных связей, есть на EgeLove.",
    f1Title: "Широкая база участников",
    f1Desc: "Знакомьтесь с новыми людьми на EgeLove, находите подходящие профили и создавайте новые связи.",
    f2Title: "Безопасная платформа",
    f2Desc: "Ваша личная информация и общение защищены в безопасной среде.",
    f3Title: "Доступ отовсюду",
    f3Desc: "Легко заходите на EgeLove с телефона, планшета или компьютера.",
    f4Title: "Умное совпадение",
    f4Desc: "Находите людей, соответствующих вашим интересам и предпочтениям, с помощью EgeMatch AI."
  },
  AR: {
    sectionTitle: "لماذا ",
    mainSubtitle: "كل ما تحتاجه للتعرف على أشخاص جدد، الدردشة، وبناء العلاقات المناسبة موجود في EgeLove.",
    f1Title: "قاعدة أعضاء واسعة",
    f1Desc: "تعرف على أشخاص جدد في EgeLove، واكتشف الملفات الشخصية التي تناسبك، وابنِ علاقات جديدة.",
    f2Title: "منصة آمنة",
    f2Desc: "معلوماتك الشخصية واتصالاتك محمية في بيئة آمنة.",
    f3Title: "الوصول من أي مكان",
    f3Desc: "قم بالوصول إلى EgeLove بسهولة من هاتفك، جهازك اللوحي، أو حاسوبك.",
    f4Title: "تطابق ذكي",
    f4Desc: "اكتشف أشخاصاً مناسبين لاهتماماتك وتفضيلاتك مع EgeMatch AI."
  }
};

// 2. İLETİŞİM BÖLÜMÜ DİL PAKETLERİ
const contactTranslations = {
  TR: {
    title: "İletişim",
    subtitle: "Sorularınız, önerileriniz veya iş birlikleri için bizimle iletişime geçebilirsiniz.",
    emailTitle: "E-Posta",
    webTitle: "Web Sitesi",
    techTitle: "Teknoloji",
    techDesc: "EgeMatch AI Destekli"
  },
  EN: {
    title: "Contact",
    subtitle: "You can contact us for your questions, suggestions, or collaborations.",
    emailTitle: "Email",
    webTitle: "Website",
    techTitle: "Technology",
    techDesc: "EgeMatch AI Powered"
  },
  RU: {
    title: "Контакты",
    subtitle: "Вы можете связаться с нами по вопросам, предложениям или сотрудничеству.",
    emailTitle: "Эл. почта",
    webTitle: "Веб-сайт",
    techTitle: "Технологии",
    techDesc: "На базе EgeMatch AI"
  },
  AR: {
    title: "اتصل بنا",
    subtitle: "يمكنك الاتصال بنا لطرح أسئلتك، مقترحاتك، أو لفرص التعاون.",
    emailTitle: "البريد الإلكتروني",
    webTitle: "الموقع الإلكتروني",
    techTitle: "التكنولوجيا",
    techDesc: "مدعوم بـ EgeMatch AI"
  }
};

function FeaturesSection({ langKey }: { langKey: LangKey }) {
  const t = featuresTranslations[langKey];
  
  const features = [
    { icon: Users, title: t.f1Title, description: t.f1Desc },
    { icon: Shield, title: t.f2Title, description: t.f2Desc },
    { icon: Smartphone, title: t.f3Title, description: t.f3Desc },
    { icon: Star, title: t.f4Title, description: t.f4Desc },
  ];

  return (
    <section id="features" className="relative overflow-hidden bg-[#160019] py-20 md:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-72 w-72 rounded-full bg-pink-600/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-0 h-72 w-72 rounded-full bg-purple-600/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <div className="mb-4 text-3xl">❤️</div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
            {t.sectionTitle}<span className="text-[#FFC000]">EgeLove?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
            {t.mainSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="group rounded-2xl border border-white/10 bg-white/[0.035] p-7 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#FFC000]/40 hover:bg-white/[0.07]">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#FFC000]/20 bg-[#FFC000]/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#FFC000]/15">
                  <Icon className="h-8 w-8 text-[#FFC000]" />
                </div>
                <h3 className="mb-3 text-xl font-extrabold text-white">{feature.title}</h3>
                <p className="text-sm leading-6 text-white/65">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function LocalContactSection({ langKey }: { langKey: LangKey }) {
  const t = contactTranslations[langKey];

  return (
    <section id="contact" className="relative overflow-hidden bg-[#0d1527] py-20 md:py-24">
      <div className="relative mx-auto max-w-7xl px-6 md:px-12 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">{t.title}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-white/70 md:text-lg">{t.subtitle}</p>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3 max-w-4xl mx-auto">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm">
            <Mail className="h-8 w-8 text-[#FFC000] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">{t.emailTitle}</h3>
            <p className="text-sm text-white/60">hello@egelove.tr</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm">
            <Globe className="h-8 w-8 text-[#FFC000] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">{t.webTitle}</h3>
            <p className="text-sm text-white/60">https://egelove.tr</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm">
            <Sparkles className="h-8 w-8 text-[#FFC000] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">{t.techTitle}</h3>
            <p className="text-sm text-white/60">{t.techDesc}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [authTab, setAuthTab] = useState<"login" | "register" | null>(null);
  const { lang } = useI18n();

  const currentLang: LangKey = ["TR", "EN", "RU", "AR"].includes(lang)
    ? (lang as LangKey)
    : "TR";

  const isRtl = currentLang === "AR";

  return (
    <div className="min-h-screen bg-[#0d1527] font-sans text-white" dir={isRtl ? "rtl" : "ltr"}>
      <Header
        onOpenLogin={() => setAuthTab("login")}
        onOpenRegister={() => setAuthTab("register")}
      />

      {/* HERO */}
      <HeroSection onCtaClick={() => setAuthTab("register")} />

      <main>
        {/* NEDEN EGELOVE */}
        <FeaturesSection langKey={currentLang} />

        {/* İLETİŞİM */}
        <LocalContactSection langKey={currentLang} />
      </main>

      <Footer />

      {/* GİRİŞ / KAYIT */}
      <AuthDialog activeTab={authTab} onClose={() => setAuthTab(null)} />
    </div>
  );
}