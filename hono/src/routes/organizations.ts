import { Hono } from 'hono';
import { authMiddleware } from '#middlewares/auth.js';
import { auth } from '#lib/auth.js';

const organizationsRouter = new Hono();

/*
POST /organizations/add-member
Add a user directly to an organization
Body: {
  organizationId: string,
  userId: string,
  role?: "member" | "admin" | "owner"
}
*/
organizationsRouter.post('/add-member', authMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const { organizationId, userId, role = 'member' } = body;

    if (!organizationId || !userId) {
      return c.json({ error: 'organizationId and userId are required' }, 400);
    }

    const data = await auth.api.addMember({
      body: {
        userId,
        role: [role],
        organizationId,
      },
    });

    return c.json({
      message: 'User added to organization successfully',
      data
    });

  } catch (error) {
    console.error('Error adding member to organization:', error);
    return c.json({ error: 'Failed to add member to organization' }, 500);
  }
});

export default organizationsRouter;