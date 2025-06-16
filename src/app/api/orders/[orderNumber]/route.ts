import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { artOrders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;

    if (!orderNumber) {
      return NextResponse.json(
        { error: "Необходимо указать номер заказа" },
        { status: 400 }
      );
    }

    const order = await db
      .select()
      .from(artOrders)
      .where(eq(artOrders.orderNumber, orderNumber))
      .limit(1);

    if (order.length === 0) {
      return NextResponse.json({ error: "Заказ не найден" }, { status: 404 });
    }

    return NextResponse.json(order[0]);
  } catch (error) {
    console.error("Error fetching order by number:", error);
    return NextResponse.json(
      { error: "Ошибка при получении заказа" },
      { status: 500 }
    );
  }
}
