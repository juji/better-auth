import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { authMiddleware } from './middlewares/auth.js';
import { verifyJwt } from './lib/jwks.js';

const app = express()

// Parse cookies
app.use(cookieParser());

if(process.env.CORS_ORIGINS){
  app.use(cors({
    origin: process.env.CORS_ORIGINS?.split(",").map(s => s.trim()) || [],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Allowed methods
    credentials: true, // Enable cookies and credentials
  }));
}

app.get('/', (_req, res) => {
  res.send("Hello From Express!")
})

app.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 42, authSession: {
    user: req.user,
    session: req.session
  } })
})

// GET /auth/token - Set httpOnly cookie with JWT
app.get('/auth/token', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Invalid authorization header' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify the JWT
    await verifyJwt(token);

    // Set httpOnly cookie with the token
    const maxAge = parseInt(process.env.COOKIE_MAX_AGE || '86400000'); // Default 24 hours in milliseconds
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: req.protocol === 'https',
      sameSite: 'strict',
      maxAge: maxAge
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// DELETE /auth/token - Clear the httpOnly cookie
app.delete('/auth/token', (req, res) => {
  res.clearCookie('authToken', {
    httpOnly: true,
    secure: req.protocol === 'https',
    sameSite: 'strict'
  });
  res.json({ success: true });
});


export default app

// force deploy