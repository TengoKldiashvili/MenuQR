"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("verifyEmail");

  const email = searchParams.get("email") || "";

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "EMAIL_REQUIRED") {
          setError(t("errors.emailRequired"));
        } else if (data.error === "INVALID_CODE") {
          setError(t("errors.invalidCode"));
        } else if (data.error === "CODE_EXPIRED") {
          setError(t("errors.codeExpired"));
        } else {
          setError(t("errors.generic"));
        }
        setLoading(false);
        return;
      }

      router.push(`/${locale}/login`);
    } catch {
      setError(t("errors.generic"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-xl font-semibold text-white">
          {t("title")}
        </h1>

        <p className="text-sm text-white/60">
          {t("subtitle")} <b>{email}</b>
        </p>

        <input
          className="w-full rounded-xl bg-gray-950/60 border border-white/10 px-4 py-2 text-white"
          placeholder={t("codePlaceholder")}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        {error && (
          <div className="text-sm text-red-400">{error}</div>
        )}

        <button
          onClick={submit}
          disabled={loading}
          className="w-full rounded-xl bg-white text-black py-2 disabled:opacity-50"
        >
          {loading ? t("loading") : t("submit")}
        </button>
      </div>
    </div>
  );
}
