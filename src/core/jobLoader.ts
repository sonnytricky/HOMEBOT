import fs from "fs";
import path from "path";
import { IJob } from "../types/job";
import { sendErrorEmail } from "../utils/notifier";

/**
 * Lädt Einmal-Jobs direkt aus src/jobs/ (erlaubt sowohl einzelne .ts/.js Dateien als auch Unterordner)
 */
async function loadDirectJobs(): Promise<IJob[]> {
    const jobsDirectory = path.join(process.cwd(), "src/jobs");
    const loadedJobs: IJob[] = [];

    if (!fs.existsSync(jobsDirectory)) {
        return loadedJobs;
    }

    const entries = fs.readdirSync(jobsDirectory, { withFileTypes: true });

    for (const entry of entries) {
        // Ignoriere den "scheduled"-Ordner
        if (entry.name === "scheduled") continue;

        const fullPath = path.join(jobsDirectory, entry.name);
        let jobModule;

        try {
            // Fall 1: Es ist eine direkte Datei (z.B. testjob.ts oder hallo-welt-job.ts)
            if (entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".js"))) {
                jobModule = await import(fullPath);
            }
            // Fall 2: Es ist ein Unterordner (z.B. mein-job/index.ts)
            else if (entry.isDirectory()) {
                const entryFile = path.join(fullPath, "index.ts");
                const entryFileJs = path.join(fullPath, "index.js");

                if (fs.existsSync(entryFile)) {
                    jobModule = await import(entryFile);
                } else if (fs.existsSync(entryFileJs)) {
                    jobModule = await import(entryFileJs);
                }
            }

            // Prüfen, ob ein gültiges Job-Objekt exportiert wurde
            if (jobModule && jobModule.default) {
                const job: IJob = jobModule.default;
                job.runOnce = true; // Einmalige Ausführung erzwingen

                if (job.name && typeof job.execute === "function") {
                    loadedJobs.push(job);
                    console.log(
                        `[JobLoader] Einmal-Job geladen [src/jobs/${entry.name}]: "${job.name}"`
                    );
                }
            }
        } catch (loadError) {
            console.error(
                `[JobLoader] Konnte Einmal-Job aus ${entry.name} nicht laden:`,
                loadError
            );
            await sendErrorEmail(`Job-Ladefehler (src/jobs/${entry.name})`, String(loadError));
        }
    }

    return loadedJobs;
}

/**
 * Lädt geplante Cron-Jobs aus src/jobs/scheduled/
 */
async function loadScheduledJobs(): Promise<IJob[]> {
    const scheduledDirectory = path.join(process.cwd(), "src/jobs/scheduled");
    const loadedJobs: IJob[] = [];

    if (!fs.existsSync(scheduledDirectory)) {
        return loadedJobs;
    }

    const jobFolders = fs.readdirSync(scheduledDirectory, { withFileTypes: true });

    for (const folder of jobFolders) {
        if (folder.isDirectory()) {
            const jobPath = path.join(scheduledDirectory, folder.name);
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
                        loadedJobs.push(job);
                        console.log(
                            `[JobLoader] Geplanter Job geladen [scheduled]: "${job.name}" [${job.cronSchedule}]`
                        );
                    } else {
                        console.warn(
                            `[JobLoader] Das Modul in scheduled/${folder.name} hat keinen gültigen Cron-Zeitplan.`
                        );
                    }
                }
            } catch (loadError) {
                console.error(
                    `[JobLoader] Konnte Job aus scheduled/${folder.name} nicht laden:`,
                    loadError
                );
                await sendErrorEmail(
                    `Job-Ladefehler (scheduled/${folder.name})`,
                    String(loadError)
                );
            }
        }
    }

    return loadedJobs;
}

/**
 * Kombiniert beide Loader und gibt alle Jobs zurück
 */
export async function loadAllJobs(): Promise<IJob[]> {
    console.log("[JobLoader] Starte kombinierten Job-Ladevorgang...");

    const directJobs = await loadDirectJobs();
    const scheduledJobs = await loadScheduledJobs();

    const allJobs = [...directJobs, ...scheduledJobs];
    console.log(
        `[JobLoader] Insgesamt ${allJobs.length} Job(s) geladen (${directJobs.length} einmalig, ${scheduledJobs.length} geplant).`
    );

    return allJobs;
}
