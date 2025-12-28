import { authService } from './auth.service.js'
import { logger } from '../../services/logger.service.js'

export async function login(req, res) {
    const { username, password } = req.body

    try {
        const user = await authService.login(username, password)
        if (!user) return res.status(401).send({ err: 'Invalid credentials' })

        req.session.user = {
            _id: user._id,
            fullname: user.fullname,
            isAdmin: user.isAdmin
        }

        req.session.save(() => {
            logger.info('User logged in:', req.session.user)
            res.json(req.session.user)
        })

    } catch (err) {
        logger.error('Failed to Login ' + err)
        res.status(401).send({ err: 'Failed to Login' })
    }
}

export async function signup(req, res) {
    try {
        const { username, password, fullname } = req.body

        const account = await authService.signup(username, password, fullname)
        logger.debug(`auth.route - new account created: ${JSON.stringify(account)}`)

        const user = await authService.login(username, password)

        req.session.user = {
            _id: user._id,
            fullname: user.fullname,
            isAdmin: user.isAdmin
        }

        req.session.save(() => {
            res.json(req.session.user)
        })

    } catch (err) {
        logger.error('Failed to signup ' + err)
        res.status(500).send({ err: 'Failed to signup' })
    }
}

export async function logout(req, res) {
    try {
        req.session.destroy(() => {
            res.clearCookie('connect.sid', {
                secure: true,
                sameSite: 'none',
                path: '/',
            })
            res.send({ msg: 'Logged out successfully' })
        })
    } catch (err) {
        res.status(500).send({ err: 'Failed to logout' })
    }
}
