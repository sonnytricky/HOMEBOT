import cron from "node-cron";
import { IJob } from "../types/job";
import { sendErrorEmail } from "../utils/notifier";
import { sendTelegramMessage } from "../utils/telegram";

/**
 * Hilfsfunktion für ein schönes, lesbares Zeitformat (z.B. 24.11.2026, 14:32:05)
 */
function getFormattedTimestamp(): string {
    return new Date().toLocaleString("de-AT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}

/**
 * Führt einen Job einmalig aus und kümmert sich um Logging & Benachrichtigungen
 */
export async function runJob(job: IJob): Promise<void> {
    const startTime = Date.now();
    const timestampStr = getFormattedTimestamp();
    console.log(`[Scheduler] Starte Job: "${job.name}" am ${timestampStr}`);

    try {
        await job.execute();
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        const endTimeStr = getFormattedTimestamp();

        console.log(
            `[Scheduler] Job "${job.name}" erfolgreich beendet um ${endTimeStr} (${duration}s).`
        );

        await sendTelegramMessage(
            `✅ *HomeBot Erfolg*\n\nDer Job *${job.name}* wurde erfolgreich ausgeführt (${duration}s).\n🕒 _${endTimeStr}_`
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`[Scheduler] Fehler in Job "${job.name}":`, errorMessage);

        try {
            await sendErrorEmail(`Fehler im Job: ${job.name}`, errorMessage);
        } catch (mailError) {
            console.error(
                `[Scheduler] Konnte Fehler-Mail nicht senden für ${job.name}:`,
                mailError
            );
        }
    }
}

/**
 * Plant einen Job entweder per Cron ein oder führt ihn einmalig sofort aus
 */
export function scheduleJob(job: IJob): void {
    // 1. Fall: Einmaliger Job beim Start
    if (job.runOnce || !job.cronSchedule) {
        console.log(`[Scheduler] Führe Einmal-Job aus: "${job.name}"`);
        void runJob(job);
        return;
    }

    // 2. Fall: Wiederkehrender Cron-Job
    if (!cron.validate(job.cronSchedule)) {
        console.error(
            `[Scheduler] Ungültiger Cron-Zeitplan für Job: ${job.name} (${job.cronSchedule})`
        );
        return;
    }

    cron.schedule(job.cronSchedule, () => {
        void runJob(job);
    });

    console.log(`[Scheduler] Job eingeplant: "${job.name}" mit Zeitplan [${job.cronSchedule}]`);
}

/**
 * Nimmt eine Liste von Jobs entgegen und verarbeitet alle
 */
export function initScheduler(jobs: IJob[]): void {
    console.log(`[Scheduler] Initialisiere Scheduler mit ${jobs.length} Job(s)...`);
    for (const job of jobs) {
        scheduleJob(job);
    }
}
