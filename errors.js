class EntityNotFoundError extends Error {
    constructor(message) {
        super(message)
        this.name = 'EntityNotFoundError'
    }
}

function validation(err, req, res, next) {
    if (err.name === 'ValidationError') {
        res.status(400).json({
            message: err.message
        })
    } else {
        next(err)
    }
}

function cast(err, req, res, next) {
    if (err.name === 'CastError') {
        res.status(400).json({
            message: `Invalid resource id: ${err.value}`
            // message: err
        })
    } else {
        next(err)
    }
}

function entityNotFound(err, req, res, next) {
    if (err.name === 'EntityNotFoundError') {
        res.status(404).json({
            message: err.message
        })
    } else {
        next(err)
    }
}

function duplicateUserNameOrEmail(err, req, res, next) {
    if (err.code !== 11000) {
        return next(err)
    }
    let errorKey = err.errmsg.split('index:')[1].split('dup key')[0].split('_')[0]
    if (errorKey === ' userName') {
        return res.status(400).json({
            message: 'Username already in use'
        })
    }
    if (errorKey === ' email') {
        return res.status(400).json({
            message: 'Email already in use'
        })
    }
    next(err)
}


module.exports = {
    EntityNotFoundError,
    handlers: [
        validation,
        cast,
        entityNotFound,
        duplicateUserNameOrEmail
    ],
}