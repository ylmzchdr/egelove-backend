import type { Metadata } from "next";
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
      </body>
    </html>
  );
}
