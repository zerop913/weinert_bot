"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArtOrder, OrderStatus } from "@/types";
import { AdminOrderCard } from "./AdminOrderCard";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { Notification } from "./Notification";

export function AdminPanel() {
  const [orders, setOrders] = useState<ArtOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | "все">("все");
  const [searchTerm, setSearchTerm] = useState("");

  // Состояние для модального окна удаления
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    order: null as ArtOrder | null,
    isDeleting: false,
  });

  // Состояние для уведомлений
  const [notification, setNotification] = useState({
    isVisible: false,
    type: "success" as "success" | "error",
    message: "",
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    orderId: string,
    status: OrderStatus,
    comment?: string
  ) => {
    try {
      const response = await fetch("/api/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: orderId,
          status,
          adminComment: comment,
        }),
      });
      if (response.ok) {
        // Обновляем локальное состояние
        setOrders(
          orders.map((order) =>
            order.id === orderId
              ? { ...order, status, adminComment: comment }
              : order
          )
        );

        // Показываем уведомление об успехе
        setNotification({
          isVisible: true,
          type: "success",
          message: `Статус заказа изменен на "${status}"`,
        });
      } else {
        throw new Error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);

      // Показываем уведомление об ошибке
      setNotification({
        isVisible: true,
        type: "error",
        message:
          "Произошла ошибка при изменении статуса заказа. Попробуйте еще раз.",
      });
    }
  };
  const handleDeleteOrder = (orderId: string) => {
    const orderToDelete = orders.find((order) => order.id === orderId);
    if (orderToDelete) {
      setDeleteModal({
        isOpen: true,
        order: orderToDelete,
        isDeleting: false,
      });
    }
  };

  const confirmDeleteOrder = async () => {
    if (!deleteModal.order) return;

    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));

    try {
      const response = await fetch("/api/orders", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: deleteModal.order.id }),
      });

      if (response.ok) {
        const data = await response.json();
        // Удаляем заказ из локального состояния
        setOrders(orders.filter((order) => order.id !== deleteModal.order!.id));

        // Показываем уведомление об успехе
        setNotification({
          isVisible: true,
          type: "success",
          message: `Заказ ${data.orderNumber} успешно удален`,
        });

        // Закрываем модальное окно
        setDeleteModal({
          isOpen: false,
          order: null,
          isDeleting: false,
        });
      } else {
        throw new Error("Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);

      // Показываем уведомление об ошибке
      setNotification({
        isVisible: true,
        type: "error",
        message: "Произошла ошибка при удалении заказа. Попробуйте еще раз.",
      });

      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const cancelDeleteOrder = () => {
    setDeleteModal({
      isOpen: false,
      order: null,
      isDeleting: false,
    });
  };

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, isVisible: false }));
  };

  // Фильтрация заказов
  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filter === "все" || order.status === filter;
    const matchesSearch =
      searchTerm === "" ||
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.idea.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Группировка заказов по статусу для статистики
  const statusCounts = {
    всего: orders.length,
    новый: orders.filter((o) => o.status === "новый").length,
    "в работе": orders.filter((o) => o.status === "в работе").length,
    выполнен: orders.filter((o) => o.status === "выполнен").length,
    отменен: orders.filter((o) => o.status === "отменен").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Загрузка заказов...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            🎨 Админ-панель
          </h1>
          <p className="text-gray-400">Управление заказами Weinert Art</p>
        </motion.div>

        {/* Статистика */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
        >
          {Object.entries(statusCounts).map(([status, count], index) => (
            <motion.div
              key={status}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="glass-ultra p-4 text-center hover-lift"
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {count}
              </div>
              <div className="text-sm text-gray-400 capitalize font-medium">
                {status}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Фильтры и поиск */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="glass-ultra p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                🔍 Фильтр по статусу
              </label>
              <select
                value={filter}
                onChange={(e) =>
                  setFilter(e.target.value as OrderStatus | "все")
                }
                className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
              >
                <option value="все">Все заказы</option>
                <option value="новый">🆕 Новые</option>
                <option value="в работе">⏳ В работе</option>
                <option value="выполнен">✅ Выполненные</option>
                <option value="отменен">❌ Отмененные</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                🔎 Поиск
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Поиск по номеру, имени клиента или идее..."
                className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
              />
            </div>
          </div>
        </motion.div>

        {/* Список заказов */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="space-y-6"
        >
          {filteredOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center py-16"
            >
              <div className="text-gray-400 text-8xl mb-6">📋</div>
              <h3 className="text-xl text-gray-300 mb-2">
                {orders.length === 0
                  ? "Заказов пока нет"
                  : "Нет заказов, соответствующих фильтрам"}
              </h3>
              <p className="text-gray-500">
                {orders.length === 0
                  ? "Как только появятся новые заказы, они отобразятся здесь"
                  : "Попробуйте изменить фильтры поиска"}
              </p>
            </motion.div>
          ) : (
            filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <AdminOrderCard
                  order={order}
                  onStatusChange={handleStatusChange}
                  onDeleteOrder={handleDeleteOrder}
                />
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Информация о количестве отображаемых заказов */}
        {filteredOrders.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-8 text-center text-gray-500"
          >
            Показано{" "}
            <span className="text-purple-400 font-semibold">
              {filteredOrders.length}
            </span>{" "}
            из{" "}
            <span className="text-pink-400 font-semibold">{orders.length}</span>{" "}
            заказов
          </motion.div>
        )}
      </div>

      {/* Модальное окно подтверждения удаления */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        order={deleteModal.order}
        onConfirm={confirmDeleteOrder}
        onCancel={cancelDeleteOrder}
        isDeleting={deleteModal.isDeleting}
      />

      {/* Уведомления */}
      <Notification
        isVisible={notification.isVisible}
        type={notification.type}
        message={notification.message}
        onClose={closeNotification}
      />
    </div>
  );
}
