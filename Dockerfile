# --- Build Stage ---
FROM node:22-alpine AS builder

WORKDIR /app

# Erst Manifest-Dateien kopieren, damit Docker den Dependency-Layer cachen kann.
COPY package.json package-lock.json ./
RUN npm ci

# TypeScript-Quellcode und Konfiguration kopieren und kompilieren.
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build


# --- Production Stage ---
FROM node:22-alpine AS production

ENV NODE_ENV=production
WORKDIR /app

# su-exec installieren, um im Entrypoint sauber von root auf PUID:PGID zu wechseln
RUN apk add --no-cache su-exec

# Produktions-Abhängigkeiten installieren
COPY package.json package-lock.json ./
RUN npm ci --omit=dev \
    && npm cache clean --force

# Kompilierte Anwendung aus dem Builder übernehmen
COPY --from=builder /app/dist ./dist

# Vorlagen-Verzeichnisse ins Image kopieren (falls Host-Ordner leer sind)
# Hinweis: Falls der Ordner jobs/ im Repo existieren muss, lege dort mindestens eine .gitkeep oder deinen testJob ab
COPY jobs/ /app/defaults/jobs/

# Entrypoint-Skript kopieren und ausführbar machen
COPY entrypoint.sh /entrypoint.sh
RUN sed -i 's/\r$//' /entrypoint.sh && chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", "dist/index.js"]