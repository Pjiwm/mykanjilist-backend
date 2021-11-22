const kanjiListController = require('../controllers/kanjilist.controller')

module.exports = (app) => {
    // app.get('/api', kanjiListController.greeting)

    app.post('/api/kanjilist', kanjiListController.create)
    app.get('/api/kanjilist/:id', kanjiListController.get)
    app.get('/api/kanjilist', kanjiListController.getAll)
    app.put('/api/kanjilist/:id', kanjiListController.edit)
    app.delete('/api/kanjilist/:id', kanjiListController.delete)
}