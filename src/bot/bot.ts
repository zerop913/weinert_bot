import { BOT_CONFIG, BOT_MESSAGES, isAdmin, logAdminAction } from "./config";

// Проверяем, что мы на сервере
const isServer = typeof window === "undefined";

// Импортируем TelegramBot только на сервере
let TelegramBot: any = null;
if (isServer) {
  TelegramBot = require("node-telegram-bot-api");
}

export class WeinertBot {
  private bot: any;
  private userLastMessages = new Map<number, number>(); // chatId -> messageId

  constructor(token: string) {
    if (!isServer || !TelegramBot) {
      throw new Error("WeinertBot can only be initialized on the server");
    }

    // В продакшене отключаем polling и webhook для отправки сообщений
    // Webhook обрабатывается отдельно в API route
    const isProduction = process.env.NODE_ENV === "production";
    this.bot = new TelegramBot(token, {
      polling: !isProduction, // polling только в development
      webHook: false, // отключаем webhook, он обрабатывается отдельно
    });

    if (!isProduction) {
      // Настраиваем обработчики только для локальной разработки с polling
      this.setupHandlers();
      console.log("🤖 Telegram bot started with polling (development mode)");
    } else {
      console.log(
        "🤖 Telegram bot initialized for message sending (production mode)"
      );
    }
  }
  private setupHandlers(): void {
    // Команда /admin
    this.bot.onText(/\/admin/, async (msg: any) => {
      const chatId = msg.chat.id;
      const userId = msg.from?.id;
      if (!userId || !isAdmin(userId)) {
        await this.sendOrEditMessage(chatId, BOT_MESSAGES.UNAUTHORIZED);
        return;
      }

      logAdminAction(userId, "ACCESS_ADMIN_PANEL", { chatId });

      const keyboard = {
        inline_keyboard: [
          [
            {
              text: "🔧 Перейти в админку",
              web_app: { url: `${BOT_CONFIG.WEB_APP_URL}/admin` },
            },
          ],
        ],
      };

      await this.sendOrEditMessage(chatId, BOT_MESSAGES.ADMIN_WELCOME, {
        reply_markup: keyboard,
      });
    });

    // Обработка ошибок
    this.bot.on("polling_error", (error: any) => {
      console.error("Polling error:", error);
    });
  }
  /**
   * Отправляет уведомление клиенту о создании заказа
   */
  async notifyOrderCreated(
    telegramUserId: string,
    orderData: {
      orderNumber: string;
      serviceName: string;
      price: string;
      deadline: string;
    }
  ): Promise<void> {
    try {
      const chatId = parseInt(telegramUserId);
      const message = `${BOT_MESSAGES.ORDER_CREATED_CLIENT}

📋 Детали заказа:
• Номер: ${orderData.orderNumber}
• Услуга: ${orderData.serviceName}
• Цена: ${orderData.price}
• Дедлайн: ${orderData.deadline}

⏳ Ожидайте ответа администратора.`;

      await this.sendOrEditMessage(chatId, message);
    } catch (error) {
      console.error("Error sending order created notification:", error);
    }
  }
  /**
   * Отправляет уведомление клиенту об отмене заказа
   */
  async notifyOrderCancelled(
    telegramUserId: string,
    orderNumber: string,
    adminComment?: string
  ): Promise<void> {
    try {
      const chatId = parseInt(telegramUserId);
      let message = BOT_MESSAGES.ORDER_CANCELLED_CLIENT.replace(
        "{orderNumber}",
        orderNumber
      );

      if (adminComment) {
        message += `\n\n📝 Комментарий администратора:\n${adminComment}`;
      }

      await this.sendOrEditMessage(chatId, message);
    } catch (error) {
      console.error("Error sending order cancelled notification:", error);
    }
  }
  /**
   * Отправляет уведомление админам о новом заказе
   */
  async notifyAdminsNewOrder(orderData: {
    orderNumber: string;
    clientName: string;
    idea: string;
    price: string;
    deadline: string;
    telegramUserId?: string;
    telegramUsername?: string;
  }): Promise<void> {
    try {
      // Формируем информацию о пользователе
      let userInfo = `👤 Клиент: ${orderData.clientName}`;

      if (orderData.telegramUsername) {
        userInfo += ` (@${orderData.telegramUsername})`;
      } else if (orderData.telegramUserId) {
        userInfo += ` (ID: ${orderData.telegramUserId})`;
      }
      const message = `${BOT_MESSAGES.NEW_ORDER_ADMIN}

${userInfo}
💡 Идея: ${orderData.idea.substring(0, 100)}${
        orderData.idea.length > 100 ? "..." : ""
      }
💰 Цена: ${orderData.price}
📅 Дедлайн: ${orderData.deadline}
🔢 Номер: ${orderData.orderNumber}`;

      const keyboard = {
        inline_keyboard: [
          [
            {
              text: "🔧 Открыть в админке",
              web_app: { url: `${BOT_CONFIG.WEB_APP_URL}/admin` },
            },
          ],
        ],
      }; // Отправляем уведомление всем админам
      for (const adminId of BOT_CONFIG.ADMIN_IDS) {
        await this.sendOrEditMessage(adminId, message, {
          reply_markup: keyboard,
        });
      }
    } catch (error) {
      console.error("Error sending new order notification to admins:", error);
    }
  }
  /**
   * Отправляет сообщение в чат
   */
  async sendMessage(
    chatId: number,
    message: string,
    options?: any
  ): Promise<any> {
    try {
      const result = await this.bot.sendMessage(chatId, message, options);

      // Сохраняем ID отправленного сообщения для будущего редактирования
      if (result && result.message_id) {
        this.userLastMessages.set(chatId, result.message_id);
      }

      return result;
    } catch (error) {
      console.error("Error sending message:", error);
      return null;
    }
  }

  /**
   * Редактирует сообщение в чате
   */
  async editMessage(
    chatId: number,
    messageId: number,
    message: string,
    options?: any
  ): Promise<any> {
    try {
      return await this.bot.editMessageText(message, {
        chat_id: chatId,
        message_id: messageId,
        ...options,
      });
    } catch (error) {
      console.error("Error editing message:", error);
      return null;
    }
  }

  /**
   * Отправляет или редактирует сообщение (умная функция)
   */
  async sendOrEditMessage(
    chatId: number,
    message: string,
    options?: any
  ): Promise<any> {
    const lastMessageId = this.userLastMessages.get(chatId);

    if (lastMessageId) {
      // Пытаемся отредактировать существующее сообщение
      const editResult = await this.editMessage(
        chatId,
        lastMessageId,
        message,
        options
      );
      if (editResult) {
        return editResult;
      }
      // Если редактирование не удалось, отправляем новое сообщение
      console.log(
        `Failed to edit message ${lastMessageId} for chat ${chatId}, sending new message`
      );
    }

    // Отправляем новое сообщение
    return await this.sendMessage(chatId, message, options);
  }

  /**
   * Отправляет уведомление клиенту об изменении статуса заказа
   */
  async notifyOrderStatusUpdated(
    telegramUserId: string,
    orderNumber: string,
    status: string
  ): Promise<void> {
    try {
      const chatId = parseInt(telegramUserId);
      const message = BOT_MESSAGES.ORDER_STATUS_UPDATED.replace(
        "{orderNumber}",
        orderNumber
      ).replace("{status}", status);

      await this.sendOrEditMessage(chatId, message);
    } catch (error) {
      console.error("Error sending order status update notification:", error);
    }
  }

  /**
   * Отправляет уведомление клиенту о том, что заказ взят в работу
   */
  async notifyOrderInProgress(
    telegramUserId: string,
    orderNumber: string
  ): Promise<void> {
    try {
      const chatId = parseInt(telegramUserId);
      const message = BOT_MESSAGES.ORDER_IN_PROGRESS.replace(
        "{orderNumber}",
        orderNumber
      );

      await this.sendOrEditMessage(chatId, message);
    } catch (error) {
      console.error("Error sending order in progress notification:", error);
    }
  }

  /**
   * Отправляет уведомление клиенту о готовности заказа
   */
  async notifyOrderCompleted(
    telegramUserId: string,
    orderNumber: string
  ): Promise<void> {
    try {
      const chatId = parseInt(telegramUserId);
      const message = BOT_MESSAGES.ORDER_COMPLETED.replace(
        "{orderNumber}",
        orderNumber
      );

      await this.sendOrEditMessage(chatId, message);
    } catch (error) {
      console.error("Error sending order completed notification:", error);
    }
  }
}

// Singleton экземпляр бота
let botInstance: WeinertBot | null = null;

export function getBotInstance(): WeinertBot | null {
  return botInstance;
}

export function initializeBot(token: string): WeinertBot {
  if (!botInstance) {
    botInstance = new WeinertBot(token);
  }
  return botInstance;
}

// Автоматическая инициализация в development режиме (только на сервере)
if (
  isServer &&
  process.env.NODE_ENV === "development" &&
  process.env.TELEGRAM_BOT_TOKEN
) {
  try {
    initializeBot(process.env.TELEGRAM_BOT_TOKEN);
    console.log("🚀 Bot auto-initialized for development");
  } catch (error) {
    console.error("❌ Failed to auto-initialize bot:", error);
  }
}
