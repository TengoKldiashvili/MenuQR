"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export default function RegisterPage() {
  const t = useTranslations("register");
  const locale = useLocale();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "INVALID_EMAIL") {
          setError(t("errors.invalidEmail"));
        } else if (data.error === "MISSING_FIELDS") {
          setError(t("errors.missingFields"));
        } else if (data.error === "PASSWORD_TOO_SHORT") {
          setError(t("errors.passwordTooShort"));
        } else if (data.error === "EMAIL_EXISTS") {
          setError(t("errors.emailExists"));
        } else {
          setError(t("errors.generic"));
        }
        return;
      }

      router.push(
        `/${locale}/verify-email?email=${encodeURIComponent(email)}`
      );
    } catch {
      setError(t("errors.generic"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-3xl font-semibold text-white">
          {t("title")}
        </h1>
        <p className="text-sm text-white/60 mt-2">
          {t("subtitle")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Basic client-side validation before hitting the API */}

          <input
            placeholder={t("name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl bg-gray-950/60 border border-white/10 px-4 py-2 text-white focus:outline-none"
          />

          <input
            type="email"
            required
            placeholder={t("email")}
            pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
            title={t("errors.invalidEmail")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl bg-gray-950/60 border border-white/10 px-4 py-2 text-white focus:outline-none"
          />

          <input
            type="password"
            required
            placeholder={t("password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl bg-gray-950/60 border border-white/10 px-4 py-2 text-white focus:outline-none"
          />

          <button
            disabled={loading}
            className="w-full rounded-xl bg-white text-black py-2.5 disabled:opacity-50"
          >
            {loading ? t("loading") : t("submit")}
          </button>

          <p className="text-center text-sm text-white/60">
            {t("haveAccount")}{" "}
            <Link href={`/${locale}/login`} className="underline">
              {t("signIn")}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
