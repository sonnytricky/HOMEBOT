import fs from "fs";
import path from "path";
import { IJob } from "../types/job";
import { sendErrorEmail } from "../utils/notifier";

/**
 * Lädt Direkt-Jobs (Einmal-Jobs / manuelle Jobs) aus dem Ordner jobs/
 */
export async function loadDirectJobs(): Promise<IJob[]> {
    const jobsDirectory = path.join(process.cwd(), "jobs");
    const loadedJobs: IJob[] = [];

    if (!fs.existsSync(jobsDirectory)) {
        console.warn(`[JobLoader] Jobs-Verzeichnis nicht gefunden: ${jobsDirectory}`);
        return loadedJobs;
    }

    const entries = fs.readdirSync(jobsDirectory, { withFileTypes: true });

    for (const entry of entries) {
        if (entry.name === "scheduled") continue;
        if (entry.name.startsWith(".")) continue;

        const fullPath = path.join(jobsDirectory, entry.name);
        let jobModule: { default?: IJob } = {};

        try {
            if (entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".js"))) {
                jobModule = await import(fullPath);
            } else if (entry.isDirectory()) {
                const entryFile = path.join(fullPath, "index.ts");
                const entryFileJs = path.join(fullPath, "index.js");

                if (fs.existsSync(entryFile)) {
                    jobModule = await import(entryFile);
                } else if (fs.existsSync(entryFileJs)) {
                    jobModule = await import(entryFileJs);
                }
            }

            if (jobModule && jobModule.default) {
                const job: IJob = jobModule.default;
                job.runOnce = true;

                if (job.name && typeof job.execute === "function") {
                    loadedJobs.push(job);
                    console.log(
                        `[JobLoader] Direkt-Job geladen [jobs/${entry.name}]: "${job.name}"`
                    );
                } else {
                    console.warn(
                        `[JobLoader] Das Modul in jobs/${entry.name} hat kein gültiges Job-Format.`
                    );
                }
            }
        } catch (loadError) {
            console.error(
                `[JobLoader] Fehler beim Laden des Jobs aus jobs/${entry.name}:`,
                loadError
            );
            await sendErrorEmail(`Job-Ladefehler (jobs/${entry.name})`, String(loadError));
        }
    }

    return loadedJobs;
}

/**
 * Lädt geplante Cron-Jobs aus dem Unterordner jobs/scheduled/
 */
export async function loadScheduledJobs(): Promise<IJob[]> {
    const scheduledDirectory = path.join(process.cwd(), "jobs", "scheduled");
    const loadedJobs: IJob[] = [];

    if (!fs.existsSync(scheduledDirectory)) {
        console.warn(`[JobLoader] Scheduled-Verzeichnis nicht gefunden: ${scheduledDirectory}`);
        return loadedJobs;
    }

    const jobFolders = fs.readdirSync(scheduledDirectory, { withFileTypes: true });

    for (const folder of jobFolders) {
        if (folder.isDirectory() && !folder.name.startsWith(".")) {
            const jobPath = path.join(scheduledDirectory, folder.name);
            const entryFile = path.join(jobPath, "index.ts");
            const entryFileJs = path.join(jobPath, "index.js");

            try {
                let jobModule: { default?: IJob } = {};
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
                            `[JobLoader] Geplanter Job geladen [scheduled/${folder.name}]: "${job.name}" [${job.cronSchedule}]`
                        );
                    } else {
                        console.warn(
                            `[JobLoader] Das Modul in scheduled/${folder.name} hat keinen gültigen Cron-Zeitplan.`
                        );
                    }
                }
            } catch (loadError) {
                console.error(
                    `[JobLoader] Fehler beim Laden des geplanten Jobs aus scheduled/${folder.name}:`,
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
        `[JobLoader] Insgesamt ${allJobs.length} Job(s) geladen (${directJobs.length} direkt, ${scheduledJobs.length} geplant).`
    );
    return allJobs;
}
