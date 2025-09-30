import { Hono } from 'hono'

import { auth, type Session } from "./lib/auth.js"; // path to your auth file
import { cors } from "hono/cors";
import { authMiddleware } from '#middlewares/auth.js';

type Variables = {
  session?: Session
}

const app = new Hono<{ Variables: Variables }>()

if(process.env.CORS_ORIGINS){
  app.use('/*', cors({
    origin: process.env.CORS_ORIGINS.split(",").map(s => s.trim()),
    allowMethods: ["POST", "GET", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],

    // expose headers for jwt?
    // no need, jwt token creation is accessed through tokens endpoint
    exposeHeaders: [
      "Content-Length", 
      // 'Set-Auth-Jwt'
    ],
    credentials: true,
  }))
}

app.on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw));

const welcomeStrings = `
<html><body style="margin: 0; padding: 0;">
<div style="background-color: #000; color: #eaeaea; padding: 16px; font-family: Arial, sans-serif; height: 100vh;">
  <p>Hello From Hono!</p>
  <p>Auth docs at <a style="color: #c2ffc2;" 
    href="https://better-auth-hono.jujiplay.com/auth/reference">
    https://better-auth-hono.jujiplay.com/auth/reference</a></p>
</div>
</body></html>
`

app.get('/', (c) => {
  return c.html(welcomeStrings)
})

app.get('/protected', authMiddleware, (c) => {
  return c.json({ 
    message: 42, 
    user: c.get('session')?.user,
    accessedVia: 'Hono API Route',
    timestamp: new Date().toISOString(),
  });
})

app.get('/maintenance', async (c) => {

  const maintenanceQueryString = c.req.query('key')
  if(!process.env.MAINTENANCE_KEY || maintenanceQueryString !== process.env.MAINTENANCE_KEY){
    return c.json({ error: 'Unauthorized' }, 401)
  }

  try {
    // Import the maintenance function dynamically
    const { maintenance } = await import('./scripts/maintenance.js');
    
    // Run maintenance without exiting the process
    await maintenance(false);
    
    return c.json({ 
      message: 'Maintenance completed successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Maintenance error:', error);
    return c.json({ 
      error: 'Maintenance failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, 500);
  }
})

export default app


// force deploy again