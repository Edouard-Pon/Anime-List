const jwt = require('jsonwebtoken')
const User = require('../models/user')

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[2]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

async function authenticateAdmin(req, res, next) {
    await authenticateToken(req, res, () => {
        if (req.user.role === 'admin') {
            next()
        } else {
            res.sendStatus(403)
        }
    })
}

module.exports = {
    authenticateToken,
    authenticateAdmin
}
