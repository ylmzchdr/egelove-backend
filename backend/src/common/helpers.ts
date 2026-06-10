const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

export function validateImageFile(mimetype: string, size: number): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(mimetype)) {
    return "Sadece JPEG, PNG ve WebP formatlarına izin verilir";
  }
  if (size > MAX_IMAGE_SIZE) {
    return "Dosya boyutu 10MB'dan büyük olamaz";
  }
  return null;
}

export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .toLowerCase()
    .slice(0, 100);
}
