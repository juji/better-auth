# Better Auth - checking out the new Auth lib.

So, what did we build..?

- A [Next.js](nextjs.org) app
- A [Hono](hono.dev) server
- an [Express](https://expressjs.com) server

Three auth method were created:

- Auth with Nextjs's api directory
- Auth with a hono server
- Auth with an Express server

Every auth method have email + password auth. Also comes with forgot-password and change password routine.

The Application is hosted at https://better-auth.jujiplay.com/

It is the nextjs app. Also contains the three auth method.

## Database & ORM

Database is [postgres](https://www.postgresql.org).. local db on dev, and remote db (Neon, Supabase, Aiven) on live.

Check them out:

- https://neon.com (Express)
- https://supabase.com (Hono)
- https://aiven.io (Next.js)

We are using [DrizzleOrm](https://orm.drizzle.team) to connect to postgres.

## Hono: the one with the most feature.

The Hono App has these:

- Enabled Github oAuth
- Enabled Google oAuth
- OpenApi docs at https://better-auth-honojujiplay.com/auth/reference
- Enabled magic link
