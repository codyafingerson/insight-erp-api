## Overview

This documentation describes the authentication module. It handles user login, session management, retrieval of authenticated user details, and logout functionality.

## API Endpoints

The following endpoints are exposed by this module:

| Method | Endpoint             | Description                     | Access Control |
| :----- | :------------------- | :------------------------------ | :------------- |
| `POST` | `/api/auth/login`    | Logs in a user using credentials. | Public         |
| `GET`  | `/api/auth/me`       | Returns the authenticated user's data. | Private (Requires Authentication) |
| `POST` | `/api/auth/logout`   | Logs out the currently authenticated user. | Public         |

---

## Components

### 1. AuthController
* **File:** [`AuthController.ts`](../src/api/auth/AuthController.ts)
* **Description:** Handles incoming HTTP requests related to authentication. It orchestrates the authentication flow by interacting with `AuthService`, Passport, and Express request/response objects.
* **Dependencies:**
    * `express`: Request, Response, NextFunction types.
    * `passport`: Used for authentication strategies and session management (`authenticate`, `logIn`, `logout`, `isAuthenticated`).
    * `./AuthService`: Service class containing the core authentication logic.
    * `../../utils/ApiError`: Custom error handling class.
* **Methods:**
    * `constructor(authService?: AuthService)`: Initializes the controller, optionally accepting an `AuthService` instance for dependency injection (defaults to a new instance if none provided). Binds method contexts.
    * `async login(req: Request, res: Response, next: NextFunction)`:
        * Uses `passport.authenticate('local', ...)` to trigger the local authentication strategy.
        * Handles errors or missing users returned by the strategy.
        * Calls `req.logIn()` upon successful authentication to establish a session.
        * Returns a success message and user object (consider filtering sensitive data here if not done elsewhere).
    * `async me(req: Request, res: Response, next: NextFunction)`:
        * Checks if the user is authenticated using `req.isAuthenticated()`.
        * If authenticated, retrieves the user object from `req.user` (populated by Passport).
        * Removes the password field from the user object before sending it in the response.
        * Returns the user object.
    * `async logout(req: Request, res: Response, next: NextFunction)`:
        * Calls `req.logout()` to remove the user from the session via Passport.
        * Calls `req.session.destroy()` to completely remove the session data.
        * Clears the session cookie (`insight-erp` in this case).
        * Returns a success message.

### 2. AuthService

* **File:** [`AuthService.ts`](../src/api/auth/AuthService.ts)
* **Description:** Contains the core business logic for validating user credentials. It interacts with the database via Prisma.
* **Dependencies:**
    * `../../config/database/prisma`: Prisma client instance for database access.
    * `../../utils/ApiError`: Custom error handling class.
    * `../../utils/bcrypt`: Utility function (`comparePasswords`) for securely comparing hashed passwords.
    * `./AuthDto`: Contains the `CredentialsDto` type definition.
* **Methods:**
    * `async validateUser(credentials: CredentialsDto): Promise<any | null>`:
        * Finds a user in the database based on the provided `username`.
        * If the user is not found, throws an `ApiError`.
        * Compares the provided `password` with the user's stored hashed password using `comparePasswords`.
        * If passwords don't match, throws an `ApiError`.
        * If validation succeeds, returns the user object fetched from the database. *Note: This method is typically used by the Passport 'local' strategy.*

### 3. AuthRouter

* **File:** [`AuthRoutes.ts`](../src/api/auth/AuthRoutes.ts)
* **Description:** Defines the Express routes for the authentication endpoints and maps them to the corresponding `AuthController` methods.
* **Dependencies:**
    * `express`: Router creation.
    * `./AuthController`: The controller handling the requests.
    * `../../middlewares/authorize`: Custom middleware to protect routes (used on `/api/auth/me`).
* **Routes:**
    * `POST /login`: Maps to `authController.login`. Publicly accessible.
    * `GET /me`: Maps to `authController.me`. Protected by the `authorize()` middleware. Only accessible to authenticated users.
    * `POST /logout`: Maps to `authController.logout`. Publicly accessible.

### 4. Data Transfer Objects (DTOs)

* **File:** [`AuthDto.ts`](../src/api/auth/AuthDto.ts)
* **Description:** Define the structure of data used within the authentication flow.
* **Interfaces:**
    * `CredentialsDto`: Represents the data expected for a login request (username, password).
    * `AuthenticatedUserDto`: Represents the structure of the user data returned after successful authentication, typically excluding sensitive information like the password hash. Includes user details and associated role/permissions.

---

## Dependencies

* **External:**
    * `express`: Web framework for Node.js.
    * `passport`: Authentication middleware for Node.js. Highly modular, uses 'strategies'.
    * `passport-local`: (Implied) Passport strategy for username/password authentication.
    * `@prisma/client`: Prisma ORM client for database interactions.
    * `bcrypt` / `bcryptjs`: (Implied by `comparePasswords`) Library for hashing and comparing passwords.
    * `express-session`: (Implied by `req.session`, `req.logIn`, `req.logout`) Middleware for session management.
* **Internal:**
    * `prisma`: Configured Prisma client instance.
    * `ApiError`: Custom utility class for standardized API error responses.
    * `comparePasswords`: Utility function wrapping bcrypt's comparison.
    * `authorize`: Custom middleware for checking user authorization/authentication status.

---

## Workflow Examples

### Login Flow

1.  Client sends `POST` request to `/api/auth/login` with `username` and `password` in the request body.
2.  The route triggers `AuthController.login`.
3.  `passport.authenticate('local', ...)` is called.
4.  Passport invokes the 'local' strategy (which should be configured elsewhere to use `AuthService.validateUser`).
5.  `AuthService.validateUser` queries the database via Prisma, finds the user, and compares the password hash using `comparePasswords`.
6.  If validation is successful, the user object is passed to the `passport.authenticate` callback.
7.  `req.logIn(user, ...)` is called, serializing the user ID (typically) into the session and setting the session cookie.
8.  `AuthController.login` sends a 200 OK response with a success message and user details.

### Get Authenticated User Flow (`/me`)

1.  Client sends `GET` request to `/api/auth/me` (including the session cookie).
2.  The `authorize()` middleware runs first. It likely checks `req.isAuthenticated()`. If not authenticated, it returns a 401 Unauthorized error.
3.  If authorized, the request proceeds to `AuthController.me`.
4.  `AuthController.me` checks `req.isAuthenticated()` again (redundant if `authorize` does it, but safe).
5.  It retrieves the user object from `req.user` (deserialized from the session by Passport).
6.  The password field is removed.
7.  A 200 OK response is sent with the user details.

---

## Setup & Integration Notes

* **Passport Configuration:** This module requires Passport to be initialized and configured in the main Express application. Specifically, a `LocalStrategy` needs to be configured to use `AuthService.validateUser`. Passport's `serializeUser` and `deserializeUser` functions must also be set up for session management.
* **Express Middleware:** Ensure `express-session` and Passport middleware (`passport.initialize()`, `passport.session()`) are applied globally in your Express app *before* this router is used.
* **Error Handling:** An application-level error handling middleware should be in place to catch errors thrown by `ApiError` or other parts of the application.
* **Database:** Ensure the Prisma schema matches the models used (`User`, potentially `Role`, `Permission`) and that the database is connected.