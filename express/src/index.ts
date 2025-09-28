import express from 'express'
import cors from 'cors'
import { authMiddleware } from './middlewares/auth.js';

const app = express()

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


export default app

// force deploy