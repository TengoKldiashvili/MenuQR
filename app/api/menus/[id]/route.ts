import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { db } from "@/lib/db";

export async function PUT(
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
    const { title, description, theme, logoUrl } = body;

    const menu = await db.menu.findUnique({
      where: { id },
    });

    if (!menu || menu.userId !== session.user.id) {
      return NextResponse.json({ error: "Menu not found" }, { status: 404 });
    }

    const updatedMenu = await db.menu.update({
      where: { id },
      data: {
        title: title !== undefined ? title : menu.title,
        description: description !== undefined ? description : menu.description,
        theme: theme !== undefined ? theme : menu.theme,
        logoUrl: logoUrl !== undefined ? logoUrl : menu.logoUrl,
      },
    });

    return NextResponse.json(updatedMenu);
  } catch (error) {
    console.error("Error updating menu:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
