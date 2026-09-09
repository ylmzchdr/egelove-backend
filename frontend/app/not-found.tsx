import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#310D0C] via-[#512510] to-[#310D0C] flex flex-col items-center justify-center text-white gap-4 p-4">
      <AlertCircle className="w-16 h-16 text-[#F6BA48]" />
      <h1 className="text-4xl font-bold text-[#FFF7E8]">Sayfa Bulunamadı</h1>
      <p className="text-[#B5A093]">Aradığınız sayfa mevcut değil.</p>
      <Link href="/">
        <Button className="bg-[#F6BA48] text-[#310D0C] hover:bg-[#EF912C] font-semibold">
          Ana Sayfaya Dön
        </Button>
      </Link>
    </div>
  );
}
