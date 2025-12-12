import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">MenuBuilder</h1>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-4 py-2 text-indigo-600 hover:text-indigo-800"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Create Beautiful Digital Menus
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Transform your restaurant menu into a stunning digital experience.
          Share with QR codes and impress your customers.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/register"
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-lg font-semibold"
          >
            Get Started Free
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 text-lg font-semibold"
          >
            Sign In
          </Link>
        </div>
      </main>
    </div>
  );
}
