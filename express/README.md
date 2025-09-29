# Better Auth Express Client

This is an Express.js server that demonstrates how to integrate with a Better Auth server as a client application. It acts as a proxy/client that connects to the Hono authentication backend for user authentication.

## Purpose

This Express server serves as an example implementation showing how to:
- Connect to an external Better Auth server
- Implement JWT-based authentication in Express.js
- Create protected API routes
- Handle authentication middleware

## Tech Stack

- **Express.js**: Web framework
- **Better Auth Client**: Authentication client library
- **JWT/JWKS**: Token verification
- **TypeScript**: Type safety

## Architecture

Unlike the Hono directory (which is a standalone auth server), this Express application acts as a **client** that:
- Connects to the Hono auth server (running on port 3001)
- Validates JWT tokens using JWKS
- Provides protected API endpoints
- Demonstrates client-side integration patterns

## Getting Started

### Prerequisites

- Node.js
- Running Hono auth server (see hono directory)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file with:
```env
# Auth server URL (Hono backend)
AUTH_SERVER=http://localhost:3001

# CORS configuration
CORS_ORIGINS=http://localhost:3000

# JWT verification

```

3. Start the development server:
```bash
npm run dev
```

The server will run on http://localhost:3002

## API Endpoints

- `GET /` - Welcome message
- `GET /protected` - Protected endpoint requiring valid JWT token

## Authentication Flow

1. **Client Authentication**: Users authenticate through the Hono auth server
2. **Token Validation**: Express server validates JWT tokens using JWKS
3. **Session Fetching**: Retrieves user session data from the auth server
4. **Protected Access**: Grants access to protected routes with valid tokens

## Middleware

### Auth Middleware
The `authMiddleware` function:
- Extracts Bearer tokens from Authorization headers
- Verifies JWT tokens using JWKS
- Fetches user sessions from the auth server
- Attaches user and session data to request objects
- Returns 401 errors for invalid/expired tokens

## Configuration

### Environment Variables

- `AUTH_SERVER`: URL of the Better Auth server (default: http://localhost:3001)
- `CORS_ORIGINS`: Comma-separated list of allowed origins
- `JWT_AUDIENCE`: Expected JWT audience claim

### JWKS Setup

The JWKS (JSON Web Key Set) is used to verify JWT tokens. You need to obtain the public key from your Better Auth server configuration.

## Development

### Scripts

- `npm run dev` - Start development server with hot reload

### Project Structure

```
src/
├── index.ts              # Main Express application
├── dev.ts                # Development server setup
├── lib/
│   ├── auth-client.ts    # Better Auth client configuration
│   └── jwks.ts           # JWT verification utilities
└── middlewares/
    └── auth.ts           # Authentication middleware
```

## Usage Example

### Making Authenticated Requests

```javascript
// Get a token from the auth server first
const token = "your-jwt-token";

// Make request to protected endpoint
fetch('http://localhost:3002/protected', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

### Response Format

Protected endpoints return:
```json
{
  "message": 42,
  "authSession": {
    "user": { /* user object */ },
    "session": { /* session object */ }
  }
}
```

## Integration with Better Auth

This Express server demonstrates the client-side integration pattern for Better Auth:

1. **Separate Concerns**: Auth server (Hono) handles authentication logic
2. **Client Applications**: Express apps consume auth services
3. **JWT Tokens**: Secure token-based communication
4. **Middleware Pattern**: Reusable auth validation

## Deployment

### Vercel

The project is configured for Vercel deployment:

```bash
npm install
npx vercel
```

Ensure all environment variables are configured in your Vercel project settings.