"use client";

import Link from "next/link";

export default function GlobalError({}: { reset: () => void }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="text-5xl font-semibold mb-6">404</h1>
        <p className="text-white/60 mb-10">
          Something went wrong. Please try again.
        </p>

        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-xl bg-white text-gray-950 text-sm font-medium hover:opacity-90 transition"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
