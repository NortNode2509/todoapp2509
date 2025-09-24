import express from "express"
import dotenv from "dotenv"
dotenv.config()

import {api} from "./api.js"

const PORT = process.env.PORT || 8080

const app = express()

app.use("/", express.static("public"))
app.use(express.json())
app.use('/api', api)

app.get('/health', (req, res) => {
    res.json({status: 'OK'})
})

app.listen(PORT, () => {console.log('Rakendus töötab pordil ' + PORT)})



