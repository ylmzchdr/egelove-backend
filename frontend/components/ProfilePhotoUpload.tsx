"use client";

import { useState, useRef } from "react";
import { Upload, X, Check, Loader2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ProfilePhotoUpload() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      alert("Sadece JPEG, PNG veya WebP formatı");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Maksimum 10MB");
      return;
    }

    try {
      setUploading(true);

      const token = localStorage.getItem("accessToken");

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

      if (!res.ok) {
        throw new Error(data?.message || "Upload failed");
      }

      setPhotos((prev) => [...prev, data.url]);

    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-4">

        {photos.map((url, i) => (
          <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
            <img src={url} className="w-full h-full object-cover" />

            <button onClick={() => removePhoto(i)} className="absolute top-2 right-2">
              <X className="w-4 h-4 text-white" />
            </button>

            {i === 0 && (
              <div className="absolute bottom-2 left-2 bg-pink-600 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                <Check className="w-3 h-3" /> Ana
              </div>
            )}
          </div>
        ))}

        {photos.length < 6 && (
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="aspect-square border-dashed border flex items-center justify-center"
          >
            {uploading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Upload />
            )}
          </button>
        )}
      </div>

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