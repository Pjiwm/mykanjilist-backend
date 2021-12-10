const GuideController = require('../controllers/guide.controller')
const jwtMiddleware = require('../helpers/jwt.verify')

module.exports = (app) => {
    app.post('/api/guide',  jwtMiddleware, GuideController.create)
    app.get('/api/guide/:id', GuideController.get)
    app.get('/api/guide', GuideController.getAll)
    app.put('/api/guide/:id', jwtMiddleware, GuideController.edit)
    app.delete('/api/guide/:id', jwtMiddleware, GuideController.delete)
    app.get('/api/guide/user/:id', GuideController.getByUserId)
}