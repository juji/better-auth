import express from 'express'
import cors from 'cors'

const app = express()

const corsOptions = {
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  "preflightContinue": false,
  "optionsSuccessStatus": 200,
  "credentials": true,            // Enable cookies and credentials
}

app.use(cors(corsOptions))

const welcomeStrings = [
  "Hello Express!",
  "To learn more about Express on Vercel, visit https://vercel.com/docs/frameworks/backend/express",
]

app.get('/', (_req, res) => {
  res.send(welcomeStrings.join('\n\n'))
})


export default app
