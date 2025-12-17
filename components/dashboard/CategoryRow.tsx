"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import ItemRow from "./ItemRow";

interface CategoryRowProps {
  category: {
    id: string;
    name: string;
    items: Array<{
      id: string;
      name: string;
      price: number | null;
      description: string | null;
      imageUrl: string | null;
    }>;
  };
  menuId: string;
}

export default function CategoryRow({ category, menuId }: CategoryRowProps) {
  const t = useTranslations("category");
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [name, setName] = useState(category.name);

  const handleDelete = async () => {
    if (!confirm(t("confirmDelete", { name: category.name }))) return;
    setIsDeleting(true);
    try {
      await fetch(`/api/categories/${category.id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async () => {
    if (!name.trim()) return;
    setIsSaving(true);
    try {
      await fetch(`/api/categories/${category.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      setIsEditing(false);
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur transition hover:border-white/30">
      <div
        onClick={() => !isEditing && setIsOpen((v) => !v)}
        className="
          p-6 cursor-pointer
          flex flex-col sm:flex-row
          sm:items-center sm:justify-between
          gap-4
          select-none
        "
      >
        {isEditing ? (
          <input
            value={name}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            className="
              w-full sm:w-64
              rounded-lg bg-white/10
              border border-white/20
              px-3 py-2 text-white
              outline-none
              focus:border-white/40
            "
          />
        ) : (
          <h2 className="text-xl font-semibold tracking-tight text-white">
            {category.name}
          </h2>
        )}

        <div
          onClick={(e) => e.stopPropagation()}
          className="flex gap-2 flex-wrap sm:flex-nowrap"
        >
          {isEditing ? (
            <>
              <button
                onClick={handleUpdate}
                disabled={isSaving}
                className="
                  text-xs px-3 py-1.5 rounded-md
                  bg-white/20 hover:bg-white/30
                  transition disabled:opacity-50
                "
              >
                {isSaving ? t("saving") : t("save")}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setName(category.name);
                }}
                className="
                  text-xs px-3 py-1.5 rounded-md
                  border border-white/20
                  text-white/60 hover:text-white
                "
              >
                {t("cancel")}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="
                  text-xs px-3 py-1.5 rounded-md
                  border border-white/20
                  text-white/60 hover:text-white
                "
              >
                {t("edit")}
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="
                  text-xs px-3 py-1.5 rounded-md
                  border border-white/20
                  text-white/60
                  hover:border-red-500/50
                  hover:text-red-400
                  disabled:opacity-50
                "
              >
                {isDeleting ? t("deleting") : t("delete")}
              </button>
            </>
          )}
        </div>
      </div>

      <div
        className={`
          overflow-hidden transition-all duration-300 ease-out
          ${isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div
          className={`
            px-6 pb-6
            transform transition duration-300
            ${isOpen ? "translate-y-0" : "-translate-y-2"}
          `}
        >
          {category.items.length === 0 ? (
            <p className="text-sm text-white/50">{t("empty")}</p>
          ) : (
            <div className="space-y-4">
              {category.items.map((item) => (
                <ItemRow key={item.id} item={item} menuId={menuId} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
