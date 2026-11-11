# --- Build Stage ---
FROM node:22-alpine AS builder
WORKDIR /app

# Abhängigkeiten kopieren und installieren
COPY package*.json ./
RUN npm ci

# Quellcode & Konfiguration kopieren und kompilieren
COPY tsconfig.json ./
COPY src/ ./src
RUN npm run build

# --- Production Stage ---
FROM node:22-alpine
WORKDIR /app

# Nur Produktions-Abhängigkeiten installieren
COPY package*.json ./
RUN npm ci --omit=dev

# Kompilierte Dateien aus dem Builder kopieren
COPY --from=builder /app/dist ./dist

# Non-root User für mehr Sicherheit
USER node

# Startbefehl
CMD ["node", "dist/index.js"]