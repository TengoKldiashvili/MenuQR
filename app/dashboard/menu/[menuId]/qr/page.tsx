import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

export default async function QRCodePage({
  params,
}: {
  params: Promise<{ menuId: string }>;
}) {
  const user = await getCurrentUser();
  const { menuId } = await params;

  if (!user) {
    redirect("/login");
  }

  const menu = await db.menu.findUnique({
    where: { id: menuId },
  });

  if (!menu || menu.userId !== user.id) {
    redirect("/dashboard");
  }

  const publicUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/menu/${menuId}`;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link
        href={`/dashboard/menu/${menuId}`}
        className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block"
      >
        ← Back to Menu
      </Link>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">QR Code</h1>

      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h2 className="text-xl font-semibold mb-4">{menu.title}</h2>
        <div className="flex justify-center mb-6">
          <QRCodeSVG value={publicUrl} size={256} />
        </div>
        <p className="text-sm text-gray-600 mb-2">Public Menu URL:</p>
        <a
          href={publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:text-indigo-800 break-all"
        >
          {publicUrl}
        </a>
        <p className="text-sm text-gray-500 mt-4">
          Scan this QR code with any smartphone to view your menu
        </p>
      </div>
    </div>
  );
}

