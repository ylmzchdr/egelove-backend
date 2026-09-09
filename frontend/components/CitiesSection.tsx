import { MapPin } from "lucide-react";

const cities = ["İzmir", "Aydın", "Muğla", "Manisa", "Denizli"];

export default function CitiesSection() {
  return (
    <section id="cities" className="py-16 bg-[#512510]/20">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-12">Öne Çıkan Şehirler</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {cities.map((city) => (
            <div
              key={city}
              className="p-4 bg-[#683312]/30 border border-[#F6BA48]/15 rounded-xl hover:bg-[#7E4114]/40 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4 text-[#F6BA48]" />
              <span className="font-medium text-white">{city}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
