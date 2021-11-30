const UserController = require('../controllers/user.controller')
const AuthController = require('../controllers/auth.controller')
const jwtMiddleware = require('../helpers/jwt.verify')

module.exports = (app) => {

    // CRUD on user
    // this is the register route
    app.post('/api/register', UserController.create)
    // this is the login route
    app.post('/api/login', AuthController.login)

    app.get('/api/user/:id', UserController.get)
    app.put('/api/user/:id', jwtMiddleware, UserController.edit)
    app.delete('/api/user/:id', jwtMiddleware, UserController.delete)
}
