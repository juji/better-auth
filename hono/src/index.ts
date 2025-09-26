import { Hono } from 'hono'

import { auth, type Session } from "./lib/auth.js"; // path to your auth file
import { cors } from "hono/cors";
import { authMiddleware } from './middlewares/auth.js';

type Variables = {
  session?: Session
}

const app = new Hono<{ Variables: Variables }>()

app.use('/*', cors({
  origin: process.env.CORS_ORIGINS?.split(",") || [],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}))

app.on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw));

const welcomeStrings = [
  'Hello Hono!',
  'To learn more about Hono on Vercel, visit https://vercel.com/docs/frameworks/backend/hono'
]

app.get('/', (c) => {
  return c.text(welcomeStrings.join('\n\n'))
})

app.get('/protected', authMiddleware, (c) => {
  return c.json({ message: 42, authSession: c.get('session') });
})

export default app
