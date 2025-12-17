import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";
import type { UploadRouter } from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<UploadRouter>();
export const UploadDropzone = generateUploadDropzone<UploadRouter>();

export function getUploadThingKey(url?: string | null) {
  if (!url) return null;
  return url.split("/f/")[1] ?? null;
}
