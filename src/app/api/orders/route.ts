import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { artOrders } from "@/lib/db/schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newOrder = await db
      .insert(artOrders)
      .values({
        name: body.name,
        charactersCount: body.charactersCount,
        references: body.references,
        idea: body.idea,
        additionalWishes: body.additionalWishes || "",
        deadline: body.deadline,
        desiredPrice: body.desiredPrice,
        contactInfo: body.contactInfo || "",
      })
      .returning();

    return NextResponse.json(newOrder[0], { status: 201 });
  } catch (error) {
    console.error("Error creating art order:", error);
    return NextResponse.json(
      { error: "Ошибка при создании заказа" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const orders = await db.select().from(artOrders);
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching art orders:", error);
    return NextResponse.json(
      { error: "Ошибка при получении заказов" },
      { status: 500 }
    );
  }
}
