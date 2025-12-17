import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { db } from "@/lib/db";
import { LIMITS } from "@/lib/limits";
import { getTranslations } from "next-intl/server";

function getLocaleFromRequest(request: NextRequest): string {
  const pathname = request.nextUrl.pathname;
  const locale = pathname.split("/")[1];
  return locale || "en";
}

export async function GET(request: NextRequest) {
  try {
    const locale = getLocaleFromRequest(request);
    const t = await getTranslations({
      locale,
      namespace: "apiMenus",
    });

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: t("unauthorized") }, { status: 401 });
    }

    const menus = await db.menu.findMany({
      where: { userId: session.user.id },
      include: {
        categories: {
          include: {
            items: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(menus);
  } catch (error) {
    console.error("Error fetching menus:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const locale = getLocaleFromRequest(request);
    const t = await getTranslations({
      locale,
      namespace: "apiMenus",
    });

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: t("unauthorized") }, { status: 401 });
    }

    const menusCount = await db.menu.count({
      where: { userId: session.user.id },
    });

    if (menusCount >= LIMITS.FREE_MENU_LIMIT) {
      return NextResponse.json(
        { error: t("menuLimitReached") },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, theme, logoUrl } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: t("titleRequired") }, { status: 400 });
    }

    const menu = await db.menu.create({
      data: {
        title: title.trim(),
        description: description || null,
        theme: theme || "light",
        logoUrl: logoUrl || null,
        userId: session.user.id,
      },
    });

    return NextResponse.json(menu, { status: 201 });
  } catch (error) {
    console.error("Error creating menu:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
