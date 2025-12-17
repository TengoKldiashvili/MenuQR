import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { LIMITS } from "@/lib/limits";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email || "").trim();
    const code = String(body.code || "").trim();

    if (!email || !code) {
      return NextResponse.json({ error: "generic" }, { status: 400 });
    }

    const record = await db.emailVerificationCode.findUnique({
      where: { email },
    });

    if (!record) {
      return NextResponse.json({ error: "invalidCode" }, { status: 400 });
    }

    if (record.expiresAt < new Date()) {
      await db.emailVerificationCode.delete({ where: { email } });
      return NextResponse.json({ error: "codeExpired" }, { status: 400 });
    }

    if (record.attempts >= LIMITS.VERIFY_EMAIL_MAX_ATTEMPTS) {
      return NextResponse.json({ error: "tooManyAttempts" }, { status: 429 });
    }

    const isValid = await bcrypt.compare(code, record.codeHash);

    await db.emailVerificationCode.update({
      where: { email },
      data: { attempts: { increment: 1 } },
    });

    if (!isValid) {
      return NextResponse.json({ error: "invalidCode" }, { status: 400 });
    }

    const exists = await db.user.findUnique({ where: { email } });
    if (exists) {
      await db.emailVerificationCode.delete({ where: { email } });
      return NextResponse.json({ error: "alreadyVerified" }, { status: 400 });
    }

    await db.user.create({
      data: {
        email,
        passwordHash: record.passwordHash,
        name: record.name,
      },
    });

    await db.emailVerificationCode.delete({ where: { email } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("VERIFY EMAIL ERROR:", err);
    return NextResponse.json({ error: "generic" }, { status: 500 });
  }
}
