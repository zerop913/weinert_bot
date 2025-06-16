/**
 * Описания команд для бота Telegram
 * Эти команды нужно установить через BotFather или API
 */

export const BOT_COMMANDS = [
  {
    command: "start",
    description: "🏠 Главное меню - начать работу с ботом",
  },
  {
    command: "help",
    description: "❓ Справка по командам и возможностям бота",
  },
  {
    command: "link",
    description: "🔗 Привязать заказ к аккаунту (пример: /link W-001)",
  },
  {
    command: "info",
    description: "ℹ️ Подробная информация о боте",
  },
  {
    command: "pricing",
    description: "💰 Информация о ценах на услуги",
  },
  {
    command: "status",
    description: "📊 Описание статусов заказов",
  },
  {
    command: "admin",
    description: "🔐 Админ-панель (только для администраторов)",
  },
];

/**
 * Функция для установки команд через API
 */
export async function setBotCommands(botToken: string): Promise<boolean> {
  try {
    const url = `https://api.telegram.org/bot${botToken}/setMyCommands`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        commands: BOT_COMMANDS,
      }),
    });

    const result = await response.json();

    if (result.ok) {
      console.log("✅ Команды бота успешно установлены");
      return true;
    } else {
      console.error("❌ Ошибка установки команд:", result);
      return false;
    }
  } catch (error) {
    console.error("❌ Ошибка при установке команд бота:", error);
    return false;
  }
}

/**
 * Функция для получения текущих команд
 */
export async function getBotCommands(botToken: string): Promise<any> {
  try {
    const url = `https://api.telegram.org/bot${botToken}/getMyCommands`;

    const response = await fetch(url);
    const result = await response.json();

    return result;
  } catch (error) {
    console.error("❌ Ошибка при получении команд бота:", error);
    return null;
  }
}
