import { loadAndRegisterAllJobs } from "./core/scheduler";

async function main() {
    console.log("🤖 HomeBot wird gestartet...");

    // Lade alle Jobs dynamisch und aktiviere den Cron-Scheduler
    await loadAndRegisterAllJobs();

    console.log("🚀 HomeBot Core läuft und wartet auf Cron-Trigger.");
}

main().catch((err) => {
    console.error("Kritischer Fehler beim Starten des HomeBots:", err);
});
