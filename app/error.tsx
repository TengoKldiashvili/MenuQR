"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html>
      <body className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Error</h1>

          <button
            onClick={() => reset()}
            className="text-sm underline text-white/70"
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
