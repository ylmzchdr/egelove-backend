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
      "EGELOVE, daha güvenli ve keyifli bir tanışma deneyimi için tasarlanmıştır.",
  },
  {
    icon: Smartphone,
    title: "Her Yerden Erişim",
    description:
      "Bilgisayarından veya mobil cihazından hesabına kolayca ulaş ve iletişimini sürdür.",
  },
  {
    icon: Sparkles,
    title: "EgeMatch AI",
    description:
      "Yapay zekâ destekli özelliklerle sana daha uygun bağlantıları keşfetmenin keyfini çıkar.",
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-gradient-to-b from-[#21001a] via-[#300020] to-[#180014] py-20 md:py-24"
    >
      {/* Dekoratif ışıklar */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-pink-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        {/* Başlık */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <div className="mb-4 text-3xl text-[#FFC000]">❤️</div>

          <h2 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            Neden <span className="text-[#FFC000]">EGELOVE?</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/70 md:text-xl">
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
                className="group relative min-h-[280px] overflow-hidden rounded-3xl border border-white/15 bg-white/[0.06] p-8 text-white shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-[#FFC000]/50 hover:bg-white/[0.09] hover:shadow-2xl"
              >
                {/* Kart içi ışık */}
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-pink-500/10 blur-2xl transition-all duration-300 group-hover:bg-pink-500/20" />

                {/* İkon */}
                <div className="relative mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFC000]/10 ring-1 ring-[#FFC000]/25 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#FFC000]/15">
                  <Icon className="h-8 w-8 text-[#FFC000]" strokeWidth={1.8} />
                </div>

                {/* Başlık */}
                <h3 className="relative mb-4 text-2xl font-extrabold text-white">
                  {feature.title}
                </h3>

                {/* Açıklama */}
                <p className="relative text-base leading-7 text-white/70">
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