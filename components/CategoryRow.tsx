"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete category "${category.name}" and all its items?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/categories/${category.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error("Error deleting category:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-900">{category.name}</h2>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm"
        >
          {isDeleting ? "Deleting..." : "Delete Category"}
        </button>
      </div>
      <div className="space-y-4">
        {category.items.map((item) => (
          <ItemRow key={item.id} item={item} menuId={menuId} />
        ))}
      </div>
    </div>
  );
}

