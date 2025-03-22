# 🚀 Insight ERP - Backend Service

## 📖 About

The **Insight ERP Backend Service** powers the **Insight ERP** (Enterprise Resource Planning) application, providing robust and scalable support for small to medium-sized businesses. 

This service streamlines essential business operations, including:
- **HR management**
- **Inventory management**
- **Customer and user management**  

---

## 🛠 Tech Stack

| Technology  | Description |
|-------------|------------|
| ![Bun][Bun.com] | JavaScript runtime |
| ![TypeScript][TypeScript.com] | Typed superset of JavaScript |
| ![Express.js][Expressjs.com] | Web framework for Node.js |
| ![Prisma][Prisma.io] | ORM for database management |
| ![Docker][Docker.com] | Containerization for deployment |

---

## 🚀 Getting Started

### 📌 Prerequisites
Ensure you have the following installed before setup:

- [Node.js](https://nodejs.org/) & bun (if developing locally)
- [PostgreSQL](https://www.postgresql.org/) (if developing locally)
- [Docker](https://www.docker.com/) (for containerized setup)
- Bash/zsh (for shell scripting)

---

## 🛠 Installation & Setup

### 🔧 Local Setup
1. **Clone the repository**  
   ```sh
   git clone git@github.com:codyafingerson/insight-erp-api.git
   cd insight-erp-api
   ```

2. **Install dependencies**  
   ```bash
   bun install
   ```

3. **Seed the database (Optional)**  
   ```bash
   bun run seed
   ```
   **Default credentials:**
   - **Username:** `root`
   - **Password:** `root`

4. **Start the development server**  
   ```bash
   bun run dev
   ```
---

### 🐳 Docker Setup

1. **Clone the repository**  
   ```sh
   git clone git@github.com:codyafingerson/insight-erp-api.git
   cd insight-erp-api
   ```

2. **Build and start the Docker container**  

   The following command will build the Docker container and run the application using the development profile.
   
   ```bash
   docker compose --profile dev up
   ```
   **Default credentials:**
   - **Username:** `root`
   - **Password:** `root`
---

## 📜 Available Commands

| Command | Description |
|---------|------------|
| **`bun run dev`** | Starts the application in development mode. |
| **`bun run build`** | Compiles TypeScript and prepares for production. |
| **`bun run start`** | Runs the compiled app from the `dist` folder. |
| **`bun run prisma:migrate`** | Applies the latest Prisma database migrations. |
| **`bun run prisma:generate`** | Generates the Prisma Client. |
| **`bun run prisma:deploy`** | Deploys Prisma migrations in production. |
| **`bun run seed`** | Seeds the database with initial data. |

💡 **Tip:** If using **npm**, replace `bun run` with `npm run` for optimized performance.

---

## 📡 API Routes

API testing is available via the Postman collection.

> **Note:** The Postman collection is actively updated. Contact the project owner for access.

### Authentication

| Method | Endpoint                  | Description                          | Access  |
|--------|---------------------------|--------------------------------------|---------|
| `POST`   | `/api/auth/login`           | Logs in a user                      | Public  |
| `GET`    | `/api/auth/me`              | Returns the authenticated user      | Private |
| `POST`   | `/api/auth/logout`          | Logs out a user                     | Public  |

---

### Employees

| Method | Endpoint                | Description                      | Access  |
|--------|-------------------------|----------------------------------|---------|
| `POST`   | `/api/employees`          | Creates a new employee          | Private (Requires `create_employee` permission) |
| `GET`    | `/api/employees`          | Retrieves all employees         | Private (Requires `read_all_employees` permission) |
| `GET`    | `/api/employees/:id`      | Retrieves an employee by ID     | Private (Requires `read_all_employees` permission) |
| `PUT`    | `/api/employees/:id`      | Updates an employee by ID       | Private (Requires `update_employee` permission) |
| `DELETE` | `/api/employees/:id`      | Deletes an employee by ID       | Private (Requires `delete_employee` permission) |

---

### Roles

| Method | Endpoint                | Description                      | Access  |
|--------|-------------------------|----------------------------------|---------|
| `POST`   | `/api/roles`              | Creates a new role              | Private (Requires `create_role` permission) |
| `GET`    | `/api/roles`              | Retrieves all roles             | Private (Requires `read_all_roles` permission) |
| `GET`    | `/api/roles/permissions`  | Retrieves all permissions       | Private (Requires `read_all_roles` permission) |
| `GET`    | `/api/roles/:id`          | Retrieves a role by ID          | Private (Requires `read_all_roles` permission) |
| `PUT`    | `/api/roles/:id`          | Updates a role by ID            | Private (Requires `update_role` permission) |
| `DELETE` | `/api/roles/:id`          | Deletes a role by ID            | Private (Requires `delete_role` permission) |

---

### Users

| Method | Endpoint                                 | Description                                      | Access  |
|--------|-----------------------------------------|--------------------------------------------------|---------|
| `POST`   | `/api/users`                             | Creates a new user                              | Private (Requires `create_user` permission) |
| `PUT`    | `/api/users/:id`                         | Updates a user                                 | Private (Requires `update_user` permission) |
| `GET`    | `/api/users`                             | Retrieves all users                            | Private (Requires `read_all_users` permission) |
| `GET`    | `/api/users/:id`                         | Retrieves a user by ID                         | Private (Requires `read_all_users` permission) |
| `DELETE` | `/api/users/:id`                         | Deletes a user                                 | Private (Requires `delete_user` permission) |
| `POST`   | `/api/users/request-password-reset`     | Initiates the password reset process           | Public  |
| `POST`   | `/api/users/reset-password`             | Resets the user's password                     | Public  |
| `POST`   | `/api/users/change-password`            | Changes the user's password                    | Private (Requires `change_password` permission) |


---

### Product Categories
| Method | Endpoint                | Description                      | Access  |
|--------|-------------------------|----------------------------------|---------|
| `POST`   | `/api/product-category`          | Creates a new product category          | Private (Requires `create_product_category` permission) |
| `GET`    | `/api/product-category`          | Retrieves all categories         | Private (Requires `read_all_product_categories` permission) |
| `GET`    | `/api/product-category/:id`      | Retrieves an product category by ID     | Private (Requires `read_all_product_categories` permission) |
| `PUT`    | `/api/product-category/:id`      | Updates an product category by ID       | Private (Requires `update_product_category` permission) |
| `DELETE` | `/api/product-category/:id`      | Deletes an product category by ID       | Private (Requires `delete_product_category` permission) |


## 🛡️ License

This project is licensed under [MIT License](LICENSE).

---

[Bun.com]: https://img.shields.io/badge/Bun-000?logo=bun&logoColor=fff
[TypeScript.com]: https://shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=FFF&style=flat-square
[Expressjs.com]: https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=fff&style=flat
[Prisma.io]: https://shields.io/badge/Prisma-2D3748?logo=Prisma&logoColor=FFF&style=flat-square
[Docker.com]: https://shields.io/badge/Docker-2496ED?logo=Docker&logoColor=FFF&style=flat-square