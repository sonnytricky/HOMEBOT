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

# Nur Produktions-Abhängigkeiten installieren.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev \
    && npm cache clean --force

# Kompilierte Anwendung aus dem Builder übernehmen.
COPY --from=builder --chown=node:node /app/dist ./dist

# Container nicht als root ausführen.
USER node

CMD ["node", "dist/index.js"]
