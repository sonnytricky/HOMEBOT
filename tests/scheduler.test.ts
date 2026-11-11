import cron from "node-cron";
import { scheduleJob } from "../src/core/scheduler";
import { sendTelegramMessage } from "../src/utils/telegram";
import { sendErrorEmail } from "../src/utils/notifier";
import { IJob } from "../src/types/job";

// 1. Module mocken
jest.mock("node-cron");
jest.mock("../src/utils/telegram");
jest.mock("../src/utils/notifier");

describe("Scheduler & Job-Loader Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // WICHTIG: Damit cron.validate in Tests immer erfolgreich ist
        (cron.validate as jest.Mock).mockReturnValue(true);
    });

    it("sollte bei erfolgreicher Job-Ausführung eine Telegram-Nachricht senden", async () => {
        const mockJob: IJob = {
            name: "Test-Erfolgs-Job",
            cronSchedule: "* * * * *",
            execute: jest.fn().mockResolvedValue(undefined),
        };

        let cronCallback: (() => Promise<void>) | undefined;
        (cron.schedule as jest.Mock).mockImplementation((_schedule, callback) => {
            cronCallback = callback;
            return { stop: jest.fn() };
        });

        scheduleJob(mockJob);

        expect(cron.validate(mockJob.cronSchedule)).toBe(true);
        expect(cron.schedule).toHaveBeenCalledTimes(1);

        if (cronCallback) {
            await cronCallback();
        }

        expect(mockJob.execute).toHaveBeenCalledTimes(1);
        expect(sendTelegramMessage).toHaveBeenCalledTimes(1);
        expect(sendTelegramMessage).toHaveBeenCalledWith(
            expect.stringContaining("Der Job *Test-Erfolgs-Job* wurde erfolgreich ausgeführt")
        );
        expect(sendErrorEmail).not.toHaveBeenCalled();
    });

    it("sollte bei einem Fehler im Job eine Fehler-E-Mail senden", async () => {
        const errorMessage = "Datenbankverbindung fehlgeschlagen";
        const mockJob: IJob = {
            name: "Test-Fehler-Job",
            cronSchedule: "0 12 * * *",
            execute: jest.fn().mockRejectedValue(new Error(errorMessage)),
        };

        let cronCallback: (() => Promise<void>) | undefined;
        (cron.schedule as jest.Mock).mockImplementation((_schedule, callback) => {
            cronCallback = callback;
            return { stop: jest.fn() };
        });

        scheduleJob(mockJob);

        if (cronCallback) {
            await cronCallback();
        }

        expect(mockJob.execute).toHaveBeenCalledTimes(1);
        expect(sendErrorEmail).toHaveBeenCalledTimes(1);
        expect(sendErrorEmail).toHaveBeenCalledWith("Fehler im Job: Test-Fehler-Job", errorMessage);
        expect(sendTelegramMessage).not.toHaveBeenCalled();
    });
});
