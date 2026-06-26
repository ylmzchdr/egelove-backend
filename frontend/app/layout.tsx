import type { Metadata } from "next";
import Script from "next/script";

import Providers from "@/components/Providers";
import CookieConsent from "@/components/CookieConsent";
import "./globals.css";

export const metadata: Metadata = {
  title: "egelove - Mutlu Birlikteliklerin Başlangıcı",
  description:
    "Türkiye'nin en köklü evlilik sitesi egelove ile mutlu birlikteliklerin başlangıcına siz de adım atın.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>
          {children}
          <CookieConsent />
        </Providers>

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-NX31XDZBXB"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-NX31XDZBXB');
          `}
        </Script>
      </body>
    </html>
  );
}