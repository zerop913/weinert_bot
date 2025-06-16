import { BOT_CONFIG, isAdmin, logAdminAction } from "./config";

// Проверяем, что мы на сервере
const isServer = typeof window === 'undefined';

// Импортируем TelegramBot только на сервере
let TelegramBot: any = null;
if (isServer) {
  TelegramBot = require("node-telegram-bot-api");
}

export class WeinertBot {
  private bot: any;

  constructor(token: string) {
    if (!isServer || !TelegramBot) {
      throw new Error("WeinertBot can only be initialized on the server");
    }

    // В продакшене используем webhook, в разработке - polling
    const isProduction = process.env.NODE_ENV === "production";
    this.bot = new TelegramBot(token, {
      polling: !isProduction, // polling только в development
      webHook: isProduction, // webhook только в production
    });

    if (!isProduction) {
      // Настраиваем обработчики только для локальной разработки с polling
      this.setupHandlers();
      console.log("🤖 Telegram bot started with polling (development mode)");
    } else {
      console.log("🤖 Telegram bot initialized for webhook (production mode)");
    }
  }
  private setupHandlers(): void {
    // Команда /admin
    this.bot.onText(/\/admin/, async (msg: any) => {
      const chatId = msg.chat.id;
      const userId = msg.from?.id;

      if (!userId || !isAdmin(userId)) {
        await this.bot.sendMessage(chatId, BOT_CONFIG.MESSAGES.UNAUTHORIZED);
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

      await this.bot.sendMessage(chatId, BOT_CONFIG.MESSAGES.ADMIN_WELCOME, {
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
      const message = `${BOT_CONFIG.MESSAGES.ORDER_CREATED_CLIENT}

📋 Детали заказа:
• Номер: ${orderData.orderNumber}
• Услуга: ${orderData.serviceName}
• Цена: ${orderData.price}
• Дедлайн: ${orderData.deadline}

⏳ Ожидайте ответа администратора.`;

      await this.bot.sendMessage(parseInt(telegramUserId), message);
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
      let message = BOT_CONFIG.MESSAGES.ORDER_CANCELLED_CLIENT.replace(
        "{orderNumber}",
        orderNumber
      );

      if (adminComment) {
        message += `\n\n📝 Комментарий администратора:\n${adminComment}`;
      }

      await this.bot.sendMessage(parseInt(telegramUserId), message);
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
  }): Promise<void> {
    try {
      const message = `${BOT_CONFIG.MESSAGES.NEW_ORDER_ADMIN}

👤 Клиент: ${orderData.clientName}
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
      };

      // Отправляем уведомление всем админам
      for (const adminId of BOT_CONFIG.ADMIN_IDS) {
        await this.bot.sendMessage(adminId, message, {
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
  ): Promise<void> {
    try {
      await this.bot.sendMessage(chatId, message, options);
    } catch (error) {
      console.error("Error sending message:", error);
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
if (isServer && process.env.NODE_ENV === "development" && process.env.TELEGRAM_BOT_TOKEN) {
  try {
    initializeBot(process.env.TELEGRAM_BOT_TOKEN);
    console.log("🚀 Bot auto-initialized for development");
  } catch (error) {
    console.error("❌ Failed to auto-initialize bot:", error);
  }
}
