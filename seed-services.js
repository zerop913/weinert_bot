import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { services } from "./src/lib/db/schema.js";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:root@localhost:5432/weinert_bot";
const client = postgres(connectionString);
const db = drizzle(client);

const demoServices = [
  // Основные услуги
  {
    title: "Портрет персонажа",
    price: "от 3000₽",
    description:
      "Детализированный портрет вашего персонажа с проработкой черт лица, эмоций и стиля. Включает 2-3 варианта композиции на выбор.",
    category: "main",
    order: 1,
    isVisible: true,
  },
  {
    title: "Фулл-боди иллюстрация",
    price: "от 5000₽",
    description:
      "Полноростовая иллюстрация персонажа с детальной проработкой костюма, позы и окружения. Идеально для концепт-артов и презентаций.",
    category: "main",
    order: 2,
    isVisible: true,
  },
  {
    title: "Дизайн персонажа",
    price: "от 7000₽",
    description:
      "Полная разработка дизайна персонажа: концепт, цветовая схема, вариации костюмов и аксессуаров. Включает референс-лист.",
    category: "main",
    order: 3,
    isVisible: true,
  },
  {
    title: "Концепт-арт окружения",
    price: "от 6000₽",
    description:
      "Создание атмосферных локаций и окружений для ваших проектов. Проработка освещения, композиции и настроения сцены.",
    category: "main",
    order: 4,
    isVisible: true,
  },
  {
    title: "Иллюстрация с несколькими персонажами",
    price: "от 8000₽",
    description:
      "Сложная композиция с 2-4 персонажами. Проработка взаимодействия, динамики и общего настроения сцены.",
    category: "main",
    order: 5,
    isVisible: true,
  },

  // Дополнительные услуги
  {
    title: "Дополнительные варианты",
    price: "+1000₽",
    description:
      "Создание альтернативных вариантов основной иллюстрации: другие позы, эмоции или цветовые схемы.",
    category: "additional",
    order: 1,
    isVisible: true,
  },
  {
    title: "Анимированная аватарка",
    price: "от 2000₽",
    description:
      "Простая анимация для социальных сетей: моргание, движение волос или дыхание персонажа.",
    category: "additional",
    order: 2,
    isVisible: true,
  },
  {
    title: "Детализированный фон",
    price: "+2000₽",
    description:
      "Добавление сложного детализированного фона к основной иллюстрации с проработкой всех элементов.",
    category: "additional",
    order: 3,
    isVisible: true,
  },
  {
    title: "Экспресс-заказ",
    price: "+50%",
    description:
      "Ускоренное выполнение заказа в течение 1-3 дней вместо стандартных сроков.",
    category: "additional",
    order: 4,
    isVisible: true,
  },
  {
    title: "Файлы в высоком разрешении",
    price: "+500₽",
    description:
      "Предоставление исходных файлов в разрешении 4K+ и дополнительных форматах для печати.",
    category: "additional",
    order: 5,
    isVisible: true,
  },
  {
    title: "Поэтапная демонстрация",
    price: "+800₽",
    description:
      "Детальное видео или фото-отчет процесса создания работы от эскиза до финального результата.",
    category: "additional",
    order: 6,
    isVisible: true,
  },
];

async function seedServices() {
  try {
    console.log("🌱 Начинаем добавление демонстрационных услуг...");

    // Очищаем существующие услуги
    // await db.delete(services);

    // Добавляем демонстрационные услуги
    for (const service of demoServices) {
      await db.insert(services).values(service);
      console.log(`✅ Добавлена услуга: ${service.title}`);
    }

    console.log("🎉 Демонстрационные услуги успешно добавлены!");
  } catch (error) {
    console.error("❌ Ошибка при добавлении услуг:", error);
  } finally {
    await client.end();
  }
}

seedServices();
