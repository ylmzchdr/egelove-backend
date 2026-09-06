"use client";

import { useState } from "react";
import {
  Users,
  Shield,
  Smartphone,
  Video,
  Languages,
  Star,
  Mail,
  Globe,
  Sparkles,
} from "lucide-react";
import { useI18n } from "@/lib/i18n-context";

import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import AuthDialog from "@/components/AuthDialog";

type LangKey = "TR" | "EN" | "RU" | "AR";

// ============================================================
// ÖZELLİKLER BÖLÜMÜ DİL PAKETLERİ
// ============================================================

const featuresTranslations = {
  TR: {
    sectionTitle: "Neden ",
    mainSubtitle:
      "Türkiye'nin 81 ilinden yeni insanlarla tanışın. Canlı görüntülü odalara katılın, 4 dilde iletişim kurun ve size uygun insanlarla güvenle bağlantı kurun.",

    f1Title: "81 İlden Yeni İnsanlar",
    f1Desc:
      "Türkiye'nin 81 ilinden insanları keşfedin, size uygun profilleri bulun ve yeni arkadaşlıklar kurun.",

    f2Title: "Canlı Görüntülü Görüşme",
    f2Desc:
      "Yeni tanıştığınız insanlarla canlı görüntülü odalara geçin ve gerçek zamanlı iletişim kurun.",

    f3Title: "4 Dilde İletişim",
    f3Desc:
      "Türkçe, İngilizce, Rusça ve Arapça dil desteğiyle farklı ülkelerden insanlarla daha kolay iletişim kurun.",

    f4Title: "Akıllı Eşleşme",
    f4Desc:
      "EgeMatch AI ile ilgi alanlarınıza ve tercihlerinize uygun insanları keşfedin.",
  },

  EN: {
    sectionTitle: "Why ",
    mainSubtitle:
      "Meet new people from all 81 provinces of Türkiye. Join live video rooms, communicate in 4 languages, and build genuine connections safely.",

    f1Title: "People from 81 Provinces",
    f1Desc:
      "Discover people from all 81 provinces of Türkiye, find profiles that match you, and build new friendships.",

    f2Title: "Live Video Chat",
    f2Desc:
      "Join live video rooms with people you meet and communicate in real time.",

    f3Title: "4-Language Communication",
    f3Desc:
      "Communicate more easily with people from different countries with Turkish, English, Russian, and Arabic language support.",

    f4Title: "Smart Matching",
    f4Desc:
      "Discover people who match your interests and preferences with EgeMatch AI.",
  },

  RU: {
    sectionTitle: "Почему ",
    mainSubtitle:
      "Знакомьтесь с людьми из всех 81 провинции Турции. Присоединяйтесь к видеокомнатам, общайтесь на 4 языках и безопасно находите новые связи.",

    f1Title: "Люди из 81 провинции",
    f1Desc:
      "Открывайте для себя людей из всех 81 провинции Турции, находите подходящие профили и заводите новые знакомства.",

    f2Title: "Видеочат в реальном времени",
    f2Desc:
      "Переходите в видеокомнаты с новыми знакомыми и общайтесь в реальном времени.",

    f3Title: "Общение на 4 языках",
    f3Desc:
      "Общайтесь с людьми из разных стран благодаря поддержке турецкого, английского, русского и арабского языков.",

    f4Title: "Умный подбор",
    f4Desc:
      "Находите людей, соответствующих вашим интересам и предпочтениям, с помощью EgeMatch AI.",
  },

  AR: {
    sectionTitle: "لماذا ",
    mainSubtitle:
      "تعرّف على أشخاص جدد من جميع الولايات الـ81 في تركيا. انضم إلى غرف الفيديو المباشرة وتواصل بـ4 لغات وابنِ علاقات جديدة بأمان.",

    f1Title: "أشخاص من 81 ولاية",
    f1Desc:
      "اكتشف أشخاصاً من جميع الولايات الـ81 في تركيا، واعثر على الملفات الشخصية المناسبة لك وابنِ صداقات جديدة.",

    f2Title: "محادثة فيديو مباشرة",
    f2Desc:
      "انضم إلى غرف الفيديو المباشرة مع الأشخاص الذين تتعرف عليهم وتواصل معهم في الوقت الفعلي.",

    f3Title: "التواصل بـ4 لغات",
    f3Desc:
      "تواصل بسهولة أكبر مع أشخاص من دول مختلفة بفضل دعم التركية والإنجليزية والروسية والعربية.",

    f4Title: "مطابقة ذكية",
    f4Desc:
      "اكتشف الأشخاص الذين يناسبون اهتماماتك وتفضيلاتك باستخدام EgeMatch AI.",
  },
};

// ============================================================
// İLETİŞİM BÖLÜMÜ DİL PAKETLERİ
// ============================================================

const contactTranslations = {
  TR: {
    title: "İletişim",
    subtitle:
      "Sorularınız, önerileriniz veya iş birlikleri için bizimle iletişime geçebilirsiniz.",
    emailTitle: "E-Posta",
    webTitle: "Web Sitesi",
    techTitle: "Teknoloji",
    techDesc: "EgeMatch AI Destekli",
  },

  EN: {
    title: "Contact",
    subtitle:
      "You can contact us for your questions, suggestions, or collaborations.",
    emailTitle: "Email",
    webTitle: "Website",
    techTitle: "Technology",
    techDesc: "EgeMatch AI Powered",
  },

  RU: {
    title: "Контакты",
    subtitle:
      "Вы можете связаться с нами по вопросам, предложениям или сотрудничеству.",
    emailTitle: "Эл. почта",
    webTitle: "Веб-сайт",
    techTitle: "Технологии",
    techDesc: "На базе EgeMatch AI",
  },

  AR: {
    title: "اتصل بنا",
    subtitle:
      "يمكنك الاتصال بنا لطرح أسئلتك أو مقترحاتك أو لفرص التعاون.",
    emailTitle: "البريد الإلكتروني",
    webTitle: "الموقع الإلكتروني",
    techTitle: "التكنولوجيا",
    techDesc: "مدعوم بـ EgeMatch AI",
  },
};

// ============================================================
// ÖZELLİKLER BÖLÜMÜ
// ============================================================

function FeaturesSection({ langKey }: { langKey: LangKey }) {
  const t = featuresTranslations[langKey];

  const features = [
    {
      icon: Users,
      title: t.f1Title,
      description: t.f1Desc,
    },
    {
      icon: Video,
      title: t.f2Title,
      description: t.f2Desc,
    },
    {
      icon: Languages,
      title: t.f3Title,
      description: t.f3Desc,
    },
    {
      icon: Star,
      title: t.f4Title,
      description: t.f4Desc,
    },
  ];

  return (
    <section
      id="features"
      className="relative overflow-hidden bg-[#FFF7FA] py-20 md:py-24"
    >
      {/* Arka plan ışıkları */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-72 w-72 rounded-full bg-pink-600/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-0 h-72 w-72 rounded-full bg-pink-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        {/* BAŞLIK */}
        <div className="mx-auto mb-14 max-w-4xl text-center">
          <div className="mb-4 text-3xl">❤️</div>

          <h2 className="text-3xl font-extrabold tracking-tight text-[#2D1721] md:text-5xl">
            {t.sectionTitle}
            <span className="text-pink-600">SenVeBen?</span>
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-[#2D1721]/70 md:text-lg">
            {t.mainSubtitle}
          </p>
        </div>

        {/* ÖZELLİK KARTLARI */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-pink-200/60 bg-white p-7 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#EC4899]/40 hover:bg-pink-50"
              >
                {/* İKON */}
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#EC4899]/20 bg-[#EC4899]/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#EC4899]/15">
                  <Icon className="h-8 w-8 text-pink-600" />
                </div>

                {/* BAŞLIK */}
                <h3 className="mb-3 text-xl font-extrabold text-[#2D1721]">
                  {feature.title}
                </h3>

                {/* AÇIKLAMA */}
                <p className="text-sm leading-6 text-[#2D1721]/65">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* ALT VURGU */}
        <div className="mx-auto mt-10 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#EC4899]/20 bg-[#EC4899]/5 px-5 py-3 text-sm text-[#2D1721]/70">
            <Video className="h-4 w-4 text-pink-600" />
            <span>
              {langKey === "TR"
                ? "Görüntülü iletişim ve çok dilli bağlantı SenVeBen'da."
                : langKey === "EN"
                ? "Live video communication and multilingual connections on SenVeBen."
                : langKey === "RU"
                ? "Видеосвязь и многоязычное общение на SenVeBen."
                : "التواصل عبر الفيديو والاتصال متعدد اللغات على SenVeBen."}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// İLETİŞİM BÖLÜMÜ
// ============================================================

function LocalContactSection({ langKey }: { langKey: LangKey }) {
  const t = contactTranslations[langKey];

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#FFF7FA] py-20 md:py-24"
    >
      <div className="relative mx-auto max-w-7xl px-6 text-center md:px-12">
        <h2 className="text-3xl font-extrabold tracking-tight text-[#2D1721] md:text-5xl">
          {t.title}
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-base text-[#2D1721]/70 md:text-lg">
          {t.subtitle}
        </p>

        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
          {/* E-POSTA */}
          <div className="rounded-2xl border border-pink-200/60 bg-white/[0.02] p-6 backdrop-blur-sm">
            <Mail className="mx-auto mb-4 h-8 w-8 text-pink-600" />

            <h3 className="mb-2 text-lg font-bold text-[#2D1721]">
              {t.emailTitle}
            </h3>

            <p className="text-sm text-[#2D1721]/60">
              hello@senveben.tr
            </p>
          </div>

          {/* WEB */}
          <div className="rounded-2xl border border-pink-200/60 bg-white/[0.02] p-6 backdrop-blur-sm">
            <Globe className="mx-auto mb-4 h-8 w-8 text-pink-600" />

            <h3 className="mb-2 text-lg font-bold text-[#2D1721]">
              {t.webTitle}
            </h3>

            <p className="text-sm text-[#2D1721]/60">
              https://senveben.tr
            </p>
          </div>

          {/* TEKNOLOJİ */}
          <div className="rounded-2xl border border-pink-200/60 bg-white/[0.02] p-6 backdrop-blur-sm">
            <Sparkles className="mx-auto mb-4 h-8 w-8 text-pink-600" />

            <h3 className="mb-2 text-lg font-bold text-[#2D1721]">
              {t.techTitle}
            </h3>

            <p className="text-sm text-[#2D1721]/60">
              {t.techDesc}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// ANA SAYFA
// ============================================================

export default function Home() {
  const [authTab, setAuthTab] = useState<
    "login" | "register" | null
  >(null);

  const { lang } = useI18n();

  const currentLang: LangKey = ["TR", "EN", "RU", "AR"].includes(lang)
    ? (lang as LangKey)
    : "TR";

  const isRtl = currentLang === "AR";

  return (
    <div
      className="min-h-screen bg-[#FFF7FA] font-sans text-[#2D1721]"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* HEADER */}
      <Header
        onOpenLogin={() => setAuthTab("login")}
        onOpenRegister={() => setAuthTab("register")}
      />

      {/* HERO */}
      <HeroSection
        onCtaClick={() => setAuthTab("register")}
      />

      <main>
        {/* NEDEN SENVEBEN */}
        <FeaturesSection langKey={currentLang} />

        {/* İLETİŞİM */}
        <LocalContactSection langKey={currentLang} />
      </main>

      {/* FOOTER */}
      <Footer />

      {/* GİRİŞ / KAYIT */}
      <AuthDialog
        activeTab={authTab}
        onClose={() => setAuthTab(null)}
      />
    </div>
  );
}


