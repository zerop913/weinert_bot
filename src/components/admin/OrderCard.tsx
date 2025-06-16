import { ArtOrder, OrderStatus } from "@/types";
import { formatDate, getStatusColor, getStatusIcon } from "@/utils/orderUtils";
import { Card } from "@/components/ui/card";
import { useState } from "react";

interface OrderCardProps {
  order: ArtOrder;
  onStatusChange: (
    orderId: string,
    status: OrderStatus,
    comment?: string
  ) => void;
}

export function OrderCard({ order, onStatusChange }: OrderCardProps) {
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
    order.status || "новый"
  );
  const [comment, setComment] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  const handleStatusChange = async () => {
    if (selectedStatus === "отменен" && !comment.trim()) {
      alert("При отмене заказа необходимо указать комментарий");
      return;
    }

    setIsChangingStatus(true);
    try {
      await onStatusChange(order.id!, selectedStatus, comment);
      setComment("");
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

  return (
    <Card className="p-6 space-y-4">
      {/* Заголовок карточки */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">
            {getStatusIcon(order.status || "новый")} Заказ {order.orderNumber}
          </h3>
          <p className="text-sm text-gray-500">
            {order.createdAt && formatDate(order.createdAt)}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
            order.status || "новый"
          )}`}
        >
          {order.status}
        </span>
      </div>

      {/* Основная информация */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-700">Клиент</p>
          <p className="text-gray-900">{order.name}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Цена</p>
          <p className="text-gray-900">{order.desiredPrice}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Дедлайн</p>
          <p className="text-gray-900">{order.deadline}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Персонажи</p>
          <p className="text-gray-900">{order.charactersCount}</p>
        </div>
      </div>

      {/* Краткое описание идеи */}
      <div>
        <p className="text-sm font-medium text-gray-700">Идея</p>
        <p className="text-gray-900 line-clamp-2">{order.idea}</p>
      </div>

      {/* Кнопки действий */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          {showDetails ? "Скрыть детали" : "Показать детали"}
        </button>
      </div>

      {/* Детальная информация */}
      {showDetails && (
        <div className="border-t pt-4 space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-700">Полная идея</p>
            <p className="text-gray-900 whitespace-pre-wrap">{order.idea}</p>
          </div>
          {order.references && (
            <div>
              <p className="text-sm font-medium text-gray-700">Референсы</p>
              <p className="text-gray-900 whitespace-pre-wrap">
                {order.references}
              </p>
            </div>
          )}
          {order.additionalWishes && (
            <div>
              <p className="text-sm font-medium text-gray-700">
                Дополнительные пожелания
              </p>
              <p className="text-gray-900 whitespace-pre-wrap">
                {order.additionalWishes}
              </p>
            </div>
          )}
          {order.contactInfo && (
            <div>
              <p className="text-sm font-medium text-gray-700">
                Контактная информация
              </p>
              <p className="text-gray-900">{order.contactInfo}</p>
            </div>
          )}
          {order.adminComment && (
            <div>
              <p className="text-sm font-medium text-gray-700">
                Комментарий администратора
              </p>
              <p className="text-gray-900 whitespace-pre-wrap">
                {order.adminComment}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Изменение статуса */}
      <div className="border-t pt-4">
        <p className="text-sm font-medium text-gray-700 mb-2">
          Изменить статус
        </p>
        <div className="flex flex-wrap gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isChangingStatus}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {getStatusIcon(status)} {status}
              </option>
            ))}
          </select>

          {selectedStatus === "отменен" && (
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Комментарий для клиента (обязательно)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              disabled={isChangingStatus}
            />
          )}

          <button
            onClick={handleStatusChange}
            disabled={isChangingStatus || selectedStatus === order.status}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isChangingStatus ? "Сохраняется..." : "Сохранить статус"}
          </button>
        </div>
      </div>
    </Card>
  );
}
