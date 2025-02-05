import dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import errorHandler from './middlewares/errorHandler';
import helmet from 'helmet';
import session from 'express-session';
import passport from './config/passport';

// Controllers
import RolesRoutes from './api/roles/RolesRoutes';
import UsersRoutes from './api/users/UsersRoutes';

class Server {
    private app: Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    public start() {
        // Error handler middleware must be declared after all other middlewares and routes
        // to ensure that it can catch errors from all of them
        this.app.use(errorHandler);
        const server = this.app.listen(this.app.get('port'), () => {
            console.log(`Server running on port ${this.app.get('port')}`);
        });

        // Graceful shutdown handling
        process.on('SIGINT', () => {
            console.log('Shutting down server...');
            server.close(() => {
                console.log('Server closed.');
                process.exit(0);
            });
        });

        process.on('SIGTERM', () => {
            console.log('Received SIGTERM. Closing server...');
            server.close(() => {
                console.log('Server closed.');
                process.exit(0);
            });
        });
    }

    private config() {
        dotenv.config();
        this.app.set('port', process.env.PORT || 3000);
        this.app.disable('x-powered-by');

        // Middleware
        this.app.use(helmet());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(morgan('dev'));
        this.app.use(cookieParser());

        this.app.use(
            session({
                secret: process.env.SESSION_SECRET as string,
                resave: false,
                saveUninitialized: false,
                cookie: {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 1000 * 60 * 60, // 1 hour
                },
            })
        );

        this.app.use(passport.initialize());
        this.app.use(passport.session());
    }

    private routes() {
        this.app.get('/', (req: Request, res: Response) => {
            res.status(200).json({ message: 'Successfully connected to Insight ERP API' });
        });

        this.app.use('/api/roles', RolesRoutes);
        this.app.use('/api/users', UsersRoutes);
    }
}

const server = new Server();
server.start();