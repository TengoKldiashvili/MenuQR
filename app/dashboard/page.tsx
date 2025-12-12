import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const menus = await db.menu.findMany({
    where: { userId: user.id },
    include: {
      categories: {
        include: {
          items: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Menus</h1>
        <Link
          href="/dashboard/create-menu"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Create New Menu
        </Link>
      </div>

      {menus.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You don't have any menus yet.</p>
          <Link
            href="/dashboard/create-menu"
            className="text-indigo-600 hover:text-indigo-800"
          >
            Create your first menu →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menus.map((menu) => (
            <Link
              key={menu.id}
              href={`/dashboard/menu/${menu.id}`}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {menu.title}
              </h2>
              {menu.description && (
                <p className="text-gray-600 text-sm mb-4">{menu.description}</p>
              )}
              <div className="text-sm text-gray-500">
                {menu.categories.length} categories •{" "}
                {menu.categories.reduce((acc, cat) => acc + cat.items.length, 0)}{" "}
                items
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

