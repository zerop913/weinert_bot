import { Metadata } from "next";
import ServicesSection from "@/components/ServicesSection";
import PageLayout from "@/components/PageLayout";

export const metadata: Metadata = {
  title: "Услуги - Weinert",
  description:
    "Профессиональные услуги по созданию цифрового искусства: портреты, иллюстрации, дизайн персонажей. Основные и дополнительные услуги с прозрачным ценообразованием.",
  keywords:
    "услуги художника, цифровое искусство, портреты на заказ, иллюстрации, дизайн персонажей, арт комиссии",
};

export default function ServicesPage() {
  return (
    <PageLayout>
      <ServicesSection />
    </PageLayout>
  );
}
