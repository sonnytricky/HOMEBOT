import { Telegraf } from "telegraf";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const defaultChatId = process.env.TELEGRAM_CHAT_ID;

// Initialisiere den Bot nur, wenn ein Token vorhanden ist
const bot = token ? new Telegraf(token) : null;

/**
 * Sendet eine Nachricht an den Standard-Chat per Telegram
 */
export async function sendTelegramMessage(message: string): Promise<void> {
    if (!bot || !defaultChatId) {
        console.warn(
            "[Telegram] Bot-Token oder Chat-ID nicht konfiguriert. Nachricht übersprungen."
        );
        return;
    }

    try {
        await bot.telegram.sendMessage(defaultChatId, message, { parse_mode: "Markdown" });
        console.log("[Telegram] Nachricht erfolgreich gesendet.");
    } catch (error) {
        console.error("[Telegram] Fehler beim Senden der Nachricht:", error);
        throw error;
    }
}
