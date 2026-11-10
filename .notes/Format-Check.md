Das lässt sich auf GitHub perfekt über eine Kombination aus einer **GitHub Action (CI)** und einer **Branch Protection Rule ( bzw. Repository RuleSet)** lösen. Dadurch kann ein Pull Request erst gemergt werden, wenn die Formatierungsprüfung erfolgreich durchgelaufen ist.

---

### Schritt 1: GitHub Action für den Format-Check anlegen

Erstelle in deinem Repository die Datei `.github/workflows/format-check.yml`:

```yaml
name: PR Code Format Check

on:
    pull_request:
        branches: [main, master, dev]

jobs:
    format-and-lint:
        name: Prettier & ESLint Check
        runs-on: ubuntu-latest
        steps:
            - name: Checkout Code
              uses: actions/checkout@v4

            - name: Setup Node.js
              uses: actions/setup-node@v4
              with:
                  node-version: 20
                  cache: "npm"

            - name: Install Dependencies
              run: npm ci

            - name: Check Formatting (Prettier)
              run: npx prettier --check "src/**/*.js"

            - name: Run Linter (ESLint)
              run: npx eslint src/
```

---

### Schritt 2: Regelsatz (Ruleset) auf GitHub einrichten

Damit der Merge-Button im PR blockiert bleibt, solange der Check nicht grün ist:

1. Gehe auf GitHub in dein Repository -> **Settings**.
2. Wähle links im Menü unter _Code and automation_ den Punkt **Rules** -> **Rulesets**.
3. Klicke auf **New ruleset** (z. B. _New branch ruleset_).
4. Vergib einen Namen (z. B. `Require Format Check on Main`).
5. Stelle den **Enforcement status** auf **Active**.
6. Unter **Target branches** fügst du die Ziel-Branches hinzu (z. B. `main` oder `default branch`).
7. Aktiviere unter **Branch rules** die Option **Require status checks to pass before merging**.
8. Klicke auf **Add checks** und suche nach dem Namen deines Jobs aus der Workflow-Datei:

- **`Prettier & ESLint Check`**

9. Klicke unten auf **Save changes**.

---

### Das Ergebnis im Pull Request

- Wenn jemand einen PR erstellt, führt GitHub automatisch den Workflow aus.
- Ist der Code nicht sauber mit Prettier formatiert, schlägt der Check fehl.
- Der Regelsatz verhindert den Merge, solange der Autor den Code nicht formatiert und neu gepusht hat.
