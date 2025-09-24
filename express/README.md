# Express TypeScript Server

This is a simple Express.js server written in TypeScript.

## Setup

1. Install dependencies:
   ```
   npm install
   ```
   or if you use pnpm:
   ```
   pnpm install
   ```

2. Set up environment variables:
   - Copy `.env.example` to `.env` (or use the existing one)
   - Modify variables as needed

3. Development:
   ```
   npm run dev
   ```
   or
   ```
   pnpm dev
   ```

4. Build for production:
   ```
   npm run build
   ```
   or
   ```
   pnpm build
   ```

5. Start production server:
   ```
   npm start
   ```
   or
   ```
   pnpm start
   ```

## API Endpoints

- `GET /`: Returns a welcome message
- `GET /health`: Health check endpoint

## Project Structure

```
.
├── src/                  # Source files
│   └── index.ts          # Main entry point
├── .env                  # Environment variables
├── .gitignore            # Git ignore file
├── package.json          # Package configuration
├── tsconfig.json         # TypeScript configuration
└── README.md             # This file
```