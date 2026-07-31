const OBJECT_PATH = "/storage/v1/object/public/";
const RENDER_PATH = "/storage/v1/render/image/public/";

/**
 * Rewrites a Supabase Storage public URL to the on-the-fly image
 * transformation endpoint so we serve resized/compressed (WebP when the
 * browser supports it) images instead of multi-megabyte originals.
 * Non-storage URLs (or local assets) are returned untouched.
 */
export function cdnImage(src: string, width: number, quality = 70): string {
  if (!src || !src.includes(OBJECT_PATH)) return src;
  const base = src.replace(OBJECT_PATH, RENDER_PATH);
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}width=${width}&quality=${quality}`;
}

export const IMAGE_WIDTHS = [640, 960, 1280, 1600, 1920];

export function cdnSrcSet(src: string, widths: number[] = IMAGE_WIDTHS): string | undefined {
  if (!src || !src.includes(OBJECT_PATH)) return undefined;
  return widths.map((w) => `${cdnImage(src, w)} ${w}w`).join(", ");
}
