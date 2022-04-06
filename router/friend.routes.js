const FriendController = require('../controllers/friend.controller')
const jwtMiddleware = require('../helpers/jwt.verify')

module.exports = (app) => {
    app.get('/api/friend', FriendController.get)
    app.post('/api/friend', FriendController.add)
    app.post('/api/friend/:id', FriendController.acceptOrDecline)
    app.delete('/api/friend', jwtMiddleware, FriendController.delete)
    app.get('/api/friend/requests', FriendController.getRequests)
}