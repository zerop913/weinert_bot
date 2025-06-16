/**
 * Генерирует уникальный номер заказа в формате AB12CD34
 */
export function generateOrderNumber(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";

  let result = "";

  // 2 буквы
  for (let i = 0; i < 2; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  // 2 цифры
  for (let i = 0; i < 2; i++) {
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  // 2 буквы
  for (let i = 0; i < 2; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  // 2 цифры
  for (let i = 0; i < 2; i++) {
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  return result;
}

/**
 * Форматирует дату для отображения
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Получает цвет статуса для UI
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case "новый":
      return "bg-blue-100 text-blue-800";
    case "в работе":
      return "bg-yellow-100 text-yellow-800";
    case "выполнен":
      return "bg-green-100 text-green-800";
    case "отменен":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

/**
 * Получает иконку статуса
 */
export function getStatusIcon(status: string): string {
  switch (status) {
    case "новый":
      return "🆕";
    case "в работе":
      return "⏳";
    case "выполнен":
      return "✅";
    case "отменен":
      return "❌";
    default:
      return "📋";
  }
}
