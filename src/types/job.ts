export interface IJob {
    name: string;
    cronSchedule: string; // z.B. "0 7 * * *" (jeden Tag um 7 Uhr)
    execute(): Promise<void>;
}
