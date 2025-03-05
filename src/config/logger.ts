import winston from "winston";
const { format, transports } = winston;
import DailyRotateFile from "winston-daily-rotate-file";

const logFormat = format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ timestamp, level = "info", message }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
);

const logger = winston.createLogger({
    level: process.env.NODE_ENV === "production" ? "error" : "debug",
    format: logFormat,
    transports: [
        new transports.Console({
            // Remove colorize to avoid extra padding
            format: logFormat,
        }),
        new transports.File({ filename: "logs/app.log" }),
    ],
});

if (process.env.NODE_ENV === "production") {
    logger.add(
        new DailyRotateFile({
            filename: "logs/application-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            maxSize: "20m",
            maxFiles: "14d",
        })
    );
}

const morganStream = {
    write: (message: string) => {
        logger.info(message.trim());
    },
};

export { logger, morganStream };