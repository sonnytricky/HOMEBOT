---
icon: simple/docker
---

# Docker-Compose

## 1. Systemvoraussetzungen & Architektur

Der HomeBot läuft gekapselt in einem Docker-Container. Das fertige Image enthält bereits Node.js, alle Abhängigkeiten sowie den kompilierten Core.

- **Zwei-Wege-Synchronisation (Bind Mounts):** Flexible Teile wie Jobs, Module und Utilities liegen außerhalb des Containers auf deinem Host-Server und werden in den Container gespiegelt.
- **Rechte-Trennung:** Der Container läuft mit deiner Host-User-ID (`user: "${PUID}:${PGID}"`), sodass vom Bot oder dir erstellte Dateien stets die korrekten Dateirechte besitzen und ohne `sudo` bearbeitet werden können.

---

## 2. Erstellen des Verzeichnisses

Erstelle einen Ordner namens `HOMEBOT` in dem Verzeichnis, in dem du deine Docker-Container verwahrst (z. B. im Home-Verzeichnis deines Users):

```bash
mkdir -p ~/HOMEBOT
cd ~/HOMEBOT

```

---

## 3. Konfigurationsdateien anlegen

Erstelle im Hauptverzeichnis deines `HOMEBOT`-Ordners die beiden benötigten Dateien `docker-compose.yml` und `.env`:

```bash
touch docker-compose.yml
touch .env

```

### A Die `docker-compose.yml` bearbeiten

Öffne die Datei (z. B. mit `nano docker-compose.yml`) und füge folgende Konfiguration ein. Sie zieht automatisch das fertige Image aus der GitHub Container Registry und liest die System-IDs aus deiner `.env` aus:

```yaml
services:
    homebot:
        image: ghcr.io/sonnytricky/homebot:latest
        container_name: homebot
        restart: unless-stopped
        user: "${PUID}:${PGID}"
        env_file:
            - .env
        volumes:
            - ./jobs:/app/src/jobs
            - ./modules:/app/src/modules
            - ./utils:/app/src/utils
            - ./data:/app/data
        environment:
            - NODE_ENV=production
            - TZ=${TZ}
        logging:
            driver: "json-file"
            options:
                max-size: "10m"
                max-file: "3"
```

### B Die `.env` bearbeiten

Öffne die `.env`-Datei:

```bash
nano .env

```

Füge deine Telegram-Zugangsdaten, SMTP-Daten sowie die Systemvariablen für Docker ein:

```env
# =====================================================================
# SYSTEM & DOCKER USER CONFIG
# =====================================================================
PUID=1000
PGID=1000
TZ=Europe/Vienna

# =====================================================================
# Telegram
# =====================================================================
# (Token deines neuen HomeBots)
TELEGRAM_BOT_TOKEN=dein_telegram_bot_token_hier
# (Deine persönliche User-ID, nicht die des botes)
TELEGRAM_CHAT_ID=deine_chat_id_hier

# =====================================================================
# GMAIL
# =====================================================================
SMTP_HOST=smtp.dein-anbieter.de
SMTP_PORT=587
SMTP_USER=deine_email@domain.de
SMTP_PASS=dein_mail_passwort
SMTP_FROM=bot@deinedomain.de
ERROR_EMAIL_RECEIVER=admin@domain.de

# =====================================================================
```

- **Nano Bedienung:** Speichern mit `Strg + O`, mit `Enter` bestätigen und Schließen mit `Strg + X`.

---

## 4. Betrieb & Befehle (CLI)

Navigiere auf deinem Server in das Projektverzeichnis:

```bash
cd ~/HOMEBOT

```

### Den HomeBot starten

Um das neueste Image herunterzuladen und den Container im Hintergrund zu starten:

```bash
docker compose pull
docker compose up -d

```

### Logs auslesen

Um zu überwachen, ob der Job-Loader alle Jobs fehlerfrei einliest und ausführt:

- **Live-Stream der Logs (Echtzeit):**

```bash
docker compose logs -f

```

_(Verlassen des Streams mit `Strg + C` – der Bot läuft im Hintergrund weiter)._

- **Die letzten 50 Log-Zeilen anzeigen:**

```bash
docker compose logs --tail=50

```

### Bot steuern (Neustart / Stoppen)

- **Neu starten (z. B. nach Anpassung von Jobs):**

```bash
docker compose restart

```

- **Komplett stoppen:**

```bash
docker compose down

```

---

## 5. Job-Verwaltung

Der integrierte Job-Loader unterscheidet automatisch zwischen zwei Arten von Aufgaben:

1. **Einmal-Jobs (`src/jobs/`):**

- Direkt als `.ts`- oder `.js`-Datei (oder als Ordner mit `index.ts`) im Hauptordner `jobs/` abgelegt (z. B. `jobs/testjob.ts`).
- Werden **genau einmal** beim Start des Containers ausgeführt.

2. **Geplante Cron-Jobs (`src/jobs/scheduled/`):**

- Als Unterordner mit einer `index.ts` im Ordner `jobs/scheduled/` abgelegt.
- Werden anhand des definierten Cron-Zeitplans (z. B. `0 18 * * *`) wiederkehrend vom Scheduler ausgeführt.

Jeder Job ist in einen Sicherheitsrahmen eingebettet: Erfolgreiche Ausführungen melden sich via Telegram, unerwartete Fehler werden automatisch abgefangen und als Benachrichtigung per E-Mail versendet.

---
