# Node Auth Service

A portfolio-ready authentication and authorization service built with **Node.js, Express.js, MongoDB, Mongoose, JWT and Swagger**.

> Personal learning/portfolio project. It demonstrates secure API patterns and is not presented as production code from a client project.

## Features

- User registration
- Login with email/password
- Password hashing with bcrypt
- Short-lived JWT access tokens
- Refresh token rotation
- Refresh tokens stored hashed in MongoDB
- Role-based authorization (`user`, `admin`)
- Protected endpoints
- Get current user profile
- Logout / revoke refresh token
- Request validation and centralized error handling
- Security headers with Helmet
- Basic rate limiting
- CORS configuration
- Swagger / OpenAPI documentation
- Docker + Docker Compose support

## Tech Stack

- Node.js 20+
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Swagger / OpenAPI
- Docker

## Project Structure

```text
node-auth-service/
├── src/
│   ├── config/
│   │   ├── db.js
│   │   └── env.js
│   ├── controllers/
│   │   └── authController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── roleMiddleware.js
│   ├── models/
│   │   ├── RefreshToken.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   ├── asyncHandler.js
│   │   ├── token.js
│   │   └── swagger.js
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

## Prerequisites

- Node.js 20+
- npm
- MongoDB 7+ locally, or Docker Desktop

## Run locally with MongoDB

### 1. Clone

```bash
git clone https://github.com/rakeshpooniatech/node-auth-service.git
cd node-auth-service
```

### 2. Install

```bash
npm install
```

### 3. Configure environment

Copy `.env.example` to `.env` and replace the JWT secrets.

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

### 4. Start MongoDB

If MongoDB is installed locally, make sure it is running.

### 5. Start the app

```bash
npm run dev
```

API base URL:

```text
http://localhost:5000
```

Swagger:

```text
http://localhost:5000/api-docs
```

Health check:

```text
http://localhost:5000/health
```

## Run with Docker

```bash
docker compose up --build
```

Swagger:

```text
http://localhost:5000/api-docs
```

## API Endpoints

| Method | Endpoint | Auth |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/refresh` | Public |
| POST | `/api/auth/logout` | Public* |
| GET | `/api/users/me` | Bearer token |
| GET | `/api/users/admin-only` | Admin |

\* Logout accepts the refresh token and revokes it.

## Example Register

```json
{
  "name": "Rakesh Poonia",
  "email": "rakesh@example.com",
  "password": "StrongPassword123"
}
```

## Example Login Response

```json
{
  "message": "Login successful",
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "user": {
    "id": "....",
    "name": "Rakesh Poonia",
    "email": "rakesh@example.com",
    "role": "user"
  }
}
```

## Authentication Flow

1. User registers.
2. Password is hashed with bcrypt.
3. User logs in.
4. Server issues a short-lived access token and a longer-lived refresh token.
5. Client sends the access token in the `Authorization` header.
6. When the access token expires, the client exchanges the refresh token for a new token pair.
7. The old refresh token is revoked during rotation.
8. Logout revokes the active refresh token.

## Role-Based Access

Default users have:

```text
role = user
```

The admin-only endpoint demonstrates authorization middleware. To create an admin for local testing, update the user's `role` field in MongoDB to:

```text
admin
```

Then call:

```text
GET /api/users/admin-only
Authorization: Bearer <access-token>
```

## Security Notes

- Never commit `.env`.
- Use long, random JWT secrets.
- Use HTTPS in production.
- Replace the demo CORS origin with the real frontend URL.
- Consider secure, httpOnly cookies for browser-based refresh tokens.
- Add stronger schema validation and audit logging for production deployments.

## Interview Topics Demonstrated

- JWT authentication
- Access vs refresh tokens
- Refresh token rotation
- Password hashing
- RBAC
- Middleware architecture
- MongoDB/Mongoose
- API security
- Swagger/OpenAPI
- Docker
- Error handling
- Rate limiting

## License

MIT
