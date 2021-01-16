let Category = require('../models/Category')
let Jimp = require('jimp');
let { v4: uuidv4 } = require('uuid');

module.exports.getCategories = async (req, res, next) => {
    let categories = await Category.findAll()

    res.status(200).json({
        categories: categories
    })
}

module.exports.createCategory = async (req, res, next) => {
    let name = req.body.name
    let file = req.file
    let imageName = uuidv4() + ".png"
    let imageUrl = req.protocol + '://' + req.get('host') + '/images/categories/' + imageName

    Jimp.read(file.buffer)
    .then(image => {
        return image
        .resize(Jimp.AUTO, 200)
        .write('public/images/categories/' + imageName);
    })
    .catch(err => {
        console.error(err);
    });

    let category = await Category.create({
        name: name,
        image: imageUrl
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
