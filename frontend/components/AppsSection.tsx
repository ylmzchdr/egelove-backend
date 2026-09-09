import { Smartphone } from "lucide-react";

export default function AppsSection() {
  return (
    <section
      id="apps"
      className="border-t border-[#F6BA48]/10 bg-gradient-to-b from-[#310D0C] via-[#512510] to-[#310D0C] py-12 text-center"
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-wrap justify-center gap-6">
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-xl border border-[#F6BA48]/20 bg-[#683312]/45 px-6 py-3 text-[#FFF7E8] backdrop-blur-md transition hover:border-[#F6BA48]/40 hover:bg-[#7E4114]/55"
          >
            <Smartphone className="h-5 w-5 text-[#F6BA48]" />
            <span className="font-medium">App Store&apos;dan İndir</span>
          </a>

          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-xl border border-[#F6BA48]/20 bg-[#683312]/45 px-6 py-3 text-[#FFF7E8] backdrop-blur-md transition hover:border-[#F6BA48]/40 hover:bg-[#7E4114]/55"
          >
            <Smartphone className="h-5 w-5 text-[#F6BA48]" />
            <span className="font-medium">Google Play&apos;den İndir</span>
          </a>
        </div>
      </div>
    </section>
  );
}
