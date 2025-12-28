
export function requireAuth(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.status(401).send('Not Authenticated')
    }
    req.loggedinUser = req.session.user
    next()
}

export function requireAdmin(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.status(401).send('Not Authenticated')
    }
    if (!req.session.user.isAdmin) {
        return res.status(403).send('Not Authorized')
    }

    next()
}
