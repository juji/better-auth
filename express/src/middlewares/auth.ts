import { verifyJwt } from "../lib/jwks.js";
import { getUserSession } from "../lib/auth-client.js";


export async function authMiddleware(req, res, next) {

  // Extract the token from cookies or headers, verify it, and attach user info to req object

  let token = req.cookies?.authToken;

  // Fallback to Authorization header
  if (!token) {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try{
    // Here verify the token and fetch user info
    // Use request origin as audience
    let audience = req.headers.origin;
    if (!audience && req.headers.referer) {
      try {
        audience = new URL(req.headers.referer).origin;
      } catch {}
    }
    audience = audience || 'http://localhost:3000';
    await verifyJwt(token, audience);

    console.log("Token verified, fetching user session...");
    const { session, error } = await getUserSession({ token });
    console.log("User session fetched:", { session, error });

    if(error || !session) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    req.user = session.user; // Attach user info to request object
    req.session = session.session;
    next(); // Proceed to the next middleware or route handler

  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }


}