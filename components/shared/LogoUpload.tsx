"use client";

import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";

interface LogoUploadProps {
  value?: string | null;
  onChange: (url: string | null) => void;
}

export default function LogoUpload({ value, onChange }: LogoUploadProps) {
  const t = useTranslations("logo");
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          <AlertTriangle className="w-4 h-4 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <label className="block text-sm font-medium text-white">
        {t("label")} <span className="text-white/40">({t("optional")})</span>
      </label>

      {value ? (
        <div className="relative w-32 h-32 mx-auto rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          <Image
            src={value}
            alt={t("alt")}
            fill
            className="object-contain p-3"
          />

          <button
            type="button"
            onClick={() => {
              onChange(null);
              setError(null);
            }}
            className="absolute top-2 right-2 rounded-full p-1.5 bg-gray-950/80 text-white/60 hover:text-white transition"
            title={t("remove")}
          >
            ✕
          </button>
        </div>
      ) : (
        <UploadDropzone
          endpoint="logoUploader"
          onClientUploadComplete={(res) => {
            const url = res?.[0]?.ufsUrl;
            if (url) {
              onChange(url);
              setError(null);
            }
          }}
          onUploadError={(err) => {
            if (err.message.includes("File size")) {
              setError(t("tooLarge"));
            } else {
              setError(t("error"));
            }
          }}
          appearance={{
            container:
              "border border-white/20 rounded-xl bg-transparent hover:border-white/40 transition",
            label: "text-white/80 text-sm",
            uploadIcon: "text-white/60",
            button: "bg-transparent text-white/80 text-sm font-medium",
          }}
        />
      )}
    </div>
  );
}
