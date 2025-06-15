"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const tabs = [
  { id: "/", label: "Главная", path: "/" },
  { id: "services", label: "Услуги", path: "/services" },
  { id: "reviews", label: "Отзывы", path: "/reviews" },
  { id: "faq", label: "FAQ", path: "/faq" },
  { id: "order", label: "Заказать", path: "/order" },
  { id: "payment", label: "Оплата", path: "/payment" },
];

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleTabClick = (path: string) => {
    router.push(path);
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  return (
    <>
      {/* Затемнение фона для мобильного меню */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black backdrop-blur-xl border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div
              className="flex-shrink-0 cursor-pointer"
              onClick={() => handleTabClick("/")}
            >
              <div className="text-3xl sm:text-4xl lg:text-3xl font-black text-white">
                WEINERT
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-center flex-1 max-w-2xl mx-8">
              <div className="flex items-center space-x-1 bg-white/5 backdrop-blur-md rounded-2xl p-2 border border-white/10">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.path)}
                    className={`relative px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 hover:-translate-y-0.5 active:scale-95 ${
                      isActive(tab.path)
                        ? "text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25"
                        : "text-gray-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center">
              <button
                onClick={() => handleTabClick("/order")}
                className="relative px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 overflow-hidden group"
              >
                <span className="relative z-10">Заказать арт</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden relative p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:scale-110 active:scale-90 transition-transform duration-300"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span
                  className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
                    mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                ></span>
                <span
                  className={`block w-5 h-0.5 bg-white transition-all duration-300 mt-1 ${
                    mobileMenuOpen ? "opacity-0" : ""
                  }`}
                ></span>
                <span
                  className={`block w-5 h-0.5 bg-white transition-all duration-300 mt-1 ${
                    mobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed top-24 left-4 right-4 z-50 bg-black/90 backdrop-blur-xl rounded-2xl border border-purple-500/20 shadow-2xl">
            <div className="p-6">
              <div className="space-y-3">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.path)}
                    className={`w-full text-left px-4 py-4 rounded-xl font-medium transition-all duration-300 hover:translate-x-2 active:scale-98 ${
                      isActive(tab.path)
                        ? "text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg"
                        : "text-gray-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
                <button
                  onClick={() => handleTabClick("/order")}
                  className="w-full mt-6 px-4 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/40 hover:scale-102 active:scale-98 transition-all duration-300"
                >
                  Заказать арт
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
