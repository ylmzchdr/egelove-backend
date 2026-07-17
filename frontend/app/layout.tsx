import type { Metadata } from "next";
import Script from "next/script";

import Providers from "@/components/Providers";
import CookieConsent from "@/components/CookieConsent";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://egelove.tr"),

  title: {
    default: "Egelove | Ege ve Akdeniz’in Arkadaşlık Platformu",
    template: "%s | Egelove",
  },

  description:
    "Egelove, Ege ve Akdeniz bölgesinde yeni insanlarla tanışmak, arkadaşlık kurmak ve güvenli bağlantılar oluşturmak isteyenler için modern bir arkadaşlık platformudur.",

  keywords: [
    "Egelove",
    "arkadaşlık sitesi",
    "tanışma sitesi",
    "Ege arkadaşlık",
    "Akdeniz arkadaşlık",
    "Muğla arkadaşlık",
    "Fethiye arkadaşlık",
    "İzmir arkadaşlık",
    "Antalya arkadaşlık",
    "Aydın arkadaşlık",
    "Mersin arkadaşlık",
  ],

  applicationName: "Egelove",
  authors: [{ name: "Egelove" }],
  creator: "Egelove",
  publisher: "Egelove",

  alternates: {
    canonical: "https://egelove.tr",
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
    url: "https://egelove.tr",
    siteName: "Egelove",
    title: "Egelove | Ege ve Akdeniz’in Arkadaşlık Platformu",
    description:
      "Ege ve Akdeniz bölgesinde yeni insanlarla tanışmak, arkadaşlık kurmak ve güvenli bağlantılar oluşturmak için Egelove.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Egelove arkadaşlık platformu",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Egelove | Ege ve Akdeniz’in Arkadaşlık Platformu",
    description:
      "Ege ve Akdeniz bölgesinde yeni insanlarla tanışmak için modern arkadaşlık platformu.",
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
        name: "Egelove",
        url: "https://egelove.tr",
        description:
          "Ege ve Akdeniz bölgesinde yeni insanlarla tanışmak ve arkadaşlık kurmak için modern platform.",
        inLanguage: "tr-TR",
        publisher: {
          "@type": "Organization",
          name: "Egelove",
          url: "https://egelove.tr",
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
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KTRDMEPHEK');
          `}
        </Script>
        <Script id="meta-pixel" strategy="afterInteractive">
  {`
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}
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