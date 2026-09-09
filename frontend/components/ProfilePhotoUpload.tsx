"use client";

import PhotoLightbox from "@/components/PhotoLightbox";
import { useEffect, useRef, useState } from "react";
import { Upload, X, Check, Loader2 } from "lucide-react";

const API_URL = "https://egelove-backend.onrender.com";

type PhotoItem = {
  id: string;
  url: string;
  status?: string;
  isMain?: boolean;
};

type ProfilePhotoUploadProps = {
  initialPhotos?: PhotoItem[];
  isOwner?: boolean;
};

export default function ProfilePhotoUpload({
  initialPhotos = [],
  isOwner = false,
}: ProfilePhotoUploadProps) {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPhotos(initialPhotos || []);
  }, [initialPhotos]);

  const getImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  // UPLOAD
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return;
    if (file.size > 10 * 1024 * 1024) return;

    try {
      setUploading(true);

      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`/api/photos/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error();

      setPhotos((prev) => [...prev, data]);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  // DELETE
  const removePhoto = async (photo: PhotoItem) => {
    if (!photo?.id) return;

    try {
      setRemovingId(photo.id);

      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const res = await fetch(`${API_URL}/photos/${photo.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error();

      setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div>
      {/* GRID */}
      <div className="mb-4 grid grid-cols-3 gap-4">
        {photos.map((photo, i) => (
          <div
            key={photo.id || i}
            className="relative aspect-square overflow-hidden rounded-xl border border-[#F6BA48]/10 bg-[#310D0C]/35"
          >
            <img
              src={getImageUrl(photo.url)}
              className="h-full w-full cursor-pointer object-cover"
              alt="photo"
              onClick={() => {
                setLightboxIndex(i);
              }}
            />

            {/* DELETE */}
            {(isOwner || true) && (
              <button
                onClick={() => removePhoto(photo)}
                disabled={removingId === photo.id}
                className="absolute right-2 top-2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition hover:bg-red-500"
              >
                {removingId === photo.id ? (
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                ) : (
                  <X className="h-4 w-4 text-white" />
                )}
              </button>
            )}

            {/* MAIN */}
            {i === 0 && (
              <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full border border-[#F6BA48]/30 bg-gradient-to-r from-[#7E4114] via-[#B16323] to-[#F6BA48] px-2 py-0.5 text-xs font-bold text-[#310D0C] shadow-md">
                <Check className="h-3 w-3" />
                Ana
              </div>
            )}
          </div>
        ))}

        {/* UPLOAD */}
        {isOwner && photos.length < 6 && (
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-[#F6BA48]/35 bg-[#F6BA48]/5 text-[#F6BA48] transition-all hover:border-[#F6BA48]/70 hover:bg-[#F6BA48]/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Upload />
            )}
          </button>
        )}
      </div>

      {/* LIGHTBOX */}
      {typeof lightboxIndex === "number" && lightboxIndex >= 0 && (
        <PhotoLightbox
          photos={photos.map((p) => ({
            id: p.id,
            url: getImageUrl(p.url),
          }))}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onChangeIndex={(i: number) => setLightboxIndex(i)}
        />
      )}

      {/* INPUT */}
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFile}
      />
    </div>
  );
}