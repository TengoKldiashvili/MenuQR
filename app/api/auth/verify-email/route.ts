import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code required" },
        { status: 400 }
      );
    }

    const record = await db.emailVerificationCode.findFirst({
      where: { email },
    });

    if (!record) {
      return NextResponse.json(
        { error: "Invalid code" },
        { status: 400 }
      );
    }

    if (record.expiresAt < new Date()) {
      await db.emailVerificationCode.deleteMany({ where: { email } });
      return NextResponse.json(
        { error: "Code expired" },
        { status: 400 }
      );
    }

    const valid = await bcrypt.compare(code, record.codeHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid code" },
        { status: 400 }
      );
    }

    await db.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    });

    await db.emailVerificationCode.deleteMany({ where: { email } });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
