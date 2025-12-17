import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { db } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, price, description, imageUrl } = body;

    const item = await db.item.findUnique({
      where: { id },
      include: {
        category: {
          include: { menu: true },
        },
      },
    });

    if (!item || item.category.menu.userId !== session.user.id) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const updatedItem = await db.item.update({
      where: { id },
      data: {
        name: name ?? item.name,
        price: price !== undefined ? parseFloat(price) : item.price,
        description: description !== undefined ? description : item.description,
        imageUrl: imageUrl !== undefined ? imageUrl : item.imageUrl,
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const item = await db.item.findUnique({
      where: { id },
      include: {
        category: {
          include: { menu: true },
        },
      },
    });

    if (!item || item.category.menu.userId !== session.user.id) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    await db.item.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
