Hier ist ein praktisches Test-Skript für deinen `tests/`-Ordner (`tests/test-email.ts`), mit dem du prüfen kannst, ob der E-Mail-Versand über deine SMTP-Zugangsdaten und die `SMTP_FROM`-Adresse reibungslos funktioniert.

### 1. Das Test-Skript (`tests/test-email.ts`)

Erstelle den Ordner `tests` (falls noch nicht geschehen) und darin die Datei `test-email.ts`:

```typescript
import dotenv from "dotenv";
import { sendErrorEmail } from "../src/utils/notifier";

// Lädt die .env Variablen aus dem Stammverzeichnis
dotenv.config();

async function runEmailTest() {
    console.log("🧪 Starte E-Mail-Test...");
    console.log(`Verwende SMTP-Host: ${process.env.SMTP_HOST}`);
    console.log(`Absender (From): ${process.env.SMTP_FROM || process.env.SMTP_USER}`);
    console.log(`Empfänger (To): ${process.env.ERROR_EMAIL_RECEIVER || process.env.SMTP_USER}`);

    try {
        await sendErrorEmail(
            "Test-Nachricht vom HomeBot",
            "Dies ist eine automatisierte Test-Nachricht, um zu prüfen, ob der E-Mail-Versand (Nodemailer) fehlerfrei funktioniert."
        );
        console.log("✅ Test-Skript beendet. Bitte prüfe deinen Posteingang!");
    } catch (error) {
        console.error("❌ E-Mail-Test fehlgeschlagen:", error);
    }
}

runEmailTest();
```

---

### 2. Ausführen mit `ts-node`

Da du `ts-node` bereits in deinen Dev-Abhängigkeiten hast, kannst du das Skript direkt über das Terminal ausführen, ohne vorher einen Build machen zu müssen:

```bash
npx ts-node tests/test-email.ts

```

Falls du dafür ein eigenes Skript in deine `package.json` eintragen möchtest, kannst du unter `scripts` folgendes ergänzen:

```json
"test:email": "ts-node tests/test-email.ts"

```

Dann reicht ein simples `npm run test:email` aus.
