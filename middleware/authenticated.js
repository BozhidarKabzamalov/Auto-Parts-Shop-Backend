let jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    let authorizationHeader = req.headers.authorization

    if (!authorizationHeader) {
        let error = new Error('Not authenticated.')
        error.statusCode = 401
        throw error
    }

    let token = authorizationHeader.split(' ')[1]
    let decodedToken

    try {
        decodedToken = jwt.verify(token, 'secretkey')
    } catch (error) {
        error.statusCode = 500
        throw error
    }

    if (!decodedToken) {
        let error = new Error('Not authenticated.')
        error.statusCode = 401
        throw error
    }

    req.body.tokenUserId = decodedToken.id
    next()
}
