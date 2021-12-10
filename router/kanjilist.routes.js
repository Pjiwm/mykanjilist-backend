const KanjiListController = require('../controllers/kanjilist.controller')
const jwtMiddleware = require('../helpers/jwt.verify')

module.exports = (app) => {
    app.post('/api/kanjilist', jwtMiddleware, KanjiListController.create)
    app.get('/api/kanjilist/:id', KanjiListController.get)
    app.get('/api/kanjilist', KanjiListController.getAll)
    app.put('/api/kanjilist/:id', jwtMiddleware, KanjiListController.edit)
    app.delete('/api/kanjilist/:id', jwtMiddleware, KanjiListController.delete)
    app.get('/api/kanjilist/user/:id', KanjiListController.getByUserId)
}