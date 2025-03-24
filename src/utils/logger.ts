import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import fs from "fs";
import path from "path";

// Ensure the logs directory exists
const logsDir = path.resolve("logs");
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

const { combine, timestamp, printf, colorize, errors } = winston.format;

const isProduction = process.env.NODE_ENV === "production";
const logLevel = isProduction ? "error" : "debug";

// Custom format that logs the timestamp, level, and message (or stack if an error)
const customFormat = printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
});

const logger = winston.createLogger({
    level: logLevel,
    format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        errors({ stack: true }), // capture stack trace for errors
        customFormat
    ),
    transports: [
        // File transport (writes to logs/app.log)
        new winston.transports.File({ filename: path.join(logsDir, "app.log") })
    ]
});

// Always log to the console with colorized output
logger.add(
    new winston.transports.Console({
        format: combine(colorize(), timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), customFormat)
    })
);

// In production, add a DailyRotateFile transport
if (isProduction) {
    logger.add(
        new DailyRotateFile({
            filename: path.join(logsDir, "application-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
            maxSize: "20m",
            maxFiles: "14d",
            level: logLevel
        })
    );
}

// Morgan stream integration for HTTP logging
const morganStream = {
    write: (message: string) => {
        logger.info(message.trim());
    }
};

export { logger, morganStream };
