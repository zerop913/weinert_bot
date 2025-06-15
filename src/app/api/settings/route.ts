import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { settings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (key) {
      const setting = await db
        .select()
        .from(settings)
        .where(eq(settings.key, key))
        .limit(1);

      return NextResponse.json(setting[0] || null);
    } else {
      const allSettings = await db.select().from(settings);
      return NextResponse.json(allSettings);
    }
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Ошибка при получении настроек" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newSetting = await db
      .insert(settings)
      .values({
        key: body.key,
        value: body.value,
        description: body.description || "",
      })
      .returning();

    return NextResponse.json(newSetting[0], { status: 201 });
  } catch (error) {
    console.error("Error creating setting:", error);
    return NextResponse.json(
      { error: "Ошибка при создании настройки" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const updatedSetting = await db
      .update(settings)
      .set({
        value: body.value,
        description: body.description,
        updatedAt: new Date(),
      })
      .where(eq(settings.key, body.key))
      .returning();

    return NextResponse.json(updatedSetting[0]);
  } catch (error) {
    console.error("Error updating setting:", error);
    return NextResponse.json(
      { error: "Ошибка при обновлении настройки" },
      { status: 500 }
    );
  }
}
