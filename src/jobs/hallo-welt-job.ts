/**
 * Beispiel für einen manuell erstellten Job auf dem Host-Server.
 * Pfad: ~/homebot/jobs/scheduled/hallo-welt/index.js
 */
module.exports = {
    name: "Hallo Welt Test-Job",
    cronSchedule: "* * * * *",
    execute: async () => {
        console.log("👋 Hallo! Dieser Job läuft aus dem externen Ordner außerhalb des Docker-Images.");
        // Fügen Sie hier Ihre eigene Logik ein (z. B. Sensor-Abfragen, API-Calls)
    }
};