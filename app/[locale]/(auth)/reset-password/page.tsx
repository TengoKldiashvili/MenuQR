"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

type ResetPasswordErrorKey =
  | "emailNotFound"
  | "passwordTooShort"
  | "passwordsNotMatch"
  | "invalidCode"
  | "codeExpired"
  | "tooManyAttempts"
  | "tooManyRequests"
  | "resendCooldown"
  | "generic";


export default function ResetPasswordPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("resetPassword");
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";

  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((c) => c - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError(t("errors.emailNotFound"));
      return;
    }

    if (password.length < 8) {
      setError(t("errors.passwordTooShort"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("errors.passwordsNotMatch"));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code,
          newPassword: password,
        }),
      });

      const data: { error?: ResetPasswordErrorKey } = await res.json();

      if (!res.ok) {
        const errorKey = data?.error ?? "generic";
        setError(t(`errors.${errorKey}`));
        return;
      }

      setSuccess(true);

      setTimeout(() => {
        router.push(`/${locale}/login`);
      }, 1500);
    } catch {
      setError(t("errors.generic"));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email || cooldown > 0) return;

    setResendLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(
          t(`errors.${data?.error ?? "generic"}`)
        );
        return;
      }

      setCooldown(60); 
    } catch {
      setError(t("errors.generic"));
    } finally {
      setResendLoading(false);
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
              {t("code")}
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full rounded-xl bg-gray-950/60 border border-white/10 px-4 py-2 text-white focus:border-white/40 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1">
              {t("newPassword")}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-gray-950/60 border border-white/10 px-4 py-2 text-white focus:border-white/40 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1">
              {t("confirmPassword")}
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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

          <div className="text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendLoading || cooldown > 0}
              className="text-sm text-white/60 hover:underline disabled:opacity-40"
            >
              {cooldown > 0
                ? `კოდის ხელახლა გაგზავნა (${cooldown}s)`
                : "კოდის ხელახლა გაგზავნა"}
            </button>
          </div>

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
