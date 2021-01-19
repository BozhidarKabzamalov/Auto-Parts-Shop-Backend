let Category = require('../models/Category')
let Jimp = require('jimp');
let { v4: uuidv4 } = require('uuid');

module.exports.getCategories = async (req, res, next) => {
    let categories

    try {
        categories = await Category.findAll()
    } catch (e) {
        console.log(e)
    }

    if (categories) {
        res.status(200).json({
            categories: categories
        })
    } else {
        res.status(500)
    }
}

module.exports.createCategory = async (req, res, next) => {
    let name = req.body.name
    let file = req.file
    let imageName = uuidv4() + ".png"
    let imageUrl = req.protocol + '://' + req.get('host') + '/images/categories/' + imageName
    let categoryExists
    let category

    try {
        categoryExists = await Category.findOne({
            where: {
                name: name
            }
        })

        if (!categoryExists) {
            category = await Category.create({
                name: name,
                image: imageUrl
            })
        } else {
            res.status(403)
        }
    } catch (e) {
        console.log(e)
    }

    if (category) {
        Jimp.read(file.buffer)
        .then(image => {
            return image
            .resize(Jimp.AUTO, 200)
            .write('public/images/categories/' + imageName);
        })
        .catch(err => {
            console.error(err);
        })

        res.status(200).json({
            category: category
        })
    } else {
        res.status(500)
    }
}

module.exports.deleteCategory = async (req, res, next) => {
    let categoryId = req.body.categoryId
    let category

    try {
        category = await Category.destroy({
            where: {
                id: categoryId
            }
        })
    } catch (e) {
        console.log(e)
    }

    if (category) {
        res.status(200).json({
            category: category
        })
    } else {
        res.status(500)
    }
}
