```
HOMEBOT/
│
├── .docs/                         # Projektweite-dokumentation
│   ├── architecture/              # Architektur & technische Konzepte
│   ├── setup/                     # Installations- und Einrichtungsanleitungen
│   ├── development/               # Entwicklungsrichtlinien
│   └── Projektstruktur.md
│
├── .gitea/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   ├── idea.md
│   │   └── task.md
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── workflows/                 # CI/CD Workflows
│
├── .images/                       # Repository-Bilder
│   └── repo-logo.png
│
├── .notes/                        # Interne Notizen, Ideen & Planung
│   ├── roadmap/
│   ├── concepts/
│   ├── decisions/
│   └── TODO.md
│
├── .vscode/
│   └── settings.json
│
├── docs/                          # Projektdokumentation über GH-Pages
│   ├── index.md                   # Home-Seite
│   ├── installation/              # Hilfe bei der Installation
│   ├── setup/                     # Einrichtungs-Anleitungen
│   └── testing/                   # wie und für was, welche tests sind
│
├── src/
│   │
│   ├── core/                      # Zentrale Bot-Funktionalität
│   │   ├── config/                # Konfiguration
│   │   ├── services/              # Zentrale Services
│   │   ├── handlers/              # Event- und Request-Handler
│   │   ├── utils/                 # Hilfsfunktionen
│   │   └── index.ts
│   │
│   ├── jobs/                      # Hintergrundjobs und Aufgaben
│   │   ├── scheduled/             # Zeitgesteuerte Jobs
│   │   ├── recurring/             # Wiederkehrende Aufgaben
│   │   └── index.ts
│   │
│   ├── types/                     # Globale TypeScript-Typen
│   │   ├── config.ts
│   │   ├── events.ts
│   │   └── index.ts
│   │
│   ├── integrations/              # Externe APIs und Dienste
│   │
│   ├── modules/                   # Funktionale Bot-Module
│   │
│   ├── database/                  # Datenbankzugriff
│   │   ├── models/
│   │   ├── repositories/
│   │   └── index.ts
│   │
│   ├── utils/                     # Allgemeine Hilfsfunktionen
│   │
│   └── index.ts                   # Einstiegspunkt
│
├── tests/                         # Tests
│   ├── unit/
│   └── integration/
│
├── .env.example
│
├── .eslintignore
├── .eslintrc.json
├── .gitattributes
├── .gitignore
├── .prettierignore
├── .prettierrc
│
├── docker-compose.yml
├── Dockerfile
│
├── LICENSE
├── README.md
├── package.json
├── package-lock.json
└── tsconfig.json
```
