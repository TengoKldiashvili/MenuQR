"use client";

import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
}

export default function ImageUpload({ onUploadComplete }: ImageUploadProps) {
  return (
    <UploadButton<OurFileRouter, "imageUploader">
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        if (res && res[0]) {
          onUploadComplete(res[0].url);
        }
      }}
      onUploadError={(error: Error) => {
        console.error("Upload error:", error);
        alert("Upload failed");
      }}
    />
  );
}

