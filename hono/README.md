# Better Auth Hono Backend

This is a Hono-based backend server that provides authentication services using the Better Auth library.

## Features

- User authentication with email and password
- Password reset functionality
- Magic link authentication
- Passkey/WebAuthn support
- Multi-session management
- Social login (GitHub, Google)
- Protected API routes
- OpenAPI documentation
- Email notifications via SMTP

## Tech Stack

- **Hono**: Web framework
- **Better Auth**: Authentication library
- **Drizzle ORM**: Database ORM for PostgreSQL
- **PostgreSQL**: Database
- **NodeMailer**: Email sending
- **TypeScript**: Type safety

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL database
- SMTP server for email (optional)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file with:
```env
# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
POSTGRES_DB=your_database
# Or use a connection string:
# POSTGRES_URL=postgresql://user:password@localhost:5432/database

# CORS
CORS_ORIGINS=http://localhost:3000

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=your_email@gmail.com

# Social Providers (optional)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Passkey configuration
BETTER_AUTH_PASSKEY_RPID=localhost
BETTER_AUTH_PASSKEY_ORIGIN=http://localhost:3000

# Cross-subdomain cookies (optional)
CROSS_SUBDOMAIN_COOKIE_DOMAIN=localhost
```

3. Generate and run database migrations:
```bash
npm run generate
npm run migrate
```

4. Start the development server:
```bash
npm run dev
```

The server will run on http://localhost:3001

## API Endpoints

- `GET /` - Welcome page
- `POST|GET /auth/*` - Authentication endpoints (handled by Better Auth)
- `GET /protected` - Protected endpoint requiring authentication

## Authentication Methods

### Email and Password
Standard email/password authentication with password reset.

### Magic Links
Passwordless authentication via email magic links.

### Passkeys
WebAuthn/FIDO2 passkey authentication for secure, passwordless login.

### Social Login
OAuth integration with GitHub and Google.

### Multi-Session
Support for multiple concurrent sessions per user.

## Database Schema

The application uses the following tables:
- `users` - User accounts
- `sessions` - User sessions
- `accounts` - OAuth/social login accounts
- `verifications` - Email verification tokens
- `passkeys` - WebAuthn credentials

## Development

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm run generate` - Generate database schema
- `npm run migrate` - Run database migrations
- `npm run generate-auth` - Generate auth schema using Better Auth CLI

### Project Structure

```
src/
├── index.ts              # Main application setup
├── dev.ts                # Development server
├── lib/
│   ├── auth.ts           # Better Auth configuration
│   ├── db/
│   │   ├── index.ts      # Database connection
│   │   └── schema/       # Database schemas
│   └── mailer/           # Email functionality
└── middlewares/
    └── auth.ts           # Authentication middleware
```

## Deployment

### Vercel

The project is configured for Vercel deployment:

```bash
npm install
npx vercel
```

### Environment Variables

Ensure all required environment variables are set in your deployment platform.

## OpenAPI Documentation

The API provides OpenAPI documentation at `/auth/reference` when the OpenAPI plugin is enabled.