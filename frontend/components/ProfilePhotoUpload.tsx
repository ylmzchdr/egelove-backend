"use client";

import { useState, useRef } from "react";
import { Upload, X, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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

    const url = URL.createObjectURL(file);
    setPhotos((prev) => [...prev, url]);
    setUploading(false);
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        {photos.map((url, i) => (
          <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-pink-900/40 border border-white/10">
            <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
            <button
              onClick={() => removePhoto(i)}
              className="absolute top-2 right-2 bg-black/60 rounded-full p-1 hover:bg-black/80"
            >
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
            className="aspect-square rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-2 hover:border-pink-400/50 transition text-white/40 hover:text-pink-300"
          >
            {uploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8" />}
            <span className="text-xs">Fotoğraf Ekle</span>
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFile} />
      <p className="text-xs text-white/40">İlk fotoğraf profil resmin olur. En fazla 6 fotoğraf. JPEG, PNG, WebP - max 10MB.</p>
    </div>
  );
}
