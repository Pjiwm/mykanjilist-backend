const jwt = require('jsonwebtoken')

module.exports = async function (authorization) {
    try {
        const token = authorization.split(' ')[1]
        // eslint-disable-next-line no-undef
        const secret = process.env.JWT_SECRET
        await jwt.verify(token, secret)
        return jwt.decode(token)
    } catch (e) {
        return {
            code: 401,
            error: 'Unauthorized ',
            message: 'You are not the correct user'
        }
    }
}