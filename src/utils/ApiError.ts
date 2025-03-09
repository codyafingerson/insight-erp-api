import { logger } from "./logger";

export default class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) { // Add req parameter
        super(message);
        this.status = status;
        
        let logMessage = `${this.status} ${this.message}`;

        logger.error(logMessage);

        if(process.env.NODE_ENV === 'development') {
            logger.info(`${this.stack}`);
        }

        Error.captureStackTrace(this, this.constructor);
    }
}