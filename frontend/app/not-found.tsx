import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-pink-950 flex flex-col items-center justify-center text-white gap-4 p-4">
      <AlertCircle className="w-16 h-16 text-pink-300" />
      <h1 className="text-4xl font-bold">Sayfa Bulunamadı</h1>
      <p className="text-white/60">Aradığınız sayfa mevcut değil.</p>
      <Link href="/">
        <Button className="bg-white text-pink-600 hover:bg-gray-100 font-semibold">
          Ana Sayfaya Dön
        </Button>
      </Link>
    </div>
  );
}
