import path from "path";
import fs from "fs";
import { loadAndRegisterAllJobs } from "./core/scheduler.js";

async function bootstrap(): Promise<void> {
    console.log("[HomeBot] Starte System-Initialisierung...");

    // Sicherstellen, dass die externen Ordner im Container existieren
    const requiredDirs = [
        path.join(__dirname, "jobs/scheduled"),
        path.join(__dirname, "modules"),
        path.join(__dirname, "utils")
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

    // Automatischen Job-Loader ausführen
    await loadAndRegisterAllJobs();

    console.log("[HomeBot] Alle Dienste erfolgreich gestartet und bereit.");
}

bootstrap().catch((error) => {
    console.error("[HomeBot] Schwerwiegender Fehler beim Start:", error);
    process.exit(1);
});