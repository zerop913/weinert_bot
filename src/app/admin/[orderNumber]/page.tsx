"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArtOrder } from "@/types";
import { AdminOrderCard } from "@/components/admin/AdminOrderCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminOrderPage() {
  const params = useParams();
  const router = useRouter();
  const orderNumber = params.orderNumber as string;
  const [order, setOrder] = useState<ArtOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrder();
  }, [orderNumber]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders/${orderNumber}`);

      if (response.ok) {
        const orderData = await response.json();
        setOrder(orderData);
      } else {
        setError("Заказ не найден");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      setError("Ошибка при загрузке заказа");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    orderId: string,
    status: string,
    comment?: string
  ) => {
    try {
      const response = await fetch("/api/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: orderId, status, adminComment: comment }),
      });

      if (response.ok) {
        fetchOrder(); // Обновляем данные заказа
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (confirm("Вы уверены, что хотите удалить этот заказ?")) {
      try {
        const response = await fetch("/api/orders", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: orderId }),
        });

        if (response.ok) {
          router.push("/admin"); // Возвращаемся к списку заказов
        }
      } catch (error) {
        console.error("Error deleting order:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Загрузка заказа...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">
            {error || "Заказ не найден"}
          </div>
          <Button
            onClick={() => router.push("/admin")}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться к списку заказов
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6">
      <div className="max-w-4xl mx-auto">
        {/* Заголовок с кнопкой назад */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button
            onClick={() => router.push("/admin")}
            className="mb-4 bg-purple-600 hover:bg-purple-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться к списку заказов
          </Button>

          <h1 className="text-3xl font-bold text-white mb-2">
            Заказ {order.orderNumber}
          </h1>
          <p className="text-gray-400">Детальная информация о заказе</p>
        </motion.div>

        {/* Карточка заказа */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <AdminOrderCard
            order={order}
            onStatusChange={handleStatusChange}
            onDeleteOrder={handleDeleteOrder}
          />
        </motion.div>
      </div>
    </div>
  );
}
