let Part = require('../models/Part')
let Model = require('../models/Model')

module.exports.getParts = async (req, res, next) => {
    let page = req.query.page
    let limit = 3
    let offset = ( page - 1 ) * limit

    let response = await Part.findAndCountAll({
        limit: limit,
        offset: offset,
        order: [
            ['createdAt', 'DESC']
        ]
    })

    let pages = Math.ceil( response.count / limit )

    res.status(200).json({
        totalItems: response.count,
        totalPages: pages,
        parts: response.rows
    })
}

module.exports.getPartsByCategory = async (req, res, next) => {
    let categoryId = req.params.categoryId
    let page = req.query.page
    let limit = 10
    let offset = ( page - 1 ) * limit

    let response = await Part.findAndCountAll({
        limit: limit,
        offset: offset,
        where: {
            categoryId: categoryId
        }
    })

    let pages = Math.ceil( response.count / limit )

    res.status(200).json({
        totalItems: response.count,
        totalPages: pages,
        parts: response.rows
    })
}

module.exports.getPartsByModelCategory = async (req, res, next) => {
    let model = req.params.model
    let categoryId = req.params.categoryId
    let page = req.query.page
    let limit = 10
    let offset = ( page - 1 ) * limit

    let response = await Part.findAndCountAll({
        limit: limit,
        offset: offset,
        where: {
            categoryId: categoryId
        },
        include: {
            model: Model,
            where: {
                name: model
            }
        }
    })

    let pages = Math.ceil( response.count / limit )

    res.status(200).json({
        totalItems: response.count,
        totalPages: pages,
        parts: response.rows
    })
}
