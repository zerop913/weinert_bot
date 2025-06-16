"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface NotificationProps {
  isVisible: boolean;
  type: "success" | "error";
  message: string;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export function Notification({
  isVisible,
  type,
  message,
  onClose,
  autoClose = true,
  duration = 4000,
}: NotificationProps) {
  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      default:
        return "ℹ️";
    }
  };

  const getColors = () => {
    switch (type) {
      case "success":
        return {
          bg: "from-green-500/20 to-emerald-600/20",
          border: "border-green-500/30",
          text: "text-green-300",
          icon: "text-green-400",
        };
      case "error":
        return {
          bg: "from-red-500/20 to-red-600/20",
          border: "border-red-500/30",
          text: "text-red-300",
          icon: "text-red-400",
        };
      default:
        return {
          bg: "from-blue-500/20 to-blue-600/20",
          border: "border-blue-500/30",
          text: "text-blue-300",
          icon: "text-blue-400",
        };
    }
  };

  const colors = getColors();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          className="fixed top-6 right-6 z-[60] max-w-sm"
        >
          <div
            className={`glass-ultra p-4 rounded-xl border ${colors.border} ${colors.bg} backdrop-blur-md`}
          >
            <div className="flex items-start gap-3">
              <div className={`text-xl ${colors.icon}`}>{getIcon()}</div>
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${colors.text} leading-relaxed`}
                >
                  {message}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors ml-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
