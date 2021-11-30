const secret = process.env.JWT_SECRET
module.exports = function(user) {
    return jwt.sign(newUser, secret)
}
