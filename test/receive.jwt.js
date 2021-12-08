module.exports = async function() {
    // TODO function that returns a new or old jwt token for testing
    return await jwt.sign(await user.toJSON(), secret)
}