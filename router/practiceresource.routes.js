const PracticeResourceController = require('../controllers/practiceresource.controller')
const jwtMiddleware = require('../helpers/jwt.verify')

module.exports = (app) => {
    app.post('/api/practiceresource', jwtMiddleware, PracticeResourceController.create)
    app.get('/api/practiceresource/:id', PracticeResourceController.get)
    app.get('/api/practiceresource', PracticeResourceController.getAll)
    app.put('/api/practiceresource/:id', jwtMiddleware, PracticeResourceController.edit)
    app.delete('/api/practiceresource/:id', jwtMiddleware, PracticeResourceController.delete)
}