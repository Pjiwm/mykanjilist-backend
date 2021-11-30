const secret = process.env.JWT_SECRET
const jwt = require('jsonwebtoken')
module.exports = async function(user) {
    return await jwt.sign(user.toJSON(), secret)
}
