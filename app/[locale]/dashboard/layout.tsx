import { redirect } from "next/navigation";
import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login`);

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-white/10 blur-3xl" />
        <div className="absolute top-20 right-0 w-[650px] h-[650px] rounded-full bg-white/10 blur-3xl" />
      </div>

      <nav className="relative sticky top-0 z-40 border-b border-white/10 bg-gray-950/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href={`/${locale}/dashboard`}
            className="text-lg font-semibold tracking-tight"
          >
            DMENU
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-white/60 hidden sm:block">
              {user.email}
            </span>
            <SignOutButton />
          </div>
        </div>
      </nav>

      <main className="relative max-w-7xl mx-auto px-6 py-12">{children}</main>
    </div>
  );
}
