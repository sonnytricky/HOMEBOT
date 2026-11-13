---
hide:
    - path
---

# Was ist der HomeBot?

Der **HomeBot** ist ein selbstgehosteter, modularer Automatisierungs- und Aufgaben-Scheduler (Hintergrunddienst), den du auf deinem eigenen Server (z. B. über Docker) betreibst. Er fungiert als dein persönlicher digitaler Assistent für routinemäßige Aufgaben, Skripte, Systemprüfungen und Erinnerungen.

### Die Hauptmerkmale im Überblick:

* **Zweistufige Job-Verwaltung:** Du kannst Aufgaben wahlweise als **Einmal-Jobs** (die genau einmal beim Start des Containers ausgeführt werden) oder als **wiederkehrende Cron-Jobs** (z. B. nach einem festen Zeitplan wie täglich um 6:00 Uhr) definieren.
* **Einfache Dateibasis:** Jobs werden unkompliziert als einzelne `.ts`- oder `.js`-Dateien (oder in eigenen Ordnern) auf deinem Host-System abgelegt. Dank Docker-Bind-Mounts greift der Bot in Echtzeit darauf zu.
* **Automatisches Benachrichtigungssystem:**
* *Erfolgreiche Ausführungen* melden sich vollautomatisch per **Telegram**-Nachricht.
* *Unerwartete Fehler* oder Ladefehler werden sofort abgefangen und als formatierte Warnung per **E-Mail** an dich versendet.


* **Sicher & Autonom:** Der Bot läuft isoliert in einem Container, erstellt fehlende Verzeichnisse beim Start eigenständig und arbeitet mit strikt getrennten Dateirechten (Non-Root), um dein Host-System zu schützen.

Kurz gesagt: Der HomeBot automatisiert deine alltäglichen Server-Skripte und hält dich über den Status im Hintergrund zuverlässig auf dem Laufenden.

---
