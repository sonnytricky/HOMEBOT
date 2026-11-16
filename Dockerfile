# --- Production Stage ---
FROM node:22-alpine AS production

ENV NODE_ENV=production
WORKDIR /app

# su-exec für den Benutzerwechsel installieren
RUN apk add --no-cache su-exec

# Produktions-Abhängigkeiten installieren
COPY package.json package-lock.json ./
RUN npm ci --omit=dev \
    && npm cache clean --force

# Kompilierte Anwendung aus dem Builder übernehmen
COPY --from=builder /app/dist ./dist

# Standard-Jobs aus src/jobs/ als Vorlage ins Image kopieren
COPY src/jobs/ /app/defaults/jobs/

# Entrypoint-Skript kopieren, Windows-Line-Endings entfernen und ausführbar machen
COPY entrypoint.sh /entrypoint.sh
RUN sed -i 's/\r$//' /entrypoint.sh && chmod +x /entrypoint.sh

# Container startet als root, damit das entrypoint.sh chown/mkdir ausführen kann
ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", "dist/index.js"]