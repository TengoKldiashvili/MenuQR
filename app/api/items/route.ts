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
    const { name, price, description, imageUrl, categoryId } = body;

    if (!name || !categoryId) {
      return NextResponse.json(
        { error: "Name and categoryId are required" },
        { status: 400 }
      );
    }

    const category = await db.category.findUnique({
      where: { id: categoryId },
      include: { menu: true },
    });

    if (!category || category.menu.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const item = await db.item.create({
      data: {
        name,
        price: price ? parseFloat(price) : null,
        description: description || null,
        imageUrl: imageUrl || null,
        categoryId,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Error creating item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
