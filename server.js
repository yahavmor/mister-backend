import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { reviewRoutes } from './api/review/review.routes.js'
import dotenv from 'dotenv'




dotenv.config()

const app = express()

app.use(cookieParser())
app.use(express.json())

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

import { authRoutes } from './api/auth/auth.routes.js'
import { userRoutes } from './api/user/user.routes.js'
import { toyRoutes } from './api/toy/toy.routes.js'

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/toy', toyRoutes)
app.use('/api/review', reviewRoutes)

    
const port = process.env.PORT || 3030
console.log('ENV:', process.env.NODE_ENV)

app.listen(port, () => {
    console.log('Backend running on port:', port)
})
