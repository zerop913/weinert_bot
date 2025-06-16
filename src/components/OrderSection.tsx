"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function OrderSection() {
  const [formData, setFormData] = useState({
    name: "",
    charactersCount: "",
    references: "",
    idea: "",
    additionalWishes: "",
    deadline: "",
    desiredPrice: "",
    contactInfo: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [telegramWebApp, setTelegramWebApp] = useState<any>(null);

  useEffect(() => {
    // Проверяем, запущено ли приложение в Telegram WebApp
    if (typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp;
      setTelegramWebApp(tg);
      tg.ready();

      // Получаем данные пользователя из Telegram
      if (tg.initDataUnsafe?.user) {
        const user = tg.initDataUnsafe.user;
        setFormData((prev) => ({
          ...prev,
          name: user.first_name + (user.last_name ? ` ${user.last_name}` : ""),
          contactInfo: user.username ? `@${user.username}` : "",
        }));
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {      const submitData = {
        ...formData,
        charactersCount: parseInt(formData.charactersCount) || 1,
        // Добавляем Telegram User ID если доступен
        telegramUserId: telegramWebApp?.initDataUnsafe?.user?.id?.toString(),
        // Добавляем Telegram Username если доступен
        telegramUsername: telegramWebApp?.initDataUnsafe?.user?.username || "",
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          name: "",
          charactersCount: "",
          references: "",
          idea: "",
          additionalWishes: "",
          deadline: "",
          desiredPrice: "",
          contactInfo: "",
        });

        // Закрываем WebApp после успешной отправки
        if (telegramWebApp) {
          telegramWebApp.close();
        }
      }
    } catch (error) {
      console.error("Error submitting order:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-ultra p-12 rounded-3xl max-w-2xl mx-auto text-center relative z-10"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Заказ отправлен!
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Спасибо за ваш заказ! Я свяжусь с вами в ближайшее время для
            обсуждения деталей.
          </p>
          <Button
            onClick={() => setSubmitted(false)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-3 rounded-xl"
          >
            Сделать новый заказ
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/3 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-6 tracking-tighter">
            ЗАКАЗАТЬ
          </h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
            className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full mx-auto max-w-md mb-8"
          />
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
            Расскажите о своем проекте, и я воплощу ваши идеи в жизнь
          </p>
        </motion.div>

        {/* Order Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <Card className="glass-ultra p-8 lg:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Имя *
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-black/50 border-gray-600 text-white placeholder-gray-400"
                    placeholder="Как вас зовут?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Количество персонажей *
                  </label>
                  <Input
                    type="number"
                    name="charactersCount"
                    value={formData.charactersCount}
                    onChange={handleChange}
                    required
                    min="1"
                    className="bg-black/50 border-gray-600 text-white placeholder-gray-400"
                    placeholder="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Референсы *
                </label>
                <Textarea
                  name="references"
                  value={formData.references}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="bg-black/50 border-gray-600 text-white placeholder-gray-400"
                  placeholder="Ссылки на изображения, описание внешности персонажей..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Идея *
                </label>
                <Textarea
                  name="idea"
                  value={formData.idea}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="bg-black/50 border-gray-600 text-white placeholder-gray-400"
                  placeholder="Опишите вашу идею, что должно быть на иллюстрации..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Дополнительные пожелания
                </label>
                <Textarea
                  name="additionalWishes"
                  value={formData.additionalWishes}
                  onChange={handleChange}
                  rows={3}
                  className="bg-black/50 border-gray-600 text-white placeholder-gray-400"
                  placeholder="Особые требования, стиль, настроение..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Желаемый срок *
                  </label>
                  <Input
                    type="text"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    required
                    className="bg-black/50 border-gray-600 text-white placeholder-gray-400"
                    placeholder="Например: 1 неделя, до 15 числа..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Желаемая цена *
                  </label>
                  <Input
                    type="text"
                    name="desiredPrice"
                    value={formData.desiredPrice}
                    onChange={handleChange}
                    required
                    className="bg-black/50 border-gray-600 text-white placeholder-gray-400"
                    placeholder="Например: 5000₽, договорная..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Контактная информация
                </label>
                <Input
                  type="text"
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleChange}
                  className="bg-black/50 border-gray-600 text-white placeholder-gray-400"
                  placeholder="Telegram, Discord, Email..."
                />
              </div>

              <div className="text-center pt-6">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-12 py-4 text-lg rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Отправляем..." : "Отправить заказ"}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
