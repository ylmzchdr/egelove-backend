import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Üyeleri Keşfet | EgeLove",
  description:
    "Türkiye'nin 81 ilinden yeni insanları keşfet. Şehir, yaş ve diğer filtrelerle sana uygun profilleri bul ve yeni insanlarla tanış.",
  alternates: {
    canonical: "https://egelove.tr/search",
  },
  openGraph: {
    title: "Üyeleri Keşfet | EgeLove",
    description:
      "Türkiye'nin 81 ilinden yeni insanları keşfet. Sana uygun profilleri bul ve yeni insanlarla tanış.",
    url: "https://egelove.tr/search",
    siteName: "EgeLove",
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