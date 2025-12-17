"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function LanguageSwitch({ locale }: { locale: string }) {
  const pathname = usePathname();
  const pathWithoutLocale = pathname.replace(/^\/(ka|en)/, "");

  return (
    <div className="flex items-center gap-2 text-xs">
      {["ka", "en"].map((lng) => {
        const active = lng === locale;

        return (
          <Link
            key={lng}
            href={`/${lng}${pathWithoutLocale || ""}`}
            className={
              active
                ? "px-2 py-1 rounded-md bg-white text-gray-950 font-medium"
                : "px-2 py-1 rounded-md text-white/50 hover:text-white transition"
            }
          >
            {lng.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}
