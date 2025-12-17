"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import DeleteMenuButton from "./DeleteMenuButton";
import EditMenuButton from "./EditMenuButton";
import EditMenuForm from "./EditMenuForm";
import { useTranslations } from "next-intl";
import { Menu } from "@prisma/client";
import { QrCode } from "lucide-react";

interface Props {
  menu: Menu & {
    categories: {
      items: { id: string }[];
    }[];
  };
  locale: string;
}

export default function MenuCardClient({ menu, locale }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const t = useTranslations("qrcode");
  const t_2 = useTranslations("dashboard");

  const itemsCount = menu.categories.reduce(
    (acc, cat) => acc + cat.items.length,
    0
  );

  return (
    <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6">
      {/* CONTENT ROW */}
      <div
        className={`
    flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center
    transition
    ${isEditing ? "opacity-40 pointer-events-none" : ""}
  `}
      >
        {/* LOGO */}
        {menu.logoUrl && (
          <div
            className="
        relative
        h-16 w-16
        sm:h-20 sm:w-20
        mx-auto sm:mx-0
        shrink-0
        overflow-hidden
        rounded-2xl
        border border-white/10
        bg-white/5
      "
          >
            <Link href={`/${locale}/dashboard/menu/${menu.id}`}>
              <Image
                src={menu.logoUrl}
                alt={menu.title ?? "Menu logo"}
                fill
                className="object-cover"
              />
            </Link>
          </div>
        )}

        <div
          className={`
      w-full
      ${isEditing ? "opacity-40 pointer-events-none" : ""}
      text-center sm:text-left
    `}
        >
          <Link href={`/${locale}/dashboard/menu/${menu.id}`}>
            <h2 className="mb-1 text-lg font-medium truncate">
              {menu.title ?? t_2("empty")}
            </h2>
          </Link>
          {/* TEXT CONTENT */}

          {menu.description && (
            <Link href={`/${locale}/dashboard/menu/${menu.id}`}>
              <p className="mb-3 text-sm text-white/60 line-clamp-2">
                {menu.description}
              </p>
            </Link>
          )}

          <div className="flex items-center justify-between gap-4">
            {/* STATS */}
            <div className="flex text-xs text-white/50">
              <span>
                {menu.categories.length} {t_2("categories")}
              </span>
              <span className="ml-4">
                {itemsCount} {t_2("items")}
              </span>
            </div>

            {/* QR BUTTON */}
            <Link
              href={`/${locale}/dashboard/menu/${menu.id}/qr`}
              className="
      group
      inline-flex items-center justify-center
      rounded-lg
      border border-white/20
      bg-white/5
      p-2
      text-white/80
      transition
      hover:bg-white/10
      hover:text-white
    "
              title={t("title")}
            >
              <QrCode className="h-4 w-4 opacity-70 group-hover:opacity-100" />
            </Link>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="absolute right-3 top-3 flex gap-2">
        <EditMenuButton onClick={() => setIsEditing((v) => !v)} />
        <DeleteMenuButton menuId={menu.id} locale={locale} />
      </div>

      {/* EDIT DROPDOWN */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mt-6"
          >
            <EditMenuForm menu={menu} onClose={() => setIsEditing(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
