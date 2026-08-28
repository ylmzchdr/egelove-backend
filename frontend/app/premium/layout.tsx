import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Premium Üyelik | EgeLove",
  description:
    "EgeLove Premium ile Türkiye'nin 81 ilinden yeni insanlarla tanış, sınırsız mesajlaş, gelişmiş filtreleri kullan ve profilini öne çıkar.",
  alternates: {
    canonical: "https://egelove.tr/premium",
  },
  openGraph: {
    title: "Premium Üyelik | EgeLove",
    description:
      "EgeLove Premium ile Türkiye'nin 81 ilinden yeni insanlarla tanış ve daha fazla özelliğin keyfini çıkar.",
    url: "https://egelove.tr/premium",
    siteName: "EgeLove",
    type: "website",
  },
};

export default function PremiumLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}