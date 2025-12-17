"use client";

import { Pencil } from "lucide-react";

export default function EditMenuButton({
  onClick,
}: {
  onClick: () => void;
}) {
  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  }

  return (
    <button
      onClick={handleClick}
      title="Edit menu"
      className="
        absolute top-4 right-14
        p-2 rounded-lg
        text-white/40
        hover:text-white
        hover:bg-white/10
        transition
      "
    >
      <Pencil className="w-4 h-4" />
    </button>
  );
}
