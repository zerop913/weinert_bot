import { db } from "./src/lib/db/index.js";
import { artOrders } from "./src/lib/db/schema.js";

async function testDatabase() {
  try {
    console.log("🔍 Тестируем подключение к базе данных...");

    // Получаем все заказы
    const orders = await db.select().from(artOrders);
    console.log(`✅ Подключение успешно! Найдено заказов: ${orders.length}`);

    // Показываем схему первого заказа (если есть)
    if (orders.length > 0) {
      console.log("📋 Пример заказа:", {
        id: orders[0].id,
        orderNumber: orders[0].orderNumber,
        status: orders[0].status,
        name: orders[0].name,
        telegramUserId: orders[0].telegramUserId,
        adminComment: orders[0].adminComment,
      });
    }

    console.log("🎉 Тест завершен успешно!");
  } catch (error) {
    console.error("❌ Ошибка при тестировании:", error);
  } finally {
    process.exit(0);
  }
}

testDatabase();
