import winston from "winston"
const { format, transports } = winston
import DailyRotateFile from "winston-daily-rotate-file"

// Log format configuration
const logFormat = format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ timestamp, level = "info", message }) => {
        const logLevel = level.toUpperCase()
        return `${timestamp} [${logLevel}]: ${message}`
    })
)

// Create Winston logger
const logger = winston.createLogger({
    level: process.env.NODE_ENV === "production" ? "error" : "debug",
    format: logFormat,
    transports: [
        new transports.Console({
            format: format.combine(format.colorize(), logFormat),
        }),
        new transports.File({ filename: "logs/app.log" }),
    ],
})

// Add daily rotating file logging in production
if (process.env.NODE_ENV === "production") {
    logger.add(
        new DailyRotateFile({
            filename: "logs/application-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            maxSize: "20m",
            maxFiles: "14d",
        })
    )
}

// Create a stream for Morgan to use
const morganStream = {
    write: (message: string) => {
        logger.info(message.trim()) // Remove newlines
    },
}

export { logger, morganStream }