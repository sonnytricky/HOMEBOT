import testJob from "../src/jobs/scheduled/test-job/index";

async function runTestNow() {
    console.log("Manueller Start des Test-Jobs...");
    try {
        await testJob.execute();
        console.log("Test erfolgreich abgeschlossen!");
    } catch (err) {
        console.error("Test fehlgeschlagen mit Fehler:", err);
    }
}

runTestNow();
