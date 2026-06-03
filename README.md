# Peer2Peer Skill Swap Backend

A TypeScript Express backend for a peer-to-peer skill swap platform. This repository hosts the backend service under `backend/`, including JWT authentication, skill profile management, wallet tracking, match discovery, connection requests, and meeting scheduling support.

## Project Overview

The backend provides the following core capabilities:

- User registration, login, refresh and logout flows with JWT stored in cookies
- Skill profile creation and retrieval for matching peers
- Skill-match discovery using intersecting teach/learn arrays
- Wallet management with automatic wallet initialization and escrow handling
- Connection request lifecycle: request, accept/reject, completion, and cancellation
- Avatar upload to ImageKit and current user profile retrieval
- Jitsi meeting link generation for accepted connection sessions
- MongoDB persistence and Redis for session/blacklist state
- Structured response format via `ApiResponse`

## Repository Structure

```
backend/
  package.json
  tsconfig.json
  src/
    app.ts              # Express app and route registration
    server.ts           # Server startup, DB + Redis connection
    config/
      envConfig.ts      # Environment validation and config
      logger.ts         # Winston logger setup
    infrastructure/
      database/mongoose.ts
      imagekit/          # ImageKit client and upload service
      redis/redis.ts
    middlewares/
      auth.middleware.ts
      errorHandler.ts
      rateLimiter.middleware.ts
      validateRequest.middleware.ts
    modules/
      auth/             # Auth routes, controller, validation, utils
      skills/           # Skill profile CRUD and validation
      wallet/           # Wallet retrieval and initialization
      match/            # Match discovery endpoint
      connections/      # Connection request lifecycle and meeting metadata
      profile/          # Profile avatar upload and user profile endpoint
      user/             # User model definitions
    utils/
      ApiError.ts
      ApiResponse.ts
      asyncHandler.ts
```

## Tech Stack

- Node.js + TypeScript
- Express.js
- MongoDB with Mongoose
- Redis for token blacklist/session support
- JWT authentication with refresh tokens
- Zod request validation
- Winston logging
- ImageKit and multer for secure avatar uploads
- TSX for local dev execution

## Prerequisites

- Node.js 18+ (or compatible with TSX / TypeScript 6)
- MongoDB instance
- Redis instance
- ImageKit account and credentials for avatar uploads

## Setup

1. Clone the repo

```bash
cd peer2peer
```

2. Install backend dependencies

```bash
cd backend
npm install
```

3. Copy environment variables

```bash
cp .env.example .env
```

4. Set `.env` values:

```dotenv
PORT=4000
NODE_ENV=development
DB_URL=mongodb://localhost:27017/peer2peer
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
REDIS_URL=redis://localhost:6379
SALT_VALUE=10
```

5. Start the app in development mode

```bash
npm run dev
```

6. Build for production

```bash
npm run build
npm start
```

## Available Scripts

- `npm run dev` — start development server using `tsx watch`
- `npm run check-types` — run TypeScript type checker
- `npm run build` — compile TypeScript to `dist/`
- `npm start` — run compiled production server from `dist/server.js`

## Environment Variables

Required variables in `backend/.env`:

- `PORT` — server port
- `NODE_ENV` — application environment (`development` / `production`)
- `DB_URL` — MongoDB connection string
- `ACCESS_TOKEN_SECRET` — JWT access token secret
- `REFRESH_TOKEN_SECRET` — JWT refresh token secret
- `REDIS_URL` — Redis connection URI
- `SALT_VALUE` — bcrypt salt rounds or value
- `MEETING_WINDOW_LIMIT` — optional scheduling window in milliseconds for connection conflict checks

## API Endpoints

### Health

- `GET /api/healthcheck`
  - Returns service uptime and health status.

### API Documentation

- `GET /api/docs`
  - Opens the Swagger UI for interactive API exploration.
- `GET /api/docs.json`
  - Returns the raw OpenAPI document.

### Auth

- `POST /api/auth/register`
  - Body: `{ email, password, name }`
  - Creates a new user.

- `POST /api/auth/login`
  - Body: `{ email, password }`
  - Returns auth cookies: `accessToken`, `refreshToken`.

- `POST /api/auth/refresh`
  - Rotates the refresh token and issues new cookies.

- `POST /api/auth/logout`
  - Clears auth cookies and blacklists the refresh token.

### Skills

- `PUT /api/skills/update`
  - Protected route
  - Body: `{ skillsToLearn?, skillsToTeach? }`
  - Creates or updates the current user skill profile.

- `GET /api/skills/me`
  - Protected route
  - Retrieves the logged-in user skill profile.

### Wallet

- `GET /api/wallet/me`
  - Protected route
  - Retrieves the current user wallet.
  - Automatically bootstraps a wallet with starting balance if missing.

### Match

- `GET /api/match/dashboard`
  - Protected route
  - Returns compatible peer skill matches based on teach/learn intersections.

### Profile

- `POST /api/profile/upload`
  - Protected route
  - Form Data: `{ avatar: file }`
  - Uploads an avatar image to ImageKit and saves the CDN URL on the user.

- `GET /api/profile/me`
  - Protected route
  - Returns the authenticated user's public profile and linked skill profile.

### Connection Requests

- `POST /api/connection/request`
  - Protected route
  - Body: `{ receiverId, proposedTime }`
  - Sends a skill-swap connection request.
  - Validates future meeting time and prevents self-requests.

- `POST /api/connection/respond`
  - Protected route
  - Body: `{ connectionId, action }` where `action` is `accepted` or `rejected`
  - Accepts or rejects a pending connection.
  - Performs conflict checks and reserves escrow balances.
  - Generates Jitsi meeting metadata on acceptance.

- `POST /api/connection/cancel`
  - Protected route
  - Body: `{ connectionId }`
  - Cancels a pending connection request sent by the authenticated user.

- `POST /api/connection/complete`
  - Protected route
  - Body: `{ connectionId }`
  - Completes a connection swap and settles escrow balances.

## Authentication Details

- Authentication is cookie-based.
- `accessToken` and `refreshToken` are stored as secure cookies.
- The `authenticateToken` middleware protects routes by validating the access token.
- Refresh tokens are hashed in MongoDB and blacklisted in Redis on rotation/logout.

## Data Models & Behavior

- `User` stores login credentials, hashed refresh token, and profile metadata.
- `SkillProfile` stores user skill preferences for teaching and learning.
- `Wallet` holds `balance` and `escrowBalance` for peer swap settlement.
- `Connection` stores request status, proposed time, scheduled time, meeting link, and meeting room id.

## Development Notes

- The backend is implemented using ES modules and TypeScript.
- `ApiResponse` provides consistent response formatting.
- `asyncHandler` wraps async routes and forwards errors to centralized middleware.
- The app initiates both MongoDB and Redis connections during server startup.

## Recommendations

- Add explicit tests for auth, connection lifecycle, and wallet settlement.
- Document expected request/response schemas with OpenAPI or Postman.
- Add a frontend or CLI client to exercise all matching and swap flows.

## License

This repository does not specify a license.
