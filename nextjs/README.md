# Better Auth Next.js Demo

This is a Next.js application that demonstrates authentication features using the Better Auth library.

## Features

- User registration and login
- Password reset functionality
- Protected routes
- Session management
- Passkey authentication
- Multi-session support
- Magic link authentication
- Social login options

## Getting Started

### Prerequisites

- Node.js
- pnpm (recommended) or npm/yarn
- A running Hono backend server (see the hono directory)

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
Create a `.env.local` file with:
```
NEXT_PUBLIC_HONO_SERVER=http://localhost:3000
```

3. Start the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

- `app/` - Next.js app router pages
  - `(protected)/` - Protected route group
  - `page.tsx` - Main authentication page
- `components/` - React components for authentication
- `lib/` - Authentication client configuration

## Authentication Flow

The application connects to a Hono backend server for authentication. The auth client is configured in `lib/auth-client-hono.ts` with plugins for:

- Magic link authentication
- Passkey authentication
- Multi-session management

## Protected Resources

Authenticated users can access protected API endpoints through the demo pages in the `(protected)` route group.

## Development

- Uses Next.js 15 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Turbopack for fast builds

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
