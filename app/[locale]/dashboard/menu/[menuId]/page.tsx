import { redirect } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import CategoryRow from "@/components/dashboard/CategoryRow";

export default async function MenuBuilderPage({
  params,
}: {
  params: Promise<{ locale: string; menuId: string }>;
}) {
  const { locale, menuId } = await params;

  const t = await getTranslations({
    locale,
    namespace: "menuBuilder",
  });

  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login`);

  const menu = await db.menu.findUnique({
    where: { id: menuId },
    include: {
      categories: {
        include: { items: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!menu || menu.userId !== user.id) {
    redirect(`/${locale}/dashboard`);
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-12">
        <Link
          href={`/${locale}/dashboard`}
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition mb-4"
        >
          ← {t("back")}
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1
              className="
    w-full
    font-semibold tracking-tight
    leading-tight
    text-[clamp(1.25rem,5vw,1.875rem)]
    whitespace-nowrap
    overflow-hidden
    text-ellipsis
  "
            >
              {menu.title}
            </h1>

            {menu.description && (
              <p className="text-white/60 mt-1">{menu.description}</p>
            )}
          </div>

          <Link
            href={`/${locale}/dashboard/menu/${menuId}/qr`}
            className="
              px-6 py-2.5 rounded-xl
              bg-white text-gray-950
              text-sm font-medium
              hover:opacity-90 transition
            "
          >
            {t("viewQr")}
          </Link>
        </div>
      </div>

      <div className="mb-10 flex flex-wrap gap-3">
        <Link
          href={`/${locale}/dashboard/menu/${menuId}/add-category`}
          className="
            px-4 py-2 rounded-xl text-sm
            border border-white/20
            text-white/70
            hover:border-white/50
            hover:text-white
            transition
          "
        >
          + {t("addCategory")}
        </Link>

        {menu.categories.length > 0 && (
          <Link
            href={`/${locale}/dashboard/menu/${menuId}/add-item`}
            className="
              px-4 py-2 rounded-xl text-sm
              border border-white/20
              text-white/70
              hover:border-white/50
              hover:text-white
              transition
            "
          >
            + {t("addItem")}
          </Link>
        )}
      </div>

      {menu.categories.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 py-24 text-center backdrop-blur">
          <p className="text-white/60 mb-6">{t("emptyTitle")}</p>

          <Link
            href={`/${locale}/dashboard/menu/${menuId}/add-category`}
            className="text-sm text-white hover:underline"
          >
            {t("emptyCta")} →
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
