"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Service {
  id: string;
  title: string;
  price: string;
  description?: string;
  category: string;
  order: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<
    "main" | "additional" | "all"
  >("all");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/services");
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter((service) => {
    if (activeCategory === "all") return true;
    return service.category === activeCategory;
  });

  const mainServices = services.filter(
    (service) => service.category === "main"
  );
  const additionalServices = services.filter(
    (service) => service.category === "additional"
  );

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
        ease: "easeOut",
      },
    },
  };

  const handleOrderService = () => {
    const event = new CustomEvent("switchTab", {
      detail: "order",
    });
    window.dispatchEvent(event);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Загружаем услуги...</p>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-6 tracking-tighter">
            УСЛУГИ
          </h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
            className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full mx-auto max-w-md mb-8"
          />
        </motion.div>{" "}
        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex justify-center mb-12 px-4 sm:px-0"
        >
          <div className="glass-ultra p-1 sm:p-2 rounded-2xl w-full max-w-lg sm:w-auto">
            <div className="flex space-x-1 sm:space-x-2">
              {[
                { key: "all", label: "Все услуги" },
                { key: "main", label: "Основные" },
                { key: "additional", label: "Дополнительные" },
              ].map((category) => (
                <button
                  key={category.key}
                  onClick={() => setActiveCategory(category.key as any)}
                  className={`flex-1 sm:flex-none px-2 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 font-medium text-xs sm:text-sm ${
                    activeCategory === category.key
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
        {/* Services Grid */}
        {activeCategory === "all" ? (
          <div className="space-y-16">
            {/* Main Services */}
            {mainServices.length > 0 && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
                  Основные услуги
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {mainServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      variants={itemVariants}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Additional Services */}
            {additionalServices.length > 0 && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="mt-16"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
                  Дополнительные услуги
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {additionalServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      variants={itemVariants}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                variants={itemVariants}
              />
            ))}
          </motion.div>
        )}
        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-center mt-20"
        >
          <div className="glass-ultra p-12 rounded-3xl max-w-4xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Готовы начать проект?
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Свяжитесь со мной, чтобы обсудить ваш проект и получить
              индивидуальное предложение
            </p>
            <Button
              onClick={handleOrderService}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-4 text-lg rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Заказать услугу
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ServiceCard({
  service,
  variants,
}: {
  service: Service;
  variants: any;
}) {
  return (
    <motion.div variants={variants}>
      <Card className="glass-ultra p-6 h-full hover:border-purple-500/30 transition-all duration-300 group">
        <div className="h-full flex flex-col">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
              {service.title}
            </h3>
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {service.price}
            </div>
          </div>

          {service.description && (
            <p className="text-gray-300 leading-relaxed flex-grow">
              {service.description}
            </p>
          )}

          <div className="mt-6 pt-4 border-t border-gray-700/50">
            <span className="inline-block px-3 py-1 text-xs font-medium bg-purple-500/10 text-purple-400 rounded-full border border-purple-500/20">
              {service.category === "main"
                ? "Основная услуга"
                : "Дополнительная услуга"}
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
