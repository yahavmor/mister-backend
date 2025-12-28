import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import session from 'express-session'
import MongoStore from 'connect-mongo'

dotenv.config()

const app = express()

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'https://mistoy-frontend.onrender.com'
    ],
    credentials: true
  })
)

app.use(cookieParser())
app.use(express.json())

app.use(session({
    secret: process.env.SECRET || 'supersecret123',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        dbName: process.env.DB_NAME,
        collectionName: 'sessions'
    }),
    cookie: {
        secure: true,
        sameSite: 'none',
        httpOnly: true,
        path: '/',              
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}))

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
