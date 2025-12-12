"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();
  
  return (
    <button
      onClick={() => {
        signOut({ redirect: false }).then(() => {
          router.push("/");
          router.refresh();
        });
      }}
      className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
    >
      Sign Out
    </button>
  );
}

