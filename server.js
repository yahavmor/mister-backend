import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import session from 'express-session'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(cookieParser())
app.use(express.json())

app.use(
  session({
    secret: 'super secret key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      httpOnly: false
    }
  })
)

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173'
    ],
    credentials: true
  })
)

import { authRoutes } from './api/auth/auth.routes.js'
import { userRoutes } from './api/user/user.routes.js'
import { toyRoutes } from './api/toy/toy.routes.js'
import { reviewRoutes } from './api/review/review.routes.js'

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/toy', toyRoutes)
app.use('/api/review', reviewRoutes)

const port = process.env.PORT || 3030
console.log('ENV:', process.env.NODE_ENV)

app.listen(port, () => {
  console.log('Backend running on port:', port)
})
