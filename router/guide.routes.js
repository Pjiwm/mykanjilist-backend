const GuideController = require('../controllers/guide.controller')

module.exports = (app) => {
    app.post('/api/guide', GuideController.create)
    app.get('/api/guide/:id', GuideController.get)
    app.get('/api/guide', GuideController.getAll)
    app.put('/api/guide/:id', GuideController.edit)
    app.delete('/api/guide/:id', GuideController.delete)
}