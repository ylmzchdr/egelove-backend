import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Üyeleri Keşfet",

  description:
    "Türkiye'nin 81 ilinden yeni insanları keşfet. Şehir ve diğer filtrelerle sana uygun profilleri bul ve yeni insanlarla tanış.",

  alternates: {
    canonical: "https://senveben.com.tr/search",
  },

  openGraph: {
    title: "Üyeleri Keşfet | SENveBEN",

    description:
      "Türkiye'nin 81 ilinden yeni insanları keşfet. Sana uygun profilleri bul ve yeni insanlarla tanış.",

    url: "https://senveben.com.tr/search",
    siteName: "SENveBEN",
    type: "website",
  },
};

export default function SearchLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}