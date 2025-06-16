import { motion } from "framer-motion";
import { useState } from "react";
import { ArtOrder, OrderStatus } from "@/types";
import { formatDate, getStatusColor, getStatusIcon } from "@/utils/orderUtils";

interface AdminOrderCardProps {
  order: ArtOrder;
  onStatusChange: (
    orderId: string,
    status: OrderStatus,
    comment?: string
  ) => void;
  onDeleteOrder: (orderId: string) => void;
}

export function AdminOrderCard({
  order,
  onStatusChange,
  onDeleteOrder,
}: AdminOrderCardProps) {
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
    order.status || "новый"
  );
  const [comment, setComment] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [showStatusChanger, setShowStatusChanger] = useState(false);

  const handleStatusChange = async () => {
    if (selectedStatus === "отменен" && !comment.trim()) {
      alert("При отмене заказа необходимо указать комментарий");
      return;
    }

    setIsChangingStatus(true);
    try {
      await onStatusChange(order.id!, selectedStatus, comment);
      setComment("");
      setShowStatusChanger(false);
    } finally {
      setIsChangingStatus(false);
    }
  };

  const statusOptions: OrderStatus[] = [
    "новый",
    "в работе",
    "выполнен",
    "отменен",
  ];

  const getStatusGradient = (status: string) => {
    switch (status) {
      case "новый":
        return "from-blue-500/20 to-blue-600/20 border-blue-500/30";
      case "в работе":
        return "from-yellow-500/20 to-orange-600/20 border-yellow-500/30";
      case "выполнен":
        return "from-green-500/20 to-emerald-600/20 border-green-500/30";
      case "отменен":
        return "from-red-500/20 to-red-600/20 border-red-500/30";
      default:
        return "from-gray-500/20 to-gray-600/20 border-gray-500/30";
    }
  };

  return (
    <motion.div
      layout
      className="glass-ultra p-6 hover-lift"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", damping: 20 }}
    >
      {/* Заголовок карточки */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">
            {getStatusIcon(order.status || "новый")} Заказ {order.orderNumber}
          </h3>
          <p className="text-sm text-gray-400">
            {order.createdAt && formatDate(order.createdAt)}
          </p>
        </div>
        <div
          className={`px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r ${getStatusGradient(
            order.status || "новый"
          )} border backdrop-blur-sm`}
        >
          {order.status}
        </div>
      </div>
      {/* Основная информация */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-400">👤 Клиент</p>
            <p className="text-white font-medium">{order.name}</p>
            {order.telegramUsername && (
              <p className="text-sm text-blue-400">@{order.telegramUsername}</p>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">💰 Цена</p>
            <p className="text-white font-medium">{order.desiredPrice}</p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-400">📅 Дедлайн</p>
            <p className="text-white font-medium">{order.deadline}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">👥 Персонажи</p>
            <p className="text-white font-medium">{order.charactersCount}</p>
          </div>
        </div>
      </div>
      {/* Краткое описание идеи */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-400 mb-2">💡 Идея</p>
        <p className="text-gray-300 line-clamp-2 bg-black/30 p-3 rounded-lg border border-gray-700/50">
          {order.idea}
        </p>
      </div>{" "}
      {/* Кнопки действий */}
      <div className="flex flex-wrap gap-3 mb-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowDetails(!showDetails)}
          className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 rounded-lg hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 backdrop-blur-sm"
        >
          {showDetails ? "🔼 Скрыть детали" : "🔽 Показать детали"}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowStatusChanger(!showStatusChanger)}
          className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-300 rounded-lg hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-300 backdrop-blur-sm"
        >
          ⚙️ Изменить статус
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDeleteOrder(order.id!)}
          className="px-4 py-2 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 text-red-300 rounded-lg hover:from-red-500/30 hover:to-red-600/30 transition-all duration-300 backdrop-blur-sm"
        >
          🗑️ Удалить заказ
        </motion.button>
      </div>
      {/* Детальная информация */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-gray-700/50 pt-4 space-y-4"
        >
          <div>
            <p className="text-sm font-medium text-gray-400 mb-2">
              📝 Полная идея
            </p>
            <p className="text-gray-300 whitespace-pre-wrap bg-black/30 p-4 rounded-lg border border-gray-700/50">
              {order.idea}
            </p>
          </div>

          {order.references && (
            <div>
              <p className="text-sm font-medium text-gray-400 mb-2">
                🖼️ Референсы
              </p>
              <p className="text-gray-300 whitespace-pre-wrap bg-black/30 p-4 rounded-lg border border-gray-700/50">
                {order.references}
              </p>
            </div>
          )}

          {order.additionalWishes && (
            <div>
              <p className="text-sm font-medium text-gray-400 mb-2">
                ✨ Дополнительные пожелания
              </p>
              <p className="text-gray-300 whitespace-pre-wrap bg-black/30 p-4 rounded-lg border border-gray-700/50">
                {order.additionalWishes}
              </p>
            </div>
          )}

          {order.contactInfo && (
            <div>
              <p className="text-sm font-medium text-gray-400 mb-2">
                📱 Контактная информация
              </p>
              <p className="text-gray-300 bg-black/30 p-4 rounded-lg border border-gray-700/50">
                {order.contactInfo}
              </p>
            </div>
          )}

          {order.adminComment && (
            <div>
              <p className="text-sm font-medium text-gray-400 mb-2">
                💬 Комментарий администратора
              </p>
              <p className="text-gray-300 whitespace-pre-wrap bg-red-500/10 p-4 rounded-lg border border-red-500/30">
                {order.adminComment}
              </p>
            </div>
          )}          {order.telegramUserId && (
            <div>
              <p className="text-sm font-medium text-gray-400 mb-2">
                🤖 Telegram
              </p>
              <div className="text-gray-300 bg-black/30 p-4 rounded-lg border border-gray-700/50">
                <p className="font-mono">ID: {order.telegramUserId}</p>
                {order.telegramUsername && (
                  <p className="text-blue-400">@{order.telegramUsername}</p>
                )}
              </div>
            </div>
          )}
        </motion.div>
      )}
      {/* Изменение статуса */}
      {showStatusChanger && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-gray-700/50 pt-4"
        >
          <p className="text-sm font-medium text-gray-400 mb-4">
            ⚙️ Изменить статус заказа
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Новый статус
              </label>
              <select
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(e.target.value as OrderStatus)
                }
                className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                disabled={isChangingStatus}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {getStatusIcon(status)} {status}
                  </option>
                ))}
              </select>
            </div>

            {selectedStatus === "отменен" && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Комментарий для клиента{" "}
                  <span className="text-red-400">(обязательно)</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Причина отмены заказа..."
                  className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  rows={3}
                  disabled={isChangingStatus}
                />
              </div>
            )}

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStatusChange}
                disabled={isChangingStatus || selectedStatus === order.status}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
              >
                {isChangingStatus ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Сохраняется...
                  </div>
                ) : (
                  "✅ Сохранить статус"
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowStatusChanger(false);
                  setSelectedStatus(order.status || "новый");
                  setComment("");
                }}
                className="px-6 py-3 bg-gradient-to-r from-gray-500/20 to-gray-600/20 border border-gray-500/30 text-gray-300 rounded-xl hover:from-gray-500/30 hover:to-gray-600/30 transition-all duration-300 backdrop-blur-sm"
              >
                ❌ Отмена
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
