import { Users, Shield, Smartphone, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Users,
    title: "Gerçek İnsanlarla Tanış",
    description:
      "Yeni insanları keşfet, sana uygun profilleri incele ve doğal sohbetlerle yeni bağlantılar kur.",
  },
  {
    icon: Shield,
    title: "Güvenli ve Özenli",
    description:
      "SENveBEN, daha güvenli ve keyifli bir tanışma deneyimi için tasarlanmıştır.",
  },
  {
    icon: Smartphone,
    title: "Her Yerden Erişim",
    description:
      "Bilgisayarından veya mobil cihazından hesabına kolayca ulaş ve iletişimini sürdür.",
  },
  {
    icon: Sparkles,
    title: "SENveBEN AI",
    description:
      "Yapay zekâ destekli özelliklerle sana daha uygun bağlantıları keşfetmenin keyfini çıkar.",
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-gradient-to-b from-[#310D0C] via-[#512510] to-[#310D0C] py-20 md:py-24"
    >
      {/* Dekoratif ışıklar */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#F6BA48]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-[#B16323]/12 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        {/* Başlık */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <div className="mb-4 text-3xl text-[#F6BA48]">❤️</div>

          <h2 className="text-4xl font-extrabold tracking-tight text-[#FFF7E8] md:text-5xl">
            Neden <span className="text-[#F6BA48]">SENveBEN?</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#F8D290]/75 md:text-xl">
            Yeni insanlarla tanışmak, sohbet etmek ve sana uygun bağlantıları
            keşfetmek için ihtiyacın olan her şey burada.
          </p>
        </div>

        {/* Kartlar */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Card
                key={feature.title}
                className="group relative min-h-[280px] overflow-hidden rounded-3xl border border-[#F6BA48]/15 bg-[#683312]/45 p-8 text-[#FFF7E8] shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-[#F6BA48]/50 hover:bg-[#7E4114]/55 hover:shadow-[0_24px_60px_rgba(246,186,72,0.12)]"
              >
                {/* Kart içi ışık */}
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#F6BA48]/8 blur-2xl transition-all duration-300 group-hover:bg-[#F6BA48]/16" />

                {/* İkon */}
                <div className="relative mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F6BA48]/10 ring-1 ring-[#F6BA48]/25 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#F6BA48]/15">
                  <Icon className="h-8 w-8 text-[#F6BA48]" strokeWidth={1.8} />
                </div>

                {/* Başlık */}
                <h3 className="relative mb-4 text-2xl font-extrabold text-[#FFF7E8]">
                  {feature.title}
                </h3>

                {/* Açıklama */}
                <p className="relative text-base leading-7 text-[#F8D290]/70">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
