import express = require('express')
import dotenv = require('dotenv')
import skillRoutes from './routes/skillRoutes'
import { bookSession } from './controllers/sessionController'
const authRoutes = require('./routes/authRoutes')

dotenv.config()

const app = express()

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/skills', skillRoutes)
app.use('/api/bookSession', bookSession)

const PORT = process.env.PORT || 4500

app.listen(PORT, ()=> {
    console.log(`Server listening on port ${PORT}`)
})