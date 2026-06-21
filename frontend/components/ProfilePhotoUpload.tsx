"use client";

import PhotoLightbox from "@/components/PhotoLightbox";
import { useEffect, useRef, useState } from "react";
import { Upload, X, Check, Loader2 } from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://egelove-backend.onrender.com";

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

      const res = await fetch(`${API_URL}/photos/upload`, {
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
      <div className="grid grid-cols-3 gap-4 mb-4">
        {photos.map((photo, i) => (
          <div
            key={photo.id || i}
            className="relative aspect-square rounded-xl overflow-hidden bg-white/10"
          >
            <img
              src={getImageUrl(photo.url)}
              className="w-full h-full object-cover cursor-pointer"
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
                className="absolute top-2 right-2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-white shadow-lg"
              >
                {removingId === photo.id ? (
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <X className="w-4 h-4 text-white" />
                )}
              </button>
            )}

            {/* MAIN */}
            {i === 0 && (
              <div className="absolute bottom-2 left-2 bg-pink-600 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                <Check className="w-3 h-3" /> Ana
              </div>
            )}
          </div>
        ))}

        {/* UPLOAD */}
        {isOwner && photos.length < 6 && (
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="aspect-square border border-dashed border-white/30 rounded-xl flex items-center justify-center bg-white/5"
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