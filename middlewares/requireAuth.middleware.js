// auth.middleware.js

export function requireAuth(req, res, next) {
    // אם אין session או אין משתמש — לא מחובר
    if (!req.session || !req.session.user) {
        return res.status(401).send('Not Authenticated')
    }

    // שמור את המשתמש בבקשה
    req.loggedinUser = req.session.user
    next()
}

export function requireAdmin(req, res, next) {
    // אם אין session או אין משתמש — לא מחובר
    if (!req.session || !req.session.user) {
        return res.status(401).send('Not Authenticated')
    }

    // אם המשתמש לא אדמין — אין הרשאה
    if (!req.session.user.isAdmin) {
        return res.status(403).send('Not Authorized')
    }

    next()
}
