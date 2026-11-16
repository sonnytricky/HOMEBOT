#!/bin/sh
set -e

# PUID/PGID Fallbacks definieren, falls in .env nicht gesetzt
PUID=${PUID:-1000}
PGID=${PGID:-1000}

echo "[Entrypoint] Starte mit UID: $PUID und GID: $PGID..."

# 1. Sicherstellen, dass die gemounteten Ziel-Ordner unter /app/dist/ und data existieren
mkdir -p /app/dist/jobs /app/dist/modules /app/dist/utils /app/dist/types /app/data

# 2. Automatisches Seeding: Wenn Ordner auf dem Host leer sind, Standard-Inhalte kopieren
for dir in jobs modules utils types; do
    if [ -z "$(ls -A /app/dist/$dir 2>/dev/null)" ]; then
        if [ -d "/app/defaults/$dir" ]; then
            mkdir -p /app/dist/$dir
            cp -r /app/defaults/$dir/* /app/dist/$dir/ 2>/dev/null || true
            echo "[Entrypoint] Standard-Inhalte erfolgreich nach dist/$dir kopiert."
        else
            echo "[Entrypoint] Warnung: /app/defaults/$dir wurde nicht gefunden."
        fi
    fi
done

# 3. Berechtigungen für gemountete Volumes anpassen (damit der User darauf schreiben kann)
chown -R $PUID:$PGID /app/dist/jobs /app/dist/modules /app/dist/utils /app/dist/types /app/data 2>/dev/null || true

echo "[Entrypoint] Übergebe an User UID $PUID und starte Anwendung..."

# 4. Ausführen als definierter Non-Root-User via su-exec (falls als root gestartet)
if [ "$(id -u)" = "0" ]; then
    exec su-exec $PUID:$PGID "$@"
else
    exec "$@"
fi