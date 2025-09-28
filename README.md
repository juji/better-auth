# Better Auth Experiment

A demonstration of [Better Auth](https://www.better-auth.com) - a modern, open-source authentication framework for TypeScript applications.

## 🚀 What We Built

This project showcases three different implementations of Better Auth:

- **[Next.js](nextjs/)** - Full-stack React application with authentication UI
- **[Hono](hono/)** - Standalone authentication server with comprehensive features
- **[Express](express/)** - Client application demonstrating server integration

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

### Implementation Overview

- **Next.js**: Frontend application with authentication UI, connects to Hono backend
- **Hono**: Complete authentication server with database, all auth methods, and API
- **Express**: Client/server example showing how to integrate with external auth servers

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
├── nextjs/          # Next.js frontend with auth UI (port 3000)
├── hono/           # Hono auth server with full features (port 3001)
├── express/        # Express client/server example (port 3002)
└── docker-compose.yml  # PostgreSQL development database
```

## 🛠️ Technology Stack

### Frontend (Next.js)
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Auth Client**: Better Auth React client
- **State Management**: React hooks

### Backend (Hono - Full Auth Server)
- **Framework**: Hono
- **Auth Library**: Better Auth v1.x with all plugins
- **Database**: PostgreSQL with Drizzle ORM
- **Email**: Nodemailer with SMTP
- **Documentation**: OpenAPI integration

### Backend (Express - Client Example)
- **Framework**: Express.js
- **Auth Client**: Better Auth client library
- **JWT**: Jose for token verification
- **Purpose**: Demonstrates client/server integration

### Development
- **Language**: TypeScript throughout
- **Package Manager**: pnpm
- **Containerization**: Docker & Docker Compose

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm
- Docker & Docker Compose (for local database)

### Quick Start

1. **Clone and install**
   ```bash
   git clone <repository-url>
   cd better-auth
   pnpm install
   ```

2. **Start PostgreSQL database**
   ```bash
   docker-compose up -d
   ```

3. **Set up Hono auth server** (most feature-complete)
   ```bash
   cd hono
   # Configure .env file (see hono/README.md)
   npm run generate
   npm run migrate
   npm run dev  # Runs on port 3001
   ```

4. **Start Next.js frontend**
   ```bash
   cd ../nextjs
   # Configure .env.local (see nextjs/README.md)
   pnpm dev  # Runs on port 3000
   ```

5. **(Optional) Start Express client**
   ```bash
   cd ../express
   # Configure .env file (see express/README.md)
   npm run dev  # Runs on port 3002
   ```

### Development URLs
- **Next.js Frontend**: http://localhost:3000
- **Hono Auth Server**: http://localhost:3001
- **Express Client**: http://localhost:3002

## 🎯 Key Features Showcase

## 🎯 Implementation Features

### Hono Implementation (Most Feature-Complete)
- ✅ Complete authentication server
- ✅ GitHub OAuth, Google OAuth
- ✅ Magic Link authentication
- ✅ Passkey/WebAuthn support
- ✅ Multi-session management
- ✅ Email notifications
- ✅ OpenAPI documentation
- ✅ PostgreSQL with Drizzle ORM

### Next.js Implementation (Frontend Demo)
- ✅ Authentication UI components
- ✅ User registration and login
- ✅ Protected routes
- ✅ Session management
- ✅ Password reset flow
- ✅ Responsive design
- ✅ Connects to Hono backend

### Express Implementation (Integration Example)
- ✅ Client/server architecture demo
- ✅ JWT token validation
- ✅ Protected API routes
- ✅ Authentication middleware
- ✅ External auth server integration

## 📚 Documentation & APIs

### Hono Auth Server
- **OpenAPI Docs**: http://localhost:3001/auth/reference (when running)
- **API Base**: http://localhost:3001/auth
- **Protected Route**: http://localhost:3001/protected

### Express Client Server
- **API Base**: http://localhost:3002
- **Protected Route**: http://localhost:3002/protected

### Better Auth Documentation
- **Official Docs**: [better-auth.com](https://www.better-auth.com)
- **GitHub**: [github.com/better-auth/better-auth](https://github.com/better-auth/better-auth)

## 🤝 Contributing

This project demonstrates different integration patterns with Better Auth:

- **Hono**: Full-featured authentication server implementation
- **Next.js**: Frontend integration with authentication UI
- **Express**: Client/server architecture patterns

Feel free to:
- Report issues with specific implementations
- Suggest improvements to the demos
- Submit pull requests for bug fixes
- Use as reference for your own Better Auth integrations

## 📄 License

This project is for educational and demonstration purposes. See individual directory READMEs for specific implementation details.

