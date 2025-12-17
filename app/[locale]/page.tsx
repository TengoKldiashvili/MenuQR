import Link from "next/link";
import LanguageSwitch from "@/components/LanguageSwitch";
import { getTranslations } from "next-intl/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "mainpage",
  });

  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session?.user;

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-white/10 blur-3xl" />
        <div className="absolute top-20 right-0 w-[650px] h-[650px] rounded-full bg-white/10 blur-3xl" />
      </div>

      <nav className="relative max-w-7xl mx-auto px-6 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold tracking-tight">
              {t("brand")}
            </h1>

            <div className="sm:hidden">
              <LanguageSwitch locale={locale} />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <div className="hidden sm:block">
              <LanguageSwitch locale={locale} />
            </div>

            {!isLoggedIn ? (
              <>
                <Link
                  href={`/${locale}/login`}
                  className="text-sm text-white/60 hover:text-white transition text-center sm:text-left"
                >
                  {t("navSignIn")}
                </Link>

                <Link
                  href={`/${locale}/register`}
                  className="w-full sm:w-auto text-center px-4 py-2.5 rounded-xl bg-white text-gray-950 text-sm font-medium hover:opacity-90 transition"
                >
                  {t("navStartFree")}
                </Link>
              </>
            ) : (
              <Link
                href={`/${locale}/dashboard`}
                className="w-full sm:w-auto text-center px-4 py-2.5 rounded-xl bg-white text-gray-950 text-sm font-medium hover:opacity-90 transition"
              >
                {t("goToDashboard")}
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Marketing hero with CTA adjusting to auth state */}
      <main className="relative max-w-6xl mx-auto px-6 py-28">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 md:p-16">
          <p className="text-xs text-white/50 uppercase tracking-wide">
            {t("eyebrow")}
          </p>

          <h2 className="mt-6 text-[1.9rem] leading-tight sm:text-5xl md:text-6xl font-semibold tracking-tight">
            {t("headlineMain")}
            <span className="text-white/60"> {t("headlineHighlight")}</span>
          </h2>

          <p className="mt-6 text-lg text-white/70 max-w-2xl">{t("subhead")}</p>

          <div className="mt-10 flex flex-wrap gap-4">
            {!isLoggedIn ? (
              <>
                <Link
                  href={`/${locale}/register`}
                  className="px-8 py-3 rounded-xl bg-white text-gray-950 text-sm font-medium hover:opacity-90 transition"
                >
                  {t("ctaPrimary")}
                </Link>

                <Link
                  href={`/${locale}/login`}
                  className="px-8 py-3 rounded-xl border border-white/20 text-sm font-medium hover:border-white/60 transition"
                >
                  {t("ctaSecondary")}
                </Link>
              </>
            ) : (
              <Link
                href={`/${locale}/dashboard`}
                className="px-8 py-3 rounded-xl bg-white text-gray-950 text-sm font-medium hover:opacity-90 transition"
              >
                {t("goToDashboard")}
              </Link>
            )}
          </div>

          <p className="mt-6 text-xs text-white/40">{t("trust")}</p>

          <div className="mt-16 grid md:grid-cols-3 gap-6">
            {[
              ["feature1Title", "feature1Desc"],
              ["feature2Title", "feature2Desc"],
              ["feature3Title", "feature3Desc"],
              ["feature4Title", "feature4Desc"],
              ["feature5Title", "feature5Desc"],
            ].map(([titleKey, descKey]) => (
              <div
                key={titleKey}
                className="rounded-2xl bg-gray-950/40 border border-white/10 p-6"
              >
                <p className="text-sm font-medium">{t(titleKey)}</p>
                <p className="text-sm text-white/60 mt-2">{t(descKey)}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-gray-950/40 border border-white/10 p-6">
              <p className="text-sm font-medium">
                {t("previewDashboardTitle")}
              </p>
              <p className="text-sm text-white/60 mt-2">
                {t("previewDashboardDesc")}
              </p>
            </div>

            <div className="rounded-2xl bg-gray-950/40 border border-white/10 p-6">
              <p className="text-sm font-medium">{t("previewCustomerTitle")}</p>
              <p className="text-sm text-white/60 mt-2">
                {t("previewCustomerDesc")}
              </p>
            </div>
          </div>

          <div className="mt-20 border-t border-white/10 pt-16 text-center">
            <h3 className="text-3xl font-semibold tracking-tight">
              {t("contactTitle")}
            </h3>
            <p className="text-white/60 mt-3 max-w-xl mx-auto">
              {t("contactDesc")}
            </p>

            <div className="mt-6 flex flex-col items-center gap-2 text-sm text-white/70">
              <p>
                {t("contactEmailLabel")}{" "}
                <span className="text-white">{t("contactEmail")}</span>
              </p>
              <p>
                {t("contactInstagramLabel")}{" "}
                <span className="text-white">{t("contactInstagram")}</span>
              </p>
            </div>
          </div>

          <div className="mt-20 text-center">
            <h3 className="text-3xl font-semibold tracking-tight">
              {t("finalTitle")}
            </h3>
            <p className="text-white/60 mt-3">{t("finalDesc")}</p>

            <Link
              href={`/${locale}/${isLoggedIn ? "dashboard" : "register"}`}
              className="inline-block mt-6 px-10 py-3 rounded-xl bg-white text-gray-950 text-sm font-medium hover:opacity-90 transition"
            >
              {isLoggedIn ? t("goToDashboard") : t("finalButton")}
            </Link>
          </div>
        </div>
      </main>

      <footer className="relative text-center text-xs text-white/40 pb-10">
        © {new Date().getFullYear()} tlab. {t("footer")}
      </footer>
    </div>
  );
}
