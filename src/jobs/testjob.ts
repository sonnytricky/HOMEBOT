import { IJob } from "../types/job";
import { sendTelegramMessage } from "../utils/telegram";
import { sendErrorEmail } from "../utils/notifier";

const testJob: IJob = {
    name: "Einmal-Test-Job",
    cronSchedule: "* * * * *", // Läuft minütlich (oder leer lassen, wenn nur beim Start)
    async execute(): Promise<void> {
        console.log("[TestJob] Starte einmaligen Test-Job...");

        // 1. Telegram-Nachricht senden
        await sendTelegramMessage(
            "🤖 *HomeBot Test-Job*\n\nDies ist die einmalige Test-Benachrichtigung für heute."
        );

        // 2. E-Mail senden
        await sendErrorEmail(
            "Test-Job Statusmeldung",
            "Der einmalige Test-Job wurde erfolgreich ausgeführt."
        );

        console.log("[TestJob] Nachrichten erfolgreich versendet.");
    },
};

export default testJob;
