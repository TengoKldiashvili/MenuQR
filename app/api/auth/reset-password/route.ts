import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { LIMITS } from "@/lib/limits";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const email = String(body.email || "").trim();
    const code = String(body.code || "").trim();
    const newPassword = String(body.newPassword || "");

    if (!email || !code) {
      return NextResponse.json({ error: "generic" }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "passwordTooShort" }, { status: 400 });
    }

    const record = await db.passwordResetCode.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });

    if (!record) {
      return NextResponse.json({ error: "emailNotFound" }, { status: 404 });
    }

    if (record.expiresAt < new Date()) {
      await db.passwordResetCode.deleteMany({ where: { email } });
      return NextResponse.json({ error: "codeExpired" }, { status: 400 });
    }

    if (record.attempts >= LIMITS.PASSWORD_RESET_MAX_ATTEMPTS) {
      return NextResponse.json({ error: "tooManyAttempts" }, { status: 429 });
    }

    await db.passwordResetCode.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });

    const isValid = await bcrypt.compare(code, record.codeHash);
    if (!isValid) {
      return NextResponse.json({ error: "invalidCode" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await db.user.update({
      where: { email },
      data: { passwordHash },
    });

    await db.passwordResetCode.deleteMany({ where: { email } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "generic" }, { status: 500 });
  }
}
