

import { Hono } from 'hono';
import { authMiddleware } from '#middlewares/auth.js';
import { db } from '#lib/db/index.js';
import { users, members } from '#lib/db/schema/auth.js';
import { eq, and, ne, count } from 'drizzle-orm';

const usersRouter = new Hono();

/*
GET /users
List all users
needs to be authenticated
optional query param ?organization=orgId to filter by organization
optional query param ?exclude=userId to filter out user by id
optional query param ?count=1 to just count the number of users based on other filters
if ?count=1 is provided, returns { count: number } instead of user list
*/
usersRouter.get('/', 
  authMiddleware, 
  async (c) => {
  try {
    const organizationId = c.req.query('organization');
    const excludeUserId = c.req.query('exclude');
    const isCountOnly = c.req.query('count') === '1';

    let result;

    if (isCountOnly) {
      // Count queries - more efficient
      if (organizationId && excludeUserId) {
        result = await db.select({ count: count() })
          .from(users)
          .innerJoin(members, eq(users.id, members.userId))
          .where(and(
            eq(members.organizationId, organizationId),
            ne(users.id, excludeUserId)
          ));
      } else if (organizationId) {
        result = await db.select({ count: count() })
          .from(users)
          .innerJoin(members, eq(users.id, members.userId))
          .where(eq(members.organizationId, organizationId));
      } else if (excludeUserId) {
        result = await db.select({ count: count() })
          .from(users)
          .where(ne(users.id, excludeUserId));
      } else {
        result = await db.select({ count: count() }).from(users);
      }
      return c.json({ count: result[0].count });
    } else {
      // Full data queries
      if (organizationId && excludeUserId) {
        result = await db.select({
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
          createdAt: users.createdAt,
        })
        .from(users)
        .innerJoin(members, eq(users.id, members.userId))
        .where(and(
          eq(members.organizationId, organizationId),
          ne(users.id, excludeUserId)
        ));
      } else if (organizationId) {
        result = await db.select({
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
          createdAt: users.createdAt,
        })
        .from(users)
        .innerJoin(members, eq(users.id, members.userId))
        .where(eq(members.organizationId, organizationId));
      } else if (excludeUserId) {
        result = await db.select({
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(ne(users.id, excludeUserId));
      } else {
        result = await db.select({
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
          createdAt: users.createdAt,
        }).from(users);
      }
      return c.json({
        users: result,
        count: result.length,
      });
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    return c.json({ error: 'Failed to fetch users' }, 500);
  }
});

export default usersRouter;