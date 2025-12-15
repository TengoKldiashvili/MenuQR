"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export default function LoginClient() {
  const t = useTranslations("auth");
  const router = useRouter();
  const locale = useLocale();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(t("errors.invalidCredentials"));
        return;
      }

      router.push(`/${locale}/dashboard`);
      router.refresh();
    } catch {
      setError(t("errors.generic"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold tracking-tight">
            {t("title")}
          </h1>
          <p className="text-sm text-white/60 mt-2">
            {t("subtitle")}
          </p>
        </div>

        {/* Lightweight credential form with inline errors */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-white/70 mb-1">
              {t("email")}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-gray-950/60 border border-white/10 px-4 py-2 text-white focus:border-white/40 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1">
              {t("password")}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-gray-950/60 border border-white/10 px-4 py-2 text-white focus:border-white/40 focus:outline-none"
            />
          </div>

          <p className="text-right text-sm">
            <Link
              href={`/${locale}/forgot-password`}
              className="text-white/70 hover:underline"
            >
              {t("forgotPassword")}
            </Link>
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white text-gray-950 text-sm font-medium py-2.5 hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? t("loading") : t("submit")}
          </button>

          <p className="text-center text-sm text-white/60">
            {t("noAccount")}{" "}
            <Link
              href={`/${locale}/register`}
              className="text-white hover:underline"
            >
              {t("create")}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
