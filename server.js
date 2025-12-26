import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import { reviewRoutes } from './api/review/review.routes.js'



dotenv.config()

const app = express()

// Middleware
app.use(cookieParser())
app.use(express.json())

// CORS for development
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:3000',
        'http://127.0.0.1:3000'
    ],
    credentials: true
}
app.use(cors(corsOptions))

// Routes
import { authRoutes } from './api/auth/auth.routes.js'
import { userRoutes } from './api/user/user.routes.js'
import { toyRoutes } from './api/toy/toy.routes.js'

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/toy', toyRoutes)

const port = process.env.PORT || 3030
app.listen(port, () => {
    console.log('Backend running on port:', port)
})
app.use('/api/review', reviewRoutes)
