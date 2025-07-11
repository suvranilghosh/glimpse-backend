# Glimpse Backend

Glimpse Backend is the server-side component of the **Glimpse Lead Management System** – a full-stack application built to manage, filter, and analyze sales leads. This backend provides a robust, secure API using Express.js, Prisma ORM, and PostgreSQL.

## Live Deployment

Backend is hosted and powered by Render.  
Frontend (connected to this backend): [https://glimpse-frontend-git-main-neils-projects-2a8fd08d.vercel.app/](https://glimpse-frontend-git-main-neils-projects-2a8fd08d.vercel.app/)

## Tech Stack

- [Node.js](https://nodejs.org/) – JavaScript runtime environment
- [Express.js](https://expressjs.com/) – Web framework for Node.js
- [Prisma](https://www.prisma.io/) – Next-gen ORM for PostgreSQL and more
- [PostgreSQL](https://www.postgresql.org/) – Open source relational database
- JWT – for secure authentication
- Bcrypt – for password hashing
- CORS – to enable cross-origin access
- dotenv – for environment variable management

## Features

- User Authentication (Register/Login) with hashed passwords and JWT
- Upload and store leads via CSV
- Server-side filtering and search by:
  - Source
  - Interest Level
  - Status
  - Name (partial match)
- Pagination and sorting support (by interest and createdAt)
- API health check

## API Endpoints

### Health Check

```
GET /
```

### Auth

#### Register

```
POST /register
Body: {
email, password, firstName, lastName
}
```

#### Login

```
POST /login
Body: {
email, password
}
Returns: { token, user }
```

### Leads

#### Upload Leads

```
POST /leads
Body: {
data: \[Lead\[]]
}
```

#### Fetch Leads with Filters

```
GET /leads
Query params:

* source
* interestLevel
* status
* searchQuery
* page
* limit
* sortByInterest
* sortByCreatedAt
```

## Project Structure

```
glimpse-backend/
├── prisma/
│   └── schema.prisma
├── src/
│   └── index.ts
├── .env
├── package.json
└── tsconfig.json
```
