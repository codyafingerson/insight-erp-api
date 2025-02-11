# Insight ERP - Backend Service

## About The Project

This is the backend service for the Insight ERP (Enterprise Resource Planning) application, which powers the frontend interface. The goal of this project is to streamline essential business operations, including HR, inventory management, customer management, and user management. Future enhancements will include an integrated email-style communication feature for engaging with customers and prospects, ordering, and more!

This solution is primarily designed for small to medium-sized businesses, providing a scalable and efficient way to manage core business functions.

## Built With

- ![Node][Nodejs.com]
- ![TypeScript][TypeScript.com]
- ![Express.js][Expressjs.com]
- ![Prisma][Prisma.io]

## Prerequisites
- Node.js/npm
- MySQL

## Getting Started
1. Clone the repository
```sh
git clone git@github.com:codyafingerson/insight-erp-api.git
```

2. Install dependencies
```sh
npm install
```

3. Create a `.env` file in the root directory and add the following environment variables:
```sh
NODE_ENV=development
PORT=8000
SESSION_SECRET=secret
DATABASE_URL=mysql://<YOUR_USERNAME>:<YOUR_PASSWORD>@localhost:3306/insight_erp_api
```
> To create the database, run the command: `CREATE DATABASE IF NOT EXIST insight_erp_api;`

4. Run the application to verify that it is working correctly
```sh
npm run dev
```
> The application should now be running on `http://localhost:8000`

5. Run the Prisma migration to create the database schema
```sh
npx run migrate
```

6. Seed the database with initial data
```sh
npm run seed
```

> Note: This will create a user with the following credentials:
> - username: `developer`
> - password: `password123`

## Routes
See the [Postman collection] for more details on the available routes.
> Note: The collection is a work in progress and will be updated as new features are added.
> If you do not have access to the collection, please reach out to the project owner!

[Nodejs.com]: https://shields.io/badge/Node.js-339933?logo=Node.js&logoColor=FFF&style=flat-square
[TypeScript.com]: https://shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=FFF&style=flat-square
[Expressjs.com]: https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=fff&style=flat
[Prisma.io]: https://shields.io/badge/Prisma-2D3748?logo=Prisma&logoColor=FFF&style=flat-square