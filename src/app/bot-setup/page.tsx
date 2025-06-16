"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function BotSetupPage() {
  const [webhookInfo, setWebhookInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [botStatus, setBotStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  const checkWebhook = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/telegram/setup");
      const data = await response.json();
      setWebhookInfo(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  const setupWebhook = async () => {
    setLoading(true);
    try {
      const webhookUrl = `${window.location.origin}/api/telegram/webhook`;
      const response = await fetch("/api/telegram/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          webhookUrl,
          setupCommands: true, // Также устанавливаем команды
        }),
      });
      const data = await response.json();
      console.log("Setup result:", data);

      if (data.success) {
        setBotStatus("success");
        setMessage("Бот успешно настроен! Webhook и команды установлены.");
      } else {
        setBotStatus("error");
        setMessage("Ошибка настройки бота");
      }

      // Обновляем информацию о webhook
      await checkWebhook();
    } catch (error) {
      console.error("Error:", error);
      setBotStatus("error");
      setMessage("Ошибка подключения");
    } finally {
      setLoading(false);
    }
  };

  const setupCommands = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/telegram/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          setupCommands: true, // Устанавливаем только команды
        }),
      });
      const data = await response.json();

      if (data.success) {
        setBotStatus("success");
        setMessage("Команды бота успешно установлены!");
      } else {
        setBotStatus("error");
        setMessage("Ошибка установки команд");
      }

      // Обновляем информацию
      await checkWebhook();
    } catch (error) {
      console.error("Error:", error);
      setBotStatus("error");
      setMessage("Ошибка подключения");
    } finally {
      setLoading(false);
    }
  };

  const setupBot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setBotStatus("idle");

    try {
      const response = await fetch("/api/bot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        setBotStatus("success");
        setMessage("Бот успешно настроен!");
        setToken("");
      } else {
        setBotStatus("error");
        setMessage(data.error || "Ошибка при настройке бота");
      }
    } catch (error) {
      setBotStatus("error");
      setMessage("Ошибка подключения к серверу");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto pt-20 space-y-6">
        {/* Настройка бота */}
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6">
            🤖 Настройка Telegram бота
          </h1>

          <form onSubmit={setupBot} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Токен бота
              </label>
              <Input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                required
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Получите токен у @BotFather в Telegram
              </p>
            </div>

            {botStatus !== "idle" && (
              <div
                className={`p-4 rounded-md ${
                  botStatus === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {message}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !token.trim()}
              className="w-full"
            >
              {loading ? "Настройка..." : "Настроить бота"}
            </Button>
          </form>
        </Card>

        {/* Настройка Webhook */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6">🔗 Настройка Webhook</h2>

          <div className="space-y-4">
            <Button onClick={checkWebhook} disabled={loading} variant="outline">
              {loading ? "Проверяем..." : "Проверить webhook"}
            </Button>

            <Button onClick={setupWebhook} disabled={loading}>
              {loading ? "Настраиваем..." : "Настроить webhook"}
            </Button>

            <Button onClick={setupCommands} disabled={loading}>
              {loading ? "Устанавливаем..." : "Установить команды бота"}
            </Button>

            {webhookInfo && (
              <div className="mt-6 p-4 bg-gray-100 rounded">
                <h3 className="font-bold mb-2">Информация о webhook:</h3>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(webhookInfo, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </Card>

        {/* Инструкция */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">📋 Инструкция по настройке</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
            <li>Создайте бота через @BotFather в Telegram</li>
            <li>Скопируйте токен бота</li>
            <li>Вставьте токен в поле выше и нажмите "Настроить бота"</li>
            <li>Настройте webhook для получения сообщений</li>
            <li>Установите команды бота</li>
            <li>Проверьте работу бота командой /start</li>
          </ol>
        </Card>

        {/* Доступные команды */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">🤖 Доступные команды бота</h3>
          <div className="grid gap-3 text-sm">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <code>/start</code>
              <span className="text-gray-600">Главное меню</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <code>/help</code>
              <span className="text-gray-600">Справка по командам</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <code>/link W-001</code>
              <span className="text-gray-600">Привязать заказ</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <code>/info</code>
              <span className="text-gray-600">Информация о боте</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <code>/pricing</code>
              <span className="text-gray-600">Цены на услуги</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <code>/status</code>
              <span className="text-gray-600">Статусы заказов</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <code>/admin</code>
              <span className="text-gray-600">Админ-панель</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
