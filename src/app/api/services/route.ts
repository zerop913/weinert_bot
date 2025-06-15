import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { services } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let servicesList;

    if (category) {
      servicesList = await db
        .select()
        .from(services)
        .where(eq(services.isVisible, true) && eq(services.category, category))
        .orderBy(asc(services.order), asc(services.createdAt));
    } else {
      servicesList = await db
        .select()
        .from(services)
        .where(eq(services.isVisible, true))
        .orderBy(asc(services.order), asc(services.createdAt));
    }

    return NextResponse.json(servicesList);
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      {
        error: "Ошибка при получении услуг",
        details: error instanceof Error ? error.message : "Unknown error",
        env: {
          hasDbUrl: !!process.env.DATABASE_URL,
          nodeEnv: process.env.NODE_ENV,
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newService = await db
      .insert(services)
      .values({
        title: body.title,
        price: body.price,
        description: body.description || "",
        category: body.category,
        order: body.order || 0,
        isVisible: body.isVisible !== undefined ? body.isVisible : true,
      })
      .returning();

    return NextResponse.json(newService[0], { status: 201 });
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: "Ошибка при создании услуги" },
      { status: 500 }
    );
  }
}
