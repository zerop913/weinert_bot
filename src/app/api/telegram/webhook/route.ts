import { NextRequest, NextResponse } from "next/server";
import { initializeBot, getBotInstance } from "@/bot/bot";

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

      // Обработка команды /start
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
      }
      // Обработка команды /admin
      else if (text === "/admin") {
        const bot = getBotInstance();
        if (bot) {
          // Используем метод бота для обработки админ-команды
          const userId = user?.id;
          if (userId) {
            // Создаем фиктивное сообщение для обработки
            const adminMessage = {
              chat: { id: chatId },
              from: { id: userId },
              text: "/admin",
            };

            // Здесь можно добавить вызов обработчика админ-команды
            // Пока просто отправляем базовый ответ
            await sendMessage(chatId, "Обработка команды /admin...");
          }
        }
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
