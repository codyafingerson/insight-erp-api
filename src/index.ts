import { environment } from "./config/environment";
import express, { type Application, type Request, type Response } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import session from "express-session";
import passport from "./config/auth/passport.ts"
import errorHandler from "./middlewares/errorMiddleware";
import { RedisStore } from "connect-redis";
import { redisClient } from "./config/database/redis";
import { morganStream } from "./utils/logger";

// Controllers
import RolesRoutes from "./api/roles/RolesRoutes";
import UsersRoutes from "./api/users/UsersRoutes";
import AuthRoutes from "./api/auth/AuthRoutes";
import DepartmentsRoutes from "./api/departments/DepartmentsRoutes";
import EmployeesRoutes from "./api/employees/EmployeesRoutes";
import ProductCategoriesRoutes from "./api/product-categories/ProductsCategoriesRoutes";
import ProductRoutes from "./api/products/ProductsRoutes";
import OrdersRoutes from "./api/orders/OrdersRoutes.ts";

class Server {
    private app: Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    public async start() {
        this.app.use(errorHandler);
        const server = this.app.listen(this.app.get("port"), "0.0.0.0", () => {
            console.log(`Server running on port ${this.app.get("port")}`);
        });

        // Graceful shutdown handling
        process.on("SIGINT", () => {
            console.log("Shutting down server...");
            server.close(() => {
                console.log("Server closed.");
                process.exit(0);
            });
        });

        process.on("SIGTERM", () => {
            console.log("Received SIGTERM. Closing server...");
            server.close(() => {
                console.log("Server closed.");
                process.exit(0);
            });
        });
    }

    private async config() {
        this.app.set("port", environment.port || 3000);
        this.app.set("trust proxy", 1);

        // Middleware
        this.app.use(
            cors({
                origin: environment.cors.allowedOrigins,
                credentials: true, // Allow cookies to be sent
                methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
            })
        );
        this.app.use(helmet());
        this.app.use(cookieParser());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));

        this.app.use(morgan("combined", { stream: morganStream })); // Use the custom morgan stream
        
        // Initialize Redis store using the ioredis client
        const redisStore = new RedisStore({
            client: redisClient,
            prefix: "insight-erp:"
        });

        // Session configuration
        const sessionSecret = environment.sessionSecret;
        if (!sessionSecret) {
            console.error("SESSION_SECRET is not defined. Exiting.");
            process.exit(1);
        }

        this.app.use(
            session({
                store: redisStore,
                secret: sessionSecret,
                resave: false,
                saveUninitialized: false,
                name: "insight-erp",
                cookie: {
                    httpOnly: true,
                    secure: environment.nodeEnv === "production",
                    sameSite: "lax",
                    maxAge: 1000 * 60 * 60 // 1 hour
                }
            })
        );

        this.app.use(passport.initialize());
        this.app.use(passport.session());
    }

    private routes() {
        this.app.get("/", (req: Request, res: Response) => {
            res.status(200).json({ message: "Successfully connected to Insight ERP API" });
        });

        this.app.use("/api/auth", AuthRoutes);
        this.app.use("/api/roles", RolesRoutes);
        this.app.use("/api/users", UsersRoutes);
        this.app.use("/api/departments", DepartmentsRoutes);
        this.app.use("/api/employees", EmployeesRoutes);
        this.app.use("/api/product-categories", ProductCategoriesRoutes);
        this.app.use("/api/products", ProductRoutes);
        this.app.use("/api/orders", OrdersRoutes);
    }
}

const server = new Server();
server.start();
