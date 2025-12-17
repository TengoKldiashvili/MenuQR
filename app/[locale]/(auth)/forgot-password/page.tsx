"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

type ForgotPasswordErrorKey =
  | "emailRequired"
  | "userNotFound"
  | "resendCooldown"
  | "tooManyRequests"
  | "generic";

export default function ForgotPasswordPage() {
  const t = useTranslations("forgotPassword");
  const locale = useLocale();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data: { error?: ForgotPasswordErrorKey } = await res.json();

      if (!res.ok) {
        const errorKey = data?.error ?? "generic";
        setError(t(`errors.${errorKey}`));
        setLoading(false);
        return;
      }

      setSuccess(true);

      setTimeout(() => {
        router.push(
          `/${locale}/reset-password?email=${encodeURIComponent(email)}`
        );
      }, 1200);
    } catch {
      setError(t("errors.generic"));
    } finally {
      setLoading(false);
    }
  };

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

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
              {t("success")}
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

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white text-gray-950 text-sm font-medium py-2.5 hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? t("loading") : t("submit")}
          </button>

          <p className="text-center text-sm text-white/60">
            <Link
              href={`/${locale}/login`}
              className="text-white hover:underline"
            >
              {t("backToLogin")}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
