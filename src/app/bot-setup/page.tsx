"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function BotSetupPage() {
  const [webhookInfo, setWebhookInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

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
        body: JSON.stringify({ webhookUrl }),
      });
      const data = await response.json();
      console.log("Setup result:", data);

      // Обновляем информацию о webhook
      await checkWebhook();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto pt-20">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6">Настройка Telegram бота</h1>

          <div className="space-y-4">
            <Button onClick={checkWebhook} disabled={loading}>
              {loading ? "Проверяем..." : "Проверить webhook"}
            </Button>

            <Button onClick={setupWebhook} disabled={loading}>
              {loading ? "Настраиваем..." : "Настроить webhook"}
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
      </div>
    </div>
  );
}
