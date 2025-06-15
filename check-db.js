import { db } from "./src/lib/db/index.js";
import { services } from "./src/lib/db/schema.js";

async function testConnection() {
  try {
    console.log("🔍 Тестируем подключение к базе данных...");

    const result = await db.select().from(services).limit(1);

    console.log("✅ Подключение к базе данных успешно!");
    console.log("📊 Количество найденных услуг:", result.length);

    if (result.length > 0) {
      console.log("📝 Первая услуга:", result[0].title);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Ошибка подключения к базе данных:", error);
    process.exit(1);
  }
}

testConnection();
