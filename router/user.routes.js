const UserController = require('../controllers/user.controller')

module.exports = (app) => {
    app.post('/api/user', UserController.create)
    app.get('/api/user/:id', UserController.get)
    app.put('/api/user/:id', UserController.edit)
    app.delete('/api/user/:id', UserController.delete)
}