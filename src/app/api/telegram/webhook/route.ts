import { NextRequest, NextResponse } from "next/server";
import { initializeBot, getBotInstance } from "@/bot/bot";
import { BOT_CONFIG, BOT_MESSAGES } from "@/bot/config";
import { db } from "@/lib/db";
import { telegramUsers, artOrders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!TELEGRAM_BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN не найден в переменных окружения");
}

// Инициализируем бота при первом запросе
let botInitialized = false;

// Хранилище для отслеживания последних сообщений от бота для каждого пользователя
// Это позволяет редактировать сообщения вместо отправки новых, избегая спама в чате
const userLastMessages = new Map<number, number>(); // chatId -> messageId

/**
 * Функция для отправки сообщения в Telegram
 * Автоматически сохраняет ID сообщения для будущего редактирования
 */
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

  const result = await response.json();

  // Сохраняем ID отправленного сообщения для будущего редактирования
  if (result.ok && result.result && result.result.message_id) {
    userLastMessages.set(chatId, result.result.message_id);
  }

  return result;
}

// Функция для редактирования сообщения в Telegram
async function editMessage(
  chatId: number,
  messageId: number,
  text: string,
  replyMarkup?: any
) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/editMessageText`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: "HTML",
      reply_markup: replyMarkup,
    }),
  });

  const result = await response.json();
  return result;
}

// Функция для отправки или редактирования сообщения (умная функция)
async function sendOrEditMessage(
  chatId: number,
  text: string,
  replyMarkup?: any
) {
  const lastMessageId = userLastMessages.get(chatId);

  if (lastMessageId) {
    // Пытаемся отредактировать существующее сообщение
    try {
      const result = await editMessage(
        chatId,
        lastMessageId,
        text,
        replyMarkup
      );
      if (result.ok) {
        return result;
      }
      // Если редактирование не удалось, отправляем новое сообщение
      console.log(
        `Failed to edit message ${lastMessageId}, sending new message`
      );
    } catch (error) {
      console.error("Error editing message:", error);
    }
  }

  // Отправляем новое сообщение
  return await sendMessage(chatId, text, replyMarkup);
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
      ); // Обработка команды /start
      if (text === "/start") {
        const keyboard = {
          inline_keyboard: [
            [
              {
                text: "🎨 Открыть портфолио",
                web_app: {
                  url:
                    process.env.NEXT_PUBLIC_APP_URL ||
                    "https://weinert-bot.vercel.app",
                },
              },
            ],
            [
              {
                text: "📝 Заказать арт",
                web_app: {
                  url: `${
                    process.env.NEXT_PUBLIC_APP_URL ||
                    "https://weinert-bot.vercel.app"
                  }/order`,
                },
              },
            ],
            [
              {
                text: "❓ Помощь",
                callback_data: "help",
              },
              {
                text: "💰 Цены",
                callback_data: "pricing",
              },
            ],
            [
              {
                text: "📊 Статусы",
                callback_data: "status",
              },
              {
                text: "ℹ️ О боте",
                callback_data: "info",
              },
            ],
          ],
        };

        await sendOrEditMessage(chatId, BOT_MESSAGES.WELCOME, keyboard);

        // Сохраняем пользователя для возможных уведомлений
        await saveUserForNotifications(
          user?.id,
          user?.username,
          user?.first_name,
          user?.last_name
        );
      }
      // Обработка команды /link для связывания с заказом
      else if (text.startsWith("/link ")) {
        const orderNumber = text.replace("/link ", "").trim();
        if (!orderNumber) {
          await sendOrEditMessage(
            chatId,
            "❌ Укажите номер заказа.\nПример: /link W-001"
          );
          return NextResponse.json({ ok: true });
        }

        try {
          // Ищем заказ в базе данных
          const orders = await db
            .select()
            .from(artOrders)
            .where(eq(artOrders.orderNumber, orderNumber))
            .limit(1);
          if (orders.length === 0) {
            await sendOrEditMessage(
              chatId,
              `❌ Заказ с номером ${orderNumber} не найден.`
            );
            return NextResponse.json({ ok: true });
          }

          // Обновляем заказ с ID пользователя
          await db
            .update(artOrders)
            .set({
              telegramUserId: user?.id.toString(),
              telegramUsername: user?.username || null,
            })
            .where(eq(artOrders.orderNumber, orderNumber));
          await sendOrEditMessage(
            chatId,
            `✅ Заказ ${orderNumber} успешно привязан к вашему аккаунту!\n\nТеперь вы будете получать уведомления о статусе заказа.`
          );

          // Отправляем тестовое уведомление пользователю
          const bot = getBotInstance();
          if (bot) {
            await bot.notifyOrderCreated(user?.id.toString(), {
              orderNumber,
              serviceName: "Заказ WEINERT",
              price: orders[0].desiredPrice,
              deadline: orders[0].deadline,
            });
          }

          console.log(
            `Заказ ${orderNumber} привязан к пользователю ${user?.id} (@${user?.username})`
          );
        } catch (error) {
          console.error("Ошибка привязки заказа:", error);
          await sendOrEditMessage(
            chatId,
            "❌ Произошла ошибка при привязке заказа. Попробуйте позже."
          );
        }
      } // Обработка команды /admin
      else if (text === "/admin") {
        const userId = user?.id;
        if (!userId) {
          await sendOrEditMessage(chatId, "❌ Ошибка авторизации");
          return NextResponse.json({ ok: true });
        }

        // Проверяем права администратора
        const adminIdsStr = process.env.ADMIN_TELEGRAM_IDS || "1109961645";
        const ADMIN_IDS = adminIdsStr
          .split(",")
          .map((id) => parseInt(id.trim()));
        const isAdmin = ADMIN_IDS.includes(userId);
        if (!isAdmin) {
          await sendOrEditMessage(
            chatId,
            "❌ У вас нет прав доступа к админ-панели"
          );
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
        await sendOrEditMessage(
          chatId,
          "🔐 Добро пожаловать в админ-панель!\n\nНажмите кнопку ниже, чтобы открыть панель управления заказами.",
          adminKeyboard
        );
      } // Обработка других команд
      else if (text === "/help") {
        const keyboard = {
          inline_keyboard: [
            [
              {
                text: "🔗 Как привязать заказ",
                callback_data: "link_help",
              },
            ],
            [
              {
                text: "📝 Заказать арт",
                web_app: {
                  url: `${
                    process.env.NEXT_PUBLIC_APP_URL ||
                    "https://weinert-bot.vercel.app"
                  }/order`,
                },
              },
            ],
            [
              {
                text: "🏠 Главное меню",
                callback_data: "start",
              },
            ],
          ],
        };

        await sendOrEditMessage(chatId, BOT_MESSAGES.HELP, keyboard);
      } // Новые команды
      else if (text === "/info") {
        await sendOrEditMessage(chatId, BOT_MESSAGES.BOT_INFO);
      } else if (text === "/pricing") {
        const keyboard = {
          inline_keyboard: [
            [
              {
                text: "📝 Заказать арт",
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
        await sendOrEditMessage(chatId, BOT_MESSAGES.PRICING_INFO, keyboard);
      } else if (text === "/status") {
        await sendOrEditMessage(chatId, BOT_MESSAGES.ORDER_STATUS_INFO);
      } else if (text.startsWith("/link_help")) {
        await sendOrEditMessage(chatId, BOT_MESSAGES.LINK_INSTRUCTIONS);
      } else {
        // Ответ на любое другое сообщение
        const keyboard = {
          inline_keyboard: [
            [
              {
                text: "🏠 Главное меню",
                callback_data: "start",
              },
              {
                text: "❓ Помощь",
                callback_data: "help",
              },
            ],
          ],
        };
        await sendOrEditMessage(chatId, BOT_MESSAGES.UNKNOWN_COMMAND, keyboard);
      }
    }

    // Обработка callback запросов (inline кнопки)
    if (body.callback_query) {
      const callbackQuery = body.callback_query;
      const chatId = callbackQuery.message.chat.id;
      const data = callbackQuery.data;
      const user = callbackQuery.from;

      // Подтверждаем получение callback
      const answerUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`;
      await fetch(answerUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callback_query_id: callbackQuery.id }),
      });

      // Обрабатываем различные callback данные
      switch (data) {
        case "help":
          const helpKeyboard = {
            inline_keyboard: [
              [
                {
                  text: "🔗 Как привязать заказ",
                  callback_data: "link_help",
                },
              ],
              [
                {
                  text: "📝 Заказать арт",
                  web_app: {
                    url: `${
                      process.env.NEXT_PUBLIC_APP_URL ||
                      "https://weinert-bot.vercel.app"
                    }/order`,
                  },
                },
              ],
              [
                {
                  text: "🏠 Главное меню",
                  callback_data: "start",
                },
              ],
            ],
          };
          await sendOrEditMessage(chatId, BOT_MESSAGES.HELP, helpKeyboard);
          break;

        case "pricing":
          const pricingKeyboard = {
            inline_keyboard: [
              [
                {
                  text: "📝 Заказать арт",
                  web_app: {
                    url: `${
                      process.env.NEXT_PUBLIC_APP_URL ||
                      "https://weinert-bot.vercel.app"
                    }/order`,
                  },
                },
              ],
              [
                {
                  text: "🏠 Главное меню",
                  callback_data: "start",
                },
              ],
            ],
          };
          await sendOrEditMessage(
            chatId,
            BOT_MESSAGES.PRICING_INFO,
            pricingKeyboard
          );
          break;

        case "status":
          const statusKeyboard = {
            inline_keyboard: [
              [
                {
                  text: "🏠 Главное меню",
                  callback_data: "start",
                },
              ],
            ],
          };
          await sendOrEditMessage(
            chatId,
            BOT_MESSAGES.ORDER_STATUS_INFO,
            statusKeyboard
          );
          break;

        case "info":
          const infoKeyboard = {
            inline_keyboard: [
              [
                {
                  text: "🏠 Главное меню",
                  callback_data: "start",
                },
                {
                  text: "❓ Помощь",
                  callback_data: "help",
                },
              ],
            ],
          };
          await sendOrEditMessage(chatId, BOT_MESSAGES.BOT_INFO, infoKeyboard);
          break;

        case "link_help":
          const linkKeyboard = {
            inline_keyboard: [
              [
                {
                  text: "📝 Заказать арт",
                  web_app: {
                    url: `${
                      process.env.NEXT_PUBLIC_APP_URL ||
                      "https://weinert-bot.vercel.app"
                    }/order`,
                  },
                },
              ],
              [
                {
                  text: "🏠 Главное меню",
                  callback_data: "start",
                },
              ],
            ],
          };
          await sendOrEditMessage(
            chatId,
            BOT_MESSAGES.LINK_INSTRUCTIONS,
            linkKeyboard
          );
          break;

        case "start":
          const startKeyboard = {
            inline_keyboard: [
              [
                {
                  text: "🎨 Открыть портфолио",
                  web_app: {
                    url:
                      process.env.NEXT_PUBLIC_APP_URL ||
                      "https://weinert-bot.vercel.app",
                  },
                },
              ],
              [
                {
                  text: "📝 Заказать арт",
                  web_app: {
                    url: `${
                      process.env.NEXT_PUBLIC_APP_URL ||
                      "https://weinert-bot.vercel.app"
                    }/order`,
                  },
                },
              ],
              [
                {
                  text: "❓ Помощь",
                  callback_data: "help",
                },
                {
                  text: "💰 Цены",
                  callback_data: "pricing",
                },
              ],
              [
                {
                  text: "📊 Статусы",
                  callback_data: "status",
                },
                {
                  text: "ℹ️ О боте",
                  callback_data: "info",
                },
              ],
            ],
          };
          await sendOrEditMessage(chatId, BOT_MESSAGES.WELCOME, startKeyboard);
          break;
        default:
          await sendOrEditMessage(chatId, "❓ Неизвестная команда");
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
