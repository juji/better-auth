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

app.get('/oauth-landing', (c) => {
  return c.html(`
<html><body style="margin: 0; padding: 0; background-color: #000; color: #eaeaea; font-family: Arial, sans-serif;">
<div style="height: 100vh; display: flex; justify-content: center; align-items: center;">
  <p>OAuth Landing Page. Redirecting...</p>
</div>
<script>
  // Extract the query parameters from the URL
  const params = new URLSearchParams(window.location.search);
  const error = params.get('error');
  console.log('error', error);
  // Redirect to the frontend application with the error message if exists
  // this will not work universally 
  // because CORS_ORIGINS is expected to be multiple
  //
  setTimeout(() => {
    window.location.href = '${process.env.CORS_ORIGINS}/' + (error ? '?error=' + error : '');
  }, 3000);
</script>
</body></html>
`)
})

app.get('/protected', authMiddleware, (c) => {
  return c.json({ message: 42, authSession: c.get('session') });
})

export default app
