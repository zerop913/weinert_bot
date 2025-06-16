/**
 * Конфигурация бота
 */
export const BOT_CONFIG = {
  // ID администраторов
  ADMIN_IDS: [1109961645] as const satisfies readonly number[],

  // Сообщения
  MESSAGES: {
    ADMIN_WELCOME: "🔐 Добро пожаловать в админ-панель!",
    UNAUTHORIZED: "❌ У вас нет прав доступа к админ-панели",
    ORDER_CREATED_CLIENT: "✅ Заказ успешно оформлен!",
    ORDER_CANCELLED_CLIENT: "❌ Ваш заказ {orderNumber} отменен",
    NEW_ORDER_ADMIN: "🆕 Новый заказ!",
  },

  // URL веб-приложения
  WEB_APP_URL: process.env.NEXT_PUBLIC_WEBAPP_URL || "https://your-domain.com",
} as const;

/**
 * Проверяет, является ли пользователь администратором
 */
export function isAdmin(userId: number): boolean {
  return (BOT_CONFIG.ADMIN_IDS as readonly number[]).includes(userId);
}

/**
 * Логирует действие администратора
 */
export function logAdminAction(
  userId: number,
  action: string,
  details?: any
): void {
  const timestamp = new Date().toISOString();
  console.log(
    `[ADMIN LOG] ${timestamp} | User: ${userId} | Action: ${action}`,
    details
  );
}
