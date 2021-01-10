let Category = require('../models/Category')

module.exports.getCategories = async (req, res, next) => {
    let categories = await Category.findAll()

    res.status(200).json({
        categories: categories
    })
}

module.exports.createCategory = async (req, res, next) => {
    let name = req.body.name
    let image = req.body.image

    let category = await Category.create({
        name: name,
        image: image
    })

    res.status(200).json({
        category: category
    })
}

module.exports.deleteCategory = async (req, res, next) => {
    let categoryId = req.body.categoryId

    await Category.destroy({
        where: {
            id: categoryId
        }
    })

    res.status(200).json({
        message: "Category successfully deleted"
    })
}
