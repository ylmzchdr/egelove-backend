"use client";

import { Heart, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n-context";

type ProfileCardProps = {
  id?: string;
  name: string;
  age?: number;
  city?: string;
  district?: string;
  bio?: string;
  avatar?: string;
  verified?: boolean;
};

const avatarColors = [
  "from-pink-400 to-purple-500",
  "from-blue-400 to-cyan-500",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-500",
  "from-rose-400 to-red-500",
  "from-violet-400 to-indigo-500",
];

export default function ProfileCard({ name, age, city, district, bio, verified = false }: ProfileCardProps) {
  const { t } = useI18n();
  const gradient = avatarColors[name.length % avatarColors.length];

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-xl overflow-hidden group hover:border-pink-400/50 transition-all duration-300">
      <div className={`h-48 bg-gradient-to-br ${gradient} relative`}>
        {verified && (
          <div className="absolute top-3 right-3 bg-pink-500 rounded-full p-1.5">
            <Star className="w-3.5 h-3.5 text-white fill-white" />
          </div>
        )}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-4 border-pink-900 bg-gradient-to-br from-pink-300 to-pink-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
          {name.charAt(0).toUpperCase()}
        </div>
      </div>

      <div className="pt-12 pb-5 px-5 text-center">
        <h3 className="text-white text-xl font-bold">
          {name}{age !== undefined ? <>, <span className="text-pink-300">{age}</span></> : ""}
        </h3>

        {(city || district) && (
          <div className="flex items-center justify-center gap-1 mt-1.5 text-white/60 text-sm">
            <MapPin className="w-3.5 h-3.5 text-pink-300" />
            <span>
              {city || ""}{city && district ? " • " : ""}{district || ""}
            </span>
          </div>
        )}

        <p className="text-white/50 text-sm mt-3 line-clamp-2 min-h-[2.5rem]">{bio || ""}</p>

        <div className="flex gap-2 mt-4">
          <Button className="flex-1 bg-pink-600 hover:bg-pink-700 text-xs h-9">
            <Heart className="w-4 h-4" />
            {t.profile.like}
          </Button>
          <Button variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10 text-xs h-9">
            {t.profile.viewProfile}
          </Button>
        </div>
      </div>
    </Card>
  );
}
