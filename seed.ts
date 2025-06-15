import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
  reviews,
  faqs,
  services,
  socialLinks,
  settings,
} from "./src/lib/db/schema";

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres:root@localhost:5432/weinert_bot",
});

const db = drizzle(pool);

async function seedDatabase() {
  try {
    console.log("🌱 Начинаем заполнение базы данных...");

    console.log("🗑️ Очистка существующих данных...");

    // Очистка таблиц
    await db.delete(reviews);
    await db.delete(faqs);
    await db.delete(services);
    await db.delete(socialLinks);
    await db.delete(settings);

    console.log("💬 Добавление отзывов...");

    // Добавление отзывов
    await db.insert(reviews).values([
      {
        author: "Бавунти Кадри",
        platform: "ВКонтакте",
        content:
          "Итак, я увидел стиль этого художника и его подход к работе и сразу же влюбился. По общению художник просто идеален, я поговорил как будто с другом, то есть было максимально комфортно!! И на протяжении всей работы я был доволен. Этапы скетчей-были, этап покраса-был. Я получил большой кайф работая с этим человеком блин берите коммышки у неё, я в шоке как она изобразила этого мальчика таким живым.. Я очень доволен работой, и это моя не последняя коммышка..",
        rating: 5,
        isVisible: true,
      },
      {
        author: "Алина Плотникова",
        platform: "ВКонтакте",
        content:
          "Я не многословный человек, но круто классно супер, рекомендую",
        rating: 5,
        isVisible: true,
      },
      {
        author: "Рита",
        platform: "Авито",
        content:
          "Обращалась к Ульяне по созданию арта по фотографии. Мне все очень понравилось. Все было готово за два дня и именно так как я и хотела. Спасибо большое автору за работу🌷 Однозначно рекомендую мастера!",
        rating: 5,
        isVisible: true,
      },
    ]);

    console.log("❓ Добавление FAQ...");

    // Добавление FAQ
    await db.insert(faqs).values([
      {
        question: "В каких стилях вы работаете?",
        answer:
          "Работаю я в около-реализме, также рисую в чиби стиле, с которым можно ознакомиться в моем портфолио.",
        order: 1,
        isVisible: true,
      },
      {
        question: "Могу ли я заказать арт по фотографии?",
        answer:
          "У меня есть небольшой опыт в рисовании стадиков(артов по фотографиям), поэтому да, можно заказать арт по фотографии.",
        order: 2,
        isVisible: true,
      },
      {
        question: "Могу ли я получить процесс создания арта?",
        answer:
          "Если речь идет о видео с процессом работы, то нет. Я не записываю процесс, но всегда готова кинуть слои работы или файлом psd.",
        order: 3,
        isVisible: true,
      },
      {
        question: "Предоставляете ли вы скидки на заказы?",
        answer:
          "Да, но предоставляю я скидки на заказы в праздничные дни, по своему желанию. Могу предоставлять скидки на арты своим постоянным заказчикам.",
        order: 4,
        isVisible: true,
      },
      {
        question: "Могу ли я использовать готовый арт в коммерческих целях?",
        answer:
          "В целом, да, но подобное подробно уже должно обсуждаться лично.",
        order: 5,
        isVisible: true,
      },
      {
        question: "Как быстро отвечаете на заявки?",
        answer:
          "Все зависит от загруженности, но как правило, в течении 15 минут.",
        order: 6,
        isVisible: true,
      },
      {
        question: "Как долго занимает создание арта?",
        answer:
          "Все индивидуально. Зависит от сложности арта и загруженности. Но, обычно, один арт занимает около 7-14 дней.",
        order: 7,
        isVisible: true,
      },
    ]);

    console.log("🎨 Добавление услуг...");

    // Добавление основных услуг
    await db.insert(services).values([
      {
        title: "Портрет",
        price: "3 000 ₽",
        description: "Портрет персонажа",
        category: "main",
        order: 1,
        isVisible: true,
      },
      {
        title: "Арт по пояс",
        price: "6 000 ₽",
        description: "Изображение персонажа по пояс",
        category: "main",
        order: 2,
        isVisible: true,
      },
      {
        title: "Арт в полный рост",
        price: "12 000 ₽",
        description: "Полноростовое изображение персонажа",
        category: "main",
        order: 3,
        isVisible: true,
      },
      {
        title: "Чиби",
        price: "1 500 ₽",
        description: "Милый арт в стиле чиби",
        category: "main",
        order: 4,
        isVisible: true,
      },
      // Дополнительные услуги
      {
        title: "2 персонажа на арте",
        price: "+100%",
        description: "Добавление второго персонажа",
        category: "additional",
        order: 1,
        isVisible: true,
      },
      {
        title: "Сложный фон",
        price: "2 000 ₽",
        description: "Детализированный фон",
        category: "additional",
        order: 2,
        isVisible: true,
      },
      {
        title: "Легкий фон",
        price: "500 ₽",
        description: "Простой фон или паттерн",
        category: "additional",
        order: 3,
        isVisible: true,
      },
      {
        title: "Заливка / легкая геометрия",
        price: "Бесплатно",
        description: "Простая заливка или геометрические фигуры",
        category: "additional",
        order: 4,
        isVisible: true,
      },
      {
        title: "Правки после завершения арта",
        price: "500 ₽",
        description: "Изменения в готовой работе",
        category: "additional",
        order: 5,
        isVisible: true,
      },
      {
        title: "Правки на этапе скетча",
        price: "Бесплатно",
        description: "Изменения на стадии наброска",
        category: "additional",
        order: 6,
        isVisible: true,
      },
    ]);

    console.log("📱 Добавление социальных сетей...");

    // Добавление социальных сетей
    await db.insert(socialLinks).values([
      {
        name: "ВКонтакте",
        url: "https://vk.com/weinertt",
        icon: "FaVk",
        order: 1,
        isVisible: true,
      },
      {
        name: "TikTok",
        url: "https://www.tiktok.com/@lina_tourmaline?_t=ZS-8xCi0MGMw6R&_r=1",
        icon: "FaTiktok",
        order: 2,
        isVisible: true,
      },
      {
        name: "Twitter (X)",
        url: "https://x.com/linacrystalll",
        icon: "FaTwitter",
        order: 3,
        isVisible: true,
      },
      {
        name: "Telegram",
        url: "https://t.me/weinertt",
        icon: "FaTelegram",
        order: 4,
        isVisible: true,
      },
    ]);

    console.log("⚙️ Добавление настроек...");

    // Добавление настроек
    await db.insert(settings).values([
      {
        key: "welcome_title",
        value: "Приветствую, меня зовут Лина (´｡• ᵕ •｡`) ♡",
        description: "Заголовок приветствия",
      },
      {
        key: "welcome_description",
        value:
          "Я диджитал художница, рисующая в около-реализме уже несколько лет. Рада приветствовать в своем творческом уголке. 💓",
        description: "Описание в секции приветствия",
      },
      {
        key: "services_description",
        value:
          "Я специализируюсь на рисовании портретов, иллюстраций и персонажей в около-реализме. Есть большой опыт в создании растровых изображений.",
        description: "Описание услуг",
      },
      {
        key: "contact_telegram",
        value: "@weinertt",
        description: "Телеграм для связи",
      },
      {
        key: "payment_info",
        value:
          "После согласования всех деталей заказа я предоставлю реквизиты для оплаты.",
        description: "Информация об оплате",
      },
    ]);

    console.log("✅ База данных успешно заполнена!");

    // Статистика
    const reviewsCount = await db.select().from(reviews);
    const faqsCount = await db.select().from(faqs);
    const servicesCount = await db.select().from(services);
    const socialLinksCount = await db.select().from(socialLinks);
    const settingsCount = await db.select().from(settings);

    console.log(`📊 Статистика:
    📝 Отзывы: ${reviewsCount.length}
    ❓ FAQ: ${faqsCount.length}
    🎨 Услуги: ${servicesCount.length}
    📱 Социальные сети: ${socialLinksCount.length}
    ⚙️ Настройки: ${settingsCount.length}`);
  } catch (error) {
    console.error("❌ Ошибка при заполнении базы данных:", error);
    process.exit(1);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

seedDatabase();
