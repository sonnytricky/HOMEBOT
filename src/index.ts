import fs from "fs";
import path from "path";
import { loadAllJobs } from "./core/jobLoader";
import { initScheduler } from "./core/scheduler";

/**
 * Stellt sicher, dass alle benötigten Ordner und Unterordner existieren
 */
function ensureDirectories(): void {
    const requiredDirs = [
        path.join(__dirname, "jobs"),
        path.join(__dirname, "jobs/scheduled"),
        path.join(__dirname, "modules"),
        path.join(__dirname, "utils"),
        path.join(process.cwd(), "data"), // Für ./data:/app/data
    ];

    for (const dir of requiredDirs) {
        if (!fs.existsSync(dir)) {
            try {
                fs.mkdirSync(dir, { recursive: true });
                console.log(`[Init] Verzeichnis automatisch erstellt: ${dir}`);
            } catch (err) {
                console.error(`[Init] Konnte Verzeichnis nicht erstellen (${dir}):`, err);
            }
        }
    }
}

async function main() {
    console.log("🤖 HomeBot wird gestartet...");

    // 1. Ordnerstruktur auf dem Host/Container sicherstellen
    ensureDirectories();

    // 2. Alle Jobs (Einmal-Jobs & Cron-Jobs) über den Loader einlesen
    const jobs = await loadAllJobs();

    // 3. Jobs an den Scheduler übergeben
    initScheduler(jobs);

    console.log("🚀 HomeBot Core läuft und wartet auf Cron-Trigger.");
}

main().catch((err) => {
    console.error("Kritischer Fehler beim Starten des HomeBots:", err);
});
