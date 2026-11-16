import { IJob } from "../types/job";
import { sendErrorEmail } from "../utils/notifier";
import { sendTelegramMessage } from "../utils/telegram";

const testJob: IJob = {
    name: "Einmal-Test-Job",
    runOnce: true,
    async execute(): Promise<void> {
        console.log("[TestJob] Starte einmaligen Test-Job...");

        // Telegram-Benachrichtigung testen
        await sendTelegramMessage(
            "🤖 *HomeBot Test-Job*\n\nDies ist die manuelle Telegram-Testnachricht aus dem Job."
        );

        // E-Mail-Versand gezielt testen
        await sendErrorEmail(
            "Test-Job Statusmeldung",
            "Der einmalige Test-Job wurde erfolgreich ausgeführt."
        );

        console.log("[TestJob] Nachrichten erfolgreich versendet.");
    },
};

export default testJob;
