import { Hono } from 'hono'

import { auth } from "./lib/auth.js"; // path to your auth file
import { cors } from "hono/cors";


const app = new Hono()

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

export default app
