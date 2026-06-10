import { Users, Shield, Smartphone, Star } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Users,
    title: "Geniş Üye Tabanı",
    description: "Ayda 90 bin yeni kayıt ile en geniş evlilik sitesi.",
  },
  {
    icon: Shield,
    title: "Güvenli Platform",
    description: "Tüm verileriniz şifrelenmiş ve güvenli sunucularda saklanır.",
  },
  {
    icon: Smartphone,
    title: "Mobil Uygulama",
    description: "Her an her yerden hesabınıza erişin.",
  },
  {
    icon: Star,
    title: "15 Yıllık Tecrübe",
    description: "Binlerce mutlu çiftin hikayesi bizimle başladı.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-16 bg-pink-950">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-12">Neden egelove?</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="p-6 bg-pink-900/40 border-white/10 text-white backdrop-blur-sm"
              >
                <Icon className="w-12 h-12 text-pink-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/75 text-sm">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
