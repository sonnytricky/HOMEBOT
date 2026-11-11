# Was das Projekt können soll:

- docker-compose
- **modulare** Bot
- Lege **ein** Git-Repository für deinen Bot an, das den gesamten TS-Code (`core/`, `modules/`, etc.) sowie die `Dockerfile` enthält.

- Wenn du deinen Code auf GitHub pushst, lässt du über GitHub Actions automatisch ein Docker-Image bauen und in die GitHub Container Registry (GHCR) pushen.
- Auf deinem Server (z. B. auf dem Ugreen NAS / Proxmox) nutzt du dann nur noch eine `docker-compose.yml`, die dieses fertig gebaute Image zieht, und bindest per Docker-Volume lediglich deine `.env` oder eine `config.json` ein.

---

## Organisation

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

### Architekturentscheidungen

1. Core und Modules trennen: Core enthält die Infrastruktur, Modules die eigentliche Bot-Logik.
2. Integrationen kapseln: Externe APIs sollten nicht direkt überall im Projekt angesprochen werden.
3. Jobs modular halten: Jeder Job sollte möglichst unabhängig funktionieren.
