import { NextRequest, NextResponse } from "next/server";
import { setBotCommands, getBotCommands, BOT_COMMANDS } from "@/bot/commands";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

/**
 * GET - получить информацию о текущей настройке бота
 */
export async function GET() {
  try {
    if (!TELEGRAM_BOT_TOKEN) {
      return NextResponse.json(
        { error: "Токен бота не настроен" },
        { status: 500 }
      );
    }

    // Получаем информацию о боте
    const botInfoUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`;
    const botInfoResponse = await fetch(botInfoUrl);
    const botInfo = await botInfoResponse.json();

    // Получаем текущие команды
    const commands = await getBotCommands(TELEGRAM_BOT_TOKEN);

    // Получаем информацию о webhook
    const webhookUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo`;
    const webhookResponse = await fetch(webhookUrl);
    const webhookInfo = await webhookResponse.json();

    return NextResponse.json({
      success: true,
      bot: botInfo.result,
      currentCommands: commands?.result || [],
      availableCommands: BOT_COMMANDS,
      webhook: webhookInfo.result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * POST - настроить бота (webhook и команды)
 */
export async function POST(request: NextRequest) {
  try {
    if (!TELEGRAM_BOT_TOKEN) {
      return NextResponse.json(
        { error: "Токен бота не настроен" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { webhookUrl, setupCommands } = body;

    const results: any = {};

    // Устанавливаем webhook если указан
    if (webhookUrl) {
      const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: webhookUrl,
          allowed_updates: ["message", "callback_query"],
        }),
      });

      const result = await response.json();
      results.webhook = {
        success: result.ok,
        result: result.result,
        description: result.description,
      };
    }

    // Устанавливаем команды если запрошено
    if (setupCommands) {
      const commandsSuccess = await setBotCommands(TELEGRAM_BOT_TOKEN);
      results.commands = {
        success: commandsSuccess,
        commands: BOT_COMMANDS,
      };
    }

    return NextResponse.json({
      success: true,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
