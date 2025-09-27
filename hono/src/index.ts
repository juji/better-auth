import { Hono } from 'hono'

import { auth, type Session } from "./lib/auth.js"; // path to your auth file
import { cors } from "hono/cors";
import { authMiddleware } from './middlewares/auth.js';

type Variables = {
  session?: Session
}

const app = new Hono<{ Variables: Variables }>()

app.use('/*', cors({
  origin: process.env.CORS_ORIGIN || '',
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["POST", "GET", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  credentials: true,
}))

app.on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw));

const welcomeStrings = `
<html><body style="margin: 0; padding: 0;">
<div style="background-color: #000; color: #eaeaea; padding: 16px; font-family: Arial, sans-serif; height: 100vh;">
  <p>Hello From Hono!</p>
  <p>Auth docs at <a style="color: #c2ffc2;" 
    href="https://better-auth-hono-ashen.vercel.app/auth/reference">
    https://better-auth-hono-ashen.vercel.app/auth/reference</a></p>
</div>
</body></html>
`

app.get('/', (c) => {
  return c.html(welcomeStrings)
})

app.get('/protected', authMiddleware, (c) => {
  return c.json({ message: 42, authSession: c.get('session') });
})

export default app
