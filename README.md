# Better Auth Experiment

A demonstration of [Better Auth](https://www.better-auth.com) - a modern, open-source authentication framework for TypeScript applications.

## 🚀 What We Built

This project showcases three different server implementations of Better Auth:

- **[Next.js](https://nextjs.org)** - Full-stack React framework with App Router
- **[Hono](https://hono.dev)** - Lightweight, fast web framework
- **[Express](https://expressjs.com)** - Traditional Node.js web framework

## ✨ Features

### Core Authentication
- **Email + Password** authentication
- **Social Logins** (GitHub, Google)
- **Magic Link** authentication
- **Passkey/WebAuthn** support for passwordless login
- **Multi-session** management across devices
- **Forgot Password** & **Change Password** flows

### Technical Features
- **TypeScript** throughout for type safety
- **PostgreSQL** database with connection pooling
- **Drizzle ORM** for type-safe database operations
- **OpenAPI Documentation** (Hono implementation)
- **Environment-based Configuration**

## 🏗️ Architecture

### Database & ORM
- **PostgreSQL** for data persistence
- **Drizzle ORM** for schema management and queries
- **Database Migrations** with Drizzle Kit

### Hosting & Deployment
- **Next.js App**: [better-auth.jujiplay.com](https://better-auth.jujiplay.com)
- **Hono API**: [better-auth-hono.jujiplay.com](https://better-auth-hono.jujiplay.com)
- **Express API**: [better-auth-express.jujiplay.com](https://better-auth-express.jujiplay.com)

## 📁 Project Structure

```
better-auth/
├── nextjs/          # Next.js implementation (main demo)
├── hono/           # Hono server implementation
├── express/        # Express server implementation
└── docker-compose.yml  # Development environment
```

## 🛠️ Technology Stack

### Frontend (Next.js)
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom glassmorphism effects
- **State Management**: React hooks with Better Auth client
- **Navigation**: Hash-based routing for auth flows

### Backend (All implementations)
- **Auth Library**: Better Auth v1.x
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Validation**: Built-in Better Auth validation

### Development
- **Language**: TypeScript
- **Package Manager**: pnpm
- **Containerization**: Docker & Docker Compose
- **Code Quality**: ESLint, Prettier

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm
- Docker & Docker Compose
- PostgreSQL (or use the provided docker-compose)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd better-auth
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the database**
   ```bash
   docker-compose up -d
   ```

4. **Set up environment variables**
   - Copy `.env.example` to `.env.local`
   - Configure your database URL and auth secrets

5. **Run database migrations**
   ```bash
   cd nextjs && pnpm run db:push
   ```

6. **Start the development server**
   ```bash
   pnpm run dev
   ```

## 🎯 Key Features Showcase

### Hono Implementation (Most Feature-Complete)
- ✅ GitHub OAuth
- ✅ Google OAuth
- ✅ Magic Link authentication
- ✅ Passkey/WebAuthn support
- ✅ Multi-session management
- ✅ OpenAPI documentation at `/auth/reference`

### Next.js Implementation (Main Demo)
- ✅ Complete UI/UX with glassmorphism design
- ✅ All authentication methods
- ✅ Protected routes and session management
- ✅ Responsive design
- ✅ Hash-based navigation

### Express Implementation
- ✅ Traditional server setup
- ✅ Core authentication features
- ✅ RESTful API design

## 🔐 Authentication Methods

| Method | Next.js | Hono | Express |
|--------|---------|------|---------|
| Email/Password | ✅ | ✅ | ✅ |
| GitHub OAuth | ❌ | ✅ | ❌ |
| Google OAuth | ❌ | ✅ | ❌ |
| Magic Link | ❌ | ✅ | ❌ |
| Passkeys | ❌ | ✅ | ❌ |
| Multi-Session | ❌ | ✅ | ❌ |

## 📚 API Documentation

- **Hono OpenAPI**: [better-auth-hono.jujiplay.com/auth/reference](https://better-auth-hono.jujiplay.com/auth/reference)
- **Better Auth Docs**: [better-auth.com](https://www.better-auth.com)

## 🤝 Contributing

This is an experimental project showcasing Better Auth capabilities. Feel free to:

- Report issues
- Suggest improvements
- Submit pull requests
- Use as reference for your own implementations

## 📄 License

This project is for educational and demonstration purposes.

