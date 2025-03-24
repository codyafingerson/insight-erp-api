import { environment } from "../config/environment";
import { logger } from "./logger";

export default class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        // Add req parameter
        super(message);
        this.status = status;

        let logMessage = `${this.status} ${this.message}`;

        logger.error(logMessage);

        if (environment.nodeEnv === "development") {
            logger.info(`${this.stack}`);
        }

        Error.captureStackTrace(this, this.constructor);
    }
}
