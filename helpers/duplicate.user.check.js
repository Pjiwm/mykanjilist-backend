const User = require('../models/user')
module.exports = async function(body) {
    const foundUser = await User.findOne(body)
    if (foundUser === null) {
        return false
    } else {
        return true
    }
}