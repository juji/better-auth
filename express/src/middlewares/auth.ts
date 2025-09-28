import { verifyJwt } from "../lib/jwks.js";
import { getUserSession } from "../lib/auth-client.js";


export async function authMiddleware(req, res, next) {

  // Extract the token from headers, verify it, and attach user info to req object

  // get Authorization header
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header' });
  }

  const token = authHeader.split(' ')[1]; // Assuming Bearer token
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try{
    // Here verify the token and fetch user info
    await verifyJwt(token);
    const { session, error } = await getUserSession({ token });

    if(error || !session) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    req.user = session.user; // Attach user info to request object
    req.sesssion = session.session;
    next(); // Proceed to the next middleware or route handler
    
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }


}