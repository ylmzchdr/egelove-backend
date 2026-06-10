import { Smartphone } from "lucide-react";

export default function AppsSection() {
  return (
    <section id="apps" className="py-12 bg-gradient-to-b from-pink-950 to-pink-900 text-center border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-wrap justify-center gap-6">
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-xl hover:bg-white/20 transition"
          >
            <Smartphone className="w-5 h-5 text-white" />
            <span className="font-medium">App Store&apos;dan İndir</span>
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-xl hover:bg-white/20 transition"
          >
            <Smartphone className="w-5 h-5 text-white" />
            <span className="font-medium">Google Play&apos;den İndir</span>
          </a>
        </div>
      </div>
    </section>
  );
}
