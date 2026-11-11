import cron from "node-cron";
import fs from "fs";
import path from "path";
import { IJob } from "../types/job";
import { sendErrorEmail } from "../utils/notifier";
import { sendTelegramMessage } from "../utils/telegram";

/**
 * Registriert und plant einen einzelnen Job ein
 */
export function scheduleJob(job: IJob): void {
    if (!cron.validate(job.cronSchedule)) {
        console.error(
            `[Scheduler] Ungültiger Cron-Zeitplan für Job: ${job.name} (${job.cronSchedule})`
        );
        return;
    }

    cron.schedule(job.cronSchedule, async () => {
        const startTime = Date.now();
        console.log(`[Scheduler] Starte Job: "${job.name}" um ${new Date().toLocaleTimeString()}`);

        try {
            await job.execute();
            const duration = ((Date.now() - startTime) / 1000).toFixed(2);

            console.log(`[Scheduler] Job "${job.name}" erfolgreich beendet (${duration}s).`);

            await sendTelegramMessage(
                `✅ *HomeBot Erfolg*\n\nDer Job *${job.name}* wurde erfolgreich ausgeführt (${duration}s).`
            );
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`[Scheduler] Fehler in Job "${job.name}":`, errorMessage);

            try {
                await sendErrorEmail(`Fehler im Job: ${job.name}`, errorMessage);
            } catch (mailError) {
                console.error(
                    `[Scheduler] Konnte nicht mal mehr die Fehler-Mail senden für ${job.name}:`,
                    mailError
                );
            }
        }
    });

    console.log(
        `[Scheduler] Job erfolgreich geladen und eingeplant: "${job.name}" [${job.cronSchedule}]`
    );
}

/**
 * Automatischer Job-Loader: Lädt alle Jobs aus dem Unterordner src/jobs/scheduled/
 */
export async function loadAndRegisterAllJobs(): Promise<void> {
    const jobsDirectory = path.join(__dirname, "../jobs/scheduled");

    if (!fs.existsSync(jobsDirectory)) {
        console.warn(`[Scheduler] Jobs-Verzeichnis existiert nicht: ${jobsDirectory}`);
        return;
    }

    const jobFolders = fs.readdirSync(jobsDirectory, { withFileTypes: true });

    for (const folder of jobFolders) {
        if (folder.isDirectory()) {
            const jobPath = path.join(jobsDirectory, folder.name);
            const entryFile = path.join(jobPath, "index.ts");
            const entryFileJs = path.join(jobPath, "index.js");

            try {
                let jobModule;
                if (fs.existsSync(entryFile)) {
                    jobModule = await import(entryFile);
                } else if (fs.existsSync(entryFileJs)) {
                    jobModule = await import(entryFileJs);
                }

                if (jobModule && jobModule.default) {
                    const job: IJob = jobModule.default;
                    if (job.name && job.cronSchedule && typeof job.execute === "function") {
                        scheduleJob(job);
                    } else {
                        console.warn(
                            `[Scheduler] Das Modul in ${folder.name} exportiert kein gültiges IJob-Objekt.`
                        );
                    }
                }
            } catch (loadError) {
                console.error(
                    `[Scheduler] Konnte Job aus Ordner ${folder.name} nicht laden:`,
                    loadError
                );
                await sendErrorEmail(`Job-Ladefehler (${folder.name})`, String(loadError));
            }
        }
    }
}
