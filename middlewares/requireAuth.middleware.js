import { logger } from '../services/logger.service.js'
import { authService } from '../api/auth/auth.service.js'

export async function requireAuth(req, res, next) {
    let loginToken = req?.cookies?.loginToken
    if (!loginToken) {
        const authHeader = req.headers.authorization
        if (authHeader && authHeader.startsWith('Bearer ')) {
            loginToken = authHeader.substring(7)
        }
    }
    if (!loginToken) {
        return res.status(401).send('Not Authenticated')
    }
    
    const loggedinUser = authService.validateToken(loginToken)
    if (!loggedinUser) return res.status(401).send('Not Authenticated')

    req.loggedinUser = loggedinUser
    next()
}

export async function requireAdmin(req, res, next) {
    let loginToken = req?.cookies?.loginToken
    if (!loginToken) {
        const authHeader = req.headers.authorization
        if (authHeader && authHeader.startsWith('Bearer ')) {
            loginToken = authHeader.substring(7)
        }
    }
    if (!loginToken) {
        return res.status(401).send('Not Authenticated')
    }

    const loggedinUser = authService.validateToken(loginToken)
    if (!loggedinUser.isAdmin) {
        logger.warn(loggedinUser.fullname + 'attempted to perform admin action')
        res.status(403).end('Not Authorized')
        return
    }
    next()
}