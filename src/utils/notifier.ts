import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendErrorEmail(subject: string, errorMessage: string): Promise<void> {
    const receiver = process.env.ERROR_EMAIL_RECEIVER || process.env.SMTP_USER;
    const sender = process.env.SMTP_FROM || process.env.SMTP_USER;

    if (!receiver || !sender) {
        throw new Error("E-Mail Absender oder Empfänger nicht definiert!");
    }

    try {
        await transporter.sendMail({
            from: `"HomeBot" <${sender}>`,
            to: receiver,
            subject: `🚨 [HomeBot Fehler] ${subject}`,
            text: `Es ist ein Fehler im Server-Assistenten aufgetreten:\n\n${errorMessage}\n\nZeitpunkt: ${new Date().toISOString()}`,
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ff4d4d; border-radius: 5px;">
            <h2 style="color: #ff4d4d;">🚨 HomeBot Fehlerbenachrichtigung</h2>
            <p><strong>Betreff:</strong> ${subject}</p>
            <pre style="background: #f4f4f4; padding: 10px; border-radius: 4px; overflow-x: auto;">${errorMessage}</pre>
            <p style="color: #666; font-size: 12px;">Zeitpunkt: ${new Date().toISOString()}</p>
        </div>
        `,
        });
        console.log(`[Notifier] Fehler-E-Mail erfolgreich von ${sender} an ${receiver} gesendet`);
    } catch (error) {
        console.error("[Notifier] Konnte Fehler-E-Mail nicht senden:", error);
        throw error; // Wichtig: Fehler weiterwerfen, damit das Skript fehlschlägt!
    }
}
