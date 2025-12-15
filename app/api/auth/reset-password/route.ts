import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email, code, newPassword } = await req.json();

    if (!email || !code || newPassword.length < 8) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const record = await db.passwordResetCode.findFirst({ where: { email } });
    if (!record || record.expiresAt < new Date()) {
      return NextResponse.json({ error: "Code expired" }, { status: 400 });
    }

    const valid = await bcrypt.compare(code, record.codeHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await db.user.update({
      where: { email },
      data: { passwordHash },
    });

    await db.passwordResetCode.deleteMany({ where: { email } });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
