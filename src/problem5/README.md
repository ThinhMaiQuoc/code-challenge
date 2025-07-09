# Express CRUD API

This is a TypeScript-based Express.js service providing a full CRUD interface for a generic `Resource` model, backed by a SQLite database via Prisma.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Scripts](#scripts)
- [Future Improvements](#future-improvements)

---

## Features

- Create, Read, Update, Delete (`Resource` entity)
- Filter listing by `name`
- Request validation middleware
- Global error handler
- Type-safe database access with Prisma

## Tech Stack

- Node.js, Express.js
- TypeScript
- Prisma ORM
- SQLite (file-based)

## Prerequisites

- Node.js v18+
- npm (or yarn)

## Installation

1. Clone the repo:
   ```bash
   git clone <repo-url>
   cd express-crud-api
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

1. Copy and edit environment variables:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and verify:
   ```dotenv
   DATABASE_URL="file:./dev.db"
   PORT=4000
   ```

## Database Setup

1. Generate Prisma client and run migrations:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```
2. A SQLite file `dev.db` will be created in the project root.

## Running the Server

- **Development** (auto-reload with `ts-node-dev`):
  ```bash
  npm run dev
  ```
- **Production build**:
  ```bash
  npm run build
  npm start
  ```

Server listens at [http://localhost:4000](http://localhost:4000) by default.

## API Endpoints

Base path: `/api/resources`

| Method | Path   | Description                     |
| ------ | ------ | ------------------------------- |
| POST   | `/`    | Create a new resource           |
| GET    | `/`    | List resources (filter: ?name=) |
| GET    | `/:id` | Get resource by ID              |
| PUT    | `/:id` | Update resource by ID           |
| DELETE | `/:id` | Delete resource by ID           |

**Example: Create**

```bash
curl -X POST http://localhost:4000/api/resources \
  -H "Content-Type: application/json" \
  -d '{"name":"Item1","value":"Value1"}'
```

## Error Handling

- **400 Bad Request**: validation failures
- **404 Not Found**: resource missing
- **500 Internal Server Error**: unexpected errors

Error responses are JSON:

```json
{ "error": "BadRequest", "message": "Name is required" }
```

## Scripts

- `npm run dev` — start in development mode
- `npm run build` — compile TypeScript
- `npm start` — run compiled code
- `npx prisma generate` — regenerate Prisma client
- `npx prisma migrate dev` — apply migrations

## Future Improvements

- Add pagination & sorting
- Integrate authentication & authorization
- Use PostgreSQL or MySQL in production
- Add comprehensive test suite

---

*End of README*

