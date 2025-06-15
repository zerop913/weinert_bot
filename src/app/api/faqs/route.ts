import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { faqs } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const faqsList = await db
      .select()
      .from(faqs)
      .where(eq(faqs.isVisible, true))
      .orderBy(asc(faqs.order), asc(faqs.createdAt));

    return NextResponse.json(faqsList);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return NextResponse.json(
      { error: "Ошибка при получении FAQ" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newFaq = await db
      .insert(faqs)
      .values({
        question: body.question,
        answer: body.answer,
        order: body.order || 0,
        isVisible: body.isVisible !== undefined ? body.isVisible : true,
      })
      .returning();

    return NextResponse.json(newFaq[0], { status: 201 });
  } catch (error) {
    console.error("Error creating FAQ:", error);
    return NextResponse.json(
      { error: "Ошибка при создании FAQ" },
      { status: 500 }
    );
  }
}
