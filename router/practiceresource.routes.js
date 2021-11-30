const PracticeResourceController = require('../controllers/practiceresource.controller')

module.exports = (app) => {
    app.post('/api/practiceresource', PracticeResourceController.create)
    app.get('/api/practiceresource/:id', PracticeResourceController.get)
    app.get('/api/practiceresource', PracticeResourceController.getAll)
    app.put('/api/practiceresource/:id', PracticeResourceController.edit)
    app.delete('/api/practiceresource/:id', PracticeResourceController.delete)
}