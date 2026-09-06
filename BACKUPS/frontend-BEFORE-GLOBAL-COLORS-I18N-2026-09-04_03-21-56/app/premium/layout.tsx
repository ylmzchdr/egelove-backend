import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Premium Üyelik | SenVeBen",
  description:
    "SenVeBen Premium ile Türkiye'nin 81 ilinden yeni insanlarla tanış, sınırsız mesajlaş, gelişmiş filtreleri kullan ve profilini öne çıkar.",
  alternates: {
    canonical: "https://senveben.com.tr/premium",
  },
  openGraph: {
    title: "Premium Üyelik | SenVeBen",
    description:
      "SenVeBen Premium ile Türkiye'nin 81 ilinden yeni insanlarla tanış ve daha fazla özelliğin keyfini çıkar.",
    url: "https://senveben.com.tr/premium",
    siteName: "SenVeBen",
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
