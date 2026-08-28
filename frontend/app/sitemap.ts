import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://egelove.tr";
  const now = new Date();

  // Veritabanınızdan veya local bir json dosyasından 81 ili çekeceğiniz alan
  // Şimdilik test amaçlı birkaç ili ekleyelim, burayı genişletebilirsiniz
  const allCities = ["izmir", "istanbul", "ankara", "mugla", "antalya", "bursa", "adana", "aydin"]; 

  // 81 il için Google'ın anlayacağı URL şablonunu oluşturuyoruz
  const cityUrls: MetadataRoute.Sitemap = allCities.map((city) => ({
    url: `${baseUrl}/${city}-arkadaslik-sitesi`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // Ana sayfaları ve dinamik şehir URL'lerini birleştirip Promise olarak döndürüyoruz
  return [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/premium`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...cityUrls,
  ];
}
