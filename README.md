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

- [Node.js](https://nodejs.org/) & npm (if developing locally)
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
   npm install
   ```

3. **Seed the database (Optional)**  
   ```bash
   npm run seed
   ```
   **Default credentials:**
   - **Username:** `root`
   - **Password:** `root`

4. **Start the development server**  
   ```bash
   npm run dev
   ```
---

### 🐳 Docker Setup

1. **Clone the repository**  
   ```sh
   git clone git@github.com:codyafingerson/insight-erp-api.git
   cd insight-erp-api
   ```

2. **Build and start the Docker container**  
   ```bash
   docker compose --profile dev up
   ```

---

## 📜 Available Commands

| Command | Description |
|---------|------------|
| **`npm run dev`** | Starts the application in development mode. |
| **`npm run build`** | Compiles TypeScript and prepares for production. |
| **`npm run start`** | Runs the compiled app from the `dist` folder. |
| **`npm run prisma:migrate`** | Applies the latest Prisma database migrations. |
| **`npm run prisma:generate`** | Generates the Prisma Client. |
| **`npm run prisma:deploy`** | Deploys Prisma migrations in production. |
| **`npm run seed`** | Seeds the database with initial data. |

💡 **Tip:** If using **Bun**, replace `npm run` with `bun run` for optimized performance.

---

## 📡 API Routes

API documentation is available via the Postman collection.

> **Note:** The Postman collection is actively updated. Contact the project owner for access.

---

## 🛡️ License

This project is licensed under [MIT License](LICENSE).

---

[Bun.com]: https://img.shields.io/badge/Bun-000?logo=bun&logoColor=fff
[TypeScript.com]: https://shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=FFF&style=flat-square
[Expressjs.com]: https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=fff&style=flat
[Prisma.io]: https://shields.io/badge/Prisma-2D3748?logo=Prisma&logoColor=FFF&style=flat-square
[Docker.com]: https://shields.io/badge/Docker-2496ED?logo=Docker&logoColor=FFF&style=flat-square