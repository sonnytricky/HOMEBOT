import dotenv from "dotenv";
import { sendErrorEmail } from "../src/utils/notifier";

dotenv.config();

async function runEmailTest() {
    console.log("🧪 Starte E-Mail-Test...");
    console.log(`Verwende SMTP-Host: ${process.env.SMTP_HOST}`);
    console.log(`Absender (From): ${process.env.SMTP_FROM || process.env.SMTP_USER}`);
    console.log(`Empfänger (To): ${process.env.ERROR_EMAIL_RECEIVER || process.env.SMTP_USER}`);

    try {
        await sendErrorEmail(
            "Test-Nachricht vom HomeBot",
            "Dies ist eine automatisierte Test-Nachricht."
        );
        console.log("✅ E-Mail erfolgreich versendet! Bitte prüfe deinen Posteingang.");
    } catch (error) {
        console.error("❌ E-Mail-Test fehlgeschlagen! Grund:", error);
        process.exit(1); // Beendet den Prozess mit Exit-Code 1 (Fehler)
    }
}

runEmailTest();
