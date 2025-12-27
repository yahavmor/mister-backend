import dotenv from 'dotenv'
dotenv.config()

import dev from './dev.js'
import prod from './prod.js'

export const config = process.env.NODE_ENV === 'production'
  ? prod
  : dev
