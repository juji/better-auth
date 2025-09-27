import 'dotenv/config'

import app from "./index.js"

const port = 3002
app.listen(port, () => {
  console.log(`Express app listening on port ${port}`)
})