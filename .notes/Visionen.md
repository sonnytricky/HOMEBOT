# Was das Projekt können soll:

- docker-compose
- **modulare** Bot 
- Lege **ein** Git-Repository für deinen Bot an, das den gesamten TS-Code (`core/`, `modules/`, etc.) sowie die `Dockerfile` enthält.

- Wenn du deinen Code auf GitHub pushst, lässt du über GitHub Actions automatisch ein Docker-Image bauen und in die GitHub Container Registry (GHCR) pushen.
- Auf deinem Server (z. B. auf dem Ugreen NAS / Proxmox) nutzt du dann nur noch eine `docker-compose.yml`, die dieses fertig gebaute Image zieht, und bindest per Docker-Volume lediglich deine `.env` oder eine `config.json` ein.

---

## Meine Empfehlungen zur Organisation

| Verzeichnis     | Aufgabe                               |
| --------------- | ------------------------------------- |
| `core/`         | Grundlegende Bot-Funktionalität       |
| `modules/`      | Eigenständige Bot-Funktionen          |
| `jobs/`         | Cronjobs und Hintergrundaufgaben      |
| `integrations/` | Discord, APIs, externe Dienste etc.   |
| `database/`     | Datenbank und Datenzugriff            |
| `types/`        | Gemeinsame TypeScript-Typdefinitionen |
| `utils/`        | Wiederverwendbare Hilfsfunktionen     |
| `tests/`        | Automatisierte Tests                  |

### Drei wichtige Architekturentscheidungen

1. Core und Modules trennen: Core enthält die Infrastruktur, Modules die eigentliche Bot-Logik.
2. Integrationen kapseln: Externe APIs sollten nicht direkt überall im Projekt angesprochen werden.
3. Jobs modular halten: Jeder Job sollte möglichst unabhängig funktionieren.

### Was ich zusätzlich ändern würde

- `.docs` für offizielle Dokumentation verwenden.
- `.notes` für interne Gedanken, Ideen und noch nicht umgesetzte Konzepte behalten.
- `tests` auf Root-Ebene anlegen.
- `utils` nicht doppelt verwenden: `core/utils` nur für Core-interne Funktionen, `src/utils` für allgemeine Funktionen.

Mein Rat: Lege nicht sofort alle vorgeschlagenen Ordner an. Erstelle zunächst nur die Struktur, für die du tatsächlich Verwendung hast. So bleibt das Repository übersichtlich und wächst organisch mit dem Bot.

```text
bot/
├── core/
│   ├── scheduler.ts
│   ├── events.ts
│   ├── logger.ts
│   └── config.ts
│
├── modules/
│   ├── garbage/
│   │   ├── index.ts
│   │   └── calendar.ts
│   │
│   ├── backup/
│   │   └── index.ts
│   │
│   ├── weather/
│   │   └── index.ts
│   │
│   └── system/
│       └── index.ts
│
├── bot/
│   └── telegram.ts
│
├── Dockerfile
└── docker-compose.yml
```
