import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reviews } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const reviewsList = await db
      .select()
      .from(reviews)
      .where(eq(reviews.isVisible, true))
      .orderBy(desc(reviews.createdAt));

    return NextResponse.json(reviewsList);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Ошибка при получении отзывов" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newReview = await db
      .insert(reviews)
      .values({
        author: body.author,
        platform: body.platform,
        content: body.content,
        rating: body.rating || 5,
        isVisible: body.isVisible !== undefined ? body.isVisible : true,
      })
      .returning();

    return NextResponse.json(newReview[0], { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Ошибка при создании отзыва" },
      { status: 500 }
    );
  }
}
