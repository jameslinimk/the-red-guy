import express from 'express'
import path from 'path'
const app = express()
const port = 80

app.use('/', express.static(path.join(__dirname, "website")))

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})