---
hide: 
    - path
---

# HomeBot – Architektur, Features & Betriebsanleitung

---

## 1. Systemvoraussetzungen

Bevor der HomeBot gestartet werden kann, müssen folgende Voraussetzungen auf deinem Host-System erfüllt sein:

* **Docker & Docker Compose:** Müssen auf dem Host-System installiert sein, um den Container im Hintergrund zu betreiben.

---

## 2. Integrierte Features des HomeBots

Der HomeBot ist als modularer, robuster Hintergrunddienst konzipiert und besitzt bereits folgende integrierte Kernfunktionen:

* **Zweistufiger Job-Loader:**
* *Einmal-Jobs:* Skripte direkt im Hauptordner `jobs/`, die genau einmal beim Start des Containers ausgeführt werden.
* *Geplante Cron-Jobs:* Skripte im Unterordner `scheduled/`, die über `node-cron` zeitgesteuert im Hintergrund laufen.

* **Automatisches Benachrichtigungssystem:**
* Erfolgreiche Job-Ausführungen melden sich vollautomatisch per Telegram.

* Unerwartete Fehler oder Ladeprobleme werden abgefangen und als formatierte Benachrichtigung per E-Mail (über Nodemailer) an den Admin gesendet.

* **Automatisierte Initialisierung:** Beim Systemstart prüft der Bot eigenständig, ob alle notwendigen Verzeichnisse existieren, und legt sie bei Bedarf automatisch an.

* **Sicherer Docker Multi-Stage Build:**
* Der Build-Prozess kompiliert den TypeScript-Code sauber in einer isolierten Umgebung.
* Das finale Produktions-Image (basierend auf Node.js Alpine) enthält nur die minimal notwendigen Laufzeit-Abhängigkeiten.
* Der Container läuft aus Sicherheitsgründen standardmäßig als nicht-privilegierter User (`node`).

---

## 3. Host-Ordnerstruktur

Durch die in der `docker-compose.yml` definierten Bind Mounts spiegelt sich der Zustand des Containers direkt auf deinen Host-Server wider. Die empfohlene und vom Job-Loader erwartete Ordnerstruktur sieht auf deinem Host wie folgt aus:

```text
~/HOMEBOT/
├── docker-compose.yml          # Docker-Setup und Container-Steuerung
├── .env                        # Sensible Konfigurationsdaten & Secrets
├── data/                       # Persistente Daten (z. B. für SQLite oder lokale Datenbanken)
├── modules/                    # Wiederverwendbare Geschäftslogiken und Module
├── utils/                      # Hilfsfunktionen (z. B. Notifier, Telegram-API, Logger)
└── jobs/                       # Zentrales Verzeichnis für alle Aufgaben
    ├── testjob.ts              # Einmalige Jobs (laufen genau einmal beim Container-Start)
    └── scheduled/              # Wiederkehrende Hintergrund-Jobs
        └── trash-reminder/     # Beispiel-Unterordner für einen Job
            └── index.ts        # Job-Definition (Cron-Expression + Ausführungslogik)
```

---