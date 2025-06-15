"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function FAQSection() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await fetch("/api/faqs");
        if (!response.ok) {
          throw new Error("Ошибка при загрузке FAQ");
        }
        const data = await response.json();
        setFaqs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Произошла ошибка");
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  const toggleExpanded = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  if (loading) {
    return (
      <div className="relative overflow-hidden">
        <section className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-black via-gray-900 to-black">
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block w-12 h-12 border-2 border-purple-500/20 border-t-purple-500 rounded-full mb-4"
            ></motion.div>
            <p className="text-gray-400 text-lg">Загрузка FAQ...</p>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative overflow-hidden">
        <section className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-black via-gray-900 to-black">
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-red-400 text-6xl mb-6"
            >
              ⚠️
            </motion.div>
            <h2 className="text-3xl font-light text-white mb-4">
              Ошибка загрузки
            </h2>
            <p className="text-gray-400 text-lg">{error}</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <section className="min-h-screen relative bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-6 py-20 relative z-10">
          {/* Header */}{" "}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center mb-16"
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-6 tracking-tighter">
              FAQ
            </h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
              className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full mx-auto max-w-md mb-8"
            />
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
              Часто задаваемые вопросы о моих услугах и процессе работы
            </p>
          </motion.div>
          {/* FAQ List */}
          {faqs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="text-center py-20"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="text-8xl mb-8"
              >
                🤔
              </motion.div>
              <h3 className="text-3xl font-light text-white mb-4">
                Пока нет вопросов
              </h3>
              <p className="text-gray-400 text-lg">
                FAQ скоро появятся. Следите за обновлениями!
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="space-y-4"
            >
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                >
                  <Card className="border border-purple-500/20 bg-transparent backdrop-blur-sm hover:border-purple-500/40 transition-all duration-300 overflow-hidden">
                    <motion.button
                      onClick={() => toggleExpanded(faq.id)}
                      className="w-full text-left p-6 focus:outline-none"
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-start space-x-4">
                          {" "}
                          <motion.div
                            className="flex-shrink-0 w-8 h-8 border-2 border-purple-400 rounded-full flex items-center justify-center text-purple-400 font-semibold text-sm"
                            whileHover={{ scale: 1.1 }}
                          >
                            {index + 1}
                          </motion.div>
                          <h3 className="text-white font-medium text-lg flex-1 pr-4 leading-relaxed">
                            {faq.question}
                          </h3>
                        </div>
                        <motion.div
                          className="flex-shrink-0 w-6 h-6 text-purple-400 transition-transform duration-300"
                          animate={{
                            rotate: expandedItem === faq.id ? 180 : 0,
                          }}
                        >
                          ▼
                        </motion.div>
                      </div>
                    </motion.button>

                    <motion.div
                      initial={false}
                      animate={{
                        height: expandedItem === faq.id ? "auto" : 0,
                        opacity: expandedItem === faq.id ? 1 : 0,
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <div className="ml-12 pt-4 border-t border-purple-500/20">
                          <div
                            className="text-gray-300 leading-relaxed whitespace-pre-wrap font-light"
                            dangerouslySetInnerHTML={{ __html: faq.answer }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 + faqs.length * 0.1, duration: 0.8 }}
            className="mt-20 text-center"
          >
            <Card className="border border-purple-500/30 bg-transparent backdrop-blur-sm p-8">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.7 + faqs.length * 0.1, duration: 0.6 }}
                className="text-3xl font-light text-white mb-4"
              >
                Не нашли ответ на свой вопрос?
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.9 + faqs.length * 0.1, duration: 0.6 }}
                className="text-gray-300 mb-8 text-lg font-light"
              >
                Напишите мне в Telegram, и я с радостью отвечу на все ваши
                вопросы!
              </motion.p>
              <motion.a
                href="https://t.me/weinertt"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center border border-purple-500/30 bg-transparent text-purple-400 hover:border-purple-500/60 hover:text-white hover:bg-purple-500/10 transition-all duration-300 px-8 py-3 text-base font-medium rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.1 + faqs.length * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="mr-2">📱</span>
                Написать в Telegram
              </motion.a>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
