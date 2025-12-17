import { redirect } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import MenuCardClient from "@/components/dashboard/MenuCardClient";
import { LIMITS } from "@/lib/limits";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "dashboard",
  });

  const user = await getCurrentUser();
  if (!user) {
    redirect(`/${locale}/login`);
  }

  const menus = await db.menu.findMany({
    where: { userId: user.id },
    include: {
      categories: {
        include: { items: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const isLimitReached = menus.length >= LIMITS.FREE_MENU_LIMIT;

  return (
    <div>
      {/* HEADER */}
      <div className="mb-12">
        <h1 className="text-3xl font-semibold">{t("title")}</h1>
        <p className="text-white/60">{t("subtitle")}</p>
      </div>

      {isLimitReached && (
        <div className="col-span-full my-8 flex justify-center">
          <div className="rounded-xl bg-red-500/10 px-4 py-2 text-sm text-red-400">
            {t("limited")}
          </div>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-1">
        {/* ADD MENU CARD */}
        {!isLimitReached && (
          <Link
            href={`/${locale}/dashboard/create-menu`}
            className="
        group
        flex min-h-[220px] items-center justify-center
        rounded-2xl border border-dashed border-white/20
        text-white/50 transition
        hover:border-white/40 hover:text-white
      "
          >
            <div className="text-center">
              <div className="mb-2 text-4xl font-light">+</div>
              <div className="text-sm font-medium">{t("addMenu")}</div>
            </div>
          </Link>
        )}

        {/* MENUS */}
        {menus.map((menu) => (
          <MenuCardClient key={menu.id} menu={menu} locale={locale} />
        ))}
      </div>
    </div>
  );
}
