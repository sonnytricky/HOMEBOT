import dotenv from "dotenv";
import { sendTelegramMessage } from "../src/utils/telegram";

dotenv.config();

async function runTelegramTest() {
    console.log("🧪 Starte Telegram-Test...");
    try {
        await sendTelegramMessage(
            "🚨 *HomeBot Test*\nHallo! Die Telegram-Integration funktioniert einwandfrei."
        );
        console.log("✅ Telegram-Nachricht erfolgreich gesendet!");
    } catch (error) {
        console.error("❌ Telegram-Test fehlgeschlagen:", error);
        process.exit(1);
    }
}

runTelegramTest();
