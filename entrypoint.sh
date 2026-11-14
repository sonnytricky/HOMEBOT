#!/bin/sh
set -e

# 1. Benötigte Ordner im Container sicherstellen
mkdir -p /app/jobs/scheduled /app/modules /app/utils /app/data

# 2. WICHTIG: Wenn der gemountete Host-Ordner "jobs/" leer ist, 
# kopiere die im Image mitgebauten Standard-Jobs (inkl. Test-Job) dorthin!
if [ -z "$(ls -A /app/jobs 2>/dev/null)" ] && [ -d /app/defaults/jobs ]; then
    echo "[Entrypoint] Host-Ordner 'jobs/' ist leer. Kopiere Standard-Jobs..."
    cp -r /app/defaults/jobs/* /app/jobs/
fi

# 3. PUID und PGID auslesen (Standard: 1000)
USER_ID=${PUID:-1000}
GROUP_ID=${PGID:-1000}

# 4. Berechtigungen der Ordner auf den Ziel-User setzen
chown -R "$USER_ID:$GROUP_ID" /app/jobs /app/modules /app/utils /app/data /app/dist

# 5. Befehl als unprivilegierter User (PUID:PGID) ausführen
exec su-exec "$USER_ID:$GROUP_ID" "$@"