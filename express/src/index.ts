import express from 'express'
import cors from 'cors'

const app = express()

if(process.env.CORS_ORIGINS){
  app.use(cors({
    origin: process.env.CORS_ORIGINS?.split(",").map(s => s.trim()) || [],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Allowed methods
    credentials: true, // Enable cookies and credentials
  }));
}



const welcomeStrings = [
  "Hello Express!",
  "To learn more about Express on Vercel, visit https://vercel.com/docs/frameworks/backend/express",
]

app.get('/', (_req, res) => {
  res.send(welcomeStrings.join('\n\n'))
})

app.get('/protected', (req, res) => {
  res.json({ message: 42, authSession: 'not implemented yet' })
})


export default app

// force deploy