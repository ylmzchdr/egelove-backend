"use client";

import { useState } from "react";
import {
  Users,
  Video,
  Languages,
  Star,
  Mail,
  Globe,
  Sparkles,
  Shield,
} from "lucide-react";

import { useI18n } from "@/lib/i18n-context";

import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import AuthDialog from "@/components/AuthDialog";

type LangKey = "TR" | "AZ" | "EN" | "RU" | "AR";

type FeatureTranslations = {
  sectionTitle: string;
  sectionBrand: string;
  mainSubtitle: string;
  f1Title: string;
  f1Desc: string;
  f2Title: string;
  f2Desc: string;
  f3Title: string;
  f3Desc: string;
  f4Title: string;
  f4Desc: string;
  bottomNote: string;
};

type ContactTranslations = {
  eyebrow: string;
  title: string;
  subtitle: string;
  emailTitle: string;
  webTitle: string;
  techTitle: string;
  techDesc: string;
  secureNote: string;
};

const featuresTranslations: Record<LangKey, FeatureTranslations> = {
  TR: {
    sectionTitle: "Neden ",
    sectionBrand: "SENveBEN?",
    mainSubtitle:
      "Türkiye'nin 81 ilinden yeni insanlarla tanış. Canlı görüntülü görüş, 5 dilde iletişim kur ve sana uygun kişilerle güvenli bağlantılar oluştur.",
    f1Title: "81 İlden Yeni İnsanlar",
    f1Desc:
      "Türkiye'nin dört bir yanından profilleri keşfet, sana uygun kişileri bul ve yeni bağlantılar kur.",
    f2Title: "Canlı Görüntülü Görüşme",
    f2Desc:
      "Karşılıklı eşleştiğin kişilerle birebir canlı görüntülü konuş ve daha doğal iletişim kur.",
    f3Title: "5 Dilde İletişim",
    f3Desc:
      "Türkçe, Azerbaycanca, İngilizce, Rusça ve Arapça desteğiyle farklı diller konuşan kişilerle daha kolay iletişim kur.",
    f4Title: "Akıllı Eşleşme",
    f4Desc:
      "SENveBEN AI ile ilgi alanlarına ve tercihlerine daha uygun profilleri keşfet.",
    bottomNote:
      "Canlı görüntülü iletişim, akıllı eşleşme ve çok dilli bağlantı SENveBEN'da.",
  },

  EN: {
    sectionTitle: "Why ",
    sectionBrand: "SENveBEN?",
    mainSubtitle:
      "Meet new people from all 81 provinces of Türkiye. Enjoy live video conversations, communicate in 5 languages and build safer connections.",
    f1Title: "People from 81 Provinces",
    f1Desc:
      "Discover profiles from across Türkiye, find people who match you and build new connections.",
    f2Title: "Live Video Conversations",
    f2Desc:
      "Start one-to-one live video conversations with people you mutually match with.",
    f3Title: "Communication in 5 Languages",
    f3Desc:
      "Communicate more easily with Turkish, Azerbaijani, English, Russian and Arabic language support.",
    f4Title: "Smart Matching",
    f4Desc:
      "Discover profiles that better match your interests and preferences with SENveBEN AI.",
    bottomNote:
      "Live video, smart matching and multilingual communication come together on SENveBEN.",
  },

  RU: {
    sectionTitle: "Почему ",
    sectionBrand: "SENveBEN?",
    mainSubtitle:
      "Знакомьтесь с людьми из всех 81 провинций Турции. Общайтесь по видеосвязи, используйте 5 языков и создавайте безопасные знакомства.",
    f1Title: "Люди из 81 провинции",
    f1Desc:
      "Открывайте профили со всей Турции, находите подходящих людей и заводите новые знакомства.",
    f2Title: "Видеосвязь",
    f2Desc:
      "Общайтесь один на один по видеосвязи с людьми, с которыми у вас взаимная симпатия.",
    f3Title: "Общение на 5 языках",
    f3Desc:
      "Общайтесь проще благодаря поддержке турецкого, английского, русского и арабского языков.",
    f4Title: "Умный подбор",
    f4Desc:
      "SENveBEN AI помогает находить профили, которые лучше соответствуют вашим интересам и предпочтениям.",
    bottomNote:
      "Видеосвязь, умный подбор и многоязычное общение объединены в SENveBEN.",
  },

  AR: {
    sectionTitle: "لماذا ",
    sectionBrand: "SENveBEN؟",
    mainSubtitle:
      "تعرّف على أشخاص من جميع المحافظات الـ81 في تركيا. تواصل بالفيديو واستخدم 5 لغات وأنشئ علاقات أكثر أمانًا.",
    f1Title: "أشخاص من 81 محافظة",
    f1Desc:
      "اكتشف ملفات شخصية من جميع أنحاء تركيا واعثر على الأشخاص المناسبين لك وابدأ علاقات جديدة.",
    f2Title: "محادثات فيديو مباشرة",
    f2Desc:
      "ابدأ محادثات فيديو مباشرة مع الأشخاص الذين تتبادلون الإعجاب.",
    f3Title: "التواصل بـ5 لغات",
    f3Desc:
      "تواصل بسهولة أكبر بفضل دعم التركية والإنجليزية والروسية والعربية.",
    f4Title: "مطابقة ذكية",
    f4Desc:
      "يساعدك SENveBEN AI في اكتشاف ملفات أكثر توافقًا مع اهتماماتك وتفضيلاتك.",
    bottomNote:
      "الفيديو المباشر والمطابقة الذكية والتواصل متعدد اللغات تجتمع في SENveBEN.",
  },

  AZ: {
    sectionTitle: "Niyə ",
    sectionBrand: "SENveBEN?",
    mainSubtitle:
      "Türkiyənin 81 vilayətindən yeni insanlarla tanış ol. Canlı görüntülü söhbət et, 5 dildə ünsiyyət qur və sənə uyğun insanlarla təhlükəsiz əlaqələr yarat.",
    f1Title: "81 Vilayətdən Yeni İnsanlar",
    f1Desc:
      "Türkiyənin hər yerindən profilləri kəşf et, sənə uyğun insanları tap və yeni əlaqələr qur.",
    f2Title: "Canlı Görüntülü Söhbət",
    f2Desc:
      "Qarşılıqlı uyğunlaşdığın insanlarla təkbətək canlı görüntülü danış və daha təbii ünsiyyət qur.",
    f3Title: "5 Dildə Ünsiyyət",
    f3Desc:
      "Türkcə, Azərbaycanca, İngiliscə, Rusca və Ərəbcə dil dəstəyi ilə fərqli dillərdə danışan insanlarla daha asan ünsiyyət qur.",
    f4Title: "Ağıllı Uyğunlaşdırma",
    f4Desc:
      "SENveBEN AI ilə maraqlarına və seçimlərinə daha uyğun profilləri kəşf et.",
    bottomNote:
      "Canlı görüntülü ünsiyyət, ağıllı uyğunlaşdırma və çoxdilli əlaqə SENveBEN-də bir aradadır.",
  },};

const contactTranslations: Record<LangKey, ContactTranslations> = {
  TR: {
    eyebrow: "SENveBEN",
    title: "İletişim",
    subtitle:
      "Sorularınız, önerileriniz veya iş birlikleri için bizimle iletişime geçebilirsiniz.",
    emailTitle: "E-Posta",
    webTitle: "Web Sitesi",
    techTitle: "Teknoloji",
    techDesc: "SENveBEN AI Destekli",
    secureNote: "Güvenli ve samimi iletişim için buradayız.",
  },

  EN: {
    eyebrow: "SENveBEN",
    title: "Contact",
    subtitle:
      "Contact us for questions, suggestions or collaboration opportunities.",
    emailTitle: "Email",
    webTitle: "Website",
    techTitle: "Technology",
    techDesc: "Powered by SENveBEN AI",
    secureNote: "We're here for safer and more genuine connections.",
  },

  RU: {
    eyebrow: "SENveBEN",
    title: "Контакты",
    subtitle:
      "Свяжитесь с нами по вопросам, предложениям или сотрудничеству.",
    emailTitle: "Эл. почта",
    webTitle: "Веб-сайт",
    techTitle: "Технологии",
    techDesc: "На базе SENveBEN AI",
    secureNote: "Мы создаём пространство для безопасного и искреннего общения.",
  },

  AR: {
    eyebrow: "SENveBEN",
    title: "التواصل",
    subtitle:
      "تواصل معنا للأسئلة أو الاقتراحات أو فرص التعاون.",
    emailTitle: "البريد الإلكتروني",
    webTitle: "الموقع الإلكتروني",
    techTitle: "التكنولوجيا",
    techDesc: "مدعوم بتقنية SENveBEN AI",
    secureNote: "نحن هنا من أجل تواصل أكثر أمانًا وصدقًا.",
  },

  AZ: {
    eyebrow: "SENveBEN",
    title: "Əlaqə",
    subtitle:
      "Suallarınız, təklifləriniz və ya əməkdaşlıq imkanları üçün bizimlə əlaqə saxlaya bilərsiniz.",
    emailTitle: "E-poçt",
    webTitle: "Veb sayt",
    techTitle: "Texnologiya",
    techDesc: "SENveBEN AI dəstəkli",
    secureNote: "Təhlükəsiz və səmimi ünsiyyət üçün buradayıq.",
  },};

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
      className="relative overflow-hidden border-t border-[#F6BA48]/20 bg-[linear-gradient(180deg,#310D0C_0%,#43180F_48%,#512510_100%)] py-20 md:py-24"
    >
      {/* Arka plan ışıkları */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-[#F6BA48]/6 blur-[120px]" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#EF912C]/6 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        {/* Başlık */}
        <div className="mx-auto mb-14 max-w-4xl text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#F6BA48]/35 bg-[#F6BA48]/10">
            <Sparkles className="h-6 w-6 text-[#F6BA48]" />
          </div>

          <h2 className="text-3xl font-black tracking-tight text-[#FFF7E8] md:text-5xl">
            {t.sectionTitle}
            <span className="text-[#F6BA48]">{t.sectionBrand}</span>
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-[#F8D290]/75 md:text-lg">
            {t.mainSubtitle}
          </p>
        </div>

        {/* Kartlar */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-[24px] border border-[#F6BA48]/24 bg-[#512510]/55 p-7 text-center shadow-[0_18px_50px_rgba(0,0,0,0.16)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#F6BA48]/55 hover:bg-[#683312]/65"
              >
                <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-[#F6BA48]/6 blur-3xl transition group-hover:bg-[#F6BA48]/10" />

                <div className="relative">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#F6BA48]/35 bg-[#7E4114]/45 transition-all duration-300 group-hover:scale-105 group-hover:bg-[#7E4114]/70">
                    <Icon className="h-8 w-8 text-[#F6BA48]" />
                  </div>

                  <h3 className="mb-3 text-xl font-black text-[#FFF7E8]">
                    {feature.title}
                  </h3>

                  <p className="text-sm leading-6 text-[#F8D290]/68">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Alt vurgu */}
        <div className="mx-auto mt-10 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#F6BA48]/30 bg-[#310D0C]/45 px-5 py-3 text-sm text-[#F8D290]/78">
            <Video className="h-4 w-4 shrink-0 text-[#F6BA48]" />
            <span>{t.bottomNote}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function LocalContactSection({ langKey }: { langKey: LangKey }) {
  const t = contactTranslations[langKey];

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-[#F6BA48]/20 bg-[linear-gradient(135deg,#512510_0%,#683312_52%,#512510_100%)] py-20 md:py-24"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-72 w-[560px] -translate-x-1/2 rounded-full bg-[#F6BA48]/7 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 text-center md:px-12">
        <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-[#F6BA48]/30 bg-[#310D0C]/35 px-4 py-2 text-xs font-black tracking-[0.18em] text-[#F6BA48]">
          <Sparkles className="h-4 w-4" />
          {t.eyebrow}
        </div>

        <h2 className="text-3xl font-black tracking-tight text-[#FFF7E8] md:text-5xl">
          {t.title}
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-base text-[#F8D290]/74 md:text-lg">
          {t.subtitle}
        </p>

        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
          {/* E-POSTA */}
          <div className="rounded-[24px] border border-[#F6BA48]/28 bg-[#310D0C]/35 p-7 backdrop-blur-sm transition hover:border-[#F6BA48]/55">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#F6BA48]/30 bg-[#F6BA48]/8">
              <Mail className="h-7 w-7 text-[#F6BA48]" />
            </div>

            <h3 className="mb-2 text-lg font-black text-[#FFF7E8]">
              {t.emailTitle}
            </h3>

            <p className="break-all text-sm text-[#F8D290]/68">
              hello@senveben.com.tr
            </p>
          </div>

          {/* WEB */}
          <div className="rounded-[24px] border border-[#F6BA48]/28 bg-[#310D0C]/35 p-7 backdrop-blur-sm transition hover:border-[#F6BA48]/55">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#F6BA48]/30 bg-[#F6BA48]/8">
              <Globe className="h-7 w-7 text-[#F6BA48]" />
            </div>

            <h3 className="mb-2 text-lg font-black text-[#FFF7E8]">
              {t.webTitle}
            </h3>

            <p className="break-all text-sm text-[#F8D290]/68">
              https://senveben.com.tr
            </p>
          </div>

          {/* TEKNOLOJİ */}
          <div className="rounded-[24px] border border-[#F6BA48]/28 bg-[#310D0C]/35 p-7 backdrop-blur-sm transition hover:border-[#F6BA48]/55">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#F6BA48]/30 bg-[#F6BA48]/8">
              <Sparkles className="h-7 w-7 text-[#F6BA48]" />
            </div>

            <h3 className="mb-2 text-lg font-black text-[#FFF7E8]">
              {t.techTitle}
            </h3>

            <p className="text-sm text-[#F8D290]/68">{t.techDesc}</p>
          </div>
        </div>

        <div className="mx-auto mt-10 inline-flex items-center gap-2 rounded-full border border-[#3FB36E]/25 bg-[#3FB36E]/5 px-5 py-3 text-sm font-bold text-[#F8D290]/75">
          <Shield className="h-4 w-4 text-[#3FB36E]" />
          {t.secureNote}
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
    <div
      className="min-h-screen bg-[#310D0C] font-sans text-[#FFF7E8]"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <Header
        onOpenLogin={() => setAuthTab("login")}
        onOpenRegister={() => setAuthTab("register")}
      />

      <HeroSection onCtaClick={() => setAuthTab("register")} />

      <main>
        <FeaturesSection langKey={currentLang} />
        <LocalContactSection langKey={currentLang} />
      </main>

      <Footer />

      <AuthDialog
        activeTab={authTab}
        onClose={() => setAuthTab(null)}
      />
    </div>
  );
}

