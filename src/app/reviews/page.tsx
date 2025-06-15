import { Metadata } from "next";
import ReviewsSection from "@/components/ReviewsSection";
import PageLayout from "@/components/PageLayout";

export const metadata: Metadata = {
  title: "Отзывы клиентов - Weinert",
  description:
    "Реальные отзывы клиентов о работе с Weinert. Оценки качества работы, профессионализма и соблюдения сроков.",
  keywords:
    "отзывы клиентов, портфолио художника, оценки работ, рекомендации клиентов",
};

export default function ReviewsPage() {
  return (
    <PageLayout>
      <ReviewsSection />
    </PageLayout>
  );
}
