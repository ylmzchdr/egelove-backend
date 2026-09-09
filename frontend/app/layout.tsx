import type { Metadata } from "next";
import Script from "next/script";

import Providers from "@/components/Providers";
import CookieConsent from "@/components/CookieConsent";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://senveben.com.tr"),

  title: {
    default: "SENveBEN | Türkiye'nin Arkadaşlık ve Tanışma Platformu",
    template: "%s | SENveBEN",
  },

  description:
    "SENveBEN, Türkiye'nin 81 ilinden yeni insanlarla tanışmak, arkadaşlık kurmak ve güvenli bağlantılar oluşturmak için modern bir arkadaşlık ve tanışma platformudur.",

  keywords: [
    "SENveBEN",
    "arkadaşlık sitesi",
    "tanışma sitesi",
    "Türkiye arkadaşlık sitesi",
    "Türkiye tanışma sitesi",
    "online arkadaşlık",
    "yeni insanlarla tanışma",
    "arkadaş bulma",
    "81 il arkadaşlık",
    "81 il tanışma",
    "şehir bazlı arkadaşlık",
    "güvenli arkadaşlık sitesi",
    "canlı görüntülü tanışma",
    "görüntülü arkadaşlık",
  ],

  applicationName: "SENveBEN",

  authors: [
    {
      name: "SENveBEN",
    },
  ],

  creator: "SENveBEN",
  publisher: "SENveBEN",

  alternates: {
    canonical: "https://senveben.com.tr",
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://senveben.com.tr",
    siteName: "SENveBEN",

    title: "SENveBEN | Türkiye'nin Arkadaşlık ve Tanışma Platformu",

    description:
      "Türkiye'nin 81 ilinden yeni insanlarla tanış, arkadaşlık kur ve güvenli bağlantılar oluştur. SENveBEN'da sana uygun kişileri keşfet.",

    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SENveBEN arkadaşlık ve tanışma platformu",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "SENveBEN | Türkiye'nin Arkadaşlık ve Tanışma Platformu",

    description:
      "Türkiye'nin 81 ilinden yeni insanlarla tanışmak ve arkadaşlık kurmak için modern arkadaşlık ve tanışma platformu.",

    images: ["/og-image.jpg"],
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body>
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "SENveBEN",
              url: "https://senveben.com.tr",
              description:
                "Türkiye'nin 81 ilinden yeni insanlarla tanışmak ve arkadaşlık kurmak için modern arkadaşlık ve tanışma platformu.",
              inLanguage: "tr-TR",

              publisher: {
                "@type": "Organization",
                name: "SENveBEN",
                url: "https://senveben.com.tr",
              },
            }),
          }}
        />

        <Providers>
          {children}
          <CookieConsent />
        </Providers>

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-KTRDMEPHEK"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];

            function gtag(){
              dataLayer.push(arguments);
            }

            gtag('js', new Date());
            gtag('config', 'G-KTRDMEPHEK');
          `}
        </Script>

        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {
              if(f.fbq)return;

              n=f.fbq=function(){
                n.callMethod
                  ? n.callMethod.apply(n,arguments)
                  : n.queue.push(arguments)
              };

              if(!f._fbq)f._fbq=n;

              n.push=n;
              n.loaded=!0;
              n.version='2.0';
              n.queue=[];

              t=b.createElement(e);
              t.async=!0;
              t.src=v;

              s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)
            }

            (window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');

            fbq('init', '1372108938399622');
            fbq('track', 'PageView');
          `}
        </Script>
      </body>
    </html>
  );
}