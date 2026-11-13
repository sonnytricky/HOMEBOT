---
icon: simple/telegram
---

# Telegram

### 1. Voraussetzungen & Benötigtes

1. **Node.js & npm** (läuft in deiner Entwicklungsumgebung oder im Docker-Container).
2. **Telegraf** und **dotenv** als installierte Dependencies im Projekt:

```bash
npm install telegraf dotenv
npm install --save-dev @types/nodemailer ts-node

```

3. **Bot bei Telegram erstellen**
1. Suche in Telegram nach dem **BotFather** (`@BotFather`).
2. Erstelle einen neuen Bot mit `/newbot` und folge den Anweisungen.
3. Du erhältst ein **Bot-Token** (z. B. `123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ`).
4. Ermittle deine **Chat-ID** (z. B. über den Bot `@userinfobot`), damit der Bot weiß, wem er die Nachricht schicken soll.



---

### 2. `.env` Variablen ergänzen

Füge die Telegram-Zugangsdaten in deine `.env`-Datei ein:

```env
TELEGRAM_BOT_TOKEN=dein_bot_token_hier
TELEGRAM_CHAT_ID=deine_chat_id_hier

```

---

### 3. Telegram-Notifier erstellen (`src/utils/telegram.ts`)

Erstelle eine neue Datei für den Telegram-Versand, die auf `telegraf` aufbaut:

```typescript
import { Telegraf } from "telegraf";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const defaultChatId = process.env.TELEGRAM_CHAT_ID;

// Initialisiere den Bot nur, wenn ein Token vorhanden ist
const bot = token ? new Telegraf(token) : null;

/**
 * Sendet eine Nachricht an den Standard-Chat per Telegram
 */
export async function sendTelegramMessage(message: string): Promise<void> {
    if (!bot || !defaultChatId) {
        console.warn(
            "[Telegram] Bot-Token oder Chat-ID nicht konfiguriert. Nachricht übersprungen."
        );
        return;
    }

    try {
        await bot.telegram.sendMessage(defaultChatId, message, { parse_mode: "Markdown" });
        console.log("[Telegram] Nachricht erfolgreich gesendet.");
    } catch (error) {
        console.error("[Telegram] Fehler beim Senden der Nachricht:", error);
        throw error;
    }
}

```

---

### 4. Test-Skript für Telegram anlegen (`tests/test-telegram.ts`)

Um zu prüfen, ob der Bot die Nachricht fehlerfrei zustellt, lege ein Test-Skript im `tests/`-Ordner an:

```typescript
import dotenv from "dotenv";
import { sendTelegramMessage } from "../src/utils/telegram";

dotenv.config();

async function runTelegramTest() {
    console.log("🧪 Starte Telegram-Test...");
    try {
        await sendTelegramMessage(
            "🚨 *HomeBot Test*\nHallo! Die Telegram-Integration funktioniert einwandfrei."
        );
        console.log("✅ Telegram-Nachricht erfolgreich gesendet!");
    } catch (error) {
        console.error("❌ Telegram-Test fehlgeschlagen:", error);
        process.exit(1);
    }
}

runTelegramTest();

```

---

### 5. Eintrag in die `package.json`

Ergänze das Test-Skript in deiner `package.json` unter `"scripts"`:

```json
"scripts": {
    "test:telegram": "ts-node tests/test-telegram.ts"
}
```

#### Test ausführen:

```bash
npm run test:telegram

```