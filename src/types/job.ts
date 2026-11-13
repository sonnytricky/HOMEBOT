export interface IJob {
    name: string;
    cronSchedule?: string; // Optional: Fehlt der Wert oder ist runOnce true, läuft er nicht per Cron
    runOnce?: boolean; // Wenn true, wird der Job einmalig beim Start ausgeführt
    execute(): Promise<void>;
}
