"use client";

import { X } from "lucide-react";

type Photo = {
  id: string;
  url: string;
};

type Props = {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onChangeIndex: (i: number) => void;
};

export default function PhotoLightbox({
  photos,
  index,
  onClose,
  onChangeIndex,
}: Props) {
  if (!photos?.length || index == null) return null;

  const current = photos?.[index];
  if (!current) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/95">

      {/* CLOSE */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white bg-white/10 p-2 rounded-full cursor-pointer"
      >
        <X />
      </button>

      {/* LEFT */}
      {index > 0 && (
        <button
          onClick={() => onChangeIndex(index - 1)}
          className="absolute left-4 text-white text-4xl cursor-pointer"
        >
          ‹
        </button>
      )}

      {/* IMAGE */}
      <img
        src={current.url}
        className="max-h-[90vh] max-w-[92vw] object-contain rounded-xl shadow-2xl cursor-pointer"
        alt="photo"
      />

      {/* RIGHT */}
      {index < photos.length - 1 && (
        <button
          onClick={() => onChangeIndex(index + 1)}
          className="absolute right-4 text-white text-4xl cursor-pointer"
        >
          ›
        </button>
      )}
    </div>
  );
}