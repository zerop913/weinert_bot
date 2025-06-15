import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Лина - Диджитал художница | Weinert",
  description:
    "Создаю красивые арты в около-реализме. Портреты, иллюстрации, персонажи. Заказ артов с быстрым выполнением.",
  keywords:
    "арт, комиссии, художник, портрет, иллюстрация, около-реализм, заказ арта",
  authors: [{ name: "Лина", url: "https://t.me/weinertt" }],
  openGraph: {
    title: "Лина - Диджитал художница",
    description:
      "Создаю красивые арты в около-реализме. Заказать арт быстро и качественно.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="m-0 p-0">
      <body
        className="font-inter antialiased m-0 p-0"
        style={{
          fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        }}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
