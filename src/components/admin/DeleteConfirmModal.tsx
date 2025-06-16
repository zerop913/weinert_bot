"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArtOrder } from "@/types";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  order: ArtOrder | null;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  order,
  onConfirm,
  onCancel,
  isDeleting,
}: DeleteConfirmModalProps) {
  if (!order) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-ultra p-8 max-w-md w-full mx-4 rounded-2xl border border-red-500/30"
            >
              {/* Icon and Title */}
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="text-6xl mb-4"
                >
                  ⚠️
                </motion.div>
                <h2 className="text-2xl font-bold text-red-400 mb-2">
                  Удаление заказа
                </h2>
                <p className="text-gray-400">Это действие нельзя отменить</p>
              </div>

              {/* Order Info */}
              <div className="bg-black/30 rounded-xl p-4 mb-6 border border-gray-700/50">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Номер заказа:</span>
                    <span className="text-white font-semibold">
                      {order.orderNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Клиент:</span>
                    <span className="text-white">{order.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Статус:</span>
                    <span className="text-white">{order.status}</span>
                  </div>
                </div>
              </div>

              {/* Warning Text */}
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
                <p className="text-red-300 text-sm leading-relaxed">
                  <strong>Внимание!</strong> После удаления заказ будет
                  полностью удален из базы данных. Восстановить его будет
                  невозможно. Вся информация о заказе и истории изменений будет
                  потеряна.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onCancel}
                  disabled={isDeleting}
                  className="flex-1 px-6 py-3 bg-gray-600/30 border border-gray-500/50 text-gray-300 rounded-xl hover:bg-gray-600/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Отмена
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onConfirm}
                  disabled={isDeleting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Удаление...
                    </div>
                  ) : (
                    "Удалить заказ"
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
