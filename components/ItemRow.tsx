"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ItemRowProps {
  item: {
    id: string;
    name: string;
    price: number | null;
    description: string | null;
    imageUrl: string | null;
  };
  menuId: string;
}

export default function ItemRow({ item, menuId }: ItemRowProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete item "${item.name}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/items/${item.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error("Error deleting item:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex gap-4 items-start p-4 border border-gray-200 rounded-lg">
      {item.imageUrl && (
        <div className="flex-shrink-0">
          <Image
            src={item.imageUrl}
            alt={item.name}
            width={80}
            height={80}
            className="rounded-lg object-cover"
          />
        </div>
      )}
      <div className="flex-1">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-gray-900">{item.name}</h3>
          {item.price && (
            <span className="font-bold text-indigo-600">
              ${item.price.toFixed(2)}
            </span>
          )}
        </div>
        {item.description && (
          <p className="text-sm text-gray-600 mb-2">{item.description}</p>
        )}
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

