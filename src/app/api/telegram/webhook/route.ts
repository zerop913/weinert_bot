import { NextRequest, NextResponse } from "next/server";
import { initializeBot, getBotInstance } from "@/bot/bot";
import { db } from "@/lib/db";
import { telegramUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!TELEGRAM_BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN не найден в переменных окружения");
}

// Инициализируем бота при первом запросе
let botInitialized = false;

// Функция для отправки сообщения в Telegram
async function sendMessage(chatId: number, text: string, replyMarkup?: any) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      reply_markup: replyMarkup,
    }),
  });
  return response.json();
}

// Функция для сохранения пользователя для уведомлений
async function saveUserForNotifications(
  telegramId?: number,
  username?: string,
  firstName?: string,
  lastName?: string
) {
  if (!telegramId) return;

  try {
    // Проверяем, есть ли уже такой пользователь
    const existingUser = await db
      .select()
      .from(telegramUsers)
      .where(eq(telegramUsers.telegramId, telegramId.toString()))
      .limit(1);

    if (existingUser.length === 0) {
      // Создаем нового пользователя
      await db.insert(telegramUsers).values({
        telegramId: telegramId.toString(),
        username: username || null,
        firstName: firstName || null,
        lastName: lastName || null,
      });
      console.log(`Сохранен новый пользователь: ${telegramId} (@${username})`);
    } else {
      // Обновляем существующего пользователя
      await db
        .update(telegramUsers)
        .set({
          username: username || null,
          firstName: firstName || null,
          lastName: lastName || null,
          updatedAt: new Date(),
        })
        .where(eq(telegramUsers.telegramId, telegramId.toString()));
      console.log(`Обновлен пользователь: ${telegramId} (@${username})`);
    }
  } catch (error) {
    console.error("Ошибка сохранения пользователя:", error);
  }
}

// Обработка webhook от Telegram
export async function POST(request: NextRequest) {
  try {
    // Инициализируем бота, если еще не сделали
    if (!botInitialized && TELEGRAM_BOT_TOKEN) {
      initializeBot(TELEGRAM_BOT_TOKEN);
      botInitialized = true;
    }

    const body = await request.json();

    console.log("Telegram webhook:", JSON.stringify(body, null, 2));

    if (body.message) {
      const message = body.message;
      const chatId = message.chat.id;
      const text = message.text;
      const user = message.from;

      // Логируем информацию о пользователе для отладки
      console.log(
        `User ID: ${user?.id}, Username: ${user?.username}, Chat ID: ${chatId}, Message: ${text}`
      );      // Обработка команды /start
      if (text === "/start") {
        const welcomeMessage =
          "Приветствую, меня зовут Лина (´｡• ᵕ •｡`) ♡\n\nЯ диджитал художница, рисующая в около-реализме уже несколько лет. Рада приветствовать в своем творческом уголке. 💓\n\nЧтобы оформить заказ и узнать больше о моих работах, нажмите кнопку ниже:";

        const keyboard = {
          inline_keyboard: [
            [
              {
                text: "🎨 Открыть портфолио",
                web_app: {
                  url:
                    process.env.NEXT_PUBLIC_APP_URL ||
                    "https://your-project.vercel.app",
                },
              },
            ],
            [
              {
                text: "📝 Заказать арт",
                web_app: {
                  url: `${
                    process.env.NEXT_PUBLIC_APP_URL ||
                    "https://your-project.vercel.app"
                  }/order`,
                },
              },
            ],
          ],
        };

        await sendMessage(chatId, welcomeMessage, keyboard);
        
        // Сохраняем пользователя для возможных уведомлений
        await saveUserForNotifications(user?.id, user?.username, user?.first_name, user?.last_name);
      }
      // Обработка команды /myid - для получения ID пользователя
      else if (text === "/myid") {
        const message = `🆔 Ваши данные:\n\n• ID: <code>${user?.id}</code>\n• Username: ${user?.username ? `@${user?.username}` : 'не указан'}\n• Имя: ${user?.first_name}${user?.last_name ? ` ${user?.last_name}` : ''}`;
        await sendMessage(chatId, message);
      }// Обработка команды /admin
      else if (text === "/admin") {
        const userId = user?.id;

        if (!userId) {
          await sendMessage(chatId, "❌ Ошибка авторизации");
          return NextResponse.json({ ok: true });
        }

        // Проверяем права администратора
        const adminIdsStr = process.env.ADMIN_TELEGRAM_IDS || "1109961645";
        const ADMIN_IDS = adminIdsStr
          .split(",")
          .map((id) => parseInt(id.trim()));
        const isAdmin = ADMIN_IDS.includes(userId);

        if (!isAdmin) {
          await sendMessage(chatId, "❌ У вас нет прав доступа к админ-панели");
          return NextResponse.json({ ok: true });
        }

        // Отправляем приветствие администратора с кнопкой для перехода в админку
        const adminKeyboard = {
          inline_keyboard: [
            [
              {
                text: "🔧 Перейти в админку",
                web_app: {
                  url: `${
                    process.env.NEXT_PUBLIC_APP_URL ||
                    "https://weinert-bot.vercel.app"
                  }/admin`,
                },
              },
            ],
          ],
        };

        await sendMessage(
          chatId,
          "🔐 Добро пожаловать в админ-панель!\n\nНажмите кнопку ниже, чтобы открыть панель управления заказами.",
          adminKeyboard
        );
      }
      // Обработка других команд
      else if (text === "/help") {
        const helpMessage =
          "🤖 Доступные команды:\n\n/start - Главное меню\n/help - Справка\n/admin - Админ-панель (только для администраторов)\n\nИли используйте кнопки ниже для быстрого доступа:";

        const keyboard = {
          inline_keyboard: [
            [
              {
                text: "📝 Заказать",
                web_app: {
                  url: `${
                    process.env.NEXT_PUBLIC_APP_URL ||
                    "https://weinert-bot.vercel.app"
                  }/order`,
                },
              },
            ],
          ],
        };

        await sendMessage(chatId, helpMessage, keyboard);
      } else {
        // Ответ на любое другое сообщение
        const defaultMessage =
          "Привет! 👋\n\nДля навигации используйте команду /start или /help";

        await sendMessage(chatId, defaultMessage);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Ошибка webhook:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// Для отладки - показываем информацию о боте
export async function GET() {
  try {
    if (!TELEGRAM_BOT_TOKEN) {
      return NextResponse.json(
        { error: "Токен бота не настроен" },
        { status: 500 }
      );
    }

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`;
    const response = await fetch(url);
    const botInfo = await response.json();

    return NextResponse.json({
      status: "Бот работает",
      bot: botInfo.result,
      webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/telegram/webhook`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
