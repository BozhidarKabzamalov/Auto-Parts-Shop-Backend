let Part = require('../models/Part')

module.exports.getCategoryParts = async (req, res, next) => {
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
