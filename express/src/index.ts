import express from 'express'
import cors from 'cors'
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth.js';
import { authMiddleware } from './middlewares/auth.js';

const app = express()

if(process.env.CORS_ORIGINS){
  app.use(cors({
    origin: process.env.CORS_ORIGINS?.split(",").map(s => s.trim()) || [],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Allowed methods
    credentials: true, // Enable cookies and credentials
  }));
}

app.all("/auth/{*any}", toNodeHandler(auth));


const welcomeStrings = [
  "Hello Express!",
  "To learn more about Express on Vercel, visit https://vercel.com/docs/frameworks/backend/express",
]

app.get('/', (_req, res) => {
  res.send(welcomeStrings.join('\n\n'))
})

app.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 42, authSession: req.session })
})


export default app

// force deploy