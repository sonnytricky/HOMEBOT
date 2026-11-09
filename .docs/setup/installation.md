Um dein neues TypeScript-Projekt lokal auf deinem Computer vorzubereiten und startklar zu machen, benötigst du ein paar grundlegende Tools sowie die passende Struktur im Git-Repository.

Hier ist die Schritt-für-Schritt-Anleitung, was du installieren und einrichten musst:

---

### 1. Grundlegende Software installieren (Lokale Umgebung)

Falls noch nicht geschehen, installiere folgende Tools auf deinem Entwicklungsrechner:

- **Node.js** (empfohlen ist die aktuelle LTS-Version, z. B. v20+ über den offiziellen Installer oder `nvm`), da Node auch den Paketmanager `npm` mitbringt.
- **Git** für die Versionskontrolle.
- **VS Code** als Code-Editor (mit den bereits genannten Extensions wie ESLint, Prettier und GitLens).

---

### 2. Repository initialisieren & Grundstruktur aufbauen

Erstelle lokal einen neuen Ordner, initialisiere ein Git-Repository und lege die Verzeichnisstruktur an, die wir besprochen haben:

```bash
mkdir server-assistant
cd server-assistant
git init

```

Erstelle die Ordnerstruktur:

```bash
mkdir -p src/core src/jobs src/types .github/workflows

```

---

### 3. Projekt initialisieren & TypeScript einrichten

Initialisiere ein neues Node.js-Projekt und installiere die notwendigen TypeScript- und Entwicklungswerkzeuge als Dev-Abhängigkeiten:

```bash
npm init -y
npm install -D typescript ts-node @types/node rimraf

```

Erstelle eine TypeScript-Konfigurationsdatei (`tsconfig.json`) im Stammverzeichnis:

```bash
npx tsc --init

```

_Tipp für die `tsconfig.json`: Stelle sicher, dass `outDir` auf `"./dist"` und `rootDir` auf `"./src"` gesetzt sind._

---

### 4. Benötigte Packages für Core & Jobs installieren

Installiere die Laufzeit-Bibliotheken, die du für den Scheduler, Telegram, E-Mail-Versand und HTTP-Anfragen/Scraping brauchst:

```bash
npm install node-cron telegraf nodemailer axios cheerio dotenv
npm install -D @types/node-cron @types/nodemailer

```

---

### 5. `package.json` Skripte anpassen

Öffne deine `package.json` und füge im `scripts`-Bereich Befehle für die Entwicklung und den Build hinzu:

```json
"scripts": {
  "build": "rimraf dist && tsc",
  "start": "node dist/index.js",
  "dev": "ts-node src/index.ts"
}

```

---

### 6. `.gitignore` anlegen

Erstelle eine `.gitignore`-Datei im Stammverzeichnis, damit sensible Daten und Build-Artefakte nicht versehentlich ins Repository geladen werden:

```text
node_modules/
dist/
.env
.DS_Store

```

---

### 7. Mit GitHub verbinden

Erstelle ein neues Repository auf GitHub (öffentlich oder privat) und verknüpfe es mit deinem lokalen Projekt:

```bash
git add .
git commit -m "chore: initial project setup"
git branch -M main
git remote add origin https://github.com/dein-username/dein-repo-name.git
git push -u origin main

```

Jetzt ist dein Repository perfekt vorbereitet, die Entwicklungsumgebung steht, und du kannst mit der Implementierung des Cores und der ersten Jobs beginnen!
