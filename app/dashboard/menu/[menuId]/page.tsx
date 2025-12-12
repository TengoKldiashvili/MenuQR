import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import CategoryRow from "@/components/CategoryRow";

export default async function MenuBuilderPage({
  params,
}: {
  params: Promise<{ menuId: string }>;
}) {
  const user = await getCurrentUser();
  const { menuId } = await params;

  if (!user) {
    redirect("/login");
  }

  const menu = await db.menu.findUnique({
    where: { id: menuId },
    include: {
      categories: {
        include: {
          items: true,
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!menu || menu.userId !== user.id) {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block"
        >
          ← Back to Dashboard
        </Link>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{menu.title}</h1>
            {menu.description && (
              <p className="text-gray-600 mt-1">{menu.description}</p>
            )}
          </div>
          <Link
            href={`/dashboard/menu/${menuId}/qr`}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            View QR Code
          </Link>
        </div>
      </div>

      <div className="mb-6 flex gap-4">
        <Link
          href={`/dashboard/menu/${menuId}/add-category`}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Add Category
        </Link>
        {menu.categories.length > 0 && (
          <Link
            href={`/dashboard/menu/${menuId}/add-item`}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Add Item
          </Link>
        )}
      </div>

      {menu.categories.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600 mb-4">No categories yet.</p>
          <Link
            href={`/dashboard/menu/${menuId}/add-category`}
            className="text-indigo-600 hover:text-indigo-800"
          >
            Create your first category →
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {menu.categories.map((category) => (
            <CategoryRow
              key={category.id}
              category={category}
              menuId={menuId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

