"use client";

import { Heart, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n-context";
import { useRouter } from "next/navigation";

type ProfileCardProps = {
  id?: string;
  name: string;
  age?: number;
  city?: string;
  district?: string;
  bio?: string;
  avatar?: any;
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

export default function ProfileCard({
  id,
  name,
  age,
  city,
  district,
  bio,
  avatar,
  verified = false,
}: ProfileCardProps) {
  const { t } = useI18n();
  const router = useRouter();

  const profileId = id || avatar?.id;
  const gradient = avatarColors[name.length % avatarColors.length];
 const backendUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

 const databasePhoto =
  avatar?.photos?.find((p: any) => p.isMain)?.url ||
  avatar?.photos?.[0]?.url;

const avatarUrl =
  databasePhoto
    ? databasePhoto.startsWith("http")
      ? databasePhoto
      : `${backendUrl}${databasePhoto.startsWith("/") ? "" : "/"}${databasePhoto}`
    : typeof avatar === "string"
      ? avatar.startsWith("http")
        ? avatar
        : `${backendUrl}${avatar.startsWith("/") ? "" : "/"}${avatar}`
      : null;

  const handleViewProfile = () => {
    if (!profileId) {
      alert("Profil ID bulunamadı");
      return;
    }

    router.push(`/profile/${profileId}`);
  };

  const handleLike = () => {
    console.log("PROFILE ID =", profileId);
    if (!profileId) {
      alert("Kullanıcı ID bulunamadı");
      return;
    }

    alert("Beğeni sistemi yakında aktif olacak");
  };

  return (
   <Card
  className="
    overflow-hidden
    rounded-3xl
    border
    border-cyan-400/15
    bg-gradient-to-b
    from-[#13283f]/95
    via-[#102235]/95
    to-[#0b1b2d]/95
    backdrop-blur-2xl
    transition-all
    duration-500
    shadow-xl
    hover:-translate-y-2
    hover:border-cyan-300/50
    hover:shadow-[0_0_45px_rgba(0,255,255,.22)]
"
>
     <div className={`relative h-56 overflow-hidden bg-gradient-to-br ${gradient}`}>
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt={name}
            className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
          />
        )}

        {verified && (
         <div className="absolute top-4 right-4 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 p-2 shadow-lg">
            <Star className="w-3.5 h-3.5 text-white fill-white" />
          </div>
        )}

        <div className="absolute -bottom-11 left-1/2 h-24 w-24 -translate-x-1/2 overflow-hidden rounded-full border-4 border-cyan-400 bg-slate-900 shadow-[0_0_30px_rgba(0,255,255,.35)]">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl font-bold text-white">
              {name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      </div>

      <div className="pt-12 pb-5 px-5 text-center">
        <h3 className="text-2xl font-black tracking-wide text-white">
          {name}
          {age !== undefined ? (
            <>
              , <span className="text-pink-300">{age}</span>
            </>
          ) : (
            ""
          )}
        </h3>

        {(city || district) && (
          <div className="flex items-center justify-center gap-1 mt-1.5 text-white/60 text-sm">
           <MapPin className="h-4 w-4 text-cyan-300" />
            <span>
              {city || ""}
              {city && district ? " • " : ""}
              {district || ""}
            </span>
          </div>
        )}

        <p className="text-white/50 text-sm mt-3 line-clamp-2 min-h-[2.5rem]">
          {bio || ""}
        </p>

        <div className="flex gap-2 mt-4">
          <Button
            type="button"
            onClick={handleLike}
          className="flex-1 h-10 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-500 text-xs font-bold shadow-lg transition-all hover:scale-105"
          >
            <Heart className="w-4 h-4" />
            {t.profile.like}
          </Button>

          <Button
            type="button"
            onClick={handleViewProfile}
            variant="outline"
            className="flex-1 h-10 rounded-xl border border-cyan-400/30 bg-cyan-400/5 text-cyan-200 transition-all hover:border-cyan-300 hover:bg-cyan-400/10"
          >
            {t.profile.viewProfile}
          </Button>
        </div>
      </div>
    </Card>
  );
}