"use client";

import { useTranslations } from "next-intl";

const THEMES = [
  { id: "light", preview: "/themes/light.png" },
  { id: "minimal", preview: "/themes/minimal.png" },
  { id: "dark", preview: "/themes/dark.png" },
  { id: "elegant", preview: "/themes/elegant.png" },
];

type Props = {
  value: string;
  onChange: (theme: string) => void;
  disabled?: boolean;
};

export default function ThemePicker({
  value,
  onChange,
  disabled = false,
}: Props) {
  const t = useTranslations("theme");

  return (
    <div
      className={`
        space-y-4
        ${disabled ? "opacity-50 pointer-events-none" : ""}
      `}
    >
      <label className="text-sm font-medium text-white">{t("label")}</label>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {THEMES.map((theme) => {
          const active = value === theme.id;

          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onChange(theme.id)}
              className={`
                group rounded-2xl overflow-hidden text-left
                border transition-all
                ${
                  active
                    ? "border-white/50 bg-white/10"
                    : "border-white/10 bg-white/5 hover:border-white/30"
                }
              `}
            >
              <div className="aspect-[3/4] bg-gray-950/60">
                <img
                  src={theme.preview}
                  alt={t(theme.id)}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>

              <div className="p-3">
                <p
                  className={`
                    text-sm font-medium
                    ${active ? "text-white" : "text-white/70"}
                  `}
                >
                  {t(theme.id)}
                </p>

                {active && (
                  <p className="text-xs text-white/50 mt-1">{t("selected")}</p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
