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
  "from-[#F6BA48] to-[#B16323]",
  "from-[#EF912C] to-[#7E4114]",
  "from-[#F8D290] to-[#CF7526]",
  "from-[#B16323] to-[#683312]",
  "from-[#F6BA48] to-[#964F1C]",
  "from-[#CF7526] to-[#512510]",
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
        border-[#F6BA48]/20
        bg-gradient-to-b
        from-[#512510]/95
        via-[#310D0C]/95
        to-[#310D0C]/95
        backdrop-blur-2xl
        transition-all
        duration-500
        shadow-xl
        hover:-translate-y-2
        hover:border-[#F6BA48]/55
        hover:shadow-[0_0_45px_rgba(246,186,72,.18)]
      "
    >
      <div
        className={`relative h-56 overflow-hidden bg-gradient-to-br ${gradient}`}
      >
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt={name}
            className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
          />
        )}

        {verified && (
          <div className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-[#B16323] via-[#EF912C] to-[#F6BA48] p-2 shadow-lg">
            <Star className="h-3.5 w-3.5 fill-[#310D0C] text-[#310D0C]" />
          </div>
        )}

        <div className="absolute -bottom-11 left-1/2 h-24 w-24 -translate-x-1/2 overflow-hidden rounded-full border-4 border-[#F6BA48] bg-[#310D0C] shadow-[0_0_30px_rgba(246,186,72,.28)]">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-2xl font-bold text-[#F8D290]">
              {name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      </div>

      <div className="px-5 pb-5 pt-12 text-center">
        <h3 className="text-2xl font-black tracking-wide text-[#F8D290]">
          {name}
          {age !== undefined ? (
            <>
              , <span className="text-[#F6BA48]">{age}</span>
            </>
          ) : (
            ""
          )}
        </h3>

        {(city || district) && (
          <div className="mt-1.5 flex items-center justify-center gap-1 text-base text-[#B5A093]">
            <MapPin className="h-4 w-4 text-[#F6BA48]" />
            <span>
              {city || ""}
              {city && district ? " • " : ""}
              {district || ""}
            </span>
          </div>
        )}

        <p className="mt-3 min-h-[2.5rem] line-clamp-2 text-base text-[#9F7C61]">
          {bio || ""}
        </p>

        <div className="mt-4 flex gap-2">
          <Button
            type="button"
            onClick={handleLike}
            className="h-10 flex-1 rounded-xl bg-gradient-to-r from-[#7E4114] via-[#B16323] to-[#F6BA48] text-xs font-bold text-[#310D0C] shadow-lg transition-all hover:scale-105 hover:from-[#964F1C] hover:via-[#CF7526] hover:to-[#F8D290]"
          >
            <Heart className="h-4 w-4" />
            {t.profile.like}
          </Button>

          <Button
            type="button"
            onClick={handleViewProfile}
            variant="outline"
            className="h-10 flex-1 rounded-xl border border-[#F6BA48]/30 bg-[#F6BA48]/5 text-[#F8D290] transition-all hover:border-[#F6BA48] hover:bg-[#F6BA48]/10 hover:text-white"
          >
            {t.profile.viewProfile}
          </Button>
        </div>
      </div>
    </Card>
  );
}