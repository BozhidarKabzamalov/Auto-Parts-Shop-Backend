let Category = require('../models/Category')

module.exports.getCategories = (req, res, next) => {
    Category.findAll({
        where: {
            'parent_id': 0
        }
    })
    .then(result => {
        res.send(result)
    })
    .catch(error => {
        console.log(error)
    })
}

module.exports.getCategory = async (req, res, next) => {
    let categoryId = req.params.categoryId

    let response = await Category.findByPk(categoryId)

    res.status(200).json({
        category: response
    })
}
