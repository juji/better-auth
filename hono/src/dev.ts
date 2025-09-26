import 'dotenv/config'

import { serve } from '@hono/node-server'
import app from './index.js'

const server = serve({ 
  fetch: app.fetch,
  port: 3001 
})

console.log('Hono app is running on http://localhost:3001')

// graceful shutdown
process.on('SIGINT', () => {
  server.close()
  process.exit(0)
})

process.on('SIGTERM', () => {
  server.close((err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    process.exit(0)
  })
})