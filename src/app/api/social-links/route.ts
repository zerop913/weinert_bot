import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { socialLinks } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const linksList = await db
      .select()
      .from(socialLinks)
      .where(eq(socialLinks.isVisible, true))
      .orderBy(asc(socialLinks.order), asc(socialLinks.createdAt));

    return NextResponse.json(linksList);
  } catch (error) {
    console.error("Error fetching social links:", error);
    return NextResponse.json(
      { error: "Ошибка при получении социальных сетей" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newLink = await db
      .insert(socialLinks)
      .values({
        name: body.name,
        url: body.url,
        icon: body.icon,
        order: body.order || 0,
        isVisible: body.isVisible !== undefined ? body.isVisible : true,
      })
      .returning();

    return NextResponse.json(newLink[0], { status: 201 });
  } catch (error) {
    console.error("Error creating social link:", error);
    return NextResponse.json(
      { error: "Ошибка при создании ссылки" },
      { status: 500 }
    );
  }
}
