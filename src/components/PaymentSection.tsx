"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  FaCreditCard,
  FaPaypal,
  FaMoneyBillWave,
  FaDollarSign,
} from "react-icons/fa";

export default function PaymentSection() {
  const paymentMethods = [
    {
      icon: FaMoneyBillWave,
      title: "Банковская карта (РФ)",
      description: "Оплата картой Visa, MasterCard, МИР через Сбербанк",
      details: "Моментальное зачисление",
    },
    {
      icon: FaCreditCard,
      title: "СБП",
      description: "Система быстрых платежей по номеру телефона",
      details: "Быстро и без комиссии",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/3 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-6 tracking-tighter">
            ОПЛАТА
          </h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
            className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full mx-auto max-w-md mb-8"
          />
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
            Удобные способы оплаты для клиентов из любой точки мира
          </p>
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
        >
          {paymentMethods.map((method, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="glass-ultra p-8 h-full hover:border-purple-500/30 transition-all duration-300 group">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <method.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                      {method.title}
                    </h3>
                    <p className="text-gray-300 mb-2">{method.description}</p>
                    <span className="inline-block px-3 py-1 text-xs font-medium bg-purple-500/10 text-purple-400 rounded-full border border-purple-500/20">
                      {method.details}
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Process Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-16"
        >
          <Card className="glass-ultra p-8 lg:p-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Как происходит оплата
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Предоплата 50%
                </h3>
                <p className="text-gray-300">
                  После согласования деталей заказа вы вносите предоплату в
                  размере 50% от стоимости
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Работа над заказом
                </h3>
                <p className="text-gray-300">
                  Я приступаю к работе и отправляю промежуточные этапы для
                  согласования
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Финальная оплата
                </h3>
                <p className="text-gray-300">
                  После завершения работы и вашего одобрения вы доплачиваете
                  оставшиеся 50%
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Important Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <Card className="glass-ultra p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Важная информация
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                <span className="text-purple-400 font-semibold">•</span> Возврат
                средств возможен только до начала работы над заказом
              </p>
              <p>
                <span className="text-purple-400 font-semibold">•</span> При
                отмене заказа после начала работы предоплата не возвращается
              </p>
              <p>
                <span className="text-purple-400 font-semibold">•</span> Все
                цены указаны в российских рублях, для других валют курс
                обговаривается отдельно
              </p>
              <p>
                <span className="text-purple-400 font-semibold">•</span> Срок
                выполнения заказа обговаривается индивидуально и зависит от
                сложности работы
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
