import { Metadata } from "next";
import OrderSection from "@/components/OrderSection";
import PageLayout from "@/components/PageLayout";

export const metadata: Metadata = {
  title: "Заказать арт - Weinert",
  description:
    "Форма заказа цифрового искусства. Расскажите о своем проекте и получите персональное предложение от профессионального артера.",
  keywords:
    "заказать арт, форма заказа, комиссии художника, персональный заказ, цифровое искусство на заказ",
};

export default function OrderPage() {
  return (
    <PageLayout>
      <OrderSection />
    </PageLayout>
  );
}
