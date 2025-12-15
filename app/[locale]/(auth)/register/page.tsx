import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import RegistrationClient from "./RegistrationClient";

export default async function RegistrationPage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/dashboard"); 
  }

  return <RegistrationClient />;
}
