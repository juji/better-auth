import { verifyJwt } from "../lib/jwks.js";


export async function authMiddleware(req, res, next) {

  // Extract the token from cookies or headers, verify it, and attach user info to req object

  let token = '';
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try{
    // Here verify the token and get the data
    const url = new URL(req.headers.origin || req.headers.referer);
    const audience = url.origin;
    const jwt = await verifyJwt(token, audience);
    req.user = jwt.payload.user; // Attach user info to request object
    next(); // Proceed to the next middleware or route handler

  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }


}