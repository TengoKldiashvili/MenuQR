import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, menuId } = body;

    if (!name || !menuId) {
      return NextResponse.json(
        { error: "Name and menuId are required" },
        { status: 400 }
      );
    }

    const menu = await db.menu.findUnique({
      where: { id: menuId },
    });

    if (!menu || menu.userId !== session.user.id) {
      return NextResponse.json({ error: "Menu not found" }, { status: 404 });
    }

    const category = await db.category.create({
      data: {
        name,
        menuId,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
