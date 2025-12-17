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
    const normalizedEmail = String(body.email || "").trim();

    if (!normalizedEmail) {
      return NextResponse.json({ error: "emailRequired" }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json({ error: "userNotFound" }, { status: 404 });
    }

    const last = await db.passwordResetCode.findFirst({
      where: { email: normalizedEmail },
      orderBy: { createdAt: "desc" },
    });

    if (last) {
      const secondsSinceLast = (Date.now() - last.createdAt.getTime()) / 1000;

      if (secondsSinceLast < LIMITS.RESEND_CODE_COOLDOWN_SECONDS) {
        return NextResponse.json({ error: "resendCooldown" }, { status: 429 });
      }

      if (
        last.expiresAt > new Date() &&
        last.attempts >= LIMITS.FORGOT_PASSWORD_MAX_SENDS
      ) {
        return NextResponse.json({ error: "tooManyRequests" }, { status: 429 });
      }
    }

    const code = generateCode();
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(
      Date.now() + LIMITS.PASSWORD_RESET_CODE_TTL_MINUTES * 60 * 1000
    );

    await db.passwordResetCode.deleteMany({
      where: { email: normalizedEmail },
    });

    await db.passwordResetCode.create({
      data: {
        email: normalizedEmail,
        codeHash,
        expiresAt,
        attempts:
          last && last.expiresAt > new Date()
            ? Math.min(last.attempts + 1, 999)
            : 1,
      },
    });

    await sendVerificationCode(normalizedEmail, code);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    return NextResponse.json({ error: "generic" }, { status: 500 });
  }
}
