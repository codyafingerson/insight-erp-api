# Insight ERP - Backend Service

## About

This backend service powers the Insight ERP (Enterprise Resource Planning) application, supporting the frontend interface. It aims to streamline core business operations for small to medium-sized businesses, including HR, inventory management, customer management, and user management, offering a scalable and efficient management solution. Future enhancements include integrated email-style communication for engaging with customers and prospects, ordering capabilities, and more.

## Tech Stack

- ![Node][Nodejs.com]
- ![TypeScript][TypeScript.com]
- ![Express.js][Expressjs.com]
- ![Prisma][Prisma.io]

## Setup

### Prerequisites

- Node.js/npm
- Postgres
- Bash/zsh

### Installation

1.  Clone the repository:

    ```sh
    git clone git@github.com:codyafingerson/insight-erp-api.git
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Run [setup.sh](./setup.sh) for easy environment configuration:

    ```bash
    chmod +x ./setup.sh
    ./setup.sh
    ```

    > Note: This script creates a default user with the following credentials:
    >
    > - username: `root`
    > - password: `root`

## API Routes

Refer to the Postman collection for details on available routes.

> Note: The Postman collection is actively being updated with new features. Contact the project owner for access.

[Nodejs.com]: https://shields.io/badge/Node.js-339933?logo=Node.js&logoColor=FFF&style=flat-square
[TypeScript.com]: https://shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=FFF&style=flat-square
[Expressjs.com]: https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=fff&style=flat
[Prisma.io]: https://shields.io/badge/Prisma-2D3748?logo=Prisma&logoColor=FFF&style=flat-square