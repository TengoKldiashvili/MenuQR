import Image from "next/image";
import { PublicMenu } from "@/types/menu";

export default function DarkTheme({ menu }: { menu: PublicMenu }) {
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      <div className="max-w-3xl mx-auto px-5 py-14">
        {menu.logoUrl && (
          <div className="mb-10 text-center">
            <Image
              src={menu.logoUrl}
              alt="Logo"
              width={150}
              height={150}
              className="mx-auto opacity-90"
            />
          </div>
        )}

        <h1 className="text-4xl font-bold text-center mb-3">{menu.title}</h1>

        {menu.description && (
          <p className="text-center text-zinc-400 mb-12">{menu.description}</p>
        )}

        <div className="space-y-14">
          {menu.categories.map((category) => (
            <section key={category.id}>
              <h2 className="text-xl font-semibold mb-6 border-b border-zinc-700 pb-2">
                {category.name}
              </h2>

              <div className="space-y-4">
                {category.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 transition-colors"
                  >
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={96}
                        height={96}
                        className="rounded-lg object-cover flex-shrink-0"
                      />
                    )}

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-lg">{item.name}</h3>
                        {item.price && (
                          <span className="text-emerald-400 font-semibold">
                            {item.price.toFixed(2)} ₾
                          </span>
                        )}
                      </div>

                      {item.description && (
                        <p className="text-sm text-zinc-400 mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
