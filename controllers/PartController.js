let Part = require('../models/Part')
let Model = require('../models/Model')

module.exports.createPart = async (req, res, next) => {
    let name = req.body.name
    let description = req.body.description
    let price = req.body.price
    let manufacturer = req.body.manufacturer
    let serialNumber = req.body.serialNumber
    let image = req.body.image
    let categoryId = req.body.categoryId

    let part = await Part.create({
        name: name,
        description: description,
        price: price,
        manufacturer: manufacturer,
        serialNumber: serialNumber,
        image: image,
        categoryId: categoryId
    })

    res.status(200).json({
        part: part
    })
}

module.exports.deletePart = async (req, res, next) => {
    let partId = req.body.partId

    await Part.destroy({
        where: {
            id: partId
        }
    })

    res.status(200).json({
        message: "Part successfully deleted"
    })
}

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
