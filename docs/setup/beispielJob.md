---
icon: simple/docusaurus
status: new
---

# Beispiel Job

Hier ist ein vollständig kommentiertes Praxisbeispiel für einen wiederkehrenden Cron-Job.
Du kannst diesen Job als Ordner unter `src/jobs/scheduled/disk-check/index.ts` auf deinem Host ablegen.

Der Job nutzt das vorgegebene `IJob`-Interface und demonstriert, wie die automatische Fehler- und Erfolgsbehandlung greift.
Es können auch **JavaScript** Jobs angelegt werden

### Beispiel-Job: Festplatten-Prüfung (`src/jobs/scheduled/disk-check/index.ts`)

```typescript
import { IJob } from "../../../types/job";

/**
 * Beispiel für einen geplanten Cron-Job.
 * Dieser Job prüft periodisch den Status und nutzt das Standard-IJob-Interface[cite: 2].
 */
const diskCheckJob: IJob = {
    // Der Name des Jobs (taucht in den Logs sowie in Telegram- & E-Mail-Meldungen auf)[cite: 1, 2]
    name: "Festplatten-Überprüfung",

    // Der Cron-Zeitplan[cite: 1, 2]:
    // "0 6 * * *" bedeutet: Jeden Tag um genau 06:00 Uhr früh.
    // (Syntax: Minute | Stunde | Tag des Monats | Monat | Wochentag)
    cronSchedule: "0 6 * * *",

    /**
     * Die Haupt-Asynchron-Methode, die vom Scheduler ausgeführt wird[cite: 1, 2].
     */
    async execute(): Promise<void> {
        console.log("[DiskCheck] Starte Analyse des Festplattenspeichers...");

        // --- Hier kommt deine eigentliche Fachlogik rein ---
        // Tipp: Komplexe Logik (wie API-Requests oder Dateisystem-Scans)
        // lagerst du am besten in den Ordner src/modules/ aus und rufst sie hier nur auf[cite: 3].

        const isDiskFull = false; // Beispiel-Zustand

        if (isDiskFull) {
            // WICHTIG: Wenn hier ein Fehler (Error) geworfen wird, fängt der Scheduler-Core
            // diesen ab und sendet dir automatisch eine formatierte E-Mail[cite: 1, 2, 3]!
            throw new Error("Warnung: Der freie Speicherplatz auf dem Server liegt unter 10%!");
        }

        console.log("[DiskCheck] Speicherprüfung erfolgreich abgeschlossen.");

        // Hinweis: Wenn execute() fehlerfrei durchläuft, sendet der Scheduler
        // automatisch die grüne Erfolgsnachricht an deinen Telegram-Bot[cite: 1, 2, 4].
    },
};

export default diskCheckJob;
```

---
