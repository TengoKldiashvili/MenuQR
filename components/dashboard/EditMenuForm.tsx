"use client";

import { useState } from "react";
import { Menu } from "@prisma/client";
import { useTranslations } from "next-intl";

import LogoUpload from "@/components/shared/LogoUpload";
import ThemePicker from "@/app/[locale]/dashboard/create-menu/ThemePicker";

interface Props {
  menu: Menu;
  onClose: () => void;
}

export default function EditMenuForm({ menu, onClose }: Props) {
  const t = useTranslations("createMenu");

  const [title, setTitle] = useState(menu.title ?? "");
  const [description, setDescription] = useState(menu.description ?? "");
  const [theme, setTheme] = useState(menu.theme);
  const [logoUrl, setLogoUrl] = useState<string | null>(menu.logoUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSave = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/menus/${menu.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || null,
          description: description || null,
          theme,
          logoUrl,
        }),
      });

      if (!res.ok) {
        setError(t("error"));
        return;
      }

      onClose();
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-gray-950/80 p-6 space-y-6 backdrop-blur">
      {/* ERROR */}
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* TITLE */}
      <div>
        <label className="block text-sm text-white/70 mb-1">
          {t("menuTitle")}
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t("menuTitlePlaceholder")}
          className="
            w-full rounded-xl
            bg-gray-950/60
            border border-white/10
            px-4 py-2
            text-white
            focus:border-white/40
            focus:outline-none
          "
        />
      </div>

      {/* DESCRIPTION */}
      <div>
        <label className="block text-sm text-white/70 mb-1">
          {t("description")}
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t("descriptionPlaceholder")}
          className="
            w-full rounded-xl
            bg-gray-950/60
            border border-white/10
            px-4 py-2
            text-white
            focus:border-white/40
            focus:outline-none
            resize-none
          "
        />
      </div>

      {/* LOGO UPLOAD */}
      <LogoUpload value={logoUrl} onChange={setLogoUrl} />

      {/* THEME PICKER */}
      <ThemePicker value={theme} onChange={setTheme} />

      {/* ACTIONS */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="
            px-5 py-2.5
            rounded-xl
            border border-white/20
            text-sm
            text-white/70
            hover:border-white/40
            hover:text-white
            transition
          "
        >
          {t("cancel")}
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="
            px-6 py-2.5
            rounded-xl
            bg-white
            text-gray-950
            text-sm font-medium
            hover:opacity-90
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          {loading ? t("creating") : t("save")}
        </button>
      </div>
    </div>
  );
}
