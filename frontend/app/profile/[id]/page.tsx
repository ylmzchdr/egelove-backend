"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapPin, Calendar, ArrowLeft, Heart, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://egelove-backend.onrender.com";

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/users/${id}`);

        if (!res.ok) {
          setProfile(null);
          return;
        }

        const data = await res.json();
        setProfile(data);
      } catch (error) {
        console.error("Profil yüklenemedi:", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id]);

  const getPhotoUrl = (url?: string) => {
    if (!url) return null;
    return url.startsWith("http") ? url : `${API_URL}${url}`;
  };

  const photos = profile?.photos || [];
  const mainPhoto =
    photos.find((p: any) => p.isMain)?.url || photos[0]?.url || null;

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#210014] text-white pt-28 px-6">
          <div className="max-w-5xl mx-auto">Profil yükleniyor...</div>
        </main>
        <Footer />
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#210014] text-white pt-28 px-6">
          <div className="max-w-5xl mx-auto">
            <Button onClick={() => router.back()} className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Geri Dön
            </Button>
            <h1 className="text-3xl font-bold">Profil bulunamadı</h1>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#210014] text-white pt-28 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="mb-6 border-white/20 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri Dön
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <section className="lg:col-span-1 rounded-3xl border border-white/30 p-4 bg-white/5">
              <div
                className="aspect-[4/5] rounded-2xl overflow-hidden bg-black/30 cursor-pointer"
                onClick={() => mainPhoto && setSelectedPhoto(getPhotoUrl(mainPhoto))}
              >
                {mainPhoto ? (
                  <img
                    src={getPhotoUrl(mainPhoto) || ""}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl font-bold">
                    {profile.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}
              </div>

              {photos.length > 1 && (
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {photos.map((p: any) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPhoto(getPhotoUrl(p.url))}
                      className="aspect-square rounded-xl overflow-hidden border border-white/20"
                    >
                      <img
                        src={getPhotoUrl(p.url) || ""}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              <div className="flex gap-3 mt-5">
                <Button
                  onClick={() => alert("Beğeni sistemi yakında aktif olacak")}
                  className="flex-1 bg-pink-600 hover:bg-pink-700"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Beğen
                </Button>

                <Button
                  onClick={() => alert("Mesaj sistemi yakında bağlanacak")}
                  variant="outline"
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Mesaj
                </Button>
              </div>
            </section>

            <section className="lg:col-span-2 space-y-6">
              <div className="rounded-3xl border border-white/30 p-8 bg-white/5">
                <h1 className="text-4xl font-bold">
                  {profile.name} {profile.surname}
                </h1>

                <div className="flex flex-wrap gap-4 mt-4 text-white/70">
                  {profile.age && (
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {profile.age}
                    </span>
                  )}

                  {(profile.city?.name || profile.district?.name) && (
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {profile.district?.name}, {profile.city?.name}
                    </span>
                  )}

                  <span className="text-green-400">● Çevrimiçi</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoBox title="Hakkımda" value={profile.aboutMe || profile.bio || "-"} />
                <InfoBox title="Aradığım Kişi" value={profile.lookingFor || "-"} />
              </div>

              <div className="rounded-3xl border border-white/30 p-8 bg-white/5">
                <h2 className="text-2xl font-bold mb-5">Profil Bilgileri</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                 
                  <InfoRow label="Şehir" value={profile.city?.name} />
                  <InfoRow label="İlçe" value={profile.district?.name} />
                  <InfoRow label="Meslek" value={profile.occupation} />
                  <InfoRow label="Eğitim" value={profile.education} />
                  <InfoRow label="Gelir" value={profile.income} />
                  <InfoRow label="Medeni Durum" value={profile.maritalStatus} />
                  <InfoRow label="Çocuk" value={profile.children} />
                  <InfoRow label="Boy" value={profile.height ? `${profile.height} cm` : ""} />
                  <InfoRow label="Kilo" value={profile.weight ? `${profile.weight} kg` : ""} />
                  <InfoRow label="Göz Rengi" value={profile.eyeColor} />
                  <InfoRow label="Saç Rengi" value={profile.hairColor} />
                  <InfoRow
                    label="İlgi Alanları"
                    value={Array.isArray(profile.hobbies) ? profile.hobbies.join(", ") : ""}
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            className="absolute top-6 right-8 text-white text-4xl"
            onClick={() => setSelectedPhoto(null)}
          >
            ×
          </button>

          <img
            src={selectedPhoto}
            alt=""
            className="max-w-[95vw] max-h-[90vh] object-contain rounded-2xl"
          />
        </div>
      )}

      <Footer />
    </>
  );
}

function InfoBox({ title, value }: { title: string; value?: string }) {
  return (
    <div className="rounded-3xl border border-white/30 p-6 bg-white/5 min-h-[150px]">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <p className="text-white/80 leading-relaxed whitespace-pre-line">{value || "-"}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: any }) {
  return (
    <div className="flex justify-between gap-4 border-b border-white/30 py-3">
      <span className="text-white/60">{label}</span>
      <span className="font-semibold text-right">{value || "-"}</span>
    </div>
  );
}