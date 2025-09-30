import { createMiddleware } from 'hono/factory'
import { auth } from "#lib/auth.js"; // path to your auth file

export const authMiddleware = createMiddleware(async (ctx, next) => {
  const session = await auth.api.getSession({
    headers: ctx.req.raw.headers
  })

  if (!session) {
    return ctx.json({ error: "Unauthorized" }, 401)
  }
  
  ctx.set('session', session)
  await next();
})
