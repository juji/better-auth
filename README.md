# Better Auth - checking out the new Auth lib.

So, what should we build..?

- A next.js app
- A Hono server
- an Express server

Two auth method should be created:

- Auth with nextjs's api directory
- Auth with a hono server
- Auth with an Express server

Every auth method have email + password auth. Also comes with forgot-password and change password routine.

The Application is hosted in https://better-auth-nextjs-tawny.vercel.app/

It is a nextjs app that contains the three auth method.

## Database & ORM

Databse is [postgres](https://www.postgresql.org).. local db on dev, and remote db (Neon, Supabase, Aiven) on live.

Check them out:

- https://neon.com (Express)
- https://supabase.com (Hono)
- https://aiven.io (Next.js)

We are using [DrizzleOrm](https://orm.drizzle.team) to connect to postgres.

## Hono: the one with the most feature.

The Hono App has these:

- Github oAuth
