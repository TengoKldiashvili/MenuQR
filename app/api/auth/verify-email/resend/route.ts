import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { sendVerificationCode } from "@/lib/mailer";
import { LIMITS } from "@/lib/limits";

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email || "").trim();

    if (!email) {
      return NextResponse.json({ error: "emailRequired" }, { status: 400 });
    }

    const last = await db.emailVerificationCode.findUnique({
      where: { email },
    });

    if (last) {
      const secondsSinceLast = (Date.now() - last.createdAt.getTime()) / 1000;

      if (secondsSinceLast < LIMITS.RESEND_CODE_COOLDOWN_SECONDS) {
        return NextResponse.json({ error: "resendCooldown" }, { status: 429 });
      }

      if (
        last.expiresAt > new Date() &&
        last.attempts >= LIMITS.VERIFY_EMAIL_MAX_SENDS
      ) {
        return NextResponse.json({ error: "tooManyRequests" }, { status: 429 });
      }
    }

    const code = generateCode();
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(
      Date.now() + LIMITS.VERIFY_EMAIL_CODE_TTL_MINUTES * 60 * 1000
    );

    await db.emailVerificationCode.upsert({
      where: { email },
      update: {
        codeHash,
        expiresAt,
        attempts: (last?.attempts ?? 0) + 1,
      },
      create: {
        email,
        codeHash,
        expiresAt,
        attempts: 1,

        passwordHash: last!.passwordHash,
        name: last?.name ?? null,
      },
    });

    await sendVerificationCode(email, code);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("RESEND VERIFY ERROR:", err);
    return NextResponse.json({ error: "generic" }, { status: 500 });
  }
}
