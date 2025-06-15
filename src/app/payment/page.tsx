import { Metadata } from "next";
import PaymentSection from "@/components/PaymentSection";
import PageLayout from "@/components/PageLayout";

export const metadata: Metadata = {
  title: "Оплата услуг - Weinert",
  description:
    "Удобные способы оплаты для заказа цифрового искусства: банковские карты, СБП, PayPal, криптовалюта. Информация о процессе оплаты и условиях.",
  keywords:
    "оплата услуг художника, способы оплаты, банковские карты, PayPal, криптовалюта, предоплата",
};

export default function PaymentPage() {
  return (
    <PageLayout>
      <PaymentSection />
    </PageLayout>
  );
}
