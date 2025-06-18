import express = require('express')
import dotenv = require('dotenv')
const authRoutes = require('./routes/authRoutes')

dotenv.config()

const app = express()

app.use(express.json())

app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 4500

app.listen(PORT, ()=> {
    console.log(`Server listening on port ${PORT}`)
})