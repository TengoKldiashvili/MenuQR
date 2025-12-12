import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";

const themes = {
  light: "bg-white text-gray-900",
  dark: "bg-gray-900 text-white",
  minimal: "bg-gray-50 text-gray-900",
  elegant: "bg-gradient-to-br from-purple-50 to-pink-50 text-gray-900",
};

export default async function PublicMenuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const menu = await db.menu.findUnique({
    where: { id },
    include: {
      categories: {
        include: {
          items: true,
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!menu) {
    notFound();
  }

  const themeClass = themes[menu.theme as keyof typeof themes] || themes.light;

  return (
    <div className={`min-h-screen ${themeClass}`}>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {menu.logoUrl && (
          <div className="mb-8 text-center">
            <Image
              src={menu.logoUrl}
              alt="Logo"
              width={200}
              height={200}
              className="mx-auto"
            />
          </div>
        )}
        <h1 className="text-4xl font-bold text-center mb-4">{menu.title}</h1>
        {menu.description && (
          <p className="text-center text-lg mb-12 opacity-80">{menu.description}</p>
        )}

        <div className="space-y-12">
          {menu.categories.map((category) => (
            <div key={category.id}>
              <h2 className="text-2xl font-semibold mb-6 border-b pb-2">
                {category.name}
              </h2>
              <div className="space-y-6">
                {category.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-6 items-start p-4 rounded-lg hover:bg-opacity-10 hover:bg-black transition-colors"
                  >
                    {item.imageUrl && (
                      <div className="flex-shrink-0">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          width={120}
                          height={120}
                          className="rounded-lg object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold">{item.name}</h3>
                        {item.price && (
                          <span className="text-lg font-bold">
                            ${item.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-sm opacity-80">{item.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

