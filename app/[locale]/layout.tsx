import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";

import en from "@/messages/en.json";
import ka from "@/messages/ka.json";
import { fontEn, fontKa } from "@/app/fonts";

type Locale = "en" | "ka";

const MESSAGES: Record<Locale, typeof en> = {
  en,
  ka,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const normalizedLocale: Locale = locale.startsWith("ka")
    ? "ka"
    : locale.startsWith("en")
    ? "en"
    : notFound();

  const fontClass =
    normalizedLocale === "ka" ? fontKa.variable : fontEn.variable;

  return (
    <div
      className={`${fontClass} min-h-screen antialiased`}
      style={
        {
          "--font-sans":
            normalizedLocale === "ka" ? "var(--font-ka)" : "var(--font-en)",
        } as React.CSSProperties
      }
    >
      <NextIntlClientProvider
        locale={normalizedLocale}
        messages={MESSAGES[normalizedLocale]}
      >
        {children}
      </NextIntlClientProvider>
    </div>
  );
}
