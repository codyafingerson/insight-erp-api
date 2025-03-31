import { environment } from "../config/environment";
import { logger } from "./logger";

export default class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        // Add req parameter
        super(message);
        this.status = status;

        Error.captureStackTrace(this, this.constructor);
    }
}
