import dotenv from "dotenv";

// Load environment variables as early as possible
dotenv.config();

function ensureEnvVar(variable: string, defaultValue?: string): string {
    if (!process.env[variable] && defaultValue === undefined) {
        throw new Error(`Missing required environment variable: ${variable}`);
    }
    return process.env[variable] || defaultValue || "";
}

const isProduction = process.env.NODE_ENV === "production";

const environment = {
    nodeEnv: ensureEnvVar("NODE_ENV"),
    sessionSecret: ensureEnvVar("SESSION_SECRET"),
    port: parseInt(ensureEnvVar("PORT"), 10),

    database: {
        url: ensureEnvVar("DATABASE_URL"),
        ...(isProduction
            ? {}
            : {
                  user: ensureEnvVar("POSTGRES_USER"),
                  password: ensureEnvVar("POSTGRES_PASSWORD"),
                  db: ensureEnvVar("POSTGRES_DB")
              })
    },

    redis: {
        host: ensureEnvVar("REDIS_HOST"),
        port: parseInt(ensureEnvVar("REDIS_PORT", "6379")),
        password: process.env.REDIS_PASSWORD || ""
    },

    rootUser: {
        name: ensureEnvVar("ROOT_NAME"),
        username: ensureEnvVar("ROOT_USERNAME"),
        email: ensureEnvVar("ROOT_EMAIL"),
        password: ensureEnvVar("ROOT_PASSWORD")
    },

    mail: {
        host: ensureEnvVar("MAIL_HOST"),
        port: parseInt(ensureEnvVar("MAIL_PORT", "465"), 10),
        user: ensureEnvVar("MAIL_USER"),
        password: ensureEnvVar("MAIL_PASSWORD")
    },
    cors: {
        allowedOrigins: ensureEnvVar("CORS_ALLOWED_ORIGINS")
            ? ensureEnvVar("CORS_ALLOWED_ORIGINS").split(",")
            : ["http://localhost:3000"]
    }
};

export { environment };
