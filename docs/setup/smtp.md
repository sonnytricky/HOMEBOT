---
icon: simple/gmail
---

# SMTP

### 1. Voraussetzungen & Benötigtes

1. **Node.js & npm** (läuft in deiner Entwicklungsumgebung oder im Docker-Container).
2. **Nodemailer** und **dotenv** als installierte Dependencies im Projekt:

```bash
npm install nodemailer dotenv
npm install --save-dev @types/nodemailer ts-node

```

3. Ein **Google-Konto** (Gmail) mit aktivierter **2-Schritt-Verifizierung** und einem generierten **App-Passwort** (16 Zeichen).

---

### 2. `.env` Variablen ergänzen

Erstelle oder ergänze im Wurzelverzeichnis deines Projekts eine `.env`-Datei mit folgenden Parametern:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=example@gmail.com                                        # von dieser Mail-Adresse werden die Mails versendet
SMTP_PASS=dein_16_stellignes_app_passwort_ohne_leerzeichen         # App-Passwort muss von der SMTP_USER Mail-Adresse sein
SMTP_FROM=example@gmail.com                                        # gleich wie SMTP_USER
ERROR_EMAIL_RECEIVER=example1@gmail.com                            # Bekommt die Fehlermeldungen

```

---

### 3. Code-Datei

[notifier.ts](src/utils/notifier.ts)

---

### E-Mail-Versand testen

Erstelle im `tests/`-Ordner eine Testdatei (`tests/test-email.ts`), um den Versand zu prüfen:

```typescript
import dotenv from "dotenv";
import { sendErrorEmail } from "../src/utils/notifier";

dotenv.config();

async function runTest() {
    console.log("🧪 Starte E-Mail-Test...");
    try {
        await sendErrorEmail(
            "Test-Nachricht vom HomeBot",
            "Dies ist ein automatisierter Test, um die SMTP-Verbindung zu prüfen."
        );
        console.log("✅ E-Mail erfolgreich versendet!");
    } catch (error) {
        console.error("❌ E-Mail-Test fehlgeschlagen:", error);
        process.exit(1);
    }
}

runTest();
```

### 4. Eintrag in die package.json

```json
"scripts": {
    "test:email": "ts-node tests/test-email.ts",
}
```

#### - Test ausführen:

```bash
npm run test:email
```

---
