const KanjiListController = require('../controllers/kanjilist.controller')

module.exports = (app) => {
    app.post('/api/kanjilist', KanjiListController.create)
    app.get('/api/kanjilist/:id', KanjiListController.get)
    app.get('/api/kanjilist', KanjiListController.getAll)
    app.put('/api/kanjilist/:id', KanjiListController.edit)
    app.delete('/api/kanjilist/:id', KanjiListController.delete)
}