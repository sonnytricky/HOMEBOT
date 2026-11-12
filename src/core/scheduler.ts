import cron from "node-cron";
import fs from "fs";
import path from "path";
import { IJob } from "../types/job";
import { sendErrorEmail } from "../utils/notifier";
import { sendTelegramMessage } from "../utils/telegram";

/**
 * Hilfsfunktion zur Ausführung und Fehlerbehandlung eines Jobs
 */
async function executeJobInstance(job: IJob): Promise<void> {
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
}

/**
 * Registriert und plant einen Job ein (oder führt ihn direkt aus)
 */
export function scheduleJob(job: IJob, runImmediatelyOnStart: boolean = false): void {
    // Wenn ein Cron-Plan existiert, diesen einplanen
    if (job.cronSchedule && cron.validate(job.cronSchedule)) {
        cron.schedule(job.cronSchedule, async () => {
            await executeJobInstance(job);
        });
        console.log(`[Scheduler] Job eingeplant: "${job.name}" [${job.cronSchedule}]`);
    } else {
        console.log(`[Scheduler] Job hat keinen Cron-Plan (reiner Start-Job): "${job.name}"`);
    }

    // Wenn gewünscht oder kein Cron-Plan vorhanden: Direkt beim Start ausführen
    if (runImmediatelyOnStart || !job.cronSchedule) {
        console.log(`[Scheduler] Führe Job "${job.name}" direkt nach Container-Start aus...`);
        setImmediate(async () => {
            await executeJobInstance(job);
        });
    }
}

/**
 * Hilfsfunktion zum Laden von Job-Modulen aus einem Verzeichnis
 */
async function loadJobsFromDir(dirPath: string, isScheduledDir: boolean): Promise<void> {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        return;
    }

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
        if (entry.isDirectory() && isScheduledDir) {
            // Unterordner in 'scheduled/' (z.B. jobs/scheduled/mein-job/index.js)
            const jobPath = path.join(dirPath, entry.name);
            await loadSingleJobFile(jobPath, entry.name);
        } else if (!entry.isDirectory() && !isScheduledDir && (entry.name.endsWith(".js") || entry.name.endsWith(".ts"))) {
            // Direkte Dateien in 'jobs/' (z.B. jobs/mein-testjob.js)
            const filePath = path.join(dirPath, entry.name);
            await loadSingleJobFile(path.dirname(filePath), entry.name, filePath);
        }
    }
}

async function loadSingleJobFile(jobFolderPath: string, identifier: string, explicitFile?: string): Promise<void> {
    const entryFileJs = explicitFile || path.join(jobFolderPath, "index.js");
    const entryFileTs = explicitFile || path.join(jobFolderPath, "index.ts");

    try {
        let jobModule;
        if (fs.existsSync(entryFileJs)) {
            jobModule = await import(entryFileJs);
        } else if (fs.existsSync(entryFileTs)) {
            jobModule = await import(entryFileTs);
        }

        if (jobModule && jobModule.default) {
            const job: IJob = jobModule.default;
            if (job.name && typeof job.execute === "function") {
                // Jobs direkt in 'jobs/ ohne Zeit' sollen standardmäßig beim Start laufen
                const runOnStart = !job.cronSchedule || job.name.includes("Test");
                scheduleJob(job, runOnStart);
            } else {
                console.warn(`[Scheduler] Modul in "${identifier}" exportiert kein gültiges IJob-Objekt.`);
            }
        }
    } catch (loadError) {
        console.error(`[Scheduler] Konnte Job aus "${identifier}" nicht laden:`, loadError);
        await sendErrorEmail(`Job-Ladefehler (${identifier})`, String(loadError));
    }
}

/**
 * Hauptfunktion: Lädt sowohl geplante Jobs als auch Direkt-Jobs
 */
export async function loadAndRegisterAllJobs(): Promise<void> {
    const rootJobsDir = path.join(__dirname, "../jobs");
    const scheduledJobsDir = path.join(__dirname, "../jobs/scheduled");

    console.log("[Scheduler] Lade Jobs aus externen Ordnern...");

    // 1. Direkt im 'jobs/' Ordner liegende Dateien laden (z.B. Einmal-Tests)
    await loadJobsFromDir(rootJobsDir, false);

    // 2. Im 'jobs/scheduled/' Ordner liegende Unterordner laden
    await loadJobsFromDir(scheduledJobsDir, true);

    console.log("[Scheduler] Job-Ladevorgang abgeschlossen.");
}